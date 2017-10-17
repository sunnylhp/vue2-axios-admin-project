<template>
    <div class="list">
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
                <table class="table table-bordered table-hover">
                    <thead>
                    <tr>
                        <th>编号<i class="fa fa-sort sort" @click="sortHandler('identifier',sort.identifier)"></i></th>
                        <th>名称<i class="fa fa-sort sort" @click="sortHandler('name',sort.name)"></i></th>
                        <th>单位<i class="fa fa-sort sort" @click="sortHandler('unit',sort.unit)"></i></th>
                        <th>售价<i class="fa fa-sort sort" @click="sortHandler('price',sort.price)"></i></th>
                        <th>折扣<i class="fa fa-sort sort" @click="sortHandler('discount',sort.discount)"></i></th>
                        <th>毛利<i class="fa fa-sort sort" @click="sortHandler('gross_margin',sort.gross_margin)"></i></th>
                        <th>推荐</th>
                        <th>品类<i class="fa fa-sort sort" @click="sortHandler('category',sort.category)"></i></th>
                        <th>品牌<i class="fa fa-sort sort" @click="sortHandler('brand',sort.brand)"></i></th>
                        <th>备注</th>
                        <th>操作</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="item in list">
                        <td>{{item.identifier}}</td>
                        <td>{{item.name}}</td>
                        <td>{{item.unit}}</td>
                        <td>{{item.cost_price}}</td>
                        <td>{{item.discount}}</td>
                        <td>{{item.gross_margin}}</td>
                        <td>
                            <span v-if="item.recommended==1">是</span>
                            <span v-else>否</span>
                        </td>
                        <td>{{item.category_name}}</td>
                        <td>{{item.brand_name}}</td>
                        <td> {{item.remarks}}</td>
                        <td>
                            <button class="btn btn-default btn-sm" v-on:click="uploadFile(item.id)">
                                图片管理</button>
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
    import upload from './upload.vue'
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
                    pathname:'goodsList',
                },
                sort:{
                    identifier:0,
                    name:0,
                    price:0,
                    unit:0,
                    discount:0,
                    gross_margin:0,
                    category:0,
                    brand:0
                },
                keys:null,
            }
        },
        components:{
            pagination
        },
        created(){
            let query = Object.keys(this.$route.query).length==0 ? this.pages: this.$route.query
            this.getList(query);
        },
        methods:{
            //搜索
            search:function () {
                let self = this;
                if(self.keys){
                    this.$http.post("/v1/goods/quicksearch_goods",{
                        search_text:self.keys
                    }).then(function (response) {
                        if(response.code==0){
                            let reData = response.data
                            self.list =reData.goods_list;
                        }
                    })
                }else {
                    self.getList(this.pages);
                }
            },
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
                this.$http.get("/v1/goods/get_goods_list",{
                    params:param
                }).then(function (response) {
                    let reData = response.data
                    self.list =reData.goods_list;
                    self.pages.page = reData.page;
                    self.pages.total = reData.total;
                    self.pages.page_size = reData.page_size;
                })
            },
            //删除
            deleteHandler:function (id) {
                let self = this;
                this.$http.get("/v1/goods/delete_goods",{
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
            uploadFile:function (id) {
                let dialog = this.$refs.dialog
                let d = dialog.open({
                    title:'上传图片',
                    template: `<upload :param="${id}"></upload>`,
                    components: {
                        upload:upload
                    },
                    width: '800px',
                    height:'600px',
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