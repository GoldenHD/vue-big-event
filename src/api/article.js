//获取文章分类

import request from'@/utils/request'

export const artGetChannellsService = ()=>{
    return request.get('/my/cate/list')
}