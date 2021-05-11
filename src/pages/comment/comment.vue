<template>
  <view class="comment">
    <!-- 内容区 -->
    <view class="content">
      <view v-for="(comment, index) in commentList" :key="index" class="item">
        <view class="avater">
          {{
            comment.commentUser.username ? comment.commentUser.username[0] : "C"
          }}
        </view>
        <view class="center">
          <view>
            <text class="author"> {{ comment.commentUser.username }}</text>
            <text class="replyPerson" v-if="comment.answerUser"
              >回复:{{ comment.answerUser.username }}</text
            >
          </view>
          <text class="describe">{{ comment.describe }}</text>
          <text>{{ comment.comment_time | formatTimer }}</text>
        </view>
        <text class="reply" @click="choosePerson(comment)">回复</text>
      </view>
    </view>
    <!-- 底部输入框 -->
    <view class="fixedBottom">
      <uni-easyinput
        v-model="commentDesc"
        class="input"
        :placeholder="placeholder"
      ></uni-easyinput>
      <button @click="send">发送</button>
    </view>
  </view>
</template>

<script>
import { comment, create } from "../../network/commentApi";
export default {
  filters: {
    formatTimer: function(value) {
      let date = new Date(value);
      let y = date.getFullYear();
      let MM = date.getMonth() + 1;
      MM = MM < 10 ? "0" + MM : MM;
      let d = date.getDate();
      d = d < 10 ? "0" + d : d;
      let h = date.getHours();
      h = h < 10 ? "0" + h : h;
      let m = date.getMinutes();
      m = m < 10 ? "0" + m : m;
      let s = date.getSeconds();
      s = s < 10 ? "0" + s : s;
      return y + "-" + MM + "-" + d + " " + h + ":" + m;
    },
  },
  computed: {
    placeholder: function() {
      if (this.person && this.person.username) {
        return "回复：" + this.person.username;
      }
      return "";
    },
  },
  onLoad(query) {
    if (query.cid) {
      //   汽车相关评论
      this.cid = query.cid;
      this.getComments(this.cid);
    } else if (query.pid) {
      this.pid = query.pid;
      this.getComments(undefined, this.pid);
    }
  },
  data() {
    return {
      cid: "", // 汽车 id
      pid: "", // 帖子 id
      commentList: [], // 评论
      total: 0, // 总数
      commentDesc: "",
      answer_uid: "", // 回复人
      person: {}, // 选择的回复人
    };
  },
  methods: {
    async getComments(cid, pid) {
      const res = await comment(cid, pid);
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
      this.commentList = res[1].data.table;
      this.total = res[1].data.total;
    },
    async send() {
      const value = this.commentDesc.trim();
      if (value === "") {
        // 说明
        uni.showToast({
          title: "发送内容为空",
        });
        return;
      }
      // 判断是否有回复人
      this.answer_uid = this.person._id;
      //   发表评论
      const res = await create(this.cid, this.pid, value, this.answer_uid);
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
      //   重新请求，刷新页面
      this.getComments(this.cid, this.pid);
    },
    choosePerson(comment) {
      // 拿到 uid
      this.person = comment.commentUser;
    },
  },
};
</script>

<style lang="scss" scoped>
.comment {
  .content {
    padding: 20rpx;
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

        .replyPerson {
          margin-left: 10rpx;
          color: pink;
        }
      }

      .reply {
        color: blue;
        font-size: 30rpx;
        margin-top: 20rpx;
      }
    }
  }

  .fixedBottom {
    position: fixed;
    bottom: 0px;
    width: 750rpx;

    display: flex;
    align-items: center;
  }
}
</style>
