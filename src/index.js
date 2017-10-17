/**
 * Created by Administrator on 2017/7/10.
 */
import Dialog from './component/common/dialog.vue'
const install = function (Vue) {
    Vue.component(Dialog.name, Dialog)
}
module.exports = {
    version: '1.0.9',
    install,
    Dialog
}
