<template>
  <view class="mine">
    <view class="status_bar">
      <!-- 这里是状态栏 -->
    </view>
    <view class="content">
      <view class="avater">
        {{ userInfo.username ? userInfo.username[0] : "C" }}
      </view>
      <text class="username">
        {{ userInfo.username }}
      </text>
      <view class="infos">
        <uni-data-picker
          popup-title="性别"
          :localdata="sexs"
          v-model="userInfo.sex"
          @change="changeSex"
        >
          <view class="info ">
            <text>性别</text> <text> {{ userInfo.sex }}</text>
          </view>
        </uni-data-picker>
        <view class="info">
          <text>创建日期</text>
          <text> {{ userInfo.reg_time | formatTimer }}</text>
        </view>
        <view class="info">
          <text>描述</text>
          <view v-if="!isChangeDesc" class="desc">
            <text>
              {{ userInfo.describe }}
            </text>
            <uni-icons
              type="compose"
              size="20"
              @click="isChangeDesc = true"
            ></uni-icons>
          </view>
          <uni-easyinput
            class="input"
            v-else
            type="textarea"
            :maxlength="50"
            :value="userInfo.describe"
            @blur="changeDesc"
          ></uni-easyinput>
        </view>
        <uni-data-picker
          popup-title="地区"
          :localdata="locations"
          :value="currentLocation"
          @change="changeLocation"
        >
          <!-- @nodeclick="onnodeclick" -->
          <view class="info">
            <text>地区</text> <text> {{ locationStr }}</text>
          </view>
        </uni-data-picker>
      </view>
      <view class="buttons">
        <button @click="myStars">我的收藏</button>
        <button @click="changePassword">修改密码</button>
        <button @click="cancelLogin">退出登陆</button>
      </view>
    </view>
  </view>
</template>

<script>
import { changeInfo } from "../../network/mineApi";
export default {
  computed: {
    locationStr: function() {
      const location = this.userInfo.location;
      if (location) {
        return `${location.country} ${location.province} ${location.city}`;
      }
      return "";
    },
    currentLocation: function() {
      const location = this.userInfo.location;
      if (location) {
        if (location.city) {
          return location.city;
        } else if (location.province) {
          return location.province;
        } else if (location.country) {
          return location.country;
        }
      }
      return "";
    },
  },
  data() {
    return {
      userInfo: {},
      sexs: [
        {
          text: "男",
          value: "男",
        },
        {
          text: "女",
          value: "女",
        },
      ],
      locations: [
        {
          text: "中国",
          value: "中国",
          children: [
            {
              text: "湖北",
              value: "湖北",
              children: [
                { text: "黄冈", value: "黄冈" },
                { text: "武汉", value: "武汉" },
              ],
            },
          ],
        },
      ],
      isChangeDesc: false,
    };
  },
  onShow() {
    // 检查是否登录
    console.log("mine show");
    if (!this.isLogin()) {
      uni.navigateTo({ url: "/pages/login/login" });
      return;
    }
    // 拿到登录信息
    this.userInfo = JSON.parse(
      JSON.stringify(this.$store.getters["user/userInfo"])
    );
    console.log(this.userInfo);
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
    changePassword() {
      // TODO: 跳转新页
      uni.navigateTo({ url: "/pages/password/password" });
    },
    changeSex(e) {
      this.userInfo.sex = e.detail.value[0].value;
      this.changeUserInfo();
    },
    changeDesc(e) {
      console.log(e.detail.value);
      this.userInfo.describe = e.detail.value;
      // 输入框恢复成文字
      this.isChangeDesc = false;
      // 发请求
      this.changeUserInfo();
    },
    changeLocation(e) {
      this.userInfo.location = {
        country: e.detail.value[0].value,
        province: e.detail.value[1].value,
        city: e.detail.value[2].value,
      };
      // 为了更新页面
      this.userInfo = Object.assign({}, this.userInfo);
      this.changeUserInfo();
    },
    async changeUserInfo() {
      // 修改个人信息
      const res = await changeInfo(this.userInfo);
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
        // TODO:需要登陆，基本上走不到这一步
        return;
      }
      // 修改以后，去修改 vuex 中的值
      this.$store.commit("user/loginUser", this.userInfo);
      uni.showToast({
        title: data.message,
        icon: "none",
      });
    },
    myStars() {
      uni.navigateTo({ url: "/pages/stars/stars" });
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

  .content {
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

    .username {
      margin-top: 30rpx;
    }

    .infos {
      margin-top: 200rpx;

      .info {
        width: 750rpx;
        display: flex;
        justify-content: space-between;
        padding: 20rpx;
        font-size: 30rpx;
        border: 2rpx solid #00000066;

        .input {
          width: 300rpx;
          flex: none;
        }

        .desc {
          display: flex;
        }
      }
    }

    .buttons {
      display: flex;
      button {
        margin: 10rpx;
      }
    }
  }
}
</style>
