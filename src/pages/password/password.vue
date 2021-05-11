<template>
  <view>
    <uni-forms
      ref="form"
      :value="formData"
      :rules="rules"
      validate-trigger="bind"
      label-position="top"
      border
    >
      <uni-forms-item label="原密码" name="password">
        <uni-easyinput
          v-model="formData.password"
          type="password"
          placeholder="原密码"
        />
      </uni-forms-item>
      <uni-forms-item label="新密码" name="new_password">
        <uni-easyinput
          v-model="formData.new_password"
          type="password"
          placeholder="新密码"
        />
      </uni-forms-item>
      <uni-forms-item
        label="确认密码"
        name="new_password_again"
        :label-width="150"
      >
        <uni-easyinput
          v-model="formData.new_password_again"
          type="password"
          placeholder="确认密码"
        />
      </uni-forms-item>
      <button @click="changePassword">更改</button>
    </uni-forms>
  </view>
</template>

<script>
import { changePassword as changePasswordApi } from "../../network/passwordApi";
export default {
  data() {
    return {
      formData: {
        password: "", // 密码
        new_password: "", // 新密码
        new_password_again: "", // 确认密码
      },
      rules: {
        password: {
          rules: [
            {
              required: true,
              errorMessage: "请输入原密码",
            },
          ],
        },
        new_password: {
          rules: [
            {
              required: true,
              errorMessage: "请输入新密码",
            },
          ],
        },
        new_password_again: {
          rules: [
            {
              required: true,
              errorMessage: "请输入确认密码",
            },
            {
              validateFunction: (rule, value, data, callback) => {
                if (value === this.formData.new_password) {
                  return true;
                }
                return false;
              },
              errorMessage: "确认密码与新密码不一致",
            },
          ],
        },
      },
    };
  },
  methods: {
    changePassword() {
      this.$refs.form
        .submit()
        .then(async (formData) => {
          // 走修改密码接口
          console.log(formData);
          const res = await changePasswordApi(
            formData.password,
            formData.new_password
          );
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
          //   修改密码成功
          uni.showToast({
            title: "修改成功",
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

<style lang="scss"></style>
