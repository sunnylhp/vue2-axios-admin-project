<template>
    <div>
        <div>
            <table class="table table-bordered">
                <thead>
                <tr>
                    <th colspan="4" style="background-color: #f5f5f5">任务编号：{{info.identifier}}</th>
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
        </div>
        <div>
            <table class="table">
                <thead>
                <tr style="background-color: #f5f5f5">
                    <th colspan="5">送货信息：</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>送货人：</td>
                    <td>{{info.point_contact_name}}</td>
                    <td>{{info.point_contact_phone}}</td>
                </tr>
                <tr>
                    <td>仓库：</td>
                    <td>{{info.warehouse_name}}</td>
                </tr>
                <tr>
                    <td>销售点：</td>
                    <td>
                        <div>{{info.point_name}}</div>
                        <div>{{info.point_address}}</div>
                        <div>{{info.point_province}}{{info.point_city}}{{info.point_district}}</div>
                        <div>{{info.point_address}}</div>
                        <div>{{info.point_contact_name}}</div>
                        <div>{{info.point_contact_phone}}</div>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
        <div>
            <table class="table">
                <thead>
                <tr style="background-color: #f5f5f5">
                    <th colspan="5">任务跟踪</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in trackList">
                    <td>{{item.track_time}}</td>
                    <td>{{item.detail}}</td>
                </tr>
                </tbody>
            </table>
            <ul>
                <li>

                </li>
            </ul>
        </div>
    </div>
</template>
<script>
    export default{
        data(){
            return {
                info:{},
                preparationList:[],
                trackList:[]
            }
        },
        props:['param'],
        created() {
            this.getInfo();
            this.getTrackInfo();
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
                       self.preparationList=reData.preparation_list
                   }else {
                       alert(response.msg)
                   }
                })
            },
            getTrackInfo(){
                let self = this;
                this.$http.get("/v1/task/get_deliverytask_tracking",{
                    params:{
                        task_id:parseInt(self.param)
                    }
                }).then(function (response) {
                    if(response.code==0){
                        self.trackList =response.data.tracking_list;
                    }else {
                        alert(response.msg)
                    }
                })
            },
        }

    }
</script>