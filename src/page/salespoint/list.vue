<template>
    <div class="list salespoint">
        <!-- Content Header (Page header) -->
        <section class="content-header">
            <div>
                <div class="form-horizontal" role="form">
                    <input class="form-control form-search" v-model="keys"
                           placeholder="输入关键字" @keyup.enter="search"/>
                    <button type="button" class="btn btn-primary btn-sm" @click="search">搜索</button>
                    <button type="button" class="btn btn-success btn-sm" v-on:click="editHandler()">新增</button>
                </div>
            </div>
        </section>
        <!-- Main content -->
        <section class="content">
            <div class="table-list">
                <table class="table table-bordered">
                    <thead>
                    <tr>
                        <th>名称<i class="fa fa-sort sort" @click="sortHandler('name',sort.name)"></i></th>
                        <th>公司<i class="fa fa-sort sort" @click="sortHandler('company_name',sort.company_name)"></i></th>
                        <th>省</th>
                        <th>市<i class="fa fa-sort sort" @click="sortHandler('city',sort.city)"></i></th>
                        <th>区<i class="fa fa-sort sort" @click="sortHandler('district',sort.district)"></i></th>
                        <th>货箱/冰柜</th>
                        <th>备注</th>
                        <th>操作</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="item in list">
                        <td>{{item.name}}</td>
                        <td>{{item.company_name}}</td>
                        <td>{{item.province}}
                        <td>{{item.city}}
                        <td>{{item.district}}<td>
                        <div v-if="item.box_count">
                            <span>共<span class="red">{{item.box_count}}</span>个货箱</span>
                        </div>

                        <div v-if="item.refrigerator_count">
                            <span>共<span class="red">{{item.refrigerator_count}}</span>个冰柜</span>
                        </div>
                        <div>
                                                <span v-if="!item.box_count && !item.refrigerator_count"
                                                      class="add-btn glyphicon glyphicon-plus"
                                                      v-on:click="boxHandler(item.id)"></span>
                            <button class="btn btn-default btn-sm"
                                    v-on:click="boxHandler(item.id)" v-else>管理</button>
                        </div>
                    </td>
                        <td> {{item.remarks}}</td>
                        <td>
                            <button class="btn btn-default btn-sm" v-on:click="editHandler(item.id)">修改</button>
                            <button class="btn btn-default btn-sm" @click="deleteHandler(item.id)" >删除</button>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <!-- /.box-body -->
            <div class="" v-show="pages.total>0">
                <pagination :page="pages"></pagination>
            </div>
        </section>
        <vdialog ref="dialog"></vdialog>
        <!-- /.content -->
    </div>
</template>
<script>
    import pagination from '../../component/common/page.vue'
    import edit from './edit.vue'
    import box from './box.vue'
    export default{
        data(){
            return {
                list:null,
                pages:{
                    page:1,
                    total:1,
                    page_size:this.global.page.page_size,
                    sort_by:null,
                    sort_type:0,
                    pathname:'salsepointList',
                },
                sort:{
                    name:0,
                    company_name:0,
                    city:0,
                    district:0,
                },
                keys:null,
            }
        },
        components:{
            pagination
        },
        created(){
            let query = Object.keys(this.$route.query).length==0 ? this.pages: this.$route.query;
            this.getList(query);
        },
        methods:{
            //新增/修改
            editHandler:function (id) {
                let title='修改';
                if(!id){
                    id = null;
                    title = '新增'
                }
                let dialog = this.$refs.dialog
                let d = dialog.open({
                    title:title,
                    template: `<edit :param="${id}"></edit>`,
                    components: {
                        edit:edit
                    },
                    width: '800px',
                    height:'600px',
                })
            },
            //货柜管理
            boxHandler:function (id) {
                let title='管理';
                if(!id){
                    id = null;
                    title = '新增'
                }
                let dialog = this.$refs.dialog
                let d = dialog.open({
                    title:title,
                    template: `<box :param="${id}"></box>`,
                    components: {
                        box:box
                    },
                    width: '800px',
                    height:'600px',
                })
            },
            //列表
            getList:function (query) {
                let self = this;
                let param;
                if(!query){
                    param = {
                        page:1.,
                        page_size:self.global.page.page_size,
                    }
                }else{
                    param = {
                        page:query.page,
                        page_size:query.page_size,
                    }
                    if(query.sort_by){
                        param ={
                            page:query.page,
                            page_size:query.page_size,
                            sort_by:query.sort_by,
                            sort_type:query.sort_type,
                        }
                    }
                }
                this.$http.get("/v1/salespoint/get_salespoint_list",{
                    params:param
                }).then(function (response) {
                    let reData = response.data
                    self.list =reData.salespoint_list;
                    self.pages.page = reData.page;
                    self.pages.total = reData.total;
                    self.pages.page_size = reData.page_size;
                })
            },
            //搜索
            search:function () {
                let self = this;
                if(self.keys){
                    this.$http.post("/v1/salespoint/quicksearch_salespoint",{
                        search_text:self.keys
                    }).then(function (response) {
                        if(response.code==0){
                            let reData = response.data
                            self.list =reData.salespoint_list;
                        }
                    })
                }else {
                    self.getList();
                }

            },
            //删除
            deleteHandler:function (id) {
                let self = this;
                if(!confirm('确定要删除？')){
                    return;
                }
                this.$http.get("/v1/salespoint/delete_salespoint",{
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
            },
            //排序
            sortHandler:function (name,type) {
                let self = this;
                self.sort[name]=type==0 ? 1:0;
                self.pages.sort_by = name;
                self.pages.sort_type = self.sort[name];
                let query = {
                    page:self.pages.page,
                    page_size:self.pages.page_size,
                    sort_by:self.pages.sort_by,
                    sort_type:self.sort[name],
                }
                this.$router.push({
                    name:self.pages.pathname,
                    query:query
                });
                self.getList(query);
            }
        }
    }
</script>
<style lang="less">
.salespoint{
    .add-btn{
        padding: 3px;
        border-radius:20px;
        border:2px solid #999;
        color: #666;
        &:hover{
            color: #333;
            cursor: pointer;
        }
    }
}
</style>