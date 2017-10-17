/**
 * 路由配置
 */
import App from '../App.vue'
import notfound from '../component/common/notfound.vue'

import login from  '../page/login/login.vue'//登录
import home from '../page/home/home.vue'//首页
import init from  '../page/home/init.vue'//初始页
import warehouse from '../page/warehouse/list.vue'//仓库管理
import goods from '../page/goods/list.vue'//商品管理
import bands from '../page/brand/list.vue'//品牌管理
import category from '../page/category/list.vue'//品类管理
import boxs from '../page/boxs/list.vue'//货箱管理
import refrigerator from '../page/refrigerator/list.vue'//货箱管理
import salsepoint from '../page/salespoint/list.vue'//销售点管理
import stock from '../page/stock/list.vue'//库存管理
import stockquery from '../page/stockquery/list.vue'//库存查询
import task from '../page/task/list.vue'//任务管理
import historytask from '../page/historytask/list.vue'//历史任务
import currenttask from '../page/currenttask/list.vue'//当前任务
import addtask from '../page/task/addtask.vue'//添加任务
import staff from '../page/staff/list.vue'//员工管理
import authority from '../page/authority/list.vue'//权限管理

import coming from '../page/coming/coming.vue'//敬请期待
export default [
    {
        path:'/',
        component:App, //顶层路由，对应index.html
        children: [ //二级路由。对应App.vue
            {
              path:'',
                redirect:'/login'
            },
            {
                path:'/home',
                name:'home',
                component:home,
                meta:{
                    auth: true // 这里设置，当前路由需要校验
                },
                children:[//三级路由
                    {
                        path:'/',
                        name:'init',
                        component:init,
                        meta:{
                            auth: true
                        }
                    },
                    //仓库管理
                    {
                        path:'/warehouse/list',
                        name:'warehouseList',
                        component:warehouse,
                        meta:{
                            auth: true
                        }
                    },
                    //商品管理
                    {
                        path:'/goods/list',
                        name:'goodsList',
                        component:goods,
                        meta:{
                            auth: true
                        }
                    },
                    //商品库存设定
                    {
                        path:'/goods/stock_setting',
                        name:'stockList',
                        component:stock,
                        meta:{
                            auth: true
                        }
                    },
                    //商品库存查询
                    {
                        path:'/goods/stock_query',
                        name:'stockqueryList',
                        component:stockquery,
                        meta:{
                            auth: true
                        }
                    },
                    //品类编辑
                    {
                        path:'/goods/category_setting',
                        component:category,
                        meta:{
                            auth: true
                        }
                    },
                    //品牌编辑
                    {
                        path:'/goods/brand_setting',
                        name:'brandList',
                        component:bands,
                        meta:{
                            auth: true
                        }
                    },
                    //货箱设定
                    {
                        path:'/salsepoint/bin_setting',
                        component:boxs,
                        meta:{
                            auth: true
                        }
                    },
                    //冰柜设定
                    {
                        path:'/salsepoint/frige_setting',
                        component:refrigerator,
                        meta:{
                            auth: true
                        }
                    },
                    //销售点管理
                    {
                        path:'/salsepoint/list',
                        name:'salsepointList',
                        component:salsepoint,
                        meta:{
                            auth: true
                        }
                    },
                    //添加任务列表
                    {
                        path:'/task/add',
                        name:'taskList',
                        component:task,
                        meta:{
                            auth: true
                        }
                    },
                    //添加任务列表
                    {
                        path:'/task/addtask',
                        name:'addtask',
                        component:addtask,
                        meta:{
                            auth: true
                        }
                    },
                    //当前任务查看
                    {
                        path:'/task/query',
                        name:'currenttaskList',
                        component:currenttask,
                        meta:{
                            auth: true
                        }
                    },
                    //历史任务查看
                    {
                        path:'/task/query_history',
                        name:'historytaskList',
                        component:historytask,
                        meta:{
                            auth: true
                        }
                    },
                    //单品销量
                    {
                        path:'/report/goods_salse',
                        component:coming,
                        meta:{
                            auth: true
                        }
                    },
                    //单点销量
                    {
                        path:'/report/branch_salse',
                        component:coming,
                        meta:{
                            auth: true
                        }
                    },
                    //行为分析
                    {
                        path:'/report/behaviour',
                        component:coming,
                        meta:{
                            auth: true
                        }
                    },
                    //配送统计
                    {
                        path:'/report/delivery',
                        component:coming,
                        meta:{
                            auth: true
                        }
                    },
                    //权限设置
                    {
                        path:'/staff/authority_setting',
                        component:authority,
                        meta:{
                            auth: true
                        }
                    },
                    //员工管理
                    {
                        path:'/staff/list',
                        name:'staffList',
                        component:staff,
                        meta:{
                            auth: true
                        }
                    },
                    //操作记录
                    {
                        path:'/system/operation_records',
                        component:coming,
                        meta:{
                            auth: true
                        }
                    },
                    //备用
                    {
                        path:'/system/blank',
                        component:coming,
                        meta:{
                            auth: true
                        }
                    }

                ]
            },
            {
                path:'/login',
                name:'login',
                component:login
            },
            /*
            {
                path:'/404',
                component:notfound
            },
            {
                path:'*',
                redirect:'/404',
                hidden:true
            }
            */
        ]
    }
]