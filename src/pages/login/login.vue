<template>
  <view class="login">
    <view class="avater">C</view>
    <!-- 标题 -->
    <text class="title">Sign in to Cars</text>
    <!-- 登陆区域 -->
    <view class="login-area">
      <uni-forms
        ref="form"
        :value="formData"
        :rules="rules"
        validate-trigger="bind"
        label-position="top"
        border
      >
        <uni-forms-item label="username" name="username">
          <uni-easyinput
            class="input"
            v-model="formData.username"
            placeholder="用户名"
          />
        </uni-forms-item>
        <uni-forms-item label="password" name="password">
          <uni-easyinput
            class="input"
            v-model="formData.password"
            type="password"
            placeholder="密码"
          />
        </uni-forms-item>
        <button @click="login">登陆</button>
      </uni-forms>
    </view>
    <!-- 注册 -->
    <text class="tips">
      如果没有账号，可以进行<text @click="register" class="register">注册</text>
    </text>
  </view>
</template>

<script>
import { login as loginApi } from "../../network/loginApi";
export default {
  data() {
    return {
      formData: {
        username: "", // 用户名
        password: "", // 密码
      },
      rules: {
        username: {
          rules: [
            {
              required: true,
              errorMessage: "请输入用户名",
            },
            // {
            //   minLength: 3,
            //   maxLength: 5,
            //   errorMessage: "姓名长度在 {minLength} 到 {maxLength} 个字符",
            // },
          ],
        },
        password: {
          rules: [
            {
              required: true,
              errorMessage: "请输入密码",
            },
          ],
        },
      },
    };
  },
  onBackPress() {
    //   回到首页
    uni.reLaunch({ url: "/pages/index/index" });
    return true; // 不执行默认的行为
  },
  methods: {
    login() {
      this.$refs.form
        .submit()
        .then(async (formData) => {
          const res = await loginApi(formData.username, formData.password);
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
          // 登陆成功，跳转我的页面
          this.$store.commit("user/loginUser", data.data);
          uni.showToast({
            title: "注册成功",
            icon: "none",
          });
          uni.switchTab({ url: "/pages/mine/mine" });
        })
        .catch((err) => {
          // 表单校验验失败，err 为具体错误信息
          uni.showToast({
            title: err[0].errorMessage,
            icon: "none",
          });
        });
    },
    register() {
      // 跳转到注册页面
      uni.navigateTo({ url: "/pages/register/register" });
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
    border-radius: 20rpx;

    .input {
      width: 500rpx;
    }
    button {
      margin-top: 20rpx;
      width: 200rpx;
      background-color: $uni-color-primary;
      color: white;
    }
  }

  .tips {
    font-size: 26rpx;
    margin-top: 20rpx;

    .register {
      color: blue;
      padding: 0 10rpx;
    }
  }
}
</style>
