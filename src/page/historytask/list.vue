<template>
    <div class="list task-list">
        <!-- Main content -->
        <section class="content">
            <h1>历史任务</h1>
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
                            <div><span class="gray">{{item.point_city}}{{item.point_district}}</span></div>
                        </td>
                        <td v-if="item.staff_name || item.staff_phone">
                            <div>{{item.staff_name}}</div>
                            <div><span class="gray">{{item.staff_phone}}</span> </div>
                        </td>
                        <td>{{item.status_msg}}</td>
                        <td>
                            <button class="btn btn-default btn-sm" @click="detailHandler(item.id)">
                                详情</button>
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
                    sort_by:null,
                    sort_type:0,
                    pathname:'historytaskList',
                }
            }
        },
        components:{
            pagination
        },
        created(){
            let query = Object.keys(this.$route.query).length==0 ? this.pages: this.$route.query
            this.getList(query);
        },
        methods:{
            getList:function (query) {
                let self = this;
                let param = {
                    page:query.page,
                    page_size:query.page_size,
                }
                if(query.sort_by){
                    param ={
                        page:query.page,
                        page_size:query.page_size,
                        sort_by:query.sort_by,
                        sort_type:query.sort_type,
                    }
                }
                this.$http.get("/v1/task/get_deliverytask_history_list",{
                    params:param
                }).then(function (response) {
                    if(response.code==0){
                        let reData = response.data
                        self.list =reData.task_list;
                        self.pages.page = reData.page;
                        self.pages.total = reData.total;
                        self.pages.page_size = reData.page_size;
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