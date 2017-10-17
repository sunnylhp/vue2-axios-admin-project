<template>
    <div>
        <div class="warehouse-wrap">
            <div class="goods-info">
                <table class="table table-bordered">
                    <thead>
                    <tr>
                        <th>高品编号</th>
                        <th>名称</th>
                        <th>规格</th>
                    </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{{info.goods_identifier}}</td>
                            <td>{{info.goods_name}}</td>
                            <td>{{info.goods_specifications}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <form class="form-horizontal warehouse-list" id="form">
                <h1 class="action">
                    <b class="red">{{info.goods_identifier}}</b>
                    <span>库存</span>
                    <button type="button" class="btn btn-success btn-sm" @click="addItem()">添加</button>
                </h1>
                <table class="table table-bordered">
                    <thead>
                    <tr>
                        <th style="width: 150px">仓库</th>
                        <th>当前库存</th>
                        <th>设置库存</th>
                        <th>预警设置</th>
                    </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item,index) in stockList">
                            <td>
                                <span v-if="!item.flag">
                                    {{item.warehouse_name}}
                                </span>
                                <span v-else>
                                     <select class="form-control" v-model.number="item.warehouse_id" @input="getSelectList(item.warehouse_id,index);$v.stockList.$each[index].warehouse_id.$touch()">
                                    <option value="0" disabled>选择</option>
                                    <option v-for="option in warehouseList" v-bind:value="option.id"
                                            v-bind:disabled="option.flag == 1">{{
                                        option.name}}
                                    </option>
                                </select>
                                <span class="error-message" v-if="$v.stockList.$each[index].warehouse_id.$error">
                                    必选</span>
                                </span>

                            </td>
                            <td>
                                {{item.cur_balance}}
                            </td>
                            <td>
                                <input class="form-control" v-bind:value="item.stock_balance"
                                       v-model.number="item.stock_balance"
                                       @input="$v.stockList.$each[index].stock_balance.$touch()"/>
                                <span class="error-message" v-if="$v.stockList.$each[index].stock_balance.$error">整数</span>
                            </td>
                            <td>
                                <input class="form-control" v-bind:value="item.warning_balance"
                                       v-model.number="item.warning_balance"
                                       @input="$v.stockList.$each[index].warning_balance.$touch()"/>
                                <span class="error-message" v-if="$v.stockList.$each[index].warning_balance.$error">整数</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>
        </div>
        <div class="footer-item">
            <button type="button" class="btn btn-primary btn-sm" @click="submit($v)">保存</button>
        </div>
    </div>
</template>
<script>
    import { required, minLength,alphaNum,numeric,floatNum,nzintNum} from 'vuelidate/lib/validators'
    export default {
        data(){
            return{
                warehouseList:[],//仓库列表
                warehouseIdList:[],
                stockList:[],//
                info:{},
                addList:[],
                selectedList:[]
            }
        },
        created(){
            this.getWarehouseList()
            this.getInfo();
        },
        computed:{

        },
        validations: {
            stockList: {
                $each: {
                    stock_balance: {
                        required,
                        numeric
                    },
                    warning_balance:{
                        required,
                        numeric
                    },
                    warehouse_id:{
                        nzintNum
                    }
                }
            }
        },
        props:['param'],
        methods:{
            //获取仓库
            getWarehouseList(){
                let self = this;
                this.$http.get("/v1/stock/get_warehouse_list",{
                    params:{
                        page:1,
                        page_size:999
                    }
                }).then(function (response) {
                    let reData = response.data
                    let warehouseArr=[]
                    reData.warehouse_list.forEach(function (item,key,array) {
                        warehouseArr.push({
                            id:item.id,
                            name:item.name,
                            flag:0
                        })
                    })
                    self.warehouseList = warehouseArr;
                    self.warehouseIdList = warehouseArr;
                })
            },
            addItem(){
                let self=this;
                self.formSelect();
                let id;
                self.stockList.push({
                    warehouse_id:0,
                    warehouse_name:'',
                    cur_balance:0,
                    stock_balance:0,
                    warning_balance:0,
                    flag:true
                })
            },
            formSelect(){
                let self = this;
                self.warehouseList = self.warehouseIdList
                let len = self.warehouseList.length,
                    len2 = self.stockList.length;
                if(len2){
                    for(let i=0;i<len;i++){
                        let id = self.warehouseList[i].id;
                        self.warehouseList[i].flag =0;
                        for(let j=0;j<len2;j++){
                            if(self.stockList[j].warehouse_id==id){
                                self.warehouseList[i].flag = 1;
                            }
                        }
                    }
                }
            },
            formData(){
                let list = this.stockList;
                let arr =[];
                list.forEach(function (item, index, array) {
                    arr.push({
                        warehouse_id:item.warehouse_id,
                        stock_balance:item.stock_balance,
                        warning_balance:item.warning_balance,
                    })
                })
                return arr;
            },
            getSelectList(id,index){
                let self = this;
                self.stockList[index].warehouse_id=id;
                self.formSelect();
            },
            getInfo(){
                let self = this;
                let id = self.param;
                this.$http.get("/v1/stock/get_goods_stock",{
                    params:{
                        good_id:parseInt(id)
                    }
                }).then(function (response) {
                    let reData = response.data;
                    self.info = reData;
                    //self.stockList =reData.stock_list? reData.stock_list:[];
                    if(reData.stock_list){
                        reData.stock_list.forEach(function (item, index, array) {
                            self.stockList.push({
                                warehouse_id:item.warehouse_id,
                                warehouse_name:item.warehouse_name,
                                cur_balance:item.stock_balance,
                                stock_balance:item.stock_balance,
                                warning_balance:item.warning_balance,
                            })
                        })
                    }
                })
            },

            submit($v) {
                let self = this;
                $v.stockList.$touch();
                if($v.$error){
                    return;
                }
                let items = self.formData();
                let params = {
                    goods_id:parseInt(self.param),
                    stock_items:items
                };
                this.$http.post("/v1/stock/add_goods_stock",params).then(function (response) {
                    if(response.code==0){
                        let query = self.$route.query
                        self.$parent.$parent.$parent.getList(query)
                        self.$parent.$parent.close(0);
                    }else {
                        alert(response.msg)
                    }
                })


            }

        }
    }
</script>
<style lang="less">
    .warehouse-wrap{
        padding: 0 10px;
        .warehouse-list{
            background-color: #f7f7f7;
            border: 1px solid #ccc;
        }
        input{
            display: inline-block;
            width:80px;
        }
        select{
            display: inline-block;
        }
        .action{
            border-bottom: 1px solid #ccc;
            padding: 0px 20px 10px 10px;
            span{
                display: inline-block;
                padding-right: 20px;
                font-weight: bold;
            }
        }
    }
</style>