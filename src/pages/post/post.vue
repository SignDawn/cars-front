<template>
  <view class="post">
    <view class="status_bar">
      <!-- 这里是状态栏 -->
    </view>
    <button @click="naviNewPage" class="button">发帖</button>
    <view class="item" v-for="(post, index) in postList" :key="index">
      <view class="avater">
        {{ post.poster.username ? post.poster.username[0] : "C" }}
      </view>
      <view class="center">
        <text class="author"> {{ post.poster.username }}</text>
        <text class="describe">{{ post.theme }}</text>
        <text>{{ post.cre_time | formatTimer }}</text>
      </view>
      <view class="actions">
        <uni-icons
          class="icon"
          type="hand-thumbsup"
          size="22"
          @click="hand(post._id)"
        ></uni-icons>
        <uni-icons
          @click="comment(post._id)"
          class="icon"
          type="chat"
          size="22"
        ></uni-icons
      ></view>
    </view>
  </view>
</template>

<script>
import { getPosts } from "../../network/postApi";
import { hand } from "../../network/detailApi";
export default {
  onLoad() {
    this.getPost();
  },
  onShow() {
    this.getPost();
  },
  data() {
    return {
      postList: [], // 帖子数
      total: 0, // 总数
    };
  },
  methods: {
    async getPost() {
      const res = await getPosts();
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
        uni.showToast({
          title: data.message,
          icon: "none",
        });
      }
      // 成功
      this.postList = res[1].data.table;
      this.total = res[1].data.total;
    },
    naviNewPage() {
      uni.navigateTo({
        url: "/pages/createPost/createPost",
      });
    },
    async hand(pid) {
      // 点赞
      const res = await hand(pid);
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
    },
    comment(pid) {
      // 跳转到评论页面
      uni.navigateTo({
        url: `/pages/comment/comment?pid=${pid}`,
      });
    },
  },
};
</script>

<style lang="scss">
.post {
  .status_bar {
    // 状态栏
    height: var(--status-bar-height);
    width: 100%;
    background-color: $uni-color-primary; // TODO: 后续注释该内容试试 配置状态栏颜色
  }
  padding: 15rpx;

  .button {
    margin-bottom: 30rpx;
  }
  .item {
    margin-bottom: 20rpx;
    display: flex;
    .avater {
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

    .center {
      margin-left: 15rpx;
      display: flex;
      flex-direction: column;
      flex: 1;
      > .describe {
        font-size: 30rpx;
        color: gray;
      }

      > :last-child {
        font-size: 24rpx;
        color: gray;
      }
    }
    .actions {
      display: flex;
      flex-direction: column;

      .icon {
        padding: 10rpx;
      }
    }
  }
}
</style>
