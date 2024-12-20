<script setup>
definePageMeta({
  middleware: ['auth'],
  layout: 'user'
});

import dayjs from 'dayjs';
const { $swal, $showModal } = useNuxtApp();
const cancelModal = ref(null);
onMounted(() => {
  cancelModal.value = $showModal(document.getElementById('cancelModal'));
});
const closeModal = () => { cancelModal.value.hide(); };

const locale = {
  name: 'zh-tw',
  weekdays: '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split('_'),
  weekdaysShort: '日_一_二_三_四_五_六'.split('_'),
  weekdaysMin: '日_一_二_三_四_五_六'.split('_'),
};
dayjs.locale('zh-tw', locale);

const orderHistorylist = ref([]);
const orderShowHistorylist = ref([]);
const orderShowlist = ref([]);
// 取得訂單列表
const { data: orderList } = await useAPI(`/orders`);
const setOrderList = (list) => {
  // 分最新及歷史訂單
  orderHistorylist.value  = list.filter((item) => item.status !== 0);
  orderShowlist.value = list.filter((item) => item.status === 0);
  orderShowHistorylist.value = orderHistorylist.value.length > 3 ? orderHistorylist.value.splice(0, 3) : orderHistorylist.value;
};
setOrderList(orderList.value);

const daysCount = (startDate, endDate) => {
  if (startDate === null || endDate === null) return 0;
  const differenceTime = new Date(endDate).getTime() - new Date(startDate).getTime();
  const differenceDay = Math.round(differenceTime / (1000 * 60 * 60 * 24));
  return differenceDay;
};
const tempOrderId = ref(null);
const getCancelOrder = (id) => { tempOrderId.value = id, cancelModal.value.show(); };
const cancelOrder = async () => {
  await use$API(`/orders/${tempOrderId.value}`, {
      method: 'delete'
  });
  $swal.fire({
      position: "center",
      icon: 'success',
      title: '取消成功！',
      showConfirmButton: false,
      timer: 1500
  });
  tempOrderId.value = null;
  const { result } = await use$API(`/orders`);
  setOrderList(result);
  closeModal();
};

const showMore = () => {
  orderShowHistorylist.value = orderHistorylist.value;
};

useSeoMeta({
  title: 'Freyja | 訂單資料',
  description: 'Freyja 訂單，提醒您即將到來的期待，享受獨特的住宿體驗！',
  ogTitle: 'Freyja | 訂單資料',
  ogDescription: 'Freyja 訂單，提醒您即將到來的期待，享受獨特的住宿體驗！',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Freyja | 訂單資料',
  twitterDescription: 'Freyja 訂單，提醒您即將到來的期待，享受獨特的住宿體驗！'
});
</script>

<template>
  <div>
    <div class="row gap-6 gap-md-0">
      <div class="col-12 col-md-7">
        <template v-if="orderShowlist && orderShowlist.length > 0">
          <template v-for="newOrder in orderShowlist" :key="newOrder._id">
            <div
              class="rounded-3xl d-flex flex-column gap-6 gap-md-10 p-4 p-md-10 bg-neutral-0 mb-2"
              style="max-width: 730px;"
            >
              <div>
                <p class="mb-2 text-neutral-80 fs-8 fs-md-7 fw-medium">
                  預訂參考編號： {{ newOrder?._id }}
                </p>
                <h2 class="mb-0 text-neutral-100 fs-7 fs-md-5 fw-bold">
                  即將來的行程
                </h2>
              </div>
      
              <img
                class="img-fluid rounded-3"
                :src="newOrder?.roomId?.imageUrl"
                :alt="newOrder?.roomId?.name"
              >
      
              <section class="d-flex flex-column gap-6">
                <h3 class="d-flex align-items-center mb-0 text-neutral-80 fs-8 fs-md-6 fw-bold">
                  <p class="mb-0">
                    {{ newOrder?.roomId?.name }}，{{ newOrder?.checkInDate && daysCount(newOrder?.checkInDate, newOrder?.checkOutDate) }} 晚
                  </p>
                  <span
                    class="d-inline-block mx-4 bg-neutral-80"
                    style="width: 1px;height: 18px;"
                  />
                  <p class="mb-0">
                    住宿人數：{{ newOrder?.peopleNum }} 位
                  </p>
                </h3>
      
                <div class="text-neutral-80 fs-8 fs-md-7 fw-bold">
                  <p class="title-deco mb-2">
                    入住：{{ newOrder?.checkInDate && dayjs(newOrder?.checkInDate).format('MM 月 DD 日 dddd') }}，15:00 可入住
                  </p>
                  <p
                    class="title-deco mb-0"
                  >
                    退房：{{ newOrder?.checkOutDate && dayjs(newOrder?.checkOutDate).format('MM 月 DD 日 dddd') }}，12:00 前退房
                  </p>
                </div>
      
                <p class="mb-0 text-neutral-80 fs-8 fs-md-7 fw-bold">
                  NT$ <span v-currency="newOrder?.roomId?.price * daysCount(newOrder?.checkInDate, newOrder?.checkOutDate)"></span>
                </p>
              </section>
      
              <hr class="my-0 opacity-100 text-neutral-40">
      
              <section>
                <h3 class="title-deco mb-6 text-neutral-100 fs-8 fs-md-7 fw-bold">
                  房內設備
                </h3>
                <ul class="d-flex flex-wrap row-gap-2 column-gap-10 p-6 mb-0 fs-8 fs-md-7 bg-neutral-0 border border-neutral-40 rounded-3 list-unstyled">
                  <li
                    v-for="(facility, index) in newOrder?.roomId?.facilityInfo"
                    :key="index"
                    class="flex-item d-flex gap-2"
                  >
                    <Icon
                      class="fs-5 text-primary-100"
                      icon="material-symbols:check"
                    />
                    <p class="mb-0 text-neutral-80 fw-bold">
                      {{ facility.title }}
                    </p>
                  </li>
                </ul>
              </section>
      
              <section>
                <h3 class="title-deco mb-6 text-neutral-100 fs-8 fs-md-7 fw-bold">
                  備品提供
                </h3>
                <ul class="d-flex flex-wrap row-gap-2 column-gap-10 p-6 mb-0 fs-8 fs-md-7 bg-neutral-0 border border-neutral-40 rounded-3 list-unstyled">
                  <li
                    v-for="(amenity, index) in newOrder?.roomId?.amenityInfo"
                    :key="index"
                    class="flex-item d-flex gap-2"
                  >
                    <Icon
                      class="fs-5 text-primary-100"
                      icon="material-symbols:check"
                    />
                    <p class="mb-0 text-neutral-80 fw-bold">
                      {{ amenity.title }}
                    </p>
                  </li>
                </ul>
              </section>
      
              <div class="d-flex gap-4">
                <button
                  class="btn btn-outline-primary-100 w-50 py-4 fw-bold"
                  style="--bs-btn-hover-color: #fff"
                  type="button"
                  @click="getCancelOrder(newOrder?._id)"
                >
                  取消預訂
                </button>
                <NuxtLink
                  :to="`/rooms/${newOrder?.roomId?._id}`"
                  class="btn btn-primary-100 text-neutral-0 w-50 py-4 fw-bold"
                  type="button"
                >
                  查看詳情
                </NuxtLink>
              </div>
            </div>
          </template>
        </template>
        <template v-else>
          <div
            class="rounded-3xl d-flex flex-column gap-6 gap-md-10 p-4 p-md-10 bg-neutral-0 mb-2"
            style="max-width: 730px;"
          >
            <h2 class="mb-0 text-neutral-100 fs-7 fs-md-5 fw-bold">
              無即將到來的行程
            </h2>
          </div>
        </template>
      </div>
      <div class="col-12 col-md-5">
        <div
          class="rounded-3xl d-flex flex-column gap-6 gap-md-10 p-4 p-md-10 bg-neutral-0"
        >
          <h2 class="mb-0 text-neutral-100 fs-7 fs-md-5 fw-bold">
            歷史訂單
          </h2>
          
          <template v-if="orderHistorylist && orderHistorylist.length > 0">
            <template v-for="order in orderShowHistorylist" :key="order._id">
              <div class="d-flex flex-column flex-lg-row gap-6">
                <img
                  class="img-fluid object-fit-cover rounded-3"
                  style="max-width: 120px; height: 80px;"
                  :src="order?.roomId?.imageUrl"
                  :alt="order?.roomId?.name"
                >
                <section class="d-flex flex-column gap-4">
                  <p class="mb-0 text-neutral-80 fs-8 fs-md-7 fw-medium">
                    預訂參考編號： {{ order?._id }}
                  </p>
                
                  <h3 class="d-flex align-items-center mb-0 text-neutral-80 fs-8 fs-md-6 fw-bold">
                    {{ order?.roomId?.name }}
                  </h3>
      
                  <div class="text-neutral-80 fw-medium">
                    <p class="mb-2">
                      住宿天數： {{ order?.checkInDate && daysCount(order?.checkInDate, order?.checkOutDate) }} 晚
                    </p>
                    <p class="mb-0">
                      住宿人數：{{ order?.peopleNum }} 位
                    </p>
                  </div>
      
                  <div class="text-neutral-80 fs-8 fs-md-7 fw-medium">
                    <p class="title-deco mb-2">
                      入住：{{ order?.checkInDate && dayjs(order?.checkInDate).format('MM 月 DD 日 dddd') }}，15:00 可入住
                    </p>
                    <p
                      class="title-deco mb-0"
                    >
                      退房：{{ order?.checkOutDate && dayjs(order?.checkOutDate).format('MM 月 DD 日 dddd') }}，12:00 前退房
                    </p>
                  </div>
                  <p class="mb-0 text-neutral-80 fs-8 fs-md-7 fw-bold">
                    NT$ <span v-currency="order?.roomId?.price * daysCount(order?.checkInDate, order?.checkOutDate)"></span>
                  </p>
                </section>
              </div>
              <hr class="my-0 opacity-100 text-neutral-40">
            </template>   
    
            <button
              v-if="orderHistorylist.length !== orderShowHistorylist.length"
              class="btn btn-outline-primary-100 py-4 fw-bold"
              style="--bs-btn-hover-color: #fff"
              type="button"
              @click="showMore"
            >
              查看更多
            </button>
          </template>
          <template v-else>
            <p>無歷史訂單</p>
          </template>
        </div>
      </div>
    </div>
  
    <div
      id="cancelModal"
      class="modal fade"
      tabindex="-1"
    >
      <div class="modal-dialog modal-dialog-centered align-items-end align-items-md-center m-0 mx-md-auto h-100">
        <div class="modal-content">
          <div class="modal-header">
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            />
          </div>
          <div class="modal-body mx-auto my-10 my-md-15 text-neutral-80 fs-8 fs-md-6 fw-bold">
            確定要取消此房型的預訂嗎？
          </div>
          <div class="modal-footer d-flex gap-4">
            <button
              type="button"
              class="btn btn-outline-primary-100 flex-grow-1 m-0 py-4 fw-bold"
              @click="closeModal"
            >
              關閉視窗
            </button>
            <button
              type="button"
              class="btn btn-primary-100 flex-grow-1 m-0 py-4 text-white fw-bold"
              @click="cancelOrder"
            >
              確定取消
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "bootstrap/scss/mixins/breakpoints";

$grid-breakpoints: (
  xs: 0,
  sm: 576px,
  md: 768px,
  lg: 992px,
  xl: 1200px,
  xxl: 1400px,
  xxxl: 1537px
);


.rounded-3xl {
  border-radius: 1.25rem;
}

.title-deco {
  display: flex;
  align-items: center;
}

.title-deco::before {
  --color: #BF9D7D;
  content: '';
  display: inline-block;
  width: 4px;
  height: 24px;
  background-color: var(--color);
  border-radius: 10px;
  margin-right: 0.75rem;
}

.title-deco:nth-child(2)::before {
  --color: #909090;
}

.flex-item {
  max-width: 97px;
  width: 100%;
  white-space: nowrap;
}


.modal {
  backdrop-filter: blur(10px);

  @include media-breakpoint-down(md) {
    backdrop-filter: none;
  }
}

.modal-header {
  @include media-breakpoint-down(md) {
    border-bottom: 0 !important;
  }
}

.modal-content {
  @include media-breakpoint-down(md) {
    border-bottom-left-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
  }
}
</style>