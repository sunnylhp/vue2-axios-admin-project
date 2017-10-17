<template>
    <div class="login-page">
        <div class="login-box">
            <div class="login-logo">
                <a href="../../index2.html"><b>Admin</b>LTE</a>
            </div>
            <!-- /.login-logo -->
            <div class="login-box-body">
                <form @keyup.enter="login">
                    <div class="form-group has-feedback">
                        <input class="form-control" v-model="username"   placeholder="账号">
                        <span class="message" v-show="!!!username&&usermsg">{{usermsg}}</span>
                        <span class="glyphicon glyphicon-envelope form-control-feedback"></span>
                    </div>
                    <div class="form-group has-feedback">
                        <input type="password" class="form-control" placeholder="密码" v-model="password">
                        <span class="glyphicon glyphicon-lock form-control-feedback"></span>
                        <span class="message" v-show="!!!password&&psdmsg">{{psdmsg}}</span>
                        <span class="message" v-show="!!!error">{{error}}</span>
                    </div>
                    <div class="row">
                        <!-- /.col -->
                        <div class="col-xs-12" style="text-align: center">
                            <input type="button" class="btn btn-primary btn-block" @click="login"
                                   value="登录">
                        </div>
                        <!-- /.col -->
                    </div>
                </form>
            </div>
            <!-- /.login-box-body -->
        </div>
    </div>
</template>
<script>
    export default{
        data(){
            return {
                username:null,
                password:null,
                usermsg:null,
                psdmsg:null,
                error:null,
                isLogin:false
            }
        },
        created(){

        },
        methods:{
            required:function () {
                return /\S/.test(this.username)
            },
            login:function () {
                if(!this.username){
                   this.usermsg='账号不正确'
                }
                if(!this.password){
                    this.psdmsg='密码不正确'
                }
                if(!this.username || !this.password){
                    return;
                }
                let self = this;
                this.$http.post("/v1/home/login",{
                    username: self.username,
                    password:self.password
                }).then(function (response) {
                    if(response.code==0){
                        self.$store.commit('login')
                        window.localStorage.setItem('isLogin',false)
                        window.localStorage.setItem('userInfo',JSON.stringify(response.data.staff))
                        self.$router.push({name:'home'});
                        window.location.reload()
                    }else {
                        alert(response.msg)
                    }
                })
            }
        }
    }
</script>
<style>
    .login-page{
        position: fixed;
        top:0;
        left: 0;
        right: 0;
        bottom:0;
    }
    .login-box{
        padding: 20px 10px;
        background: #fff;
    }
    .login-footer{
        margin-top: 15px;
        font-size: 12px;
    }
    .message{
        color: red;
        font-size:12px;
        margin-top: 2px;
    }
</style>