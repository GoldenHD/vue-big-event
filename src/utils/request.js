import axios from 'axios'
import { useUserStore} from '@/stores'
import {ElMessage} from 'element-plus'
import router from '@/router'
import 'element-plus/es/components/message/style/css';

const baseURL = 'http://big-event-vue-api-t.itheima.net'

const instance = axios.create({
    //基地址，超时时间
        baseURL,
        timeout:10000
})

instance.interceptors.request.use(
    (config)=>{
        //携带token
        const useStore = useUserStore()
        if(useStore.token){
            config.headers.Authorization = useStore.token
        }


        return config
    },
    (err)=> Promise.reject(err)
)
//响应拦截器
instance.interceptors.response.use(
    (res)=>{

        //处理业务失败
        //摘取核心相应数据
        //成功
        if(res.data.code === 0){
            return res
        }
        //处理业务失败，给错误提示并抛出错误
        ElMessage.error(res.data.message || '服务异常')
        return Promise.reject(res.data)
        
    },
    (err)=>{
        //处理401错误

        //特殊情况 401 权限不足 或token过期 拦截登录
        if(err.response?.status === 401){
            router.push('/login')
        }

        //默认情况
        ElMessage.error(err.response.data.message || '服务异常')
        return Promise.reject(err)
    }
)

export default instance
export {baseURL}