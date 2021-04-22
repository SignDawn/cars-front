<template>
  <view class="login">
    <view class="avater">C</view>
    <!-- 标题 -->
    <text class="title">Sign in to Cars</text>
    <!-- 登陆区域 -->
    <view class="login-area">
      <text>username</text>
      <uni-easyinput
        class="input"
        v-model="username"
        placeholder="用户名"
      ></uni-easyinput>
      <text>password</text>
      <uni-easyinput
        class="input"
        v-model="password"
        type="password"
        placeholder="密码"
      ></uni-easyinput>
    </view>
    <!-- 按钮区域 -->
    <view class="buttons">
      <button hover-class="loginButton" @click="login">登陆</button>
      <button>注册</button>
    </view>
  </view>
</template>

<script>
import { login as loginApi } from "../../network/loginApi";
export default {
  data() {
    return {
      username: "", // 用户名
      password: "", // 密码
    };
  },
  onBackPress() {
    //   回到首页
    uni.reLaunch({ url: "/pages/index/index" });
    return true; // 不执行默认的行为
  },
  methods: {
    async login() {
      console.log("username", this.username);
      console.log("password", this.password);
      const res = await loginApi(this.username, this.password);
      if (res[0]) {
        // 不为空，弹出一个 toast
        uni.showToast({
          title: "网络异常",
          icon: "none",
        });
        return;
      }
      const data = res[1].data;
      if (data.code === "error") {
        uni.showToast({
          title: data.message,
          icon: "none",
        });
        return;
      }
      // 登陆成功，跳转我的页面 TODO:
      this.$store.commit("user/loginUser", data.data);
      uni.switchTab({ url: "/pages/mine/mine" });
    },
  },
};
</script>

<style lang="scss" scoped>
.login {
  display: flex;
  flex-direction: column;
  align-items: center;

  .avater {
    margin-top: 50rpx;
    $avater-width-height: 100rpx;
    width: $avater-width-height;
    height: $avater-width-height;
    background-color: $uni-color-primary;
    border-radius: $avater-width-height / 2;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 50rpx;
  }

  .title {
    margin-top: 50rpx;
    font-size: 48rpx;
    font-weight: 300;
    letter-spacing: -0.5px;
  }

  .login-area {
    margin-top: 32rpx;
    padding: 40rpx;
    background-color: #f6f8fa;
    display: flex;
    flex-direction: column;
    border-radius: 20rpx;

    text {
      font-size: 30rpx;
      &:nth-child(3) {
        margin-top: 30rpx;
      }
    }

    .input {
      margin-top: 20rpx;
      width: 500rpx;
    }
  }
  .buttons {
    display: flex;
    flex-direction: column;

    button {
      margin-top: 20rpx;
      width: 200rpx;

      &:nth-child(1) {
        background-color: $uni-color-primary;
        color: white;
      }

      &.loginButton {
        opacity: 0.6;
      }
    }
  }
}
</style>
