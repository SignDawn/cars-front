/**
 * 注册页接口
 */
import {
    BASE_URL
} from './api';

export function register(username, password) {
    return uni.request({
        url: `${BASE_URL}/user/register`,
        data: {
            username,
            password
        },
        method: 'POST'
    })
}