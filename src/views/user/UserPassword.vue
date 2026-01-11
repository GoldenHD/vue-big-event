<script setup>
import { ref  } from 'vue'
import { userUpdatePwdService } from '@/api/user'
import { ElMessage } from 'element-plus'
import PageContainer from '@/components/PageContainer.vue'
import { useUserStore } from '@/stores'
import { useRouter } from 'vue-router'
const pwdForm = ref({
  old_pwd: '',
  new_pwd: '',
  re_pwd: ''
})

const pwdFormRef = ref()

const userStore = useUserStore()

const rules = {
  old_pwd: [
    { required: true, message: '请输入原密码', trigger: 'blur' },
    { min: 6, max: 15, message: '密码长度在6到15位', trigger: 'blur' }
  ],
  new_pwd: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 15, message: '密码长度在6到15位', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value === pwdForm.value.old_pwd) {
          callback(new Error('新密码不能与原密码相同'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  re_pwd: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    { min: 6, max: 15, message: '密码长度在6到15位', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== pwdForm.value.new_pwd) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

const router = useRouter()

const submitForm = async() => {
  await pwdFormRef.value.validate()
  await userUpdatePwdService(pwdForm.value)
    ElMessage.success('修改密码成功')

    //密码修改成功后，退出重新登录
    userStore.setUser({})
    userStore.setToken('')

    //拦截登录
    router.push('/login')


}

const resetForm = () => {
  pwdFormRef.value.resetFields()
}
</script>

<template>
    <page-container title="修改密码">
  
    <el-form
      :model="pwdForm"
      :rules="rules"
      ref="pwdFormRef"
      label-width="100px"
      class="demo-ruleForm"
      style="width:50%"
    >
      <el-form-item label="原密码" prop="old_pwd">
        <el-input
          v-model="pwdForm.old_pwd"
          type="password"
          placeholder="请输入原密码"
        />
      </el-form-item>
      <el-form-item label="新密码" prop="new_pwd">
        <el-input
          v-model="pwdForm.new_pwd"
          type="password"
          placeholder="请输入新密码"
        />
      </el-form-item>
      <el-form-item label="确认密码" prop="re_pwd">
        <el-input
          v-model="pwdForm.re_pwd"
          type="password"
          placeholder="请输入确认密码"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">修改密码</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
    </page-container>
</template>



<style scoped>
.user-password {
  max-width: 600px;
  margin: 0 auto;
}
</style>