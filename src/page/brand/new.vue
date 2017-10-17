<template>
    <div>
        <form class="form-horizontal">
            <div class="col-sm-12">
                <div class="box-body">
                    <div class="form-group">
                        <label class="col-sm-2 control-label">名称:</label>
                        <div class="col-sm-9">
                            <input type="text" class="form-control" name="" placeholder="" @input="$v.info.name.$touch"
                                   v-model="info.name">
                            <span class="error-message" v-if="$v.info.name.$error">必填</span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label">英文名称:</label>
                        <div class="col-sm-9">
                            <input type="text" class="form-control" name="" placeholder="" v-model.trim="info.eng_name">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label">备注:</label>
                        <div class="col-sm-9">
                            <textarea type="text" class="form-control" name="" placeholder="" v-model.trim="info.remarks"></textarea>
                        </div>
                    </div>
                </div>
            </div>
        </form>
        <div class="footer-item" style="text-align: center">
            <button type="button" class="btn btn-success btn-sm" @click="submit($v.info.name)">保存</button>
        </div>
    </div>
</template>
<script>
    import { required, minLength,alphaNum } from 'vuelidate/lib/validators'
    export default{
        data: function () {
            return {
                info:{
                    name:null,
                    eng_name:null,
                    remarks:'',
                }
            };
        },
        created(){

        },
        validations:{
            info:{
                name:{
                    required
                }
            }
        },
        methods: {
            submit:function ($v) {
                let self = this;
                $v.$touch();
                if($v.$error) return;
                this.$http.post("/v1/goods/add_brand",{
                    name:self.info.name,
                    eng_name:self.info.eng_name,
                    remarks:self.info.remarks,
                }).then(function (response) {
                   if(response.code==0){
                       self.$parent.$parent.$parent.getList()
                       self.$parent.$parent.close(0);
                   }
                })

            }
        }
    }
</script>