<template>
    <div class="authority-wrap">
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
                        <label class="col-sm-2 control-label"><span class="required-label">*</span>权限:</label>
                        <div class="col-sm-9">
                            <table class="table table-bordered table-hover">
                                <tbody>
                                    <tr v-for="item in items">
                                        <td>{{item.module_name}}：</td>
                                        <td>
                                            <span class="mr-20" v-for="val in item.responsibility_items">
                                                <label><input type="checkbox" v-bind:value="val.responsibility_id"
                                                              v-model="checkedItems"/>
                                                <span>{{val.definition}}</span></label>
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <div v-if="!checkedItems.length"><span class="error-message">必选</span></div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label">备注:</label>
                        <div class="col-sm-9">
                            <textarea type="text" class="form-control" name="" placeholder=""
                                      v-model.trim="info.remarks"></textarea>
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
    import { required, minLength,alphaNum } from 'vuelidate/lib/validators'
    export default{
        data: function () {
            return {
                info:{
                    id:null,
                    name:null,
                    remarks:null,
                    responsibility_items:[],
                },
                items:{},
                checkedItems:[],
                requiredCheck:true
            };
        },
        created(){
            if(this.param){
                this.getDetail();
            }
            this.getResponsibility();
        },
        validations:{
            info:{
                name:{
                    required
                }
            }
        },
        props:['param'],
        methods: {
            //获得员工列表
            getResponsibility:function () {
                let self = this;
                this.$http.get("/v1/staff/get_responsibility_all").then(function (response) {
                    let moduleItems = response.data.module_items
                    self.items =moduleItems;
                })
            },
            props:['param'],
            //获得信息
            getDetail:function () {
                let self = this;
                let id = self.param;
                if(!id){
                    return;
                }
                this.$http.get("/v1/staff/view_role",{
                    params:{id:id}
                }).then(function (response) {
                    self.info =response.data;
                    let items = response.data.responsibility_items;
                    if(!items){
                        items=[];
                    }
                    items.forEach(function (item, index, array) {
                        self.checkedItems.push(item.responsibility_id);
                    })
                })
            },
            submit:function ($v) {
                let self = this;
                $v.$touch();
                if($v.$error || !self.checkedItems.length){
                    return;
                }
                let responsibilityItems=[];
                self.checkedItems.forEach(function (val,key,arary) {
                    responsibilityItems.push({
                        responsibility_id:val
                    })
                })
                let params = {
                    name:self.info.name,
                    remarks:self.info.remarks,
                    responsibility_items:responsibilityItems,
                }
                if(self.param){
                    params = {
                        id:self.param,
                        name:self.info.name,
                        remarks:self.info.remarks,
                        responsibility_items:responsibilityItems,
                    }
                }
                this.$http.post("/v1/staff/save_role",params).then(function (response) {
                    if(response.code==0){
                        self.$parent.$parent.$parent.getList()
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
    .authority-wrap{
        .table td{
            padding: 12px;
            input{
                vertical-align: sub;
            }
        }
        .table tr:nth-of-type(2n+1){
            background-color: #e9eaeb;
        }
        .table tr:nth-of-type(2n){
            background-color: #f5f5f5;
        }
    }
</style>