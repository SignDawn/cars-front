<template>
  <view class="createPost">
    <uni-easyinput
      type="textarea"
      v-model="theme"
      placeholder="请输入内容"
    ></uni-easyinput>
    <button class="button" @click="createPost">发布</button>
  </view>
</template>

<script>
import { createPost as create } from "../../network/postApi";
export default {
  data() {
    return { theme: "" };
  },
  methods: {
    async createPost() {
      const value = this.theme.trim();
      if (value === "") {
        // 说明
        uni.showToast({
          title: "发送内容为空",
        });
        return;
      }
      //   发表评论
      const res = await create(value);
      if (res[0]) {
        // 不为空，弹出一个 toast
        uni.showToast({
          title: "网络错误",
          icon: "none",
        });
        return;
      }
      const data = res[1].data;
      if (data.code === "error") {
        if (data.message === "请先登陆") {
          // 请登录
          uni.switchTab({ url: "/pages/mine/mine" });
          return;
        }
        uni.showToast({
          title: data.message,
          icon: "none",
        });
      }
      // 成功
      uni.showToast({
        title: data.message,
        icon: "none",
      });
      uni.switchTab({
        url: "/pages/post/post",
      });
    },
  },
};
</script>

<style lang="scss">
.createPost {
  .button {
    position: fixed;
    bottom: 0;
    width: calc(750rpx - 40rpx);
    margin: 20rpx;
  }
}
</style>
