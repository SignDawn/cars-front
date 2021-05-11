/**
 * 修改密码页面接口
 */
import {
    BASE_URL
} from './api';

export function changePassword(password, new_password) {
    return uni.request({
        url: `${BASE_URL}/user/password`,
        data: {
            password,
            new_password
        },
        method: 'PUT'
    })
}