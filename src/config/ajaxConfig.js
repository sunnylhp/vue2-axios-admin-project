/**
 * Created by Administrator on 2017/7/18.
 */
//import baseUrl from './configDefault'
const baseUrl ='http://123.207.36.182:8080';

var ajaxConfig = {
    baseUrl:baseUrl,
    headers:{'Content-Type':'application/json'},
    withCredentials:true,//带凭证的请求，
    responseType:'json',
    transformRequest:[function (data) {
            return JSON.stringify(data);
    }],
    transformResponse:function (response) {
        if(response.data.code==50000008){
            window.localStorage.isLogin=false;
            window.location.href = '/'
        }
        return response.data;
    }
}
export default ajaxConfig;
