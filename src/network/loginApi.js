/**
 * 登陆页接口
 */
import {
    BASE_URL
} from './api';

export function login(username, password) {
    return uni.request({
        url: `${BASE_URL}/user/login`,
        data: {
            username,
            password
        },
        method: 'POST'
    })
}