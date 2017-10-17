<template>
    <div class="list">
        <!-- Content Header (Page header) -->
        <section class="content-header">
            <div>
                <div class="form-horizontal" role="form">
                    <button type="button ml-10" class="btn btn-success btn-sm" v-on:click="editHandler()">新增</button>
                </div>
            </div>
        </section>
        <!-- Main content -->
        <section class="content">
            <div class="box-body">
                <table id="example2" class="table table-bordered table-hover">
                    <thead>
                    <tr>
                        <th>姓名<i class="fa fa-sort sort" @click="sortHandler('name',sort.name)"></i></th>
                        <th>账号</th>
                        <th>姓名</th>
                        <th>角色 <i class="fa fa-sort sort" @click="sortHandler('role',sort.role)"></i></th>
                        <th>手机号 <i class="fa fa-sort sort" @click="sortHandler('phone',sort.phone)"></i></th>
                        <th>身份证号</th>
                        <th>性别</th>
                        <th>备注</th>
                        <th>操作</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="item in list">
                        <td>{{item.name}}</td>
                        <td>{{item.login_name}}</td>
                        <td>{{item.role_name}}</td>
                        <td>{{item.phone}}</td>
                        <td>{{item.id_card}}</td>
                        <td>{{item.id_card}}</td>
                        <td>
                            <span v-if="item.gender==1">男</span>
                            <span v-else>女</span>
                        </td>
                        <td> {{item.remarks}}</td>
                        <td>
                            <button class="btn btn-default btn-sm" v-on:click="detailHandler(item.id)">详情
                            </button>
                            <button class="btn btn-default btn-sm" v-on:click="editHandler(item.id)">修改
                            </button>
                            <button class="btn btn-default btn-sm" @click="deleteHandler(item.id)" >删除</button>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div class="" v-show="pages.total>0">
                <pagination :page.sync="pages"></pagination>
            </div>
        </section>
        <vdialog ref="dialog"></vdialog>
        <!-- /.content -->
    </div>
</template>
<script>
    import pagination from '../../component/common/page.vue'
    import details from './detail.vue'
    import edit from './edit.vue'
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
                    pathname:'staffList',
                },
                sort:{
                    name:0,
                    role:0,
                    phone:0,
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
            //新增、修改
            editHandler: function (id) {
                let title='修改';
                if(!id){
                    id = null;
                    title = '新增'
                }
                let dialog = this.$refs.dialog
                let d = dialog.open({
                    title:title,
                    template: `<edit :param.sync="${id}"></edit>`,
                    components: {
                        edit:edit
                    },
                    width: '800px',
                    height:'600px'
                })
            },
            //详情
            detailHandler: function (id) {
                let dialog = this.$refs.dialog
                let d = dialog.open({
                    title:'详情',
                    template: `<detail :param.sync="${id}"></detail>`,
                    components: {
                        detail:details
                    },
                    width: '500px',
                    height:'400px'
                })
            },
            //列表
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
                    if(query.sort_by){
                        param ={
                            page:query.page,
                            page_size:query.page_size,
                            sort_by:query.sort_by,
                            sort_type:query.sort_type,
                        }
                    }
                }
                this.$http.get("/v1/staff/get_staff_list",{
                    params:param
                }).then(function (response) {
                    if(response.code==0){
                        let reData = response.data
                        self.list =reData.staff_list;
                        self.pages.page = reData.page;
                        self.pages.total = reData.total;
                        self.pages.page_size = reData.page_size;
                    }else {
                        alert(response.msg)
                    }
                })
            },
            //删除
            deleteHandler:function (id) {
                let self = this;
                if(!confirm('确定删除?')){
                    return;
                }
                this.$http.get("/v1/staff/delete_staff",{
                    params:{
                        id:id
                    }
                }).then(function (response) {
                    if(response.code==0){
                        self.getList();
                    }else {
                        alert(response.msg)
                    }
                })
            },
            //排序
            sortHandler:function (name,type) {
                let self = this;
                self.sort[name]=type==0 ? 1:0;
                self.pages.sort_by = name;
                self.pages.sort_type = self.sort[name];
                let query = {
                    page:self.pages.page,
                    page_size:self.pages.page_size,
                    sort_by:self.pages.sort_by,
                    sort_type:self.sort[name],
                }
                this.$router.push({
                    name:self.pages.pathname,
                    query:query
                });
                self.getList(query);
            }
        }
    }
</script>