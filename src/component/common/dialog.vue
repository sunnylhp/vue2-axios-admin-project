<template>
    <div class="dialog">
        <div class="dialog-wrap"  v-for="(comp,index) in comps" v-bind:style="style(index,comp)" >
           <div class="dialog-content">
               <div class="dialog-header" >
                   <span>{{comp.title}}</span>
                   <span class="close" @click="close(index)">
                <svg width="14"  height="14" version="1.1"
                     xmlns="http://www.w3.org/2000/svg">
                    <polyline points="0 0,7 7,0 14"
                              style="fill:white;stroke:#000;stroke-width:1"/>
                    <polyline points="14 0,7 7,14 14"
                              style="fill:white;stroke:#000;stroke-width:1"/>
                </svg>
                </span>
               </div>
               <div class="dialog-body">
                   <component :is="comp"></component>
               </div>
           </div>
        </div>
        <dialogBack ref="back" v-bind:z-index="realIndex-1"></dialogBack>
    </div>
</template>

<script>
    import dialogBack from './background.vue'
    export default {
        name: 'dialog',
        data () {
            return {
                comps: []
            }
        },
        props: {
            'mIndex': {
                type: Number,
                default: 99999
            }

        },
        computed: {
            realIndex: function () {
                return this.mIndex
            }
        },
        components: {
            dialogBack
        },
        methods: {
            //打开dialog
            open: function (comp) {
                comp.promise = new Promise(function (resolve, reject) {
                    comp.resolve = resolve
                    comp.reject = reject
                })
                comp.width = (comp.width )? comp.width : '60%'
                comp.height = (comp.height) ? comp.height : '70%'
                this.params = comp.params;
                this.comps.push(comp)
                if (!this.$refs.back.show) {
                    this.$refs.back.open()
                }
                return comp.promise
            },
            clickHandler: function (type, comp, index) {
                var self = this;
                let close = function () {
                    self.close(index);
                }
                if(comp.onOk) comp.onOk();
                else if(comp.onCancel) comp.onCancel();
                if(!comp.isClose){
                    self.close(index)//关闭当前弹出框
                }
                /** 只提供promise模式,返回close方法 */
                comp.resolve({'type': type, 'close': close})
            },
            style: function (index, comp) {
                return {
                    zIndex: this.realIndex + index,
                    width: comp.width ,
                    height: comp.height,
                    left: '50%',
                    top: '50%',
                    transform:'translate(-50%,-50%)',
                }
            },
            close:function (index) {
                this.comps.splice(index, 1)
                if (this.comps.length === 0 && this.$refs.back.show) {
                    this.$refs.back.close()
                }
            }
        }
    }
</script>
<style lang="less">
    .dialog{
        .dialog-wrap{
            position: absolute;
            overflow: auto;
            padding: 0;
            max-height:80%;
            background-color: #fff;
        }
        .dialog-header{
            position: absolute;
            top:0;
            left: 0;
            right: 0;
            background-color: #f5f5f5;
            padding: 10px 20px;
            border-bottom: 1px solid #ddd;
        }
        .dialog-content {
            height: 100%;
        }
        .dialog-body{
            padding: 20px 15px 15px 15px;
            position: absolute;
            left: 0;
            width: 100%;
            bottom: 0;
            overflow: auto;
            top: 42px;
        }
        .dialog-footer{
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
        }
        .dialog-close{
            position: absolute;
            display: inline-block;
            right: 30px;
            font-size: 18px;
            color:#666;
            &:hover{
                cursor: pointer;
            }
        }
    }
</style>
