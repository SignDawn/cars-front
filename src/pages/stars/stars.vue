<template>
  <view class="stars">
    <view
      v-for="(collection, index) in collections"
      :key="index"
      class="collection"
      @click="goDetail(collection.cid)"
    >
      <text>汽车{{ index + 1 }}</text> <text>{{ collection.cid }}</text>
    </view>
  </view>
</template>

<script>
export default {
  computed: {
    collections: function() {
      if (this.userInfo.collection_info instanceof Array) {
        return this.userInfo.collection_info;
      }
      return [];
    },
  },
  data() {
    return {
      userInfo: {},
    };
  },
  onShow() {
    // 拿到登录信息
    this.userInfo = JSON.parse(
      JSON.stringify(this.$store.getters["user/userInfo"])
    );
  },
  methods: {
    goDetail(cid) {
      uni.navigateTo({ url: `/pages/detail/detail?detailId=${cid}` });
    },
  },
};
</script>

<style lang="scss">
.stars {
  .collection {
    display: flex;
    justify-content: space-between;
    border: 1px solid #00000055;
    padding: 10rpx;
  }
}
</style>
