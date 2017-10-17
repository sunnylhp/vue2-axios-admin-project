<template>
    <div>
        <form class="form-horizontal">
            <div class="col-sm-12">
                <div class="box-body">
                    <div class="form-group">
                        <label class="col-sm-2 control-label"><span class="required-label">*</span>名称:</label>
                        <div class="col-sm-9">
                            <input type="text" class="form-control" name="" placeholder="" @input="$v.info.name.$touch" v-model.trim="info.name">
                            <span class="error-message" v-if="$v.info.name.$error">必填</span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label"><span class="required-label">*</span>地址:</label>
                        <div class="col-sm-9">
                            <div>
                                <select class="form-control select-inline" v-model.number="info.province"
                                        @change="$v.info.province.$touch">
                                    <option value="">选择省</option>
                                    <option v-for="option in provinceList"  v-bind:value="option.region.name">
                                        {{option.region.name}}
                                    </option>
                                </select>
                                <select class="form-control select-inline" v-model.number="info.city"
                                        @change="$v.info.city.$touch">
                                    <option value="">选择市</option>
                                    <option v-for="option in cityList" v-bind:value="option.name">
                                        {{option.name}}
                                    </option>
                                </select>
                                <select class="form-control select-inline" v-model.number="info.district" @change="$v.info.district.$touch">
                                    <option value="">选择区</option>
                                    <option v-for="option in districtList" v-bind:value="option.name">
                                        {{option.name}}
                                    </option>
                                </select>
                                <span class="error-message"
                                      v-if="$v.info.province.$error ||$v.info.city.$error||$v.info.district.$error">选择省/市/区
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label"><span class="required-label">*</span></label>
                        <div class="col-sm-9">
                            <input type="text" class="form-control" name="" placeholder="详细地址" v-model="info.address"
                                   @input="$v.info.address.$touch">
                            <span class="error-message" v-if="$v.info.address.$error">
                                必填
                            </span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label"><span class="required-label">*</span>负责人:</label>
                        <div class="col-sm-9">
                            <select class="form-control" v-model.number="info.staff_id">
                                <option value="">选择负责人</option>
                                <option v-for="option in staffList" v-bind:value="option.id">
                                    {{option.name}}
                                </option>
                            </select>
                            <span class="error-message" v-if="$v.info.staff_id.$error">
                                请选择负责人
                            </span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label">备注：</label>
                        <div class="col-sm-9">
                            <textarea type="text" class="form-control" name="" placeholder="" v-model="info.remarks"></textarea>
                        </div>
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
    import { required, minLength,alphaNum } from 'vuelidate/lib/validators'
    export default{
        data: function () {
            return {
                provinceList:cityselect,
                staffList:[],
                info:{
                    province:'',
                    city:'',
                    district:'',
                    staff_id:'',
                    name:null,
                    address:null,
                    remarks:'',
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
        validations:{
            info:{
                name:{
                    required
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
                },
            }
        },
        props:['param'],
        methods: {
            //获得员工列表
            getStaff:function () {
                let self = this;
                this.$http.get("/v1/staff/get_warehouse_in_charge").then(function (response) {
                    self.staffList =response.data.staff_list;
                    if(self.param){
                        self.getDetail();
                    }
                })
            },
            //获得仓库详情
            getDetail:function () {
                let self = this;
                let id = self.param;
                if(!id){
                    return self.info = {};
                }
                this.$http.get("/v1/stock/view_warehouse",{
                    params:{id:id}
                }).then(function (response) {
                    self.info =response.data;
                })
            },
            submit:function ($v) {
                let self = this;
                $v.$touch();
                if($v.$error){
                    return;
                }
                let params = {
                    province:self.info.province,
                    city:self.info.city,
                    district:self.info.district,
                    staff_id:self.info.staff_id,
                    name:self.info.name,
                    address:self.info.address,
                    remarks:self.info.remarks
                }
                if(self.param){
                    params = {
                        id:self.info.id,
                        province:self.info.province,
                        city:self.info.city,
                        district:self.info.district,
                        staff_id:self.info.staff_id,
                        name:self.info.name,
                        identifier:self.info.identifier,
                        address:self.info.address,
                        remarks:self.info.remarks
                    }
                }
                this.$http.post("/v1/stock/save_warehouse",params).then(function (response) {
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
<style>
    .row{
        margin-top: 10px;
    }
    .control-label{
        text-align: right;
        color: #666;
        font-weight:normal;
        padding-right: 0px;
        padding-left: 0px;
    }
    .footer-item{
        text-align: center;
        margin-top: 30px;
    }
</style>