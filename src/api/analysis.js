import request from '@/utils/request'
import qs from 'qs'

// =================== weibo =========================

// 获取某帖子下的评论
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

// 微博评论数量
export function getWeiboCommentCount(data) {
    var ran = ['','']
    if (data.timeRange != null && data.timeRange != ''){
      ran[0] = Date.parse(data.timeRange[0])
      ran[1] = Date.parse(data.timeRange[1])
    }
    return request({
        url: '/weibo/comment/count',
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

// 微博整体数据
export function getWeiboStatistic(data) {
    return request({
        url: '/weibo/analysis/statistic',
        method: 'get',
        params: data
    })
}
// =================== bili =========================

// 获取bili的视频评论
export function getBiliAnalysis(data) {
    return request({
        url: '/bili/analysis/count',
        method: 'get',
        params: data
    })
}

// 获取评论数量
export function getBiliReplyCount(data) {
    return request({
        url: '/bili/reply/count',
        method: 'get',
        params: data
    })
}

// =================== twitter =========================
export function getTwitterCommentCount(data) {
    return request({
        url: '/twitter/comment/count',
        method: 'get',
        params: data
    })
}