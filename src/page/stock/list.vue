<template>
    <div class="list salespoint">
        <!-- Content Header (Page header) -->
        <section class="content-header">
            <div>
                <div class="form-horizontal" role="form">
                    <input class="form-control form-search" v-model="keys"
                           placeholder="输入关键字" @keyup.enter="search"/>
                    <button type="button" class="btn btn-primary btn-sm" @click="search">搜索</button>
                    <span class="ml-10">仓库：</span>
                    <select class="form-control form-search" v-model.number="warehouseId" @change="init()">
                        <option value="0">全部</option>
                        <option v-for="item in warehouseList" v-bind:value="item.id">{{item.name}}</option>
                    </select>
                </div>
            </div>
        </section>
        <!-- Main content -->
        <section class="content">
            <div class="table-list">
                <table class="table table-bordered">
                    <thead>
                    <tr>
                        <th>商品编号<i class="fa fa-sort sort" @click="sortHandler('identifier',sort.identifier)"></i></th>
                        <th>名称<i class="fa fa-sort sort" @click="sortHandler('name',sort.name)"></i></th>
                        <th>单位<i class="fa fa-sort sort" @click="sortHandler('unit',sort.unit)"></i></th>
                        <th>品类<i class="fa fa-sort sort" @click="sortHandler('category',sort.category)"></i></th>
                        <th>规格</th>
                        <th>备注</th>
                        <th>库存</th>
                        <th>预警值</th>
                        <th>操作</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="item in list">
                        <td>{{item.goods_identifier}}</td>
                        <td>{{item.goods_name}}</td>
                        <td>{{item.goods_unit}}</td>
                        <td>{{item.goods_category_name}}</td>
                        <td>{{item.goods_specifications}}</td>
                        <td>{{item.goods_remarks}}</td>
                        <td>{{item.stock_info.stock_balance}}</td>
                        <td>{{item.stock_info.warning_balance}}</td>
                        <td>
                            <button class="btn btn-default btn-sm" v-on:click="stocktHandler(item.goods_id)">
                                库存管理</button>
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
    import stock from './stock.vue'
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
                    pathname:'stockList',
                },
                sort:{
                    identifier:0,
                    name:0,
                    unit:0,
                    category:0,
                },
                keys:null,
                warehouseList:[],
                warehouseId:0
            }
        },
        components:{
            pagination
        },
        created(){
            this.getWarehouseList();
            this.init();
        },
        methods:{
            init:function () {
                let query = Object.keys(this.$route.query).length==0 ? this.pages: this.$route.query
                this.getList(query);
            },
            //搜索
            search:function () {
                let self = this;
                if(self.keys){
                    this.$http.post("/v1/stock/quicksearch_goods_stock",{
                        search_text:self.keys
                    }).then(function (response) {
                        if(response.code==0){
                            let reData = response.data
                            self.list =reData.goods_stock_list;
                            self.pages.page = reData.page;
                            self.pages.total = reData.total;
                            self.pages.page_size = reData.page_size;
                        }
                    })
                }else {
                    self.getList();
                }
            },
            //库存管理
            stocktHandler:function (id) {
                let title='库存管理';
                let dialog = this.$refs.dialog
                let d = dialog.open({
                    title:title,
                    template: `<stock :param="${id}"></stock>`,
                    components: {
                        stock:stock
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
                if(self.warehouseId!=0){
                    param.warehouse_id = self.warehouseId;
                }
                this.$http.get("/v1/stock/get_goods_stock_list",{
                    params:param
                }).then(function (response) {
                    let reData = response.data
                    self.list =reData.goods_stock_list;
                    self.pages.page = reData.page;
                    self.pages.total = reData.total;
                    self.pages.page_size = reData.page_size;
                })
            },
            //获取仓库
            getWarehouseList(){
                let self = this;
                this.$http.get("/v1/stock/get_warehouse_list",{
                    params:{
                        page:1,
                        page_size:999
                    }
                }).then(function (response) {
                    if(response.code==0){
                        let reData = response.data;
                        self.warehouseList = reData.warehouse_list
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