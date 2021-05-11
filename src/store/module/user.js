const user = {
    namespaced: true, // 限制命名空间，设置在 user 下
    state: { //存放状态
        userInfo: {}, // 用户基本信息
    },
    getters: {
        // 存在就说明已经登陆
        isLoggedIn: (state) => !!state.userInfo.username,
        userInfo: (state) => state.userInfo,
    },
    mutations: {
        loginUser(state, userInfo) {
            state.userInfo = userInfo;
        },
        cancelLogin(state) {
            state.userInfo = {};
        }
    }
}
export default user