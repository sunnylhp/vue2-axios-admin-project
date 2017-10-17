<template>
    <div class="new-container">
        <form class="form-horizontal">
            <div class="col-sm-12">
                <div class="box-body">
                    <div class="form-group">
                        <label class="col-sm-2 control-label"><span class="required-label">*</span>冰箱:</label>
                        <div class="col-sm-9">
                            <input type="text" class="form-control" name="" placeholder="" @input="$v.info.name.$touch"
                                   v-model="info.name">
                            <span class="error-message" v-if="$v.info.name.$error">必填</span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label"><span class="required-label">*</span>规格描述:</label>
                        <div class="col-sm-9">
                            <input type="text" class="form-control" name="" placeholder=""
                               v-model.trim="info.specifications" @input="$v.info.specifications.$touch">
                            <span class="error-message" v-if="$v.info.specifications.$error">必填</span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label">排序:</label>
                        <div class="col-sm-9">
                            <input type="text" class="form-control" name="" placeholder="" v-model.trim="info.sort" @input="$v.info.sort.$touch">
                            <span class="error-message" v-if="$v.info.sort.$error">整数</span>
                        </div>
                    </div>
                </div>
            </div>
        </form>
        <div class="footer-item" style="text-align: center">
            <button type="button" class="btn btn-success btn-sm" @click="submit($v)">保存</button>
        </div>
    </div>
</template>
<script>
    import { required, minLength,alphaNum ,numeric} from 'vuelidate/lib/validators'
    export default{
        data: function () {
            return {
                info:{
                    name:null,
                    specifications:null,
                    sort:'',
                }
            };
        },
        created(){

        },
        validations:{
            info:{
                name:{
                    required
                },
                specifications:{
                    required
                },
                sort:{
                    numeric
                }
            }
        },
        props:['param'],
        methods: {
            submit:function ($v) {
                let self = this;
                $v.$touch();
                if($v.$error) return;
                this.$http.post("/v1/salespoint/add_refrigerator_spec",{
                    name:self.info.name,
                    specifications:self.info.specifications,
                    sort:parseInt(self.info.sort),
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