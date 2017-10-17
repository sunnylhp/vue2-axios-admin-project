<template>
    <div>
        <form class="form-horizontal">
            <div class="box-body">
                <div class="form-group">
                    <label class="col-sm-2 control-label"><span class="required-label">*</span>账号:</label>
                    <div class="col-sm-9">
                        <input type="text" class="form-control" name="" placeholder="" @input="$v.info.login_name.$touch" v-model.trim="info.login_name">
                        <span class="error-message" v-if="$v.info.login_name.$error">必填</span>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-2 control-label"><span class="required-label">*</span>姓名:</label>
                    <div class="col-sm-9">
                        <input type="text" class="form-control" name="" placeholder="" @input="$v.info.name.$touch" v-model.trim="info.name">
                        <span class="error-message" v-if="$v.info.name.$error">必填</span>
                    </div>
                </div>
                <div class="form-group" v-if="param">
                    <label class="col-sm-2 control-label">密码:</label>
                    <div class="col-sm-9">
                        <input type="password" class="form-control" name="" placeholder="8~16个字符"
                               v-model.trim="info.password">
                    </div>
                </div>
                <div class="form-group" v-else="!param">
                    <label class="col-sm-2 control-label"><span class="required-label">*</span>密码:</label>
                    <div class="col-sm-9">
                        <input type="password" class="form-control" name="" placeholder="8~16个字符"
                               @input="$v.info.password.$touch"
                               v-model.trim="info.password">
                        <span class="error-message" v-if="$v.info.password.$error">8~16个字符</span>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-2 control-label"><span class="required-label">*</span>角色:</label>
                    <div class="col-sm-9">
                        <select class="form-control" v-model.number="info.role_id" @change="$v.info.role_id.$touch">
                            <option value="0" disabled>选择角色</option>
                            <option v-for="option in roleItems" v-bind:value="option.id">
                                {{option.name}}
                            </option>
                        </select>
                        <span class="error-message" v-if="$v.info.role_id.$error">
                               选择角色
                            </span>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-2 control-label"><span class="required-label">*</span>手机号:</label>
                    <div class="col-sm-9">
                        <input type="text" class="form-control" name="" placeholder="11位手机号" @input="$v.info.phone.$touch" v-model.trim="info.phone">
                        <span class="error-message" v-if="$v.info.phone.$error">11位手机号</span>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-2 control-label">身份证:</label>
                    <div class="col-sm-9">
                        <input type="text" class="form-control" name="" placeholder="" v-model.trim="info.id_card">
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-2 control-label">性别:</label>
                    <div class="col-sm-9">
                        <label><input type="radio" v-bind:value="1" v-model.number="info.gender"> 男</label>
                        <label class="ml-10"><input type="radio" value="2" v-model.number="info.gender"> 女</label>

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
        </form>
        <div class="footer-item" style="text-align: center">
            <button type="button" class="btn btn-success btn-sm" @click="submit($v.info)">保存</button>
        </div>
    </div>
</template>
<script>
    import { required, minLength,alphaNum,nzintNum,maxLength } from 'vuelidate/lib/validators'
    export default{
        data: function () {
            return {
                roleItems:[],
                info:{
                    login_name:null,
                    name:null,
                    password:null,
                    role_id:0,
                    phone:null,
                    id_card:null,
                    gender:1,
                    remarks:null
                }
            };
        },
        created(){
            this.getRole();
           // this.getDetail();
        },
        validations:{
            info:{
                login_name:{
                    required
                },
                name:{
                    required
                },
                password:{
                    required,
                    minLength:minLength(8),
                    maxLength:maxLength(16),
                },
                phone:{
                    required
                },
                role_id:{
                    required,
                    nzintNum
                }
            }
        },
        props:['param'],
        methods: {
            //获得信息
            getDetail:function () {
                let self = this;
                let id = self.param;
                this.$http.get("/v1/staff/view_staff",{
                    params:{id:id}
                }).then(function (response) {
                    self.info =response.data;
                })
            },
            getRole:function () {
                let self = this;
                this.$http.get("/v1/staff/get_role_all").then(function (response) {
                    if(response.code==0){
                        let reData = response.data
                        self.roleItems =reData.role_items;
                        if(self.param){
                            self.getDetail();
                        }
                    }else {
                        alert(response.msg)
                    }
                })
            },
            submit:function ($v) {
                let self = this;
                $v.$touch();
                let isFlag = true;
                if($v.$error){
                    isFlag = false;
                    if(self.param && $v.password.$error){
                        isFlag = true;
                    }
                    if(!isFlag){
                        return;
                    }
                }

                let params = {
                    login_name:self.info.login_name,
                    name:self.info.name,
                    password:self.info.password,
                    role_id:self.info.role_id,
                    phone:self.info.phone,
                    id_card:self.info.id_card,
                    gender:self.info.gender,
                    remarks:self.info.remarks
                }
                if(self.param){
                    params = {
                        id:self.info.id,
                        login_name:self.info.login_name,
                        name:self.info.name,
                        password:self.info.password,
                        role_id:self.info.role_id,
                        phone:self.info.phone,
                        id_card:self.info.id_card,
                        gender:self.info.gender,
                        remarks:self.info.remarks
                    }
                }
                this.$http.post("/v1/staff/save_staff",params).then(function (response) {
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