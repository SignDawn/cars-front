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
      <input disabled placeholder="法拉利" />
      <!-- 图标 -->
      <uni-icons type="search" :size="22" class="icon"></uni-icons>
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
        <uni-list-item
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
        </uni-list-item>
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
export default {
  data() {
    return {
      swiperCars: [],
      cars: [],
      loadStatus: "more", // 加载状态
    };
  },
  onLoad() {
    this.getCars();
  },
  methods: {
    async getCars() {
      const res = await query(1, 20);
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
     * 传入 car 主要是为了修改值后，样式改变
     */
    displayMore(index) {
      this.cars[index].displayMore = !this.cars[index].displayMore;
      // vue 监听机制存在问题，下面操作为了刷新页面
      this.cars = [].concat(this.cars);
    },
    /**
     * 查看具体的车辆，需要跳转
     */
    seeDetailCar(detailCar) {
      console.log(detailCar);
    },
    /**
    加载更多 */
    loadMore() {
      console.log("加载更多");
      this.loadStatus = "loading";
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
      .item {
        display: flex;
        image {
          width: 240rpx;
          height: 160rpx;
        }
        .infos {
          flex: 1;
          display: flex;
          flex-direction: column;

          margin-left: 20rpx;

          .title {
            color: $uni-color-primary;
          }

          .info {
            margin-top: 10rpx;
            display: flex;
            flex-wrap: wrap;
            .infoItem {
              margin-right: 10rpx;
              font-size: 16rpx;
              display: flex;
            }
          }
        }
      }

      .more {
        display: flex;
        flex-direction: column;
        align-items: center;

        .detail {
          width: 100%;
          font-size: 16rpx;

          .detailCar {
            padding: 10rpx 20rpx;
            margin-top: 15rpx;
            border: 2rpx solid #e8e8e8;
            display: flex;
            justify-content: space-between;

            .price {
              color: $uni-color-primary;
            }
          }
        }
      }
    }
  }
}
</style>
