<template>
  <view class="post">
    <!-- <view v-for=""></view> -->
  </view>
</template>

<script>
import { getPosts } from "../../network/postApi";
export default {
  data() {
    return {};
  },
  methods: {
    async getPost() {
      const res = await getPosts();
	  
    },
  },
};
</script>

<style lang="scss">
.post {
}
</style>
