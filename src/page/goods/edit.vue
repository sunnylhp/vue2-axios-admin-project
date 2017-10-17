<template>
    <div class="goods-edit">
        <form class="form-horizontal row">
            <div class="col-sm-6">
                <div class="form-group">
                    <label class="col-sm-3 control-label"><span class="required-label">*</span>商品名称:</label>
                    <div class="col-sm-9">
                        <input type="text" class="form-control" name="" placeholder="" @input="$v.info.name.$touch" v-model.trim="info.name">
                        <span class="error-message" v-if="$v.info.name.$error">必填</span>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-3 control-label">高品条码:</label>
                    <div class="col-sm-9">
                        <input type="text" class="form-control" name="" placeholder="" v-model="info.bar_code">
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-3 control-label">商品单位:</label>
                    <div class="col-sm-9">
                        <input type="text" class="form-control" name="" placeholder="" v-model="info.unit">
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-3 control-label"><span class="required-label">*</span>售价:</label>
                    <div class="col-sm-9">
                        <input type="text" class="form-control" name="" placeholder="" @input="$v.info.price.$touch"
                               v-model.number="info.price">
                        元
                        <span class="error-message" v-if="$v.info.price.$error">数字</span>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-3 control-label">折扣:</label>
                    <div class="col-sm-9">
                        <input type="text" class="form-control" name="" placeholder="" v-model.number="info.discount" @input="$v.info.discount.$touch">
                        <span class="error-message" v-if="$v.info.discount.$error">数字</span>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-3 control-label"><span class="required-label">*</span>成本:</label>
                    <div class="col-sm-9">
                        <input type="text" class="form-control" name="" placeholder=""
                               @input="$v.info.cost_price.$touch" v-model.number="info.cost_price">
                        元
                        <span class="error-message" v-if="$v.info.cost_price.$error">数字</span>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-3 control-label"></label>
                    <div class="col-sm-9">
                        <span class="col-sm-4"><input type="checkbox" class="" placeholder="" v-model.number="info.promotion"> 促销
                        </span>
                        <span class="col-sm-4"><input type="checkbox" placeholder="" class="ml-10" v-model.number="info.recommended">
                            推荐</span>
                    </div>
                </div>
            </div>
            <div class="col-sm-6">
                <div class="form-group">
                    <label class="col-sm-3 control-label">毛税率:</label>
                    <div class="col-sm-9">
                        <input type="text" class="form-control" placeholder="" v-model.number="info.gross_margin" @input="$v.info.gross_margin.$touch">
                        <span class="error-message" v-if="$v.info.gross_margin.$error">数字</span>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-3 control-label"><span class="required-label">*</span>品类:</label>
                    <div class="col-sm-9">
                        <select class="form-control" v-model.number="info.category_id">
                            <option value="" disabled>选择品类</option>
                            <option v-for="item in optionsList"  v-bind:value="item.id"
                                    v-bind:class="'level'+item.level">
                                <span class="level2" v-if="item.level==2">&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                <span class="level2" v-if="item.level==3">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                {{item.name}}
                            </option>
                        </select>
                        <span class="error-message" v-if="$v.info.category_id.$error">必选</span>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-3 control-label">品牌:</label>
                    <div class="col-sm-9">
                        <select class="form-control" v-model.number="info.brand_id">
                            <option value="" disabled>选择品牌</option>
                            <option v-for="item in brandList" v-bind:value="item.id">{{item.name}}</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-3 control-label">规格:</label>
                    <div class="col-sm-9">
                        <input class="form-control" v-model="info.specifications"/>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-3 control-label">标题:</label>
                    <div class="col-sm-9">
                        <input type="text" class="form-control" name="" placeholder="" v-model="info.title">
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-3 control-label">描述:</label>
                    <div class="col-sm-9">
                    <textarea type="text" class="form-control" name="" placeholder=""
                              v-model="info.remarks"></textarea>
                    </div>
                </div>
            </div>
        </form>
        <div class="footer-item" style="text-align: center">
            <button type="button" class="btn btn-success btn-sm" @click="submit($v.info)">保存</button>
        </div>
    </div>
</template>
<script>
    import cityselect from '../../data/cityselect'
    import { required, minLength,alphaNum,numeric,floatNum} from 'vuelidate/lib/validators'
    export default{
        data: function () {
            return {
                category:[],
                optionsList:[],
                brandList:[],
                info:{
                    bar_code:null,
                    name:null,
                    title:null,
                    description:null,
                    unit:null,
                    price:null,
                    discount:null,
                    cost_price:null,
                    gross_margin:null,
                    category_id:'',
                    brand_id:'',
                    recommended:null,
                    promotion:null,
                    specifications:null,
                    remarks:null
                }
            };
        },
        created(){
            this.getCategory();
            this.getBrand();
        },
        computed :{

        },
        props:['param'],
        validations:{
            info:{
                name:{
                    required
                },
                category_id:{
                    required,
                },
                price:{
                    required,
                    floatNum
                },
                cost_price:{
                    required,
                    floatNum
                },
                gross_margin:{
                    floatNum
                },
                discount:{
                    floatNum
                }
            }
        },
        methods: {
            //获得品牌列表
            getBrand:function () {
                let self = this;
                this.$http.get("/v1/goods/get_brand_list",{
                    params:{
                        page:1,
                        page_size:9999
                    }
                }).then(function (response) {
                    if(response.code==0){
                        self.brandList = response.data.brand_list;
                    }
                })
            },
            formOptionsList:function () {
                let curArr1 = this.category;
                let optionsArr = [];
                for(let i=0,len=curArr1.length;i<len;i++){
                    optionsArr.push({
                        id:curArr1[i].id,
                        name:curArr1[i].name,
                        level:curArr1[i].level
                    });
                    let curArr2 = curArr1[i].children_list;
                    if(curArr2){
                        for(let j=0;j<curArr2.length;j++){
                            optionsArr.push({
                                id:curArr2[j].id,
                                name:curArr2[j].name,
                                level:curArr2[j].level
                            })
                            let curArr3 = curArr2[j].children_list;
                            if(curArr3){
                                for(let h=0;h<curArr3.length;h++){
                                    optionsArr.push({
                                        id:curArr3[h].id,
                                        name:curArr3[h].name,
                                        level:curArr3[h].level
                                    })
                                }
                            }

                        }
                    }

                }
                this.optionsList = optionsArr;
            },
            getCategory:function () {
                let self = this;
                this.$http.get("/v1/goods/get_category_all").then(function (response) {
                    let reData = response.data
                    self.category =reData.category_items;
                    self.formOptionsList();
                    self.getDetail(self.param);
                })
            },
            getDetail:function (id) {
                let self = this;
                this.$http.get("/v1/goods/view_goods",{
                    params:{
                        id:id
                    }
                }).then(function (response) {
                    if(response.code==0){
                        self.info = response.data;
                    }
                })
            },
            submit:function ($v) {
                let self = this;
                $v.$touch();
                if($v.$error){
                    return;
                };
                let params ={
                    bar_code:self.info.bar_code,
                    name:self.info.name,
                    title:self.info.title,
                    description:self.info.description,
                    unit:self.info.unit,
                    price:parseFloat(self.info.price),
                    discount:parseFloat(self.info.discount),
                    cost_price:parseFloat(self.info.cost_price),
                    gross_margin:parseFloat(self.info.gross_margin),
                    category_id:self.info.category_id,
                    brand_id:self.info.brand_id,
                    recommended:self.info.recommended ? 1:0,
                    promotion:self.info.promotion ? 1:0,
                    specifications:self.info.specifications,
                    remarks:self.info.remarks,
                }
                if(self.param){
                    params = {
                        id:self.param,
                        bar_code:self.info.bar_code,
                        name:self.info.name,
                        title:self.info.title,
                        description:self.info.description,
                        unit:self.info.unit,
                        price:parseFloat(self.info.price),
                        discount:parseFloat(self.info.discount),
                        cost_price:parseFloat(self.info.cost_price),
                        gross_margin:parseFloat(self.info.gross_margin),
                        category_id:self.info.category_id,
                        brand_id:self.info.brand_id,
                        recommended:self.info.recommended ? 1:0,
                        promotion:self.info.promotion ? 1:0,
                        specifications:self.info.specifications,
                        remarks:self.info.remarks,
                    };
                }

                this.$http.post("/v1/goods/save_goods",params).then(function (response) {
                    if(response.code==0){
                        let query = self.$route.query
                        self.$parent.$parent.$parent.getList(query)
                        self.$parent.$parent.close(0);
                    }
                })

            }
        }
    }
</script>
<style lang="less">
    .goods-edit{
        .form-control{
            width: 180px;
            display: inline-block;
        }
        .level1{
            color: #008d4c;
            font-weight:bold;
            line-height: 2;
        }
        .level2{
            color: #000;
        }
        .level3{
            color: #666;
            font-size: 12px;
            line-height: 3;
        }
    }

</style>