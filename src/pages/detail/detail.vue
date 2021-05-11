<template>
  <view class="detail">
    <swiper class="swiper" indicator-dots autoplay circular>
      <swiper-item
        class="item"
        v-for="(img, index) in detailCar.images"
        :key="index"
      >
        <image :src="img" mode="aspectFill"
      /></swiper-item>
    </swiper>
    <view class="content">
      <text class="title">{{ detailCar.carName }}</text>
      <text class="price">价格：{{ detailCar.price }}</text>
      <view class="infos">
        <text
          class="info"
          v-for="(obj, index) in detailCar.detailConfig"
          :key="index"
        >
          {{ obj.key }}：{{ obj.value }}
        </text>
      </view>
      <view class="buttons">
        <button class="button" @click="hand">
          <uni-icons type="hand-thumbsup" size="22"></uni-icons>
          <text> 点赞</text>
          <uni-badge :text="hands" class="badge"> </uni-badge>
        </button>
        <button class="button" @click="comment">
          <uni-icons type="chat" size="22"></uni-icons>
          <text> 评论</text>
        </button>
        <button class="button" @click="star">
          <uni-icons type="star" size="22"></uni-icons>
          <text>收藏</text>
        </button>
      </view>
    </view>
  </view>
</template>

<script>
import { queryOne } from "../../network/homeApi";
import { collection, hand } from "../../network/detailApi";
export default {
  computed: {
    hands: function() {
      if (this.detailCar) {
        if (this.detailCar.like_list instanceof Array) {
          return this.detailCar.like_list.length;
        }
        return 0;
      }
      return 0;
    },
  },
  onLoad(query) {
    this.getOne(query.detailId);
  },
  data() {
    return {
      detailCar: {}, // 具体汽车
    };
  },
  methods: {
    async getOne(detailId) {
      const res = await queryOne(detailId);
      // 返回值是个数组，第一个参数是错误对象，第二个是返回的数据
      if (res[0]) {
        // 不为空，弹出一个 toast
        uni.showToast({
          title: "请求具体汽车失败",
          icon: "none",
        });
        return;
      }
      this.detailCar = res[1].data.data;
      for (const index in this.detailCar.images) {
        this.detailCar.images[index] = this.detailCar.images[index].replace(
          "240x180",
          "360x270"
        );
      }
      console.log(this.detailCar);
    },
    async hand() {
      // 点赞
      if (this.detailCar && this.detailCar.detailId) {
        const res = await hand(undefined, this.detailCar.detailId);
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
      }
    },
    async star() {
      // 收藏
      if (this.detailCar && this.detailCar.detailId) {
        const res = await collection(this.detailCar.detailId);
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
        // 添加一条伪数据，用作显示而已  TODO:
        this.detailCar.like_list.push(false);
      }
    },
    comment() {
      // 跳转到评论页面
      uni.navigateTo({
        url: `/pages/comment/comment?cid=${this.detailCar.detailId}`,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.detail {
  .swiper {
    height: 400rpx;

    .item {
      image {
        width: 750rpx;
        height: 100%;
      }
    }
  }

  .content {
    display: flex;
    flex-direction: column;
    .title {
      font-size: 50rpx;
      font-weight: 700;
      margin: 10rpx;
    }
    .price {
      color: $uni-color-primary;
      font-size: 40rpx;
      margin: 10rpx;
    }

    .infos {
      display: flex;
      flex-wrap: wrap;
      .info {
        margin: 5rpx 10rpx;
        font-size: 20rpx;
      }
    }

    .buttons {
      margin-top: 30rpx;
      display: flex;

      .button {
        width: 150rpx;
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;

        .badge {
          position: absolute;
          top: 5rpx;
          right: 5rpx;
        }
      }
    }
  }
}
</style>
