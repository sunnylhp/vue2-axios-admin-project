<template>
    <div class="list">
        <!-- Content Header (Page header) -->
        <section class="content-header">
            <div>
                <form class="form-horizontal" role="form">
                    <button type="button" class="btn btn-success btn-sm" v-on:click="editHandler()">新增</button>
                </form>
            </div>
        </section>
        <!-- Main content -->
        <section class="content">
            <div class="table-list">
                <table id="example2" class="table table-bordered table-hover">
                    <thead>
                    <tr>
                        <th>货箱</th>
                        <th>规格描述</th>
                        <th>排序</th>
                        <th>操作</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="item in list">
                        <td>{{item.name}}</td>
                        <td>{{item.specifications}}</td>
                        <td>{{item.sort}}</td>
                        <td>
                            <button class="btn btn-default btn-sm" @click="alertHandler(item.id)" >删除</button>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </section>
        <vdialog ref="dialog"></vdialog>
        <!-- /.content -->
    </div>
</template>
<script>
    import pagination from '../../component/common/pagination.vue'
    import edit from './edit.vue'
    export default{
        data(){
            return {
                list:null,
            }
        },
        components:{
            pagination
        },
        created(){
            this.getList();
        },
        methods:{
            editHandler:function (id) {
                let title = id ? '修改':'新增';
                if(!id){
                    id = null;
                }
                let dialog = this.$refs.dialog
                let d = dialog.open({
                    title:title,
                    template: `<edit :param="${id}"></edit>`,
                    components: {
                        edit:edit
                    },
                    width: '700px',
                    height:'600px'
                })
            },
            //alert
            alertHandler:function (id) {
                let self = this;
                var valert = this.$root.$refs.alert
                valert.alert({
                    content:'确定删除？',
                    onOk:function () {
                        self.deleteHandler(id);
                    },
                    onCancel:function () {
                        return;
                    }
                })
            },
            getList:function () {
                let self = this;
                this.$http.get("/v1/salespoint/get_box_spec_all").then(function (response) {
                    let reData = response.data
                    self.list =reData.box_items;
                })
            },
            //删除
            deleteHandler:function (id) {
                let self = this;
                this.$http.get("/v1/salespoint/delete_box_spec",{
                    params:{
                        id:id
                    }
                }).then(function (response) {
                   self.getList();
                })
            }
        }
    }
</script>
<style lang="less">
    .pagination>li>.active{
        background: #00a7d0;
        color:#fff;
    }
    .pagination>li>.active:hover{
        background: #00a7d0;
        color:#fff;
    }
    .form-search{
        width: 300px;
        display: inline-block;
    }
</style>