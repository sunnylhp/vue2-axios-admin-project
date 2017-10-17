<template>
    <div class="">
        <form class="form-horizontal">
            <div class="form-group">
                <label class="col-sm-2 control-label"><span class="required-label">*</span>名称:</label>
                <div class="col-sm-9">
                    <input type="text" class="form-control" name="" placeholder="" @input="$v.info.name.$touch" v-model.trim="info.name">
                    <span class="error-message" v-if="$v.info.name.$error">必填</span>
                </div>
            </div>
            <div class="form-group">
                <label class="col-sm-2 control-label"><span class="required-label">*</span>公司名称:</label>
                <div class="col-sm-9">
                    <input type="text" class="form-control" name="" placeholder="" @input="$v.info.company_name.$touch" v-model="info.company_name">
                    <span class="error-message" v-if="$v.info.company_name.$error">必填</span>
                </div>
            </div>
            <div class="form-group">
                <label class="col-sm-2 control-label"><span class="required-label">*</span>地址:</label>
                <div class="col-sm-9">
                    <div>
                        <select class="form-control select-inline" v-model="info.province" @change="$v.info.province.$touch">
                            <option value="" disabled>选择省</option>
                            <option v-for="option in provinceList"  v-bind:value="option.region.name">
                                {{option.region.name}}
                            </option>
                        </select>
                        <select class="form-control select-inline" v-model="info.city" @change="$v.info.city.$touch">
                            <option value="" disabled>选择市</option>
                            <option v-for="option in cityList" v-bind:value="option.name">
                                {{option.name}}
                            </option>
                        </select>
                        <select class="form-control select-inline " v-model="info.district" @change="$v.info.district.$touch">
                            <option value="" disabled>选择区</option>
                            <option v-for="option in districtList" v-bind:value="option.name">
                                {{option.name}}
                            </option>
                        </select>
                        <span class="error-message"
                              v-if="$v.info.province.$error ||$v.info.city.$error||$v.info.district.$error">选择省/市/区
                                </span>
                    </div>
                    <div class="mt-10">
                        <textarea class="form-control" placeholder="详细地址"
                                  @input="$v.info.address.$touch" v-model="info.address"></textarea>
                        <span class="error-message" v-if="$v.info.address.$error">必填</span>
                    </div>
                </div>
            </div>
            <div class="form-group">
                <label class="col-sm-2 control-label">联系人:</label>
                <div class="col-sm-9">
                    <div>
                        <select class="form-control" placeholder="" v-model="info.staff_id" @change="$v.info.staff_id.$touch">
                            <option value="" disabled>选择负责人</option>
                            <option v-for="item in staffList" v-bind:value="item.id">
                                {{item.name}}
                            </option>
                        </select>
                    </div>
                    <div><span class="error-message" v-if="$v.info.staff_id.$error">必填</span></div>
                </div>
            </div>
            <div class="form-group">
                <label class="col-sm-2 control-label">联系人:</label>
                <div class="col-sm-9">
                    <input type="text" class="form-control" placeholder="" v-model="info.contact_name">
                </div>
            </div>
            <div class="form-group">
                <label class="col-sm-2 control-label">联系电话:</label>
                <div class="col-sm-9">
                    <input type="text" class="form-control" placeholder="" v-model="info.contact_phone">
                </div>
            </div>
            <div class="form-group">
                <label class="col-sm-2 control-label">协议编号:</label>
                <div class="col-sm-9">
                    <input type="text" class="form-control" placeholder="" v-model="info.contract_number">
                </div>
            </div>
            <div class="form-group">
                <label class="col-sm-2 control-label">备注:</label>
                <div class="col-sm-9">
                        <textarea type="text" class="form-control" name="" placeholder=""
                                  v-model="info.remarks"></textarea>
                </div>
            </div>
        </form>
        <div class="footer-item" style="text-align: center">
            <button type="button" class="btn btn-success btn-sm" @click="submit($v)">保存</button>
        </div>
    </div>
</template>
<script>
    import cityselect from '../../data/cityselect'
    import { required, minLength,alphaNum,numeric,floatNum} from 'vuelidate/lib/validators'
    export default{
        data: function () {
            return {
                provinceList:cityselect,
                staffList:[],
                info:{
                    name:null,
                    company_name:null,
                    province:'',
                    city:'',
                    district:'',
                    address:null,
                    contact_name:null,
                    contact_phone:null,
                    staff_id:'',
                    contract_number:null,
                    remarks:null,
                }
            };
        },
        created(){
            this.getStaff();
        },
        computed :{
            cityList:function () {//获取城市列表
                let self = this;
                let citys = [];
                this.provinceList.forEach(function (item,index,array) {
                    if(item.region.name == self.info.province){
                        citys = item.region.state;
                    }
                })
                return citys;
            },
            districtList:function () {//获取区列表
                let self = this;
                let d=[];
                this.cityList.forEach(function (item,index,array) {
                    if(item.name == self.info.city){
                        d = item.city;
                    }
                })
                return d;
            }
        },
        props:['param'],
        validations:{
            info:{
                name:{
                    required
                },
                company_name:{
                    required,
                },
                province:{
                    required
                },
                city:{
                    required
                },
                district:{
                    required
                },
                address:{
                    required
                },
                staff_id:{
                    required
                }
            }
        },
        methods: {
            //获取负责人
            getStaff:function () {
                let self = this;
                this.$http.get("/v1/staff/get_sales_in_charge").then(function (response) {
                   if(response.code==0){
                       self.staffList =response.data.staff_list;
                       if(self.param){
                           self.getDetail(self.param);
                       }
                       //self.getDetail()
                   }else {
                       alert(response.msg)
                   }
                })
            },
            getDetail:function (id) {
                let self = this;
                this.$http.get("/v1/salespoint/view_salespoint",{
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
                let params={};
                $v.$touch();
                if($v.$error){
                    return;
                };
                if(self.param){
                    params = {
                        id:parseInt(self.param),
                        name:self.info.name,
                        company_name:self.info.company_name,
                        province:self.info.province,
                        city:self.info.city,
                        district:self.info.district,
                        address:self.info.address,
                        contact_name:self.info.contact_name,
                        contact_phone:self.info.contact_phone,
                        staff_id:parseInt(self.info.staff_id),
                        contract_number:self.info.contract_number,
                        remarks:self.info.remarks
                    };
                }else {
                    params = {
                        name:self.info.name,
                        company_name:self.info.company_name,
                        province:self.info.province,
                        city:self.info.city,
                        district:self.info.district,
                        address:self.info.address,
                        contact_name:self.info.contact_name,
                        contact_phone:self.info.contact_phone,
                        staff_id:parseInt(self.info.staff_id),
                        contract_number:self.info.contract_number,
                        remarks:self.info.remarks
                    };
                }
                this.$http.post("/v1/salespoint/save_salespoint",params).then(function (response) {
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
    .select-inline{
        display: inline-block;
        width: 150px;
    }
</style>