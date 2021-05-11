<template>
  <uni-list-item direction="column">
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
          @click="displayMore()"
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
</template>

<script>
export default {
  props: {
    car: {
      type: Object,
      default() {
        return {};
      },
    },
    // 外界传入，为了传出后让外界修改对应值
    carIndex: {
      type: Number,
    },
  },
  methods: {
    /**
     * 传入 car 主要是为了修改值后，样式改变
     */
    displayMore() {
      this.car.displayMore = !this.car.displayMore;
      //   通知外界更改
      this.$emit("updateCar", this.carIndex);
    },
    /**
     * 查看具体的车辆，需要跳转 TODO:
     */
    seeDetailCar(detailCar) {
      uni.navigateTo({
        url: `/pages/detail/detail?detailId=${detailCar.detailId}`,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
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
</style>
