<template>
    <div>
        <div class="box-wrap">
            <h1>
                <button class="btn btn-success btn-sm" @click="addItem()">添加</button>
                <button class="btn btn-default btn-sm ml-10" @click="deletesHandler()">清空</button>
            </h1>
            <form class="form-horizontal" id="form">
                <table class="table table-bordered">
                    <thead>
                    <tr>
                        <th>编号</th>
                        <th>容器编号</th>
                        <th>类型</th>
                        <th>规格</th>
                        <th>操作</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item,index) in containerList">
                        <td>
                            <span class="text-primary">{{item.identifier}}</span>
                        </td>
                        <td>
                            <input class="form-control" v-bind:value="item.number" v-model.trim="item.number"
                                   @input="$v.containerList.$each[index].number.$touch()"/>
                            <span class="error-message" v-if="$v.containerList.$each[index].number.$error">整数</span>
                        </td>
                        <td>
                            <select class="form-control" v-model="item.type"
                                    @change="$v.containerList.$each[index].type.$touch()">
                                <option value="0" disabled>选择</option>
                                <option value="1">货箱</option>
                                <option value="2">冰柜</option>
                            </select>
                            <span class="error-message"
                                  v-if="!$v.containerList.$each[index].type.nzintNum">必选</span>
                        </td>
                        <td>
                            <span v-if="item.type==1">
                                 <select class="form-control" v-model="item.box_spec_id" @change="$v.containerList.$each[index].box_spec_id.$touch()">
                                    <option value="0" disabled>选择</option>
                                    <option v-for="items in boxList" v-bind:value="items.id" v-if="item.type>0">
                                        {{items.name}}
                                    </option>
                                </select>
                                <span class="error-message" v-if="!$v.containerList.$each[index].box_spec_id.nzintNum">必选</span>
                            </span>

                           <span v-else>
                                <select class="form-control" v-model="item.refrigerator_spec_id" @change="$v.containerList.$each[index].refrigerator_spec_id.$touch()">
                                <option value="0" disabled>选择</option>
                                <option v-for="items in refrigeratorList" v-bind:value="items.id" v-if="item.type>0">
                                    {{items.name}}
                                </option>
                            </select>
                            <span class="error-message" v-if="!$v.containerList.$each[index].refrigerator_spec_id.nzintNum">必选</span>
                           </span>

                        </td>
                        <td>
                            <button type="button" class="btn btn-default btn-sm" @click="deletesHandler(item.id)" >删除
                            </button>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <div v-for="(item,index) in addList">
                    <input type="" value="add" v-model="item.id"/>
                </div>
            </form>
        </div>
        <div class="footer-item" style="text-align: center">
            <button type="button" class="btn btn-primary btn-sm" @click="submit($v)">保存</button>
        </div>
    </div>
</template>
<script>
    import { required, minLength,alphaNum,numeric,floatNum,nzintNum} from 'vuelidate/lib/validators'
    function formData(array) {
        let arr=[];
        let isFlag=true;
        array.forEach(function (item,key) {
            let temp = {};
            temp['id'] = parseInt(item.id);
            temp['number'] = parseInt(item.number);
            temp['type'] = parseInt(item.type);
            temp['spec_id'] = temp['type']==1 ? parseInt(item.box_spec_id):parseInt(item.refrigerator_spec_id)
            arr.push(temp)
            if(temp['spec_id']==0){
                isFlag = false;
            }
        })
        if(!isFlag){
            return isFlag;
        }else {
            return arr
        }
    }
    export default {
        data(){
            return{
                containerList:[],
                boxList:[],//货箱规格，
                refrigeratorList:[],//冰柜规格，
                addList:[],
            }
        },
        created(){
            this.getContainerList(this.param);
            this.getBoxList();
            this.getRefrigeratorList();
        },
        validations: {
            containerList: {
                $each: {
                    number: {
                        required,
                        numeric
                    },
                    type:{
                        nzintNum
                    },
                    box_spec_id:{
                        nzintNum
                    },
                    refrigerator_spec_id:{
                        nzintNum
                    }
                }
            }

        },
        props:['param'],
        methods:{
            //获取编号列表
            getIdentifier(id){
                let self = this;
                this.$http.get("/v1/salespoint/add_container",{
                    params:{
                        point_id:id
                    }
                }).then(function (response) {
                    if(response.code!=0){
                        alert(response.msg)
                    }
                })
            },
            //获取货箱规格
            getBoxList(){
                let self = this;
                this.$http.get("/v1/salespoint/get_box_spec_all").then(function (response) {
                    if(response.code==0){
                        self.boxList= response.data.box_items;
                    }else {
                        alert(response.msg)
                    }
                })
            },
            //获取冰柜规格
            getRefrigeratorList(){
                let self = this;
                this.$http.get("/v1/salespoint/get_refrigerator_spec_all").then(function (response) {
                    if(response.code==0){
                        self.refrigeratorList= response.data.refrigerator_items;
                    }else {
                        alert(response.msg)
                    }
                })
            },
            //获取容器列表
            getContainerList(id){
                let self = this;
                this.$http.get("/v1/salespoint/get_container_all",{
                    params:{
                        point_id:id
                    }
                }).then(function (response) {
                    if(response.code==0){
                        self.containerList = response.data.container_list ? response.data.container_list:[];
                    }
                })
            },
            addItem(){
                let self = this;
                let point_id = self.param;
                this.$http.get("/v1/salespoint/add_container",{
                    params:{
                        point_id:point_id,
                        count:1
                    }
                }).then(function (response) {
                    if(response.code==0){
                        self.containerList.push(response.data.container_list[0])

                    }else {
                        alert(response.msg)
                    }
                })
            },
            //删除
            deletesHandler(id) {
                let self = this;
                let ids =id;
                let param = {
                    id:ids
                }
                if(!ids){
                    param={
                        point_id:parseInt(self.param)
                    }
                }
                this.$http.get("/v1/salespoint/delete_container",{
                    params:param
                }).then(function (response) {
                    if(response.code==0){
                        self.getContainerList(self.param);
                    }else {
                        alert(response.msg)
                    }
                })
            },
            submit:function ($v) {
                let self = this;
                $v.containerList.$touch();
                let  items= formData(self.containerList)
                if(items==false){
                    return;
                }
                let params = {
                 point_id:parseInt(self.param),
                 container_items:items
                };
                this.$http.post("/v1/salespoint/update_container",params).then(function (response) {
                    if(response.code==0){
                        let query = self.$route.query
                        self.$parent.$parent.$parent.getList(query)
                        self.$parent.$parent.close(0);
                    }
                })


            }
        }
    }
</script>
<style lang="less">
    .box-wrap{
        padding: 0 20px;
        input{
            display: inline-block;
            width:60px;
        }
        select{
            display: inline-block;
            width: 100px;
        }
    }
</style>