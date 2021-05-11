/**
 * 首页获取数据
 */
import {
    BASE_URL
} from './api';

export function getPosts(theme) {
    if (theme) {
        return uni.request({
            url: `${BASE_URL}/post/query?theme=${theme}&pageSize=100`
        })
    }
    return uni.request({
        url: `${BASE_URL}/post/query?pageSize=100`
    })
}