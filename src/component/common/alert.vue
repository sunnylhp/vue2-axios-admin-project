<template>
    <div class="modal-alert" v-show="show">
        <section class="modal-alert-container">
            <div class="alert-title">
                <span>{{title}}</span>
                <span class="icon-close" @click="clickHandler('cancel')">
                    <svg width="14" class="close" height="14" version="1.1"
                         xmlns="http://www.w3.org/2000/svg">
                        <polyline points="0 0,7 7,0 14"
                                  style="fill:white;stroke:#000;stroke-width:1"/>
                        <polyline points="14 0,7 7,14 14"
                                  style="fill:white;stroke:#000;stroke-width:1"/>
                    </svg>
                </span>
            </div>
            <p class="alert-content">
                {{content}}
            </p>
            <div class="alert-btn">
                <button type="button" class="btn btn-primary btn-sm" @click="clickHandler('ok')">确认</button>
                <button type="button" class="btn btn-default btn-sm" @click="clickHandler('cancel')">取消</button>
            </div>
        </section>
    </div>
</template>
<script>
    export default{
        data(){
            return {
                show:false,//是否显示
                onCancel:false,//取消
                onOk:false,//确定
                title:'',//alert的标题
                content:''//alert的内容
            }
        },
        mounted(){

        },
        methods:{
            clickHandler(type){
                if(type=='ok'){
                    if(this.onOk) this.onOk()
                }else {
                    if(this.onCancel) this.onCancel()
                }
                this.onCancel = false
                this.onOk = false
                this.show = false
            },
            alert({title='提示title', content='内容', onOk =false, onCancel=false}){//参数初始化
                this.title = title
                this.content = content
                this.onOk = onOk
                this.onCancel = onCancel
                this.show = true
            }
        }
    }
</script>
<style lang="less">
    .modal-alert{
        position: fixed;
        top:0;
        left:0;
        right:0;
        bottom:0;
        z-index: 999;
    }
    .modal-alert-container{
        width: 200px;
        padding:10px;
        position: absolute;
        top:150px;
        left: 50%;
        margin-left: -110px;
        background-color: #fff;
        box-shadow: 0px 0px 15px #999;
    }
    .alert-btn{
        text-align: center;
        margin-top: 15px;
    }
    .modal-alert{
        .alert-title{
            position: relative;
            min-height: 30px;
        }
        .btn{
            padding: 0.2rem 1rem;
        }
        .icon-close{
            position: absolute;
            top:50%;
            right: 20px;
            transform: translateY(-50%);
            &:hover{
                cursor: pointer;
            }
        }
    }
</style>