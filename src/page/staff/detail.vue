<template>
    <div>
        <h1></h1>
        <div class="info" v-show="info">
            <div class="row">
                <label class="col-sm-3">姓名:</label>
                <span class="col-sm-8">{{info.name}}</span>
            </div>
            <div class="row">
                <label class="col-sm-3">账号:</label>
                <span class="col-sm-8">{{info.login_name}}</span>
            </div>
            <div class="row">
                <label class="col-sm-3">角色:</label>
                <span class="col-sm-8">{{info.role_name}}</span>
            </div>
            <div class="row">
                <label class="col-sm-3">手机号:</label>
                <span class="col-sm-8">{{info.phone}}</span>
            </div>
            <div class="row">
                <label class="col-sm-3">身份证号:</label>
                <span class="col-sm-8">
                    {{info.id_card}}
                </span>
            </div>
            <div class="row">
                <label class="col-sm-3">性别:</label>
                <span class="col-sm-8">
                    <span v-if="info.gender==1"> 男</span>
                                    <span v-else> 女</span>
                </span>
            </div>
            <div class="row" v-show="info.remarks">
                <label class="col-sm-3">备注:</label>
                <span class="col-sm-8">{{info.remarks}}</span>
            </div>
        </div>
    </div>
</template>
<script>
    export default{
        data: function () {
            return {
                info:{}
            };
        },
        props:['param'],
        created(){
           this.getDetail();
        },
        methods: {
            getDetail:function () {
                let self = this;
                let id = self.param;
                this.$http.get("/v1/staff/view_staff",{
                    params:{id:id}
                }).then(function (response) {
                    self.info =response.data;
                })
            }
        }

    }
</script>
<style>
    .info{
        padding:0 20px 20px 20px;
    }
    .info label{
        text-align: right;
    }
</style>