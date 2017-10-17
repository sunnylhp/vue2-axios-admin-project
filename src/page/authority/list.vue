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
            <table id="example2" class="table table-bordered table-hover">
                <thead>
                <tr>
                    <th>角色</th>
                    <th>权限</th>
                    <th>备注</th>
                    <th>操作</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in list">
                    <td>{{item.name}}</td>
                    <td>{{item.name}}</td>
                    <td>{{item.remarks}}</td>
                    <td>
                        <button class="btn btn-default btn-sm" v-on:click="detailHandler(item.id)">详情
                        </button>
                        <button class="btn btn-default btn-sm" v-on:click="editHandler(item.id)">修改
                        </button>
                        <button class="btn btn-default btn-sm" @click="deleteHandler(item.id)" >删除</button>
                    </td>
                </tr>
                </tbody>
            </table>
        </section>
        <vdialog ref="dialog"></vdialog>
        <!-- /.content -->
    </div>
</template>
<script>
    import page from '../../component/common/page.vue'
    import details from './detail.vue'
    import edit from './edit.vue'
    export default{
        data(){
            return {
                list:null,
            }
        },
        created(){
            this.getList();
        },
        methods:{
            //新增、修改
            editHandler: function (id) {
                let title='修改';
                if(!id){
                    id = null;
                    title = '新增'
                }
                let dialog = this.$refs.dialog
                let d = dialog.open({
                    title:title,
                    template: `<edit :param.sync="${id}"></edit>`,
                    components: {
                        edit:edit
                    },
                    width: '800px',
                    height:'600px'
                })
            },
            //详情
            detailHandler: function (id) {
                let dialog = this.$refs.dialog
                let d = dialog.open({
                    title:'详情',
                    template: `<detail :param.sync="${id}"></detail>`,
                    components: {
                        detail:details
                    },
                    width: '800px',
                    height:'400px'
                })
            },
            //列表
            getList:function () {
                let self = this;
                this.$http.get("/v1/staff/get_role_all").then(function (response) {
                    if(response.code==0){
                        let reData = response.data
                        self.list =reData.role_items;
                    }else {
                        alert(response.msg)
                    }
                })
            },
            //删除
            deleteHandler:function (id) {
                let self = this;
                if(!confirm('确定删除?')){
                    return;
                }
                this.$http.get("/v1/staff/delete_role",{
                    params:{
                        id:id
                    }
                }).then(function (response) {
                    if(response.code==0){
                        self.getList();
                    }else {
                        alert(response.msg)
                    }
                })
            }
        }
    }
</script>