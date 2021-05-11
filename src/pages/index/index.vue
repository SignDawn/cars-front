<template>
  <view class="home">
    <view class="status_bar">
      <!-- 这里是状态栏 -->
    </view>
    <!-- 内容区 -->
    <!-- 头部搜索栏 -->
    <view class="top_search">
      <text>C</text>
      <!-- 输入框 -->
      <input placeholder="法拉利" v-model="searchValue" />
      <!-- 图标 -->
      <uni-icons
        type="search"
        :size="22"
        class="icon"
        @click="searchCar"
      ></uni-icons>
    </view>
    <!-- 轮播图 -->
    <swiper class="swiper" indicator-dots autoplay circular>
      <swiper-item class="item" v-for="(img, index) in swiperCars" :key="index">
        <image :src="img" mode="aspectFill"
      /></swiper-item>
    </swiper>
    <!-- 内容列表 -->
    <view class="content">
      <view class="title">汽车</view>
      <uni-list :border="false" class="list">
        <template v-for="(car, index) in cars">
          <car-item
            :key="index"
            :car="car"
            :carIndex="index"
            @updateCar="updateCar"
          ></car-item>
        </template>
        <!-- <uni-list-item
          v-for="(car, index) in cars"
          :key="index"
          direction="column"
        >
          <template slot="body">
            <view class="item">
              <image :src="car.img" mode="aspectFill" />
              <view class="infos">
                <text class="title">{{ car.carName }}</text>
                <view class="info">
                  <view
                    v-for="(item, index) in car.infos"
                    :key="index"
                    class="infoItem"
                  >
                    <template v-if="item.key && item.value">
                      <text v-html="item.key"> </text>
                      ：
                      <text>{{ item.value }}</text>
                    </template>
                  </view>
                </view>
              </view>
            </view>
          </template>
          <template slot="footer">
            <view class="more">
              <uni-icons
                :type="car.displayMore ? 'arrowup' : 'arrowdown'"
                :size="22"
                class="icon"
                color="#1afa29"
                @click="displayMore(index)"
              ></uni-icons>
              <view v-show="car.displayMore" class="detail">
                <view
                  v-for="(detailCar, index2) in car.specificCars"
                  :key="index2"
                  class="detailCar"
                  @click="seeDetailCar(detailCar)"
                >
                  <text> {{ detailCar.carName }}</text>
                  <text class="price"> {{ detailCar.price }}</text>
                </view>
              </view>
            </view>
          </template>
        </uni-list-item> -->
        <uni-load-more
          :status="loadStatus"
          @clickLoadMore="loadMore"
        ></uni-load-more>
      </uni-list>
    </view>
  </view>
</template>

<script>
import { query } from "../../network/homeApi";
import CarItem from "../../components/services/CarItem.vue";
export default {
  components: {
    "car-item": CarItem,
  },
  data() {
    return {
      swiperCars: [],
      cars: [],
      loadStatus: "more", // 加载状态
      params: {}, // 参数对象
      searchValue: "", // 搜索值
      total: 0, // 总数
    };
  },
  onLoad() {
    this.getCars();
  },
  methods: {
    async getCars() {
      this.params = { page: 1, pageSize: 20 };
      const res = await query(this.params.page, this.params.pageSize);
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
      // 成功，配置轮播图，只取前五个
      this.swiperCars = this.cars.slice(0, 5).map((item) => {
        // 切换改变清晰度
        item.img = item.img.replace("120x90", "360x270");
        return item.img;
      });
    },
    /**
     * 查看具体的车辆，需要跳转
     */
    seeDetailCar(detailCar) {
      console.log(detailCar);
    },
    updateCar(index) {
      // vue 监听机制存在问题，下面操作为了刷新页面
      this.cars[index] = Object.assign({}, this.cars[index]);
      this.cars = [].concat(this.cars);
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
      const res = await query(this.params.page, this.params.pageSize);
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
    searchCar() {
      // 跳转新页，新页面中去加载对应数据
      uni.navigateTo({ url: `/pages/search/search?q=${this.searchValue}` });
    },
  },
};
</script>

<style lang="scss" scoped>
.home {
  .status_bar {
    // 状态栏
    height: var(--status-bar-height);
    width: 100%;
    background-color: $uni-color-primary; // TODO: 后续注释该内容试试 配置状态栏颜色
  }

  .top_search {
    display: flex;
    // justify-content: space-around;
    align-items: center;
    background-color: $uni-color-primary; // 配置状态栏颜色
    height: 80rpx;
    text {
      margin-left: 20rpx;
    }

    input {
      flex: 1;
      font-size: 20rpx;
      height: 60rpx;
      margin-left: 40rpx;
      padding-left: 25rpx;
      margin-right: 20rpx;
      border-radius: 20rpx;
      background-color: #fff;
    }
    .icon {
      margin-right: 20rpx;
    }
  }

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
    > .title {
      height: 100rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      color: $uni-color-primary;
      border-bottom: 2rpx solid #e8e8e8;
    }

    .list {
    }
  }
}
</style>
