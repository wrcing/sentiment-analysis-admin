import request from '@/utils/request'
import qs from 'qs'

export function getWeiboAnalysis(data) {
    var ran = ['','']
    if (data.timeRange != ''){
      ran[0] = Date.parse(data.timeRange[0])
      ran[1] = Date.parse(data.timeRange[1])
    }
    return request({
        url: '/weibo/analysis',
        method: 'get',
        params: { 
            url: data.url,
            location: data.location,
            minLike: data.minLike,
            minReply: data.minReply,
            timeRange: ran
        },
        paramsSerializer: params => {
            return qs.stringify(params, {
                arrayFormat: 'repeat'
            })
        },
        // params: data ,
    })
}

export function getWeiboCommentCount(data) {
    var ran = ['','']
    if (data.timeRange != null && data.timeRange != ''){
      ran[0] = Date.parse(data.timeRange[0])
      ran[1] = Date.parse(data.timeRange[1])
    }
    return request({
        url: '/weibo/count',
        method: 'get',
        params: { 
            url: data.url,
            location: data.location,
            minLike: data.minLike,
            minReply: data.minReply,
            timeRange: ran
        },
        paramsSerializer: params => {
            return qs.stringify(params, {
                arrayFormat: 'repeat'
            })
        },
    })
}


export function getBiliAnalysis(data) {
    return request({
        url: '/bili/analysis',
        method: 'get',
        params: data
    })
}

export function getBiliReplyCount(data) {
    return request({
        url: '/bili/count',
        method: 'get',
        params: data
    })
}

export function getTotalCount(data) {
    return request({
        url: '/total/count',
        method: 'get',
        params: data
    })
}