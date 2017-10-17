<template>
    <div class="wrapper">
        <header class="main-header">
            <!-- Logo -->
            <div class="logo">
                <!-- mini logo for sidebar mini 50x50 pixels -->
                <span class="logo-mini"><b>Admin</b></span>
                <!-- logo for regular state and mobile devices -->
                <span class="logo-lg"><b>{{pageInfo.site_name}}</b></span>
            </div>
            <!-- Header Navbar: style can be found in header.less -->
            <nav class="navbar navbar-static-top">
                <!-- Sidebar toggle button-->
                <a href="#" class="sidebar-toggle" data-toggle="push-menu" role="button">
                    <span class="sr-only">Toggle navigation</span>
                </a>
                <div class="navbar-custom-menu">
                    <ul class="nav navbar-nav">
                        <li class="dropdown user user-menu">
                            <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                                <img :src="userInfo.avatar_thum_path" class="user-image" alt="User Image" v-if="userInfo.avatar_thum_path">
                                <img src="/dist/img/no_pic.jpg" class="user-image" alt="User Image" v-else>
                                <span class="hidden-xs">{{userInfo.login_name}}</span>
                            </a>
                        </li>
                        <li>
                            <a href="javascript:;" type="button" @click="logout">退出</a>
                        </li>
                    </ul>
                </div>
            </nav>
        </header>
        <!-- Left side column. contains the logo and sidebar -->
        <aside class="main-sidebar">
            <!-- sidebar: style can be found in sidebar.less -->
            <section class="sidebar">
                <ul class="sidebar-menu" data-widget="tree">
                    <!--
                    <li class="treeview" v-for="(item,index) in menus" :class="{'active': index===0}">
                    -->
                    <li class="treeview" v-for="(item,index) in menus">
                        <a href="#">
                            <i class="fa fa-dashboard"></i>
                            <span>{{item.title}}</span>
                            <span class="pull-right-container">
                                <i class="fa fa-angle-left pull-right"></i>
                            </span>
                        </a>
                        <ul class="treeview-menu" v-show="item.items">
                            <li v-for="(v,k) in item.items">
                                <router-link :to="v.url">{{v.title}}</router-link>
                            </li>
                        </ul>
                    </li>
                </ul>
            </section>
            <!-- /.sidebar -->
        </aside>

        <!-- Content Wrapper. Contains page content -->
        <div class="content-wrapper">
            <router-view></router-view>
        </div>
        <!-- /.content-wrapper -->
        <footer class="main-footer">
            <div class="pull-right hidden-xs">
                <b>Version</b> 2.4.0
            </div>
            <strong>{{pageInfo.copyright}}<a href="pageInfo.domain">{{pageInfo.company}}</a>.</strong> All rights
            reserved.
        </footer>
    </div>
</template>
<script>
    export default{
        data(){
            return {
                menus:null,
                pageInfo:{},
                userInfo:JSON.parse(window.localStorage.getItem('userInfo'))
            }
        },
        created(){
            if(this.$store.getters.authorizd){
                this.getPageInfo();
                this.getMenus();
            }
        },
        methods:{
            getPageInfo:function () {
                let self =this;
                this.$http.get("v1/home/get_page_info").then(function (response) {
                    self.pageInfo = response.data;
                    //location.reload()
                })
            },
            getMenus:function () {
                let self =this;
                this.$http.get("/v1/home/get_sidebar").then(function (response) {
                    self.menus = response.data.sidebar_items;
                })
            },
            // 退出登录
            logout:function () {
                let self =this;
                this.$http.get("/v1/home/logout").then(function (response) {
                    if(response.code==0){
                        self.$store.commit('logout');
                        window.localStorage.setItem('isLogin',false)
                        window.localStorage.setItem('userInfo',false)
                        self.$router.push({name:'login'});
                    }else {
                        alert(response.msg)
                    }
                })
            }
        }
    }
</script>