<script setup>
    import PageContainer from '@/components/PageContainer.vue'
    import {ref} from 'vue'
    import {useUserStore} from '@/stores' 
    import {userUpdateInfoService} from '@/api/user'
    import {ElMessage} from 'element-plus'


    const {user:{email,id,nickname,username},getUser} = useUserStore()


    const formRef = ref()


    //在使用仓库中数据的初始值(无需响应式)结构无问题
    const form = ref({
       id,
       username,
       nickname,
       email
    })

    const rules = ref({
        nickName:[
            {required:true,message:'请输入用户昵称',trigger:'blur'},
            {pattern:/^\S{2,10}$/,message:'用户昵称必须是2-10位非空字符',trigger:'blur'}
        ],
        email:[
            {required:true,message:'请输入用户邮箱',trigger:'blur'},
            {type:'email',message:'请输入正确的邮箱格式',trigger:'blur'}
        ]
    })

    const submitForm = async()=>{
        //等待校验结果
        await formRef.value.validate()
        //调用接口更新用户信息
        await userUpdateInfoService(form.value)
        //通知user模块进行数据更新
        getUser()
        //提示用户
        ElMessage.success('更新用户信息成功')
    }

</script>

<template>
    <page-container title="基本资料">
        <!-- 表单部分 -->
          <template #default>
            <el-form style="width:50%" ref="formRef" :model="form" :rules="rules" label-width="100px">
            <el-form-item label="登录名称" >
                <el-input v-model="form.username" disabled></el-input>
            </el-form-item>
            <el-form-item label="用户昵称" prop="nickname">
                <el-input v-model="form.nickname"></el-input> 
            </el-form-item>
            <el-form-item label="用户邮箱" prop="email">
                <el-input v-model="form.email"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm">提交修改</el-button>
            </el-form-item>
            </el-form>
         </template>

    </page-container> 
</template>