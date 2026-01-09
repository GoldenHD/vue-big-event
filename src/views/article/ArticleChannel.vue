<script setup>

    import { artGetChannellsService } from '@/api/article';
    import {ref} from 'vue'
    import {onMounted} from 'vue'
    import {Edit,Delete} from '@element-plus/icons-vue'
    import ChannelEdit from './components/ChannelEdit.vue';
    const channelList = ref([])
    const dialog = ref()

    const getChannelList = async ()=>{
        loading.value = true
        const res = await artGetChannellsService()
        channelList.value = res.data.data
        loading.value = false
    }

    onMounted(()=>{
        getChannelList()
    })

    const onEditChannel = (row,$index)=>{
        dialog.value.open(row)
        console.log(row,$index)
    }
    const onDelChannel = (row,$index)=>{
        
        console.log(row,$index)
    }

    const loading = ref(false)

    const onAddChannel = ()=>{
        dialog.value.open({})
    }

    const onSuccess = ()=>{
        getChannelList()
    }

</script>


<template>
    <page-container title="文章分类">
        <template #extra>
            <el-button @click="onAddChannel">添加分类</el-button>
        </template>
        <el-table v-loading="loading" :data="channelList" style="width:100%">
            <el-table-column type="index" label="序号" width="100"></el-table-column>
            <el-table-column prop="cate_name" label="分类名称"></el-table-column>
            <el-table-column prop="cate_alias" label="分类别名"></el-table-column>
            <el-table-column  label="操作" width="150">
                <!-- row 就是 channelList的一项， $index 下标 -->
                <template #default="{row,$index}">
                    <el-button @click="onEditChannel(row,$index)" :icon="Edit" circle type="primary" plain></el-button>
                    <el-button @click="onDelChannel(row,$index)" :icon="Delete" circle type="danger" plain></el-button>
                </template>
            </el-table-column>

            <template #empty>
                <el-empty description="这个人很懒，什么也没有留下..."></el-empty>
            </template>
        </el-table>

        <ChannelEdit ref="dialog" @success="onSuccess"></ChannelEdit>
    </page-container>     
</template>

<style lang="scss" scoped>

</style>