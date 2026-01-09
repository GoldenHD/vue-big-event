<script setup>
    import {Edit,Delete} from '@element-plus/icons-vue'
    import {ref} from 'vue'
    import ChannelSelect from './components/ChannelSelect.vue'
    const articleList = ref([
        {
            id:5961,
            title:'新的文章',
            pub_date:'2022-07-10 14:54:52.604',
            state:'已发布',
            cate_name:'体育'
        },
        {
            id:5962,
            title:'新的文章2',
            pub_date:'2022-07-10 14:55:30.797',
            state:'草稿',
            cate_name:'体育'
        },
    ])
        //编辑逻辑
    const onEditArticle = (row)=>{
        console.log(row)
    }
        //删除逻辑
    const onDelArticle = (row)=>{
        console.log(row)
    }
    //定义请求参数对象
    const params= ref({
        pagenum:1,
        pagesize:5,
        cate_id:'',
        state:''
    })
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
                    <el-button type="primary">搜索</el-button>
                    <el-button>重置</el-button>
                </el-form-item>
            </el-form>

            <!-- 表格区域 -->
             <el-table :data="articleList">
                <el-table-column label="文章标题" prop="title" >
                    <template #default="{row}">
                        <el-link type="primary" :underline="false">{{ row.title }}</el-link>
                    </template>
                </el-table-column>
                <el-table-column label="分类" prop="cate_name"></el-table-column>
                <el-table-column label="发表时间" prop="pub_date"></el-table-column>
                <el-table-column label="状态" prop="state"></el-table-column>
                <el-table-column label="操作">
                    <!-- 利用作用域插槽row可以获取当前行的数据 -->
                    <template #default="{row}">
                        <el-button circle plain type="primary" :icon="Edit" @click="onEditArticle(row)" ></el-button>
                        <el-button circle plain type="danger" :icon="Delete" @click="onDelArticle(row)"></el-button>
                        
                    </template>
                </el-table-column>
             </el-table>
    </page-container>     
</template>

<style lang="scss" scoped>

</style>