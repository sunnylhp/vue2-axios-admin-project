<template>
    <div class="list">
        <!-- Content Header (Page header) -->
        <section class="content-header">
            <div>
                <form class="form-horizontal" role="form">
                    <button type="button" class="btn btn-success btn-sm" v-on:click="newHandler()">新增</button>
                </form>
            </div>
        </section>
        <!-- Main content -->
        <section class="content">
            <div class="table-list">
                <table class="table table-bordered table-hover">
                    <thead>
                    <tr>
                        <th>名称</th>
                        <th>英文名称</th>
                        <th>备注</th>
                        <th>操作</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="item in list">
                        <td>{{item.name}}</td>
                        <td>{{item.eng_name}}</td>
                        <td>{{item.remarks}}</td>
                        <td>
                            <button class="btn btn-default btn-sm" @click="alertHandler(item.id)" >删除</button>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <!-- /.box-body -->
            <div v-show="pages.total>0">
                <pagination :page="pages" :pathname="pathname"></pagination>
            </div>
        </section>
        <vdialog ref="dialog"></vdialog>
        <!-- /.content -->
    </div>
</template>
<script>
    import pagination from '../../component/common/pagination.vue'
    import news from './new.vue'
    export default{
        data(){
            return {
                list:null,
                pages:{
                    page:1,
                    total:1,
                    size:10
                },
                pathname:'brandList',
                keys:null,
            }
        },
        components:{
            pagination
        },
        created(){
            this.getList();
        },
        computed:{
            page:function () {
                return this.$route.query.page;
            }
        },
        methods:{
            newHandler:function () {
                let dialog = this.$refs.dialog
                let d = dialog.open({
                    title:'新增',
                    template: `<news></news>`,
                    components: {
                        news:news
                    },
                    width: '700px',
                    height:'600px'
                })
            },
            //列表
            getList:function () {
                let self = this;
                this.$http.get("/v1/goods/get_brand_list",{
                    params:{
                        page:self.page,
                        page_size:self.pages.size
                    }
                }).then(function (response) {
                    let reData = response.data
                    self.list =reData.brand_list;
                    self.pages.page = reData.page;
                    self.pages.total = reData.total;
                    self.pages.size = reData.page_size;
                })
            },
            //删除仓库
            deleteHandler:function (id) {
                let self = this;
                this.$http.get("/v1/goods/delete_brand",{
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