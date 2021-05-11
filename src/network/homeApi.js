/**
 * 首页获取数据
 */
import {
    BASE_URL
} from './api';

/**
 * 获取汽车信息
 * @param {number} page 
 * @param {number} pageSize 
 * @param {string} carName 
 * @returns {Promise<any>}
 */
export function query(page, pageSize, carName) {
    if (carName) {
        return uni.request({
            url: `${BASE_URL}/car/query?page=${page}&pageSize=${pageSize}&carName=${carName}`
        })
    }
    return uni.request({
        url: `${BASE_URL}/car/query?page=${page}&pageSize=${pageSize}`
    })
}

export function queryOne(detailId) {
    return uni.request({
        url: `${BASE_URL}/car/one?detailId=${detailId}`
    });
}