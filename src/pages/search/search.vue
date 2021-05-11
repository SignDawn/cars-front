<template>
  <uni-list :border="false" class="list search">
    <template v-for="(car, index) in cars">
      <car-item
        :key="index"
        :car="car"
        :carIndex="index"
        @updateCar="updateCar"
      ></car-item>
    </template>
    <uni-load-more
      :status="loadStatus"
      @clickLoadMore="loadMore"
    ></uni-load-more>
  </uni-list>
</template>

<script>
import { query } from "../../network/homeApi";
import CarItem from "../../components/services/CarItem.vue";
export default {
  components: {
    "car-item": CarItem,
  },
  onLoad(query) {
    // 去请求数据
    if (query.q) {
      this.getCars(query.q);
    } else {
      this.getCars("法拉利");
    }
  },
  data() {
    return {
      params: {}, // 请求参数
      cars: [], // 汽车
      total: 0, // 总数
      loadStatus: "more", // 加载状态
    };
  },
  methods: {
    async getCars(carName) {
      this.params = { page: 1, pageSize: 20, carName };
      const res = await query(
        this.params.page,
        this.params.pageSize,
        this.params.carName
      );
      // 返回值是个数组，第一个参数是错误对象，第二个是返回的数据
      if (res[0]) {
        // 不为空，弹出一个 toast
        uni.showToast({
          title: "请求汽车失败",
          icon: "none",
        });
        return;
      }
      // 全部汽车
      this.cars = res[1].data.table;
      this.total = res[1].data.total;
    },
    /**
    加载更多 */
    async loadMore() {
      if (this.total <= this.cars.length) {
        // 数量已经够了，没有更多了
        this.loadStatus = "noMore";
        return;
      }
      this.loadStatus = "loading";
      // 往后一页
      this.params.page++;
      const res = await query(
        this.params.page,
        this.params.pageSize,
        this.params.carName
      );
      // 返回值是个数组，第一个参数是错误对象，第二个是返回的数据
      if (res[0]) {
        // 不为空，弹出一个 toast
        uni.showToast({
          title: "请求汽车失败",
          icon: "none",
        });
        this.params.page--;
        this.loadStatus = "more";
        return;
      }
      // 全部汽车
      this.cars.push(...res[1].data.table);
      this.loadStatus = "more";
    },
    updateCar(index) {
      // vue 监听机制存在问题，下面操作为了刷新页面
      this.cars[index] = Object.assign({}, this.cars[index]);
      this.cars = [].concat(this.cars);
    },
  },
};
</script>

<style lang="scss" scoped>
.search {
}
</style>
