<script setup>
  import { useRoute,useRouter } from 'vue-router';
  import { useUserStore,useCounterStore } from '@/stores';
  const route = new useRoute()
  const router = new useRouter()

  const goList = ()=>{
    router.push('/list')
    console.log(router,route);
    
  }

  const userStore = useUserStore()
  const counterStore = useCounterStore()
</script>


<template>
  <div>
    <hr>
    <router-view></router-view>




    <hr>
    <hr>
    <hr>
    我是APP 
    <el-button @click="$router.push('./home')">跳首页</el-button>
    <el-button @click="goList">跳列表页</el-button>

    <p>{{ userStore.token }}</p>
    <el-button @click="userStore.setToken('asdasdasdasd')">登录</el-button>
    <el-button @click="userStore.removeToken()">退出</el-button>
    <hr>

    {{ counterStore.count }}

    <el-button @click="counterStore.add(2)">加</el-button>
  </div>
</template>

<style scoped></style>
