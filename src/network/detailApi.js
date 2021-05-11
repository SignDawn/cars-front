/**
 * 汽车详情页获取数据
 */
import {
    BASE_URL
} from './api';

/**
 * 收藏汽车
 * @param {String} detailId 具体汽车id
 */
export function collection(detailId) {
    return uni.request({
        url: `${BASE_URL}/car/collection?detailId=${detailId}`,
        method: 'POST'
    })
}

/**
 * 点赞汽车或帖子
 * @param {string} pid 帖子id
 * @param {string} cid 汽车id
 */
export function hand(pid, cid) {
    let params;
    if (pid) {
        params = {
            pid
        };
    } else {
        params = {
            cid
        };
    }
    return uni.request({
        url: `${BASE_URL}/comment/like`,
        method: 'POST',
        data: params
    });
}