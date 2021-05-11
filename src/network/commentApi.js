/**
 * 评论页获取数据
 */
import {
    BASE_URL
} from './api';

export function comment(cid, pid) {
    if (cid && cid !== '') {
        return uni.request({
            url: `${BASE_URL}/comment/query?cid=${cid}`,
        })
    } else if (pid && pid !== '') {
        return uni.request({
            url: `${BASE_URL}/comment/query?pid=${pid}`,
        })
    }
}


export function create(cid, pid, describe, answer_uid) {
    if (cid && cid !== '') {
        const data = {
            cid,
            describe
        };
        if (answer_uid && answer_uid !== '') {
            data.answer_uid = answer_uid;
        }
        return uni.request({
            url: `${BASE_URL}/comment/create`,
            method: 'POST',
            data: data,
        })
    } else if (pid && pid !== '') {
        const data = {
            pid,
            describe
        };
        if (answer_uid && answer_uid !== '') {
            data.answer_uid = answer_uid;
        }
        return uni.request({
            url: `${BASE_URL}/comment/create`,
            method: 'POST',
            data,
        })
    }
}