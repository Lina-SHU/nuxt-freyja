<script setup>
definePageMeta({
    middleware: ['auth']
});

const { $swal } = useNuxtApp();
import BookingLoading from '@/components/rooms/BookingLoading.vue';
import dayjs from 'dayjs';
const locale = {
  name: 'zh-tw',
  weekdays: '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split('_'),
  weekdaysShort: '日_一_二_三_四_五_六'.split('_'),
  weekdaysMin: '日_一_二_三_四_五_六'.split('_'),
};
dayjs.locale('zh-tw', locale);

const router = useRouter();
const route = useRoute();

const isLoading = ref(false);
const submitButtonRef = ref(null);
const formRef = ref(null);

import distinctList from '../../../public/taiwan_districts.json';
const cityList = computed(() => distinctList.map((item) => item.name));
const resetTown = () => {
  formRef.value.setFieldValue('行政區', null);
};
const townList = computed(() => {
  if (!formRef.value) return;
  if (!formRef.value.values['縣市']) return;
  const selectedCity = distinctList.find((item) => item.name === formRef.value.values['縣市']);
  return selectedCity.districts;
});

// 取得房間詳細資訊
const { data: roomInfo } = await useAPI(`/rooms/${route.params.roomId}`);

// 取得 bookingInfo
const bookingStore = useBookingStore();
const { bookingInfo } = storeToRefs(bookingStore);
const goBack = () => {
  router.back();
}
if(!bookingInfo.value){
    navigateTo('/rooms');
}
// 送出訂單
const confirmBooking = () => {
  submitButtonRef.value.click();
};
const onSubmit = async (value = {}, { resetForm }) => {
  try {
    isLoading.value = true;

    const bookConfirmInfo = {
      roomId: route.params.roomId,
      checkInDate: dayjs(bookingInfo.value.checkInDate).format('YYYY/MM/DD'),
      checkOutDate: dayjs(bookingInfo.value.checkOutDate).format('YYYY/MM/DD'),
      peopleNum: bookingInfo.value.peopleNum,
      userInfo: {
        name: value['姓名'],
        phone: value['手機號碼'],
        email: value['電子信箱'],
        address: {
          zipcode: value['行政區'],
          detail: value['詳細地址']
        }
      }
    };
    const { result } = await use$API('/orders', {
      body: bookConfirmInfo,
      method: 'post'
    });

    if (!result._id) return;
    await navigateTo(`/booking-confirmation/${result._id}`);
    resetForm();
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <main class="pt-18 pt-md-30 bg-neutral-120">
    <section class="py-10 py-md-30 bg-primary-10">
      <div class="container">
        <button
          class="d-flex align-items-baseline gap-2 mb-10 bg-transparent border-0"
          type="button"
          @click="goBack"
        >
          <Icon
            class="fs-5 text-neutral-100"
            icon="mdi:keyboard-arrow-left"
          />
          <h1 class="mb-0 text-neutral-100 fs-3 fw-bold">
            確認訂房資訊
          </h1>
        </button>

        <div class="row gap-10 gap-md-0">
          <div class="col-12 col-md-7">
            <section>
              <h2 class="mb-8 mb-md-10 text-neutral-100 fs-6 fs-md-4 fw-bold">
                訂房資訊
              </h2>
              <div class="d-flex flex-column gap-6">
                <div class="d-flex justify-content-between align-items-center text-neutral-100">
                  <div>
                    <h3 class="title-deco mb-2 fs-7 fw-bold">
                      選擇房型
                    </h3>
                    <p class="mb-0 fw-medium">
                      {{ roomInfo.name }}
                    </p>
                  </div>
                </div>
                <div class="d-flex justify-content-between align-items-center text-neutral-100">
                  <div>
                    <h3 class="title-deco mb-2 fs-7 fw-bold">
                      訂房日期
                    </h3>
                    <p class="mb-2 fw-medium">
                      入住：{{ bookingInfo?.checkInDate && dayjs(bookingInfo?.checkInDate).format('MM 月 DD 日 dddd') }}
                    </p>
                    <p class="mb-0 fw-medium">
                      退房：{{ bookingInfo?.checkOutDate && dayjs(bookingInfo?.checkOutDate).format('MM 月 DD 日 dddd') }}
                    </p>
                  </div>
                </div>
                <div class="d-flex justify-content-between align-items-center text-neutral-100">
                  <div>
                    <h3 class="title-deco mb-2 fs-7 fw-bold">
                      房客人數
                    </h3>
                    <p class="mb-0 fw-medium">
                      {{ bookingInfo?.peopleNum }} 人
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <hr class="my-10 my-md-12 opacity-100 text-neutral-60">

            <section>
              <div class="d-flex justify-content-between align-items-center mb-10">
                <h2 class="mb-0 text-neutral-100 fs-6 fs-md-4 fw-bold">
                  訂房人資訊
                </h2>
                <!-- <button
                  class="text-primary-100 bg-transparent border-0 fw-bold text-decoration-underline"
                  type="button"
                >
                  套用會員資料
                </button> -->
              </div>

              <Form @submit="onSubmit" ref="formRef" v-slot="{ errors }">
                <div class="d-flex flex-column gap-6">
                  <div class="text-neutral-100">
                    <label
                      for="name"
                      class="form-label fs-8 fs-md-7 fw-bold"
                    >姓名</label>
                    <Field
                      id="name"
                      name="姓名"
                      type="text"
                      :class="{ 'is-invalid': errors['姓名'] }"
                      class="form-control p-3 rounded-3"
                      placeholder="請輸入姓名"
                      rules="required|min:2"
                    />
                    <ErrorMessage name="姓名" class="invalid-feedback" />
                  </div>
  
                  <div class="text-neutral-100">
                    <label
                      for="phone"
                      class="form-label fs-8 fs-md-7 fw-bold"
                    >手機號碼</label>
                    <Field name="手機號碼" v-slot="{ field }" rules="required|isPhone">
                      <input id="phone" v-bind="field" type="tel" class="form-control p-3 rounded-3" :class="{ 'is-invalid': errors['手機號碼'] }" placeholder="請輸入手機號碼">
                    </Field>
                    <ErrorMessage name="手機號碼" class="invalid-feedback" />
                  </div>
  
                  <div class="text-neutral-100">
                    <label
                      for="email"
                      class="form-label fs-8 fs-md-7 fw-bold"
                    >電子信箱</label>
                    <Field name="電子信箱" v-slot="{ field }" rules="required|email">
                      <input
                        id="email"
                        type="email"
                        v-bind="field"
                        class="form-control p-4 fs-8 fs-md-7 rounded-3"
                        :class="{ 'is-invalid': errors['電子信箱'] }"
                        placeholder="請輸入電子信箱"
                      >
                    </Field>
                    <ErrorMessage name="電子信箱" class="invalid-feedback" />
                  </div>
  
                  <div class="text-neutral-100">
                    <label
                      for="address"
                      class="form-label fs-8 fs-md-7 fw-bold"
                    >地址</label>
                    <div className="d-flex gap-2 mb-4">
                      <div class="w-50">
                        <Field name="縣市" as="select" class="form-select p-4 text-neutral-80 fs-8 fs-md-7 fw-medium rounded-3" :class="{ 'is-invalid': errors['縣市'] }" rules="required" @change="resetTown">
                          <option selected disabled value="">請選擇縣市</option>
                          <option v-for="city in cityList" :key="city" :value="city">{{ city }}</option>
                        </Field>
                        <ErrorMessage name="縣市" class="invalid-feedback" />
                      </div>
                      <div class="w-50">
                        <Field name="行政區" as="select" class="form-select p-4 text-neutral-80 fs-8 fs-md-7 fw-medium rounded-3" :class="{ 'is-invalid': errors['行政區'] }" rules="required">
                          <option selected disabled value="">請選擇行政區</option>
                          <option v-for="town in townList" :key="town.zip" :value="town.zip">{{ town.name }}</option>
                        </Field>
                        <ErrorMessage name="行政區" class="invalid-feedback" />
                      </div>
                    </div>
                    <Field name="詳細地址" v-slot="{ field }" rules="required">
                      <input
                        id="address"
                        type="text"
                        v-bind="field"
                        class="form-control p-4 fs-8 fs-md-7 rounded-3"
                        :class="{ 'is-invalid': errors['詳細地址'] }"
                        placeholder="請輸入詳細地址"
                      >
                    </Field>
                    <ErrorMessage name="詳細地址" class="invalid-feedback" />
                  </div>
                  <button ref="submitButtonRef" type="submit" class="d-none"></button>
                </div>
              </Form>
            </section>

            <hr class="my-10 my-md-12 opacity-100 text-neutral-60">

            <section>
              <h2 class="mb-8 mb-md-10 text-neutral-100 fs-6 fs-md-4 fw-bold">
                房間資訊
              </h2>
              <div class="d-flex flex-column gap-6">
                <section>
                  <h3 class="title-deco mb-4 mb-md-6 fs-7 fs-md-5 fw-bold">
                    房型基本資訊
                  </h3>
                  <ul class="d-flex gap-4 list-unstyled">
                    <li class="card-info px-4 py-5 bg-neutral-0 border border-primary-40 rounded-3">
                      <Icon
                        class="mb-2 fs-5 text-primary-100"
                        icon="fluent:slide-size-24-filled"
                      />
                      <p class="mb-0 fw-bold text-neutral-80 text-nowrap">
                        {{ roomInfo.areaInfo }}
                      </p>
                    </li>
                    <li class="card-info px-4 py-5 bg-neutral-0 border border-primary-40 rounded-3">
                      <Icon
                        class="mb-2 fs-5 text-primary-100"
                        icon="material-symbols:king-bed"
                      />
                      <p class="mb-0 fw-bold text-neutral-80 text-nowrap">
                        {{ roomInfo.bedInfo }}
                      </p>
                    </li>
                    <li class="card-info px-4 py-5 bg-neutral-0 border border-primary-40 rounded-3">
                      <Icon
                        class="mb-2 fs-5 text-primary-100"
                        icon="ic:baseline-person"
                      />
                      <p class="mb-0 fw-bold text-neutral-80 text-nowrap">
                        2-{{ roomInfo.maxPeople }} 人
                      </p>
                    </li>
                  </ul>
                </section>

                <section>
                  <h3 class="title-deco mb-4 mb-md-6 text-neutral-100 fs-7 fs-md-5 fw-bold">
                    房間格局
                  </h3>
                  <ul class="d-flex flex-wrap gap-6 gap-md-10 p-6 fs-8 fs-md-7 bg-neutral-0 rounded-3 list-unstyled">
                    <li
                      v-for="(layout, index) in roomInfo.layoutInfo"
                      :key="index"
                      class="d-flex gap-2"
                    >
                      <template v-if="layout.isProvide">
                        <Icon
                          class="fs-5 text-primary-100"
                          icon="material-symbols:check"
                        />
                        <p class="mb-0 text-neutral-80 fw-bold">
                          {{ layout.title }}
                        </p>
                      </template>
                    </li>
                  </ul>
                </section>

                <section>
                  <h3 class="title-deco mb-4 mb-md-6 text-neutral-100 fs-7 fs-md-5 fw-bold">
                    房內設備
                  </h3>
                  <ul class="d-flex flex-wrap row-gap-2 column-gap-10 p-6 mb-0 fs-8 fs-md-7 bg-neutral-0 rounded-3 list-unstyled">
                    <li
                      v-for="(facility, index) in roomInfo.facilityInfo"
                      :key="index"
                      class="flex-item d-flex gap-2"
                    >
                      <template v-if="facility.isProvide">
                        <Icon
                          class="fs-5 text-primary-100"
                          icon="material-symbols:check"
                        />
                        <p class="mb-0 text-neutral-80 fw-bold">
                          {{ facility.title }}
                        </p>
                      </template>
                    </li>
                  </ul>
                </section>

                <section>
                  <h3 class="title-deco mb-4 mb-md-6 text-neutral-100 fs-7 fs-md-5 fw-bold">
                    備品提供
                  </h3>
                  <ul class="d-flex flex-wrap row-gap-2 column-gap-10 p-6 mb-0 fs-8 fs-md-7 bg-neutral-0 rounded-3 list-unstyled">
                    <li
                      v-for="(amenity, index) in roomInfo.amenityInfo"
                      :key="index"
                      class="flex-item d-flex gap-2"
                    >
                      <template v-if="amenity.isProvide">
                        <Icon
                          class="fs-5 text-primary-100"
                          icon="material-symbols:check"
                        />
                        <p class="mb-0 text-neutral-80 fw-bold">
                          {{ amenity.title }}
                        </p>
                      </template>
                    </li>
                  </ul>
                </section>
              </div>
            </section>
          </div>

          <div class="col-12 col-md-5">
            <div
              class="confirm-form rounded-3xl d-flex flex-column gap-10 p-6 p-md-10 mx-auto ms-md-auto me-md-0 bg-neutral-0"
            >
              <img
                class="img-fluid rounded-3"
                :src="roomInfo?.imageUrl"
                :alt="roomInfo?.name"
              >

              <div>
                <h2 className="mb-6 text-neutral-100 fs-6 fs-md-4 fw-bold">
                  價格詳情
                </h2>
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <div class="d-flex align-items-center text-neutral-100 fw-medium">
                    <span>NT$ <span v-currency="roomInfo?.price"></span></span>
                    <Icon
                      class="ms-2 me-1 text-neutral-80"
                      icon="material-symbols:close"
                    />
                    <span class="text-neutral-80">{{ bookingInfo?.daysCount }} 晚</span>
                  </div>
                  <span class="fw-medium">
                    NT$ <span v-currency="roomInfo.price * bookingInfo?.daysCount"></span>
                  </span>
                </div>
                <!-- <div class="d-flex justify-content-between align-items-center fw-medium">
                  <p class="d-flex align-items-center mb-0 text-neutral-100">
                    住宿折扣
                  </p>
                  <span class="text-primary-100">
                    -NT$ 1,000
                  </span>
                </div> -->
                <hr class="my-6 opacity-100 text-neutral-40">
                <div class="d-flex justify-content-between align-items-center text-neutral-100 fw-bold">
                  <p class="d-flex align-items-center mb-0">
                    總價
                  </p>
                  <span>
                    NT$ <span v-currency="roomInfo.price * bookingInfo?.daysCount"></span>
                  </span>
                </div>
              </div>

              <button
                class="btn btn-primary-100 py-4 text-neutral-0 fw-bold rounded-3"
                type="button"
                @click="confirmBooking"
              >
                確認訂房
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <BookingLoading v-if="isLoading" />
  </main>
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

.title-deco {
  display: flex;
  align-items: center;
}

.title-deco::before {
  content: '';
  display: inline-block;
  width: 4px;
  height: 24px;
  background-color: #BF9D7D;
  border-radius: 10px;
  margin-right: 0.75rem;
}

.form-control::placeholder {
  --neutral-60: #909090;
  color: var(--neutral-60);
  font-weight: 500;
}

.card-info {
  width: 97px;
  height: 97px;
}

.flex-item {
  flex: 1 1 15%;

  @include media-breakpoint-down(md) {
    flex-basis: 40%;
  }
}

.rounded-3xl {
  border-radius: 1.25rem;
}

.confirm-form {
  position: sticky;
  top: 160px;
  max-width: 478px;

  @include media-breakpoint-down(md) {
    position: static;
    top: 0;
    max-width: auto;
  }
}

</style>