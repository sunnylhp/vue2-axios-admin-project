<template>
    <div>
        <div class="task-wrap">
            <div class="info-wrap row">
                <div class="col-sm-4">
                    <div class="info-item">{{info.name}}</div>
                    <div class="info-item">{{info.company_name}}</div>
                    <div class="info-item">{{info.province}} {{info.city}} {{info.district}}</div>
                    <div class="info-item">{{info.address}}</div>
                </div>
                <div class="col-sm-4">
                    <div class="info-item">货箱共<span class="red">{{info.box_count}}</span>个</div>
                </div>
                <div class="col-sm-4">
                    <div class="info-item">冰柜共<span class="red">{{info.refrigerator_count}}</span>个</div>
                </div>
            </div>
            <form class="form-horizontal warehouse-list" id="form">
                <table class="table table-bordered" v-for="(item,index) in onsaleList">
                    <thead>
                    <tr>
                        <th colspan="7">货架编号:{{item.container_identifier}}
                       <span class="ml-10">规格：{{item.container_spec_name}}</span>
                        <button type="button" class="btn btn-success btn-xs ml-10" @click="createTask(item.container_id)">添加商品
                        </button></th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr class="table-header">
                        <td>商品</td>
                        <td>在售数量</td>
                        <td>补货仓库</td>
                        <td>库存</td>
                        <td>计划上架</td>
                        <td>预警值</td>
                    </tr>
                    <tr v-for="(val,key) in item.goods_items" v-show="val.type==0">
                        <td>{{val.goods_name}}</td>
                        <td style="width: 80px">{{val.onsale_quantity}}</td>
                        <td style="width: 120px">{{val.warehouse_name}}</td>
                        <td style="width: 80px">{{val.stock_balance}}</td>
                        <td style="width: 120px">
                            <input class="form-control" type="number" v-model.number="val.quantity"
                                   v-bind:value="0">
                        </td>
                        <td style="width: 120px">
                            <input class="form-control" type="number" v-bind:value="val.lower_limit"
                                   v-model.number="val.lower_limit">
                        </td>
                        <td v-if="val.is_new" style="width: 120px"><button type="button" class="btn btn-default btn-sm" @click="deleteHandler(item.container_id,val.goods_id,val.is_new)">删除</button></td>
                        <td v-else style="width: 120px"><button type="button" class="btn btn-default btn-sm" @click="deleteHandler(item.container_id,val.goods_id)">删除</button></td>
                    </tr>
                    </tbody>
                </table>
            </form>
        </div>
        <div class="footer-item">
            <button type="button" class="btn btn-primary btn-sm" @click="submit">下一步</button>
        </div>
        <vdialog ref="dialog"></vdialog>
    </div>
</template>
<script>
    import { required, minLength,alphaNum,numeric,floatNum,nzintNum} from 'vuelidate/lib/validators'
    import goodslist from './goodslist.vue'
    import create from './create.vue'
    export default {
        data(){
            return{
                onsaleList:[],
                info:{}
            }
        },
        created(){
            this.getSaleList();
            this.getInfo();
        },
        computed:{

        },
        //props:['param'],
        methods:{
            //获取销售点信息
            getInfo() {
                let self = this;
                this.$http.get("/v1/salespoint/view_salespoint",{
                    params:{
                        id:self.$route.query.point_id
                    }
                }).then(function (response) {
                    if(response.code==0){
                        self.info = response.data;
                    }else {
                        alert(response.msg);
                    }
                })
            },
            //在售商品列表
            getSaleList(){
                let self = this;
                let id = self.$route.query.point_id;
                this.$http.get("/v1/task/get_onsales_all_by_point",{
                    params:{
                        point_id:parseInt(id)
                    }
                }).then(function (response) {
                    if(response.code==0){
                        let list = response.data.onsale_list;
                        list.forEach(function (item,index,array) {
                            let items = item.goods_items
                            if(items){
                                for(let i=0,len=items.length;i<len;i++){
                                    list[index].goods_items[i].type=0;
                                }
                            }
                        })
                        self.onsaleList = list;
                    }else {
                        alert(response.msg);
                    }
                })
            },
            //创建任务
            createTask: function (id) {
                let dialog = this.$refs.dialog
                let d = dialog.open({
                    title:'选择商品',
                    template: `<create :param.sync="${id}"></create>`,
                    components: {
                        create:goodslist
                    },
                    width: '800px',
                    height:'600px'
                })
            },
            //添加商品
            addGoods:function (containerId,goodsArr) {
                let self = this;
                let list = self.onsaleList;
               if(list.length){
                   list.forEach(function (item, index, array) {
                       if(item.container_id == containerId){
                           let arr=[];
                               for(let i=0,len=goodsArr.length;i<len;i++){
                                   let isFalg = false;
                                   if(!item.goods_items){
                                       item.goods_items=[];
                                   }
                                   for(let j=0,l=item.goods_items.length;j<l;j++){
                                       if(goodsArr[i].goods_id==item.goods_items[j].goods_id){
                                           isFalg = true;
                                           break;
                                       }
                                   }
                                   if(!isFalg){
                                       arr.push(goodsArr[i])
                                   }
                               }
                           list[index].goods_items.push(...arr);
                           }
                   })
               }
               self.onsaleList = list;
            },
            //删除商品
            deleteHandler:function (container_id,goods_id,is_new) {
                let self= this;
                let list = self.onsaleList;
                list.forEach(function (item,index,array) {
                    let items = item.goods_items
                    if(items && item.container_id==container_id){
                        for(let i=0,len=items.length;i<len;i++){
                            if(items[i].goods_id==goods_id){
                                if(is_new){
                                    list[index].goods_items.splice(i,1)
                                }else {
                                    list[index].goods_items[i].type=1;
                                }
                            }
                        }
                    }
                })
                self.onsaleList = list
            },
            submit($v) {
                let self = this;
                let isValid = true;
                let list = self.onsaleList;
                let preparationArr=[];
                if(list.length){
                    list.forEach(function (item, index, array) {
                        if(!item.goods_items) item.goods_items=[];
                        for(let i=0,len=item.goods_items.length;i<len;i++){
                            preparationArr.push({
                                container_id:item.container_id,
                                goods_id:item.goods_items[i].goods_id,
                                warehouse_id:item.goods_items[i].warehouse_id,
                                type:0,
                                quantity:item.goods_items[i].quantity,
                                lower_limit:item.goods_items[i].lower_limit,
                            })
                        }
                    })
                }
                let params = {preparation_items:preparationArr};
                let task_id;
                this.$http.post("/v1/task/create_preparation",params).then(function (response) {
                    if(response.code==0){
                        task_id = response.data.id;
                        let dialog = self.$refs.dialog;
                        let d = dialog.open({
                            title:'创建补货任务',
                            template: `<create :param.sync="${task_id}"></create>`,
                            components: {
                                create:create
                            },
                            width: '800px',
                            height:'600px'
                        })
                    }else {
                        alert(response.msg);
                        return;
                    }
                })



            }

        }
    }
</script>
<style lang="less">
    .task-wrap{
        padding: 20px 10px 0 20px;
        input{
            display: inline-block;
            width:80px;
            height: 26px;
        }
        .table thead{
            border-top: 1px solid #ccc;
            border-bottom: 1px solid #ccc;
            background-color: #f5f5f5;
        }
        .table{
            margin: 0;
        }
        .table-header{
            td{
            }
            color: #000;
        }
        .info-wrap{
            border: 1px solid #ddd;
            padding: 20px 0 10px 0;
            margin-bottom: 20px;
        }
        .info-item{
            margin-bottom: 10px;
        }
    }
</style>