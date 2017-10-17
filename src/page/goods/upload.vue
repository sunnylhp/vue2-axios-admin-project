<template>
    <div class="upload-container">
        <h1 class="tips">最多上传三张图片,首图不能删除</h1>
        <ul class="img-list">
            <li v-for="item in imgList">
                <a v-bind:href="item.pic_orig_url" target="_blank">
                    <img v-bind:src="item.pic_orig_url"/>
                    <label><input type="radio" v-model="cover_id" v-bind:value="item.id"/>首图</label>

                </a>
                <span @click="deleteHandler(item.id)" class="remove glyphicon glyphicon-remove"></span>
            </li>
            <li v-if="imgNum<3">
                <input type="hidden" v-bind:value="param"/>
                <span class="upload-file">
                    <input type="file" class="upload-btn" value="上传图片" @change="uploadFile">
                </span>
            </li>
        </ul>
        <div class="footer-item" style="text-align: center">
            <button type="button" class="btn btn-success btn-sm" @click="setCover(cover_id)">保存</button>
        </div>
    </div>
</template>
<script>
    export default{
        data(){
            return {
                imgList:[],
                imgNum:0,
                cover_id:null//首
            }
        },
        props:['param'],
        created(){
          this.getImgList();
        },
        methods:{
            //上传图片
            uploadFile(e){
                let self = this;
                let formdata = new FormData();
                let files = e.target.files;
                let goods_id = parseInt(this.param);
                formdata.append('goods_id',goods_id)
                formdata.append('goods_pic',files[0]);
                this.$axios({
                    url:'/v1/goods/upload_picture',
                    method:'post',
                    data:formdata,
                }).then(function (response) {
                    if(response.code==0){
                        self.getImgList();
                    }
                    alert(response.msg)
                })
            },
            //获取上传的图片
            getImgList(){
                let self = this;
                this.$http.get("/v1/goods/get_picture_all",{
                    params:{
                       goods_id:parseInt(self.param)
                    }
                }).then(function (response) {
                    if(response.code==0){
                        let reData = response.data
                        if(reData.goods_pic_list){
                            self.imgList =reData.goods_pic_list;
                            self.imgNum = reData.goods_pic_list.length
                            self.imgList.forEach(function (item,key,array) {
                                if(item.is_cover){
                                    self.cover_id = item.id;
                                }
                            })
                        }

                    }else {
                        alert(response.msg)
                    }
                })
            },
            //设置封面图片
            setCover(id) {
                let self = this;
                this.$http.get("/v1/goods/set_cover_pic",{
                    params:{
                        id:id
                    }
                }).then(function (response) {
                    alert(response.msg)
                    if(response.code==0){
                        self.$parent.$parent.$parent.getList()
                        self.$parent.$parent.close(0);
                    }
                })
            },
            //删除图片
            deleteHandler(id) {
                let self = this;
                if(!confirm('确定删除图片？')){
                    return;
                }
                this.$http.get("/v1/goods/delete_picture",{
                    params:{
                        id:id
                    }
                }).then(function (response) {
                    if(response.code==0){
                        //alert(response.msg)
                        self.getImgList();
                    }else {
                        alert(response.msg)
                    }
                    return;
                })
            },
        }
    }
</script>
<style lang="less">
    .upload-container{
        .tips{
            padding-bottom: 5px;
        }
        .img-list{
            li{
                position: relative;
                display: inline-block;
                width: 100px;
                vertical-align: top;
                margin-right: 15px;
                .remove{
                    position: absolute;
                    top:-5px;
                    right: -5px;
                    display: inline-block;
                    padding: 4px;
                    margin-top: 5px;
                    text-align: center;
                    font-size: 16px;
                    font-weight: normal;
                    &:hover{
                        color: red;
                        cursor: pointer;
                    }
                }
            }
            a{
                display: block;
            }
            label{
                margin-top: 5px;
                font-size: 14px;
                font-weight:normal;
            }
            img{
                display: block;
                width: 100%;
                height: 100px;
                max-height: 100px;
                border:1px solid #ddd;
            }
        }

        .upload-file{
            position: relative;
            display: inline-block;
            width: 100px;
            height: 100px;
            border: 1px solid #ddd;
            &:hover{
                cursor:pointer;
            }
            &:before,&:after{
                position: absolute;
                content: '';
                display: block;
                top:50%;
                left:50%;
                background: #ccc;
                -webkit-transform: translate(-50%,-50%);
                -moz-transform: translate(-50%,-50%);
                -ms-transform: translate(-50%,-50%);
                -o-transform: translate(-50%,-50%);
                transform: translate(-50%,-50%);
            }
            &:before{
                width: 2px;
                height: 50px;
            }
            &:after{
                width: 50px;
                height: 2px;
            }
            .upload-btn{
                display: inline-block;
                width: 100px;
                height: 100px;
                cursor: pointer;
                opacity: 0;
            }
        }
    }
</style>