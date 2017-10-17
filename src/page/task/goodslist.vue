<template>
    <div class="list goods-list">
        <!-- Content Header (Page header) -->
        <section class="content-header">
            <div>
                <form class="form-horizontal" role="form">
                    <input class="form-control form-search" v-model="keys"
                           placeholder="输入关键字"/>
                    <button type="button" class="btn btn-primary btn-sm" @click="search">搜索</button>
                    <span class="ml-10">仓库：</span>
                    <select class="form-control form-search" v-model.number="warehouseId" @change="getList()">
                        <option v-for="item in warehouseList" v-bind:value="item.id">{{item.name}}</option>
                    </select>
                </form>
            </div>
        </section>
        <!-- Main content -->
        <section class="content">
            <table class="table table-bordered table-hover">
                <thead>
                <tr>
                    <th></th>
                    <th>编号</th>
                    <th>名称</th>
                    <th>品类</th>
                    <th>品牌</th>
                    <th>单位</th>
                    <th>可用库存</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in list">
                    <td><input type="checkbox" v-bind:value="item.goods_id" v-model="checkItems"/></td>
                    <td>{{item.goods_identifier}}</td>
                    <td>{{item.goods_name}}</td>
                    <td>{{item.goods_category_name}}</td>
                    <td>{{item.goods_category_name}}</td>
                    <td>{{item.goods_unit}}</td>
                    <td>{{item.stock_info.stock_balance}}</td>
                </tr>
                </tbody>
            </table>
                <div class="" v-show="pages.total>pages.size">
                    <page :page="pages" :pathname="pathname"></page>
                </div>
            <div class="footer-item" style="text-align: center">
                <button type="button" class="btn btn-success btn-sm" @click="selectGoods">确定</button>
            </div>
        </section>
        <vdialog ref="dialog"></vdialog>
        <!-- /.content -->
    </div>
</template>
<script>
    import page from './page.vue'
    export default{
        data(){
            return {
                list:null,
                pages:{
                    page:1,
                    total:1,
                    size:10
                },
                pathname:'goodsList',
                keys:null,
                warehouseList:[],
                warehouseId:0,
                checkItems:[],
                flag:false
            }
        },
        components:{
            page
        },
        created(){
            this.getWarehouseList();
            //this.getList();
        },
        props:['param'],
        computed:{
            page:function () {
                return this.$route.query.page;
            }
        },
        methods:{
            //搜索
            search:function () {
                let self = this;
                let param;
                if(self.keys){
                    let param = {
                        search_text:self.keys,
                        warehouse_id:self.warehouseId
                    }
                    this.$http.post("/v1/stock/quicksearch_goods_stock",param).then(function (response) {
                        if(response.code==0){
                            let reData = response.data
                            self.list =reData.goods_stock_list;
                            self.pages.page = 1;
                            self.pages.total = reData.total;
                            self.pages.size = 9999;
                            self.flag = true;
                        }
                    })
                }else {
                    self.getList();
                }
            },
            //列表
            getList:function (page) {
                let self = this;
                let p=1;
                if(page){
                    p=page
                }
                self.pages.size = self.flag ? 3 : self.pages.size
                let  param = {
                    page:p,
                    page_size:self.pages.size,
                    warehouse_id:self.warehouseId
                }
                this.$http.get("/v1/stock/get_goods_stock_list",{
                    params:param
                }).then(function (response) {
                    let reData = response.data
                    self.list =reData.goods_stock_list;
                    self.pages.page = reData.page;
                    self.pages.total = reData.total;
                    self.pages.size = reData.page_size;
                    self.flag = false;
                })
            },
            formData(id){
                let self = this;
                let list = self.list;
                list.forEach(function (item, index, array) {
                    let items = item.stock_list;
                    for(let i=0,len=items.length;i<len;i++){
                        if(items[i].warehouse_id = id){

                        }
                    }
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
                        self.warehouseList = reData.warehouse_list?reData.warehouse_list:[];
                        self.warehouseId = self.warehouseList[0].id;
                        self.getList();
                    }else {
                        alert(response.msg)
                    }
                })
            },
            selectGoods:function () {
                let self = this;
                let list = self.list;
                let checkItems = self.checkItems
                let selectItems = [];
                list.forEach(function (item, index, array) {
                    for(let i=0,len=checkItems.length;i<len;i++){
                        let cur = list[index]
                        if(checkItems[i]==item.goods_id){
                            let warehouse_name= (function () {
                                let name;
                                self.warehouseList.forEach(function (item,index,array) {
                                    if(self.warehouseId==item.id){
                                        name = item.name
                                    }
                                })
                                return name;
                            })()
                            selectItems.push({
                                goods_id:cur.goods_id,
                                goods_name:cur.goods_name,
                                onsale_quantity:0,
                                warehouse_id:self.warehouseId,
                                warehouse_name:warehouse_name,
                                stock_balance:cur.stock_info.stock_balance,
                                quantity:0,
                                type:0,
                                lower_limit:5,
                                is_new:1
                            })
                        }
                    }
                })

                this.$parent.$parent.$parent.addGoods(self.param,selectItems)
                this.$parent.$parent.close(0);
            }
        }
    }
</script>
<style lang="less">
    .goods-list{
        .form-search{
            width: 150px;
            display: inline-block;
        }
        select.form-search{
            width: 120px;
        }
    }
</style>