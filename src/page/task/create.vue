<template>
    <div>
        <form class="create-wrap form-horizontal">
            <table class="table table-bordered">
                <thead>
                <tr style="background-color: #f5f5f5">
                    <th colspan="3">{{info.warehouse_name}} --> {{info.point_name}} --- {{info.point_company_name}}</th>
                    <th>送货截止时间：
                        <span style="font-style: normal">
                        <date-picker v-model="date" :config="configs.basic"></date-picker>
                        </span>
                    </th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in info.preparation_list">
                    <td>{{item.container_identifier}}</td>
                    <td>{{item.goods_name}}</td>
                    <td>X {{item.quantity}}</td>
                    <td v-if="item.type==0">送货</td>
                    <td v-else>取货</td>
                </tr>
                </tbody>
            </table>
            <div class="row ">
                <div class="col-sm-6">
                    <div class="form-group">
                        <label class="col-sm-2 control-label">送货员:</label>
                        <div class="col-sm-9">
                            <select class="form-control" v-model.number="staffId">
                                <option v-for="item in staffList" v-bind:value="item.id">{{item.name}}</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="col-sm-6">
                    <div class="form-group">
                        <label class="col-sm-2 control-label">备注:</label>
                        <div class="col-sm-9">
                            <textarea class="form-control" name="" placeholder="" v-model="remarks"></textarea>
                        </div>
                    </div>
                </div>
            </div>
        </form>
        <div class="footer-item">
            <button type="button" class="btn btn-success btn-sm" @click="submit()">保存</button>
        </div>
    </div>
</template>
<script>
   // import datetimepicker from '../../assets/vender/bootstrap-datepicker/bootstrap-datepicker.min';
   import datePicker from 'vue-bootstrap-datetimepicker';
    export default{
        data(){
            return {
                info:{},
                staffList:[],
                date:new Date(),
                staffId:null,
                staff_name:null,
                remarks:null,
                configs:{
                    basic: {
                        format: 'YYYY/MM/DD hh:mm',
                        useCurrent: false,
                        showClear: true
                    }
                }
            }
        },
        props:['param'],
        created() {
            this.getInfo();
            this.getDelivery();
        },
        components:{
            datePicker
        },
        methods:{
            getInfo(){
                let self = this;
                this.$http.get("/v1/task/get_deliverytask_detail",{
                    params:{
                        task_id:parseInt(self.param)
                    }
                }).then(function (response) {
                    if(response.code==0){
                        let reData = response.data
                        self.info =reData;
                    }else {
                        alert(response.msg)
                    }
                })
            },
            getDelivery(){
                let self = this;
                this.$http.get("/v1/staff/get_delivery_in_charge").then(function (response) {
                    if(response.code==0){
                        self.staffList =response.data.staff_list;
                        self.staffId = self.staffList[0].id;
                        self.staff_name = self.staffList[0].name;
                    }else {
                        alert(response.msg)
                    }
                })
            },
            submit(){
                let self = this;
                let list = self.staffList
                list.forEach(function (item, index, array) {
                    if(item.id==self.staffId){
                        self.staff_name = item.name;
                    }
                })
                let param = {
                    task_id:self.param,
                    staff_id:self.staffId,
                    staff_name:self.staff_name,
                    deadline:parseInt(self.date.getTime()/1000),
                    remarks:self.remarks
                }
                this.$http.post("/v1/task/assign_deliverytask",param).then(function (response) {
                    if(response.code==0){
                        self.$router.push({name:'taskList'});
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
    .create-wrap{
        input{
            display: inline-block;
            width: 180px;
        }
    }
</style>