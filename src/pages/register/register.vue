<template>
  <view class="register">
    <view class="avater">C</view>
    <!-- 标题 -->
    <text class="title">Sign up to Cars</text>
    <!-- 注册区域 -->
    <view class="register-area">
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
        <uni-forms-item
          label="password again"
          name="passwordAgain"
          :label-width="150"
        >
          <uni-easyinput
            class="input"
            v-model="formData.passwordAgain"
            type="password"
            placeholder="确认密码"
          />
        </uni-forms-item>
        <button @click="register">注册</button>
      </uni-forms>
    </view>
  </view>
</template>

<script>
import { register as registerApi } from "../../network/registerApi";
export default {
  data() {
    return {
      formData: {
        username: "", // 用户名
        password: "", // 密码
        passwordAgain: "",
      },
      rules: {
        username: {
          rules: [
            {
              required: true,
              errorMessage: "请输入用户名",
            },
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
        passwordAgain: {
          rules: [
            {
              required: true,
              errorMessage: "请输入确认密码",
            },
            {
              validateFunction: (rule, value, data, callback) => {
                if (value === this.formData.password) {
                  return true;
                }
                return false;
              },
              errorMessage: "确认密码与密码不一致",
            },
          ],
        },
      },
    };
  },
  methods: {
    register() {
      this.$refs.form
        .submit()
        .then(async (formData) => {
          // 走注册接口
          console.log(formData);
          const res = await registerApi(formData.username, formData.password);
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
          // 注册成功，默认也走了登录，直接存到 vuex
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
  },
};
</script>

<style lang="scss">
.register {
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

  .register-area {
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
}
</style>
