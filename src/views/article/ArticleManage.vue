<script setup>
    import {Edit,Delete} from '@element-plus/icons-vue'
    import {ref} from 'vue'
    import ChannelSelect from './components/ChannelSelect.vue'
    import { artGetListService } from '@/api/article'
    import {formatTime} from '@/utils/format.js'
    const articleList = ref([])//文章列表
    const total = ref(0)//总条数
    const loading = ref(false)
   
    //定义请求参数对象
    const params= ref({
        pagenum:1,//当前页
        pagesize:5,//当前生效的每页条数
        cate_id:'',
        state:''
    })
    //基于params参数，获取文章列表
    const getArticleList = async () =>{
        loading.value = true
        const res = await artGetListService(params.value)
        articleList.value = res.data.data
        total.value = res.data.total

        loading.value = false
    }
    getArticleList()
    //编辑逻辑
    const onEditArticle = (row)=>{
        console.log(row)
    }
    //删除逻辑
    const onDelArticle = (row)=>{
        console.log(row)
    }

    //处理分页逻辑
    const onSizeChange = (size)=>{
        //如果每页条数变化了，原本正在访问的当前页意义不大，数据大概率已不再原来的那一页
        params.value.pagenum = 1
        params.value.pagesize = size

        getArticleList()

    }
    const onCurrentChange = (page)=>{
        params.value.pagenum = page

        getArticleList()

    }
  

    //处理搜索逻辑 => 按照最新条件重新检索，从第一页开始展示
    const onSearch = ()=>{
        params.value.pagenum = 1
        getArticleList()
    }

    const onReset = ()=>{
        params.value.cate_id = ''
        params.value.state= ''
        params.value.pagenum = 1

    }
</script>


<template>
    <page-container title="文章管理">
        <template #extra>
            <el-button>添加文章</el-button>
        </template>

            <!-- 表单区域 -->
            <el-form inline>
                <el-form-item label="文章分类：">
                    <ChannelSelect v-model="params.cate_id"></ChannelSelect>
                </el-form-item>
                <el-form-item label="发布状态：">
                    <!-- 这里后台标记发布章台，就是通过中文标记的 -->
                    <el-select style="width:220px" v-model="params.state">
                        <el-option label="已发布" value="已发布"></el-option>
                        <el-option label="草稿" value="草稿"></el-option>
                    </el-select>

                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSearch">搜索</el-button>
                    <el-button @click="onReset">重置</el-button>
                </el-form-item>
            </el-form>

            <!-- 表格区域 -->
             <el-table :data="articleList" v-loading="loading">
                <el-table-column label="文章标题" prop="title" >
                    <template #default="{row}">
                        <el-link type="primary" :underline="false">{{ row.title }}</el-link>
                    </template>
                </el-table-column>
                <el-table-column label="分类" prop="cate_name"></el-table-column>
                <el-table-column label="发表时间" prop="pub_date">
                    <template #default="{row}">
                        {{ formatTime(row.pub_date) }}
                    </template>
                </el-table-column>
                <el-table-column label="状态" prop="state"></el-table-column>
                <el-table-column label="操作">
                    <!-- 利用作用域插槽row可以获取当前行的数据 -->
                    <template #default="{row}">
                        <el-button circle plain type="primary" :icon="Edit" @click="onEditArticle(row)" ></el-button>
                        <el-button circle plain type="danger" :icon="Delete" @click="onDelArticle(row)"></el-button>
                        
                    </template>
                </el-table-column>
             </el-table>

             <!-- 分页 -->
              <el-pagination
                v-model:current-page="params.pagenum"              
                v-model:page-size="params.pagesize"
                :page-sizes="[2,3,5,10]"
                :background="true"
                layout="jumper,total,sizes,prev,pager,next"
                :total="total"
                @size-change="onSizeChange"
                @current-change="onCurrentChange"
                style="margin-top:20px; justify-content: flex-end;"
              />
                
              
    </page-container>     
</template>

<style lang="scss" scoped>

</style>