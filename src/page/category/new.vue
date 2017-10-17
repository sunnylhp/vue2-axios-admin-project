<template>
    <div class="category-new">
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
                        <label class="col-sm-2 control-label">父品类:</label>
                        <div class="col-sm-9" v-if="param">
                            <select class="form-control" v-model="info.parent_id" @change="$v.info.parent_id.$touch" disabled="true">
                                <optgroup label="---------" v-for="item in parent_list" >
                                    <option class="parent-option" v-bind:value="item.id">{{item.name}}</option>
                                    <option v-for="option in item.children_list"  v-bind:value="option.id">
                                        {{option.name}}
                                    </option>
                                </optgroup>
                            </select>
                        </div>
                        <div class="col-sm-9" v-else>
                            <select class="form-control" v-model="info.parent_id" @change="$v.info.parent_id.$touch">
                                <option value="">选择父类</option>
                                <optgroup label="---------" v-for="item in parent_list" >
                                    <option class="parent-option" v-bind:value="item.id">{{item.name}}</option>
                                    <option v-for="option in item.children_list"  v-bind:value="option.id">
                                        {{option.name}}
                                    </option>
                                </optgroup>
                            </select>
                            <span class="error-message" v-if="$v.info.parent_id.$error">
                                请选择父品类
                            </span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label">排序:</label>
                        <div class="col-sm-9">
                            <input type="text" class="form-control" name="" placeholder="" v-model.trim="info.sort">
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
    import { required, minLength,alphaNum } from 'vuelidate/lib/validators'
    export default{
        data: function () {
            return {
                parent_list:null,
                info:{
                    name:null,
                    parent_id:null,
                    sort:null,

                }
            };
        },
        created(){
            if(this.param){
                this.info.parent_id = this.param
            }else {
                this.info.parent_id=''
            }
            this.getParent();
        },
        props:[
            'param'
        ],
        validations:{
            info:{
                name:{
                    required
                },
                parent_id:{
                    required
                }
            }
        },
        methods: {
            getParent:function () {
                let self = this;
                this.$http.get("/v1/goods/get_category_all",{
                    params:{
                        level:2
                    }
                }).then(function (response) {
                    let reData = response.data
                    self.parent_list =reData.category_items;
                })
            },
            submit:function ($v) {
                let self = this;
                $v.$touch();
                if($v.$error) return;
                this.$http.post("/v1/goods/add_category",{
                    name:self.info.name,
                    parent_id:self.info.parent_id,
                    sort:self.info.sort,
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
    .category-new optgroup{
        color: #999;
    }
    .category-new option{
        color: #666;
    }
    .category-new .parent-option{
        color: #00a7d0;
    }
</style>