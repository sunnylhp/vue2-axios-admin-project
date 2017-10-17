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
            <div class="table-list category-list">
                <table class="table table-bordered table-hover" v-for="(item,index) in list">
                    <thead v-if="index==0">
                    <tr>
                        <th>名称</th>
                        <th>级别</th>
                        <th>排序</th>
                        <th>操作</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td style="font-weight: bold;">{{item.name}}</td>
                        <td>{{item.level}}</td>
                        <td>{{item.sort}}</td>
                        <td>
                            <button class="btn btn-success btn-sm"
                                    @click="newHandler(item.id,item.name)" >添加
                            </button>
                        </td>
                    </tr>
                    </tbody>
                    <tbody v-for="item in item.children_list">
                    <tr>
                        <td style="color: #367fa9;"><span class="level-icon-1"></span>{{item.name}}</td>
                        <td>{{item.level}}</td>
                        <td>{{item.sort}}</td>
                        <td>
                            <button class="btn btn-success btn-sm"
                                    @click="newHandler(item.id,item.name)" >添加
                            </button>
                            <button v-show="!item.children_list" class="btn btn-default btn-sm"
                                    @click="alertHandler(item.id)" >
                                删除</button>
                        </td>
                    </tr>
                    <tr v-for="item in item.children_list">
                        <td><span class="level-icon-2"></span>{{item.name}}</td>
                        <td>{{item.level}}</td>
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
    import page from '../../component/common/page.vue'
    import news from './new.vue'
    export default{
        data(){
            return {
                list:null,
                parentId:0,
                firstLevel:[],
                secondLevel:[],
                threeLevel:[],
            }
        },
        components:{
            pagination
        },
        created(){
            this.getList();
        },
        watch:{

        },
        methods:{
            newHandler:function (id) {
                if(!id){
                    id = null
                }
                let dialog = this.$refs.dialog
                let d = dialog.open({
                    title:'新增',
                    template: `<news :param="${id}"></news>`,
                    components: {
                        news:news
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
                this.$http.get("/v1/goods/get_category_all").then(function (response) {
                    let reData = response.data
                    self.list =reData.category_items;
                    self.firstLevel = self.list;
                })
            },
            //删除仓库
            deleteHandler:function (id) {
                let self = this;
                this.$http.get("/v1/goods/delete_category",{
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
    .category-list .table>tbody+tbody{
        border:none;
    }
    .category-list .table td{
        width: 25%;
    }
    .level-icon-1,.level-icon-2{
        display: inline-block;
        height: 8px;
        width: 20px;
        border-left: 1px solid #bbb;
        border-bottom: 1px solid #bbb;
        color: #999;
        margin-right: 5px;
        margin-left: 20px;
    }
    .level-icon-2{
        margin-left: 50px;
    }
</style>