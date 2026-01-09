<script setup>
    import { artGetChannellsService } from '@/api/article';
    import {ref} from 'vue'

    defineProps({
        modelValue:{
            type:[Number,String]
        }
    })

    const emit = defineEmits(['update:modelValue'])

    const channelList = ref([])
    const getChannelList = async ()=>{
        const res = await artGetChannellsService()
        channelList.value = res.data.data
    }
    getChannelList()
</script>

<template>
    <el-select 
    style="width:220px" 
    :modelValue="modelValue"
    @update:modelValue="emit('update:modelValue',$event)"
    
    >
         <!-- label展示给用户看 value提交给后台的 -->
        <el-option v-for="channel in channelList" 
        :key="channel.id"
        :label="channel.cate_name" 
        :value="channel.id"></el-option>
    </el-select>
</template>