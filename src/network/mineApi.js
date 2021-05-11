/**
 * 我的页面接口
 */
import {
    BASE_URL
} from './api';

export function changeInfo(userInfo) {
    return uni.request({
        url: `${BASE_URL}/user/info`,
        data: {
            sex: userInfo.sex,
            avater: userInfo.avater,
            describe: userInfo.describe,
            location: userInfo.location
        },
        method: 'PUT'
    })
}