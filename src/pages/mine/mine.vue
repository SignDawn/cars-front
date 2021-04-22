<template>
  <view class="mine">
    <view class="status_bar">
      <!-- 这里是状态栏 -->
    </view>
    <view>我的页面</view>
    <button @click="cancelLogin">退出登陆</button>
  </view>
</template>

<script>
export default {
  data() {
    return {};
  },
  onShow() {
    // 检查是否登录
    console.log("mine show");
    if (!this.isLogin()) {
      uni.navigateTo({ url: "/pages/login/login" });
      return;
    }
  },
  methods: {
    isLogin() {
      return this.$store.getters["user/isLoggedIn"];
    },
    cancelLogin() {
      this.$store.commit("user/cancelLogin");
      // 切换到首页
      uni.switchTab({ url: "/pages/index/index" });
    },
  },
};
</script>

<style lang="scss" scoped>
.mine {
  .status_bar {
    // 状态栏
    height: var(--status-bar-height);
    width: 100%;
    background-color: $uni-color-primary; // TODO: 后续注释该内容试试 配置状态栏颜色
  }
}
</style>
