<script setup>
    import {ref} from 'vue'
    import ChannelSelect from './ChannelSelect.vue'
    import { Plus } from '@element-plus/icons-vue'
    import { QuillEditor } from '@vueup/vue-quill'
    import '@vueup/vue-quill/dist/vue-quill.snow.css'
    import { artPublishService,artGetDetailService,artEditDetailService } from '@/api/article'
    import { ElMessage } from 'element-plus'
    import { baseURL } from '@/utils/request'
    import axios from 'axios'
    
    //控制抽屉隐藏
    const visibleDrawer = ref(false)

    //默认数据
    const defaultForm = {
        title:'',//标题
        cate_id:'',//分类id
        cover_img:'',//封面图片 file 对象
        content:'',//string内容
        state:''//状态
    }


    //准备数据
    const formModel = ref({
        ...defaultForm
    })
    //图片上传相关逻辑
    const imgUrl = ref('')
    const onSelectFile = (file)=>{
        imgUrl.value = URL.createObjectURL(file.raw) //预览图片
        //将图片对象存入formModel.value.cover_img将来用于提交
        formModel.value.cover_img = file.raw

    }
    //提交
    const emit = defineEmits(['success'])
    const onPublish = async (state) =>{
        formModel.value.state = state
        //注意：当前接口需要formData对象
        //将普通对象穿换成formData对象
        const fd = new FormData()
        for(let key in formModel.value){
            fd.append(key,formModel.value[key])
        }

        //发请求
        if(formModel.value.id){
            //编辑
            await artEditDetailService(fd)
            ElMessage.success('修改成功')
            visibleDrawer.value = false
            emit('success','edit')
        }else{
            //添加操作
            await artPublishService(fd)
            ElMessage.success('添加成功')
            visibleDrawer.value = false
            emit('success','add')

        }
    }
    //将网络图片地址转换为File对象的函数
    async function imageUrlToFileObject(imgUrl,filename){
        try{
            //使用Axios下载图片数据
            const response = await axios.get(imgUrl,{responseType:'arraybuffer'})

            const blob = new Blob([response.data],{
                type:response.headers['content-type']
            })

            const file = new File([blob],filename,{
                type:response.headers['content-type']
            })

            return file

        }catch(error){
            console.error('Error converting image URL to File object',error)
            return null
        }
    }

    const editorRef = ref()
    const open = async (row) =>{
        visibleDrawer.value = true //显示抽屉
        if(row.id){
            //需要基于row.id发送请求，获取编辑对应的详情数据进行回显
            const res = await artGetDetailService(row.id)
            formModel.value = res.data.data
            //图片单独回显
            imgUrl.value = baseURL + formModel.value.cover_img
            //注意：提交给后台需要的数据格式是file对象格式
            //需要将网络图片地址转换成file对象存储起来
            const file = await imageUrlToFileObject(imgUrl.value,formModel.value.cover_img)
            formModel.value.cover_img = file
        }else{
            formModel.value = {...defaultForm} //基于默认数据重置form数据
            //这里重置了表单数据，但图片上传img地址，富文本编辑器内容需要手动重置
            imgUrl.value = ''
            editorRef.value.setHTML('')
        }
    }

    defineExpose({
        open
    })
</script>




<template>
    <el-drawer
        v-model="visibleDrawer"
        title="标题"
        direction="rtl"
        size="50%"
     >
        <el-form :model="formModel" ref="formRef" label-width="100px">
            <el-form-item label="文章标题" prop="title">
                <el-input v-model="formModel.title" placeholder="请输入标题"></el-input>
            </el-form-item>
            <el-form-item label="文章分类" prop="cate_id">
                <channel-select
                v-model="formModel.cate_id"
                width="100%"
                ></channel-select>
            </el-form-item>
            <el-form-item label="文章封面" prop="cover_img">
                <!-- 此处需要关闭element-plus的自动上传，不需要配置action等参数
                 只需要做前端的本地预览图片即可，无需在提交前上传图标
                 语法：URL.createObjectURL(...)创建本地预览的地址，来预览 -->
                <el-upload
                class="avatar-uploader"
                :show-file-list="false"
                :auto-upload="false"
                :on-change="onSelectFile"
                >
                    <img :src="imgUrl" v-if="imgUrl" class="avatar">
                    <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                </el-upload>
            </el-form-item>
            <el-form-item label="文章内容" prop="content">
                <div class="editor">
                    <QuillEditor 
                    ref="editorRef"
                    theme="snow"
                    v-model:content="formModel.content"
                    content-type="html"
                    ></QuillEditor>
 
                </div>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onPublish('已发布')">发布</el-button>
                <el-button type="info" @click="onPublish('草稿')">草稿</el-button>
            </el-form-item>

        </el-form>
     </el-drawer>
</template>

<style lang="scss" scoped>
    .avatar-uploader{
    :deep(){
        .avatar{
            width: 178px;
            height: 178px;
            display: block;
        }
        .el-upload{
            border:1px dashed var(--el-border-color);
            border-radius:6px;
            cursor:pointer;
            position:relative;
            overflow: hidden;
            transition:var(--el-transition-duration-fast);
        }
        .el-upload:hover{
            border-color:var(--el-color-primary);
        }
        .el-icon.avatar-uploader-icon{
            font-size:28px;
            color:#8c939d;
            width: 178px;
            height: 178px;
            text-align: center;
        }
    }
    
}
.editor{
        width: 100%;
        :deep(.ql-editor){
            min-height: 200px;
        }
    }
</style>