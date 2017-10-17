<template>
    <div>
        <div class="box-footer clearfix">
            <ul class="pagination pagination-sm no-margin pull-right">
                <li><span>共{{page.total}}条</span></li>
                <li>
                    <span class="a-link" @click.prevent="pageClick(1)">
                        首页
                    </span>
                </li>
                <li>
                    <span class="a-link" @click.prevent="pageClick(page.page==1 ?1:(page.page-1))">
                        &laquo;
                    </span>
                </li>

                <li v-for="(val,index) in pageArray">
                    <span class="a-link" @click.prevent="pageClick(val)" v-if="val==page.page" :class="val==page.page ? 'active':''">
                        {{val}}
                    </span>

                    <span class="a-link" @click.prevent="pageClick(val)" v-else >
                        {{val}}
                    </span>

                </li>
                <li>
                    <span class="a-link" @click.prevent="pageClick(page.page==totalPage?totalPage:(page.page+1))">»</span>
                </li>
                <li>
                    <span class="a-link" @click.prevent="pageClick(totalPage)">尾页</span>
                </li>

                <li><span>共{{totalPage}}页</span></li>
            </ul>
        </div>
    </div>
</template>
<script>
    /*
     pages:{
     currentPage:3,
     totalPage:20,
     pageSize:20,
     pages:[1,2,3,4,5]
     }
     */
    export default{
        data(){
            return {
                pageLength:10, //显示页数
            }
        },
        props:[
            'page',
        ],
        computed:{
            totalPage:function () {
                let p = this.page.total%this.page.page_size==0 ? 0 : 1;
                return parseInt(this.page.total/this.page.page_size) + p;
            },
            pageArray:function () {
                let pageLen = this.pageLength,
                    pageCur = this.page.page,
                    pageTotal = this.totalPage,
                    half = Math.ceil(pageLen/2),
                    start=1,
                    pageArr=[],
                    end;
                if(pageTotal<=pageLen){
                    start = 1;
                    end = pageTotal;
                }else {
                    if(pageCur-half<=0){
                        start=1;
                        end=pageLen;
                    }else {
                        if(pageCur+half<=pageTotal){
                            start = pageCur - half+1;
                            end = pageCur + half;
                        }else {
                            start = pageTotal - pageLen+1;
                            end = pageTotal;
                        }
                    }
                }
                for(let i=start;i<=end;i++){
                    pageArr.push(i);
                }
                return pageArr;
            }
        },
        methods:{
            pageClick:function (curpage) {
                let self = this;
                let pages = self.page;
                let query = {
                    page:curpage,
                    page_size:pages.page_size,
                }
                if(pages.sort_by){
                    query = {
                        page:curpage,
                        page_size:pages.page_size,
                        sort_by:pages.sort_by,
                        sort_type:pages.sort_type,
                    }
                }
                this.$parent.$router.push({
                    name:pages.pathname,
                    query:query
                });
                this.$parent.getList(query);
            },
        }
    }
</script>