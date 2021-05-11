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
        url: `${BASE_URL}/car/collection?detailId=${detailId}`
    })
}