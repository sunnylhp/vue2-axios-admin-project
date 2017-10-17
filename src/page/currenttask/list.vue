<template>
    <div class="list task-list">
        <!-- Main content -->
        <section class="content">
            <h1>当前任务</h1>
            <div class="task-item" v-for="item in list" >
                <table class="table table-bordered">
                    <thead>
                    <tr class="item-header">
                        <td style="width: 280px;">任务编号:{{item.identifier}}</td>
                        <td>送货截止时间：{{item.deadline}}</td>
                        <td colspan="5">创建时间：{{item.create_time}}</td>
                    </tr>
                    </thead>
                    <tbody style="border: none">
                    <tr>
                        <td>
                            <div v-for="val in item.preparation_list">
                                <div>
                                    <span>{{val.container_identifier}}</span>
                                    <span class="ml-10">
                                                {{val.goods_name}} X <span class="red">{{val.quantity}}</span>
                                            </span>
                                </div>
                            </div>
                        </td>
                        <td>{{item.warehouse_name}}</td>
                        <td>
                            <div>{{item.point_name}}</div>
                            <div><span class="gray">{{item.point_province}}{{item.point_city}}/{{item.point_district}}
                            </span></div>
                        </td>
                        <td v-if="item.staff_name || item.staff_phone">
                            <div>{{item.staff_name}}</div>
                            <div><span class="gray">{{item.staff_phone}}</span> </div>
                        </td>
                        <td>{{item.status_msg}}</td>
                        <td>
                            <button class="btn btn-default btn-sm" @click="detailHandler(item.id)">
                                详情</button>
                            <button class="btn btn-default btn-sm" @click="cancelHandler(item.id)">取消任务</button>
                            <button class="btn btn-default btn-sm" @click="cancelHandler(item.id)">设置完成</button>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div class="" v-show="pages.total>0">
                <pagination :page="pages"></pagination>
            </div>

        </section>
        <vdialog ref="dialog"></vdialog>
        <!-- /.content -->
    </div>
</template>
<script>
    import pagination from '../../component/common/page.vue'
    import details from './detail.vue'
    export default{
        data(){
            return {
                list:null,
                pages:{
                    page:1,
                    total:1,
                    page_size:this.global.page.page_size,
                    pathname:'currenttaskList',
                }
            }
        },
        components:{
            pagination
        },
        created(){
            this.getList();
        },
        computed:{
            page:function () {
                return this.$route.query.page;
            }
        },
        methods:{
            getList:function (query) {
                let self = this;
                let param;
                if(!query){
                    param = {
                        page:1.,
                        page_size:self.global.page.page_size,
                    }
                }else{
                    param = {
                        page:query.page,
                        page_size:query.page_size,
                    }
                }
                this.$http.get("/v1/task/get_deliverytask_list",{
                    params:param
                }).then(function (response) {
                    if(response.code==0){
                        let reData = response.data
                        self.list =reData.task_list;
                        self.pages.page = reData.page;
                        self.pages.total = reData.total;
                        self.pages.size = reData.page_size;
                    }else {
                        alert(response.msg)
                    }

                })
            },
            detailHandler:function (id) {
                let dialog = this.$refs.dialog;
                dialog.open({
                    title:'详情',
                    template:`<detail :param="${id}"></detail>`,
                    components:{
                        detail:details
                    },
                    width:'800px',
                    height:'600px'
                })
            },
            cancelHandler:function (id) {
                let self = this;
                if(!confirm('确定取消任务?')){
                    return;
                }
                this.$http.get('/v1/task/cancel_deliverytask',{
                    params:{
                        task_id:id
                    }
                }).then(function (response) {
                    if(response.code==0){
                        self.getList();
                    }else {
                        alert(response.msg)
                    }
                })
            },
            finishHandler:function (id) {
                let self = this;
                if(!confirm('确定设置完成任务?')){
                    return;
                }
                this.$http.get('/v1/task/set_deliverytask_finish',{
                    params:{
                        task_id:id
                    }
                }).then(function (response) {
                    if(response.code==0){
                        self.getList();
                    }else {
                        alert(response.msg)
                    }
                })
            }
        }
    }
</script>
<style lang="less">
    .task-list{
        .task-item{
            margin-bottom: 20px;
            border:1px solid #ddd;
        }
        .item-header{
            border-top: 1px solid #ddd;
            background-color: #f5f5f5;
            font-weight:bold;
        }
    }
</style>