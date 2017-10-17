<template>
    <div>
        <h1></h1>
        <div class="info" v-show="info">
            <div class="row">
                <label class="col-sm-3">仓库名称:</label>
                <span class="col-sm-9">{{info.name}}</span>
            </div>
            <div class="row">
                <label class="col-sm-3">仓库编号:</label>
                <span class="col-sm-9">{{info.identifier}}</span>
            </div>
            <div class="row">
                <label class="col-sm-3">省市区:</label>
                <span class="col-sm-9">{{info.province}}/{{info.city}}/{{info.district}}</span>
            </div>
            <div class="row">
                <label class="col-sm-3">地址:</label>
                <span class="col-sm-9">{{info.address}}</span>
            </div>
            <div class="row">
                <label class="col-sm-3">负责人:</label>
                <span class="col-sm-9">{{info.staff_name}}</span>
            </div>
            <div class="row">
                <label class="col-sm-3">备注:</label>
                <span class="col-sm-9">{{info.remarks}}</span>
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
                this.$http.get("/v1/stock/view_warehouse",{
                    params:{id:id}
                }).then(function (response) {
                    self.info =response.data;
                })
            }
        }

    }
</script>