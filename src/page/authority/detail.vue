<template>
    <div class="authority-detail">
        <table class="table">
            <tbody>
            <tr>
                <td>名称:</td>
                <td>{{info.name}}</td>
            </tr>
            <tr>
                <td>拥有权限:</td>
                <td>
                    <span class="mr-20"  v-for="item in items">
                        <label><span>{{item.definition}}</span></label>
                    </span>
                </td>
            </tr>
            <tr>
                <td>备注:</td>
                <td>{{info.remarks}}</td>
            </tr>
            </tbody>
        </table>
    </div>
</template>
<script>
    import { required, minLength,alphaNum } from 'vuelidate/lib/validators'
    export default{
        data: function () {
            return {
                info:{
                    id:null,
                    name:null,
                    remarks:null,
                    responsibility_items:[],
                },
                items:{},
                checkedItems:[],
            };
        },
        created(){
            if(this.param){
                this.getDetail();
            }
            this.getResponsibility();
        },
        props:['param'],
        methods: {
            props:['param'],
            //获得信息
            getDetail:function () {
                let self = this;
                let id = self.param;
                if(!id){
                    return;
                }
                this.$http.get("/v1/staff/view_role",{
                    params:{id:id}
                }).then(function (response) {
                    self.info =response.data;
                   self.items = response.data.responsibility_items
                })
            }
        }
    }
</script>
<style lang="less">
    .authority-detail{
        padding: 20px;
        .table td{
            padding: 12px;
            background-color: #f5f5f5;
        }
        .table tr td:first-child{
            text-align: right;
            font-weight:bold;
            width: 150px;
        }
        label{
            text-align: right;
        }
    }
</style>