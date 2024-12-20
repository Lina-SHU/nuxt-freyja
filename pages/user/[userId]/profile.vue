<script setup>
definePageMeta({
    middleware: ['auth']
});

import dayjs from 'dayjs';
const { $swal } = useNuxtApp();
const route = useRoute();
const changeMimaRef = ref(null);
const profileRef = ref(null);

const isEditPassword = ref(false);
const isEditProfile = ref(false);

import distinctList from '../../../public/taiwan_districts.json';
const cityList = computed(() => distinctList.map((item) => item.name));
const resetTown = () => {
  profileRef.value.setFieldValue('行政區', null);
};
const townList = computed(() => {
  if (!profileRef.value) return;
  if (!profileRef.value.values['縣市']) return;
  const selectedCity = distinctList.find((item) => item.name === profileRef.value.values['縣市']);
  return selectedCity.districts;
});

const setUserInfo = (info) => {
  const { zipcode } = info.address;
  distinctList.forEach((city) => {
    city.districts.forEach((town) => {
      if (town.zip === zipcode.toString()) {
        info.address.city = city.name;
        info.address.county = town.name;
      }
    })
  });
  const birthday = new Date(info.birthday);
  info.year = birthday.getFullYear();
  info.month = birthday.getMonth() + 1;
  info.day = birthday.getDate();
};

// 取得個人資料
const userInfo = ref(null);
const { data } = await useAPI('/user');
userInfo.value = data.value;
setUserInfo(userInfo.value);

onMounted(() => {
  profileRef.value.setFieldValue('姓名', userInfo.value.name);
  profileRef.value.setFieldValue('手機號碼', userInfo.value.phone);
  profileRef.value.setFieldValue('縣市', userInfo.value.address.city);
  profileRef.value.setFieldValue('行政區', userInfo.value.address.zipcode);
  profileRef.value.setFieldValue('詳細地址', userInfo.value.address.detail);
  profileRef.value.setFieldValue('年', new Date(userInfo.value.birthday).getFullYear());
  profileRef.value.setFieldValue('月', new Date(userInfo.value.birthday).getMonth() + 1);
  profileRef.value.setFieldValue('日', new Date(userInfo.value.birthday).getDate());
});

const resetMonDay = () => {
  profileRef.value.setFieldValue('月', '');
  profileRef.value.setFieldValue('日', '');
};
const resetDay = () => { profileRef.value.setFieldValue('日', '')};
const dayList = computed(() => {
  if (!profileRef.value) return;
  const month = profileRef.value.values['月'];
  const year = profileRef.value.values['年']; 
  // 大月. 小月
  if ([1, 3, 5, 7, 8, 10, 12].includes(month)) {
    return 31;
  } else if ([4, 6, 9, 11].includes(month)) {
    return 30;
  } else if (month === 2) {
    // 判斷閏年條件
    if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
      return 29;
    } else {
      return 28;
    }
  } else {
    return 0;
  }
});
// 修改密碼
const changeMima = async (value = {}, { resetForm }) => {
  const mimaInfo = {
    userId: route.params.userId,
    oldPassword: value['舊密碼'],
    newPassword: value['新密碼']
  }
  const { status } = await use$API('/user', {
      body: mimaInfo,
      method: 'put'
  });
  if (!status) return;
  $swal.fire({
      position: "center",
      icon: 'success',
      title: '密碼變更成功，下次請用新密碼登入！'
  });
  resetForm();
  isEditPassword.value = false;
};

// 修改個人資訊
const editProfile = async (value = {}, { resetForm }) => {
  const info = {
    userId: route.params.userId,
    name: value['姓名'],
    phone: value['手機號碼'],
    birthday: `${value['年']}/${value['月']}/${value['日']}`,
    address: { zipcode: value['行政區'], detail: value['詳細地址'] }
  };
  const { status, result } = await use$API('/user', {
      body: info,
      method: 'put'
  });

  if (!status) return;
  $swal.fire({
      position: "center",
      icon: 'success',
      title: '更新成功！'
  });
  userInfo.value = result;
  setUserInfo(userInfo.value);
  isEditProfile.value = false;
};

useSeoMeta({
  title: 'Freyja | 會員資料',
  description: '填妥 Freyja 會員資料，不定期享 Freyja 提供的各項優惠，享受獨特的住宿體驗！',
  ogTitle: 'Freyja | 會員資料',
  ogDescription: '填妥 Freyja 會員資料，不定期享 Freyja 提供的各項優惠，享受獨特的住宿體驗！',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Freyja | 會員資料',
  twitterDescription: '填妥 Freyja 會員資料，不定期享 Freyja 提供的各項優惠，享受獨特的住宿體驗！'
});
</script>

<template>
  <NuxtLayout name="user">
    <div class="row gap-6 gap-md-0">
      <div class="col-12 col-md-5">
        <section class="rounded-3xl d-flex flex-column gap-6 gap-md-10 p-6 p-md-10 bg-neutral-0">
          <h2 class="fs-6 fs-md-5 fw-bold">
            修改密碼
          </h2>
          <div class="d-flex flex-column gap-4 gap-md-6">
            <div class="fs-8 fs-md-7">
              <p class="mb-2 text-neutral-80 fw-medium">
                電子信箱
              </p>
              <span
                class="form-control pe-none p-0 text-neutral-100 fw-bold border-0"
              >{{ userInfo?.email }}</span>
            </div>
  
            <div
              class="d-flex justify-content-between align-items-center"
              :class="{'d-none': isEditPassword}"
            >
              <div>
                <label class="mb-0 text-neutral-80 fs-8 fs-md-7 fw-medium">
                  密碼
                </label>
                <input
                  class="form-control pe-none p-0 text-neutral-100 fs-5 fs-md-3 fw-bold border-0"
                  type="password"
                  value="**********"
                >
              </div>
  
              <button
                class="flex-shrink-0 text-primary-100 fs-8 fs-md-7 fw-bold text-decoration-underline border-0 bg-transparent"
                type="button"
                @click="isEditPassword = !isEditPassword"
              >
                重設
              </button>
            </div>
  
            <div
              class="d-flex flex-column gap-4 gap-md-6"
              :class="{'d-none': !isEditPassword}"
            >
              <Form @submit="changeMima" ref="changeMimaRef" v-slot="{ errors }">
                <div class="mb-3">
                  <label
                    for="oldPassword"
                    class="form-label fs-8 fs-md-7 fw-bold"
                  >舊密碼</label>
                  <Field name="舊密碼" v-slot="{ field }" rules="required|isMima">
                    <input
                      id="oldPassword"
                      type="password"
                      v-bind="field"
                      :autocomplete="true"
                      class="form-control p-4 fs-7 rounded-3"
                      placeholder="請輸入舊密碼"
                      :class="{ 'is-invalid': errors['舊密碼'] }"
                    >
                    <ErrorMessage name="舊密碼" class="invalid-feedback" />
                  </Field>
                </div>
    
                <div class="mb-3">
                  <label
                    for="newPassword"
                    class="form-label fs-8 fs-md-7 fw-bold"
                  >新密碼</label>
                  <Field name="新密碼" v-slot="{ field }" rules="required|isMima">
                    <input
                      id="newPassword"
                      type="password"
                      v-bind="field"
                      :autocomplete="true"
                      class="form-control p-4 fs-7 rounded-3"
                      placeholder="請輸入新密碼"
                      :class="{ 'is-invalid': errors['新密碼'] }"
                    >
                    <ErrorMessage name="新密碼" class="invalid-feedback" />
                  </Field>
                </div>
    
                <div class="mb-3">
                  <label
                    for="confirmPassword"
                    class="form-label fs-8 fs-md-7 fw-bold"
                  >確認新密碼</label>
                  <Field name="確認新密碼" v-slot="{ field }" rules="required|isMima">
                    <input
                      id="confirmPassword"
                      type="password"
                      v-bind="field"
                      :autocomplete="true"
                      class="form-control p-4 fs-7 rounded-3"
                      placeholder="請再輸入一次新密碼"
                    >
                    <ErrorMessage name="確認新密碼" class="invalid-feedback" />
                  </Field>
                </div>
                
                <button
                  class="btn btn-neutral-40 align-self-md-start px-8 py-4 text-neutral-60 rounded-3"
                  type="submit"
                >
                  儲存設定
                </button>
              </Form>
            </div>
  
          </div>
        </section>
      </div>
  
      <div class="col-12 col-md-7">
        <section class="rounded-3xl d-flex flex-column gap-6 gap-md-10 p-6 p-md-10 bg-neutral-0">
          <h2 class="fs-6 fs-md-5 fw-bold">
            基本資料
          </h2>
          <Form @submit="editProfile" ref="profileRef" v-slot="{ errors }">
            <div class="d-flex flex-column gap-4 gap-md-6">
              <div class="fs-8 fs-md-7">
                <label
                  class="form-label"
                  :class="{'fw-bold text-neutral-100': isEditProfile, 'fw-medium text-neutral-80': !isEditProfile}"
                  for="name"
                >
                  姓名
                </label>
                <Field
                  id="name"
                  name="姓名"
                  type="text"
                  class="form-control text-neutral-100 fw-bold"
                  :class="{'pe-none p-0 border-0': !isEditProfile, 'p-4': isEditProfile, 'is-invalid': errors['姓名'] }"
                  rules="required|min:2"
                />
                <ErrorMessage name="姓名" class="invalid-feedback" />
              </div>
    
              <div class="fs-8 fs-md-7">
                <label
                  class="form-label"
                  :class="{'fw-bold text-neutral-100': isEditProfile, 'text-neutral-80': !isEditProfile}"
                  for="phone"
                >
                  手機號碼
                </label>
                <Field name="手機號碼" v-slot="{ field }" rules="required">
                  <input
                    id="phone"
                    name="手機號碼"
                    v-bind="field"
                    class="form-control text-neutral-100 fw-bold"
                    :class="{'pe-none p-0 border-0': !isEditProfile, 'p-4': isEditProfile, 'is-invalid': errors['手機號碼']}"
                    type="tel"
                  >
                  <ErrorMessage name="手機號碼" class="invalid-feedback" />
                </Field>
              </div>
    
              <div class="fs-8 fs-md-7">
                <label
                  class="form-label"
                  :class="{'fw-bold text-neutral-100': isEditProfile, 'fw-medium text-neutral-80': !isEditProfile}"
                  for="birth"
                >
                  生日
                </label>
                <span
                  class="form-control pe-none p-0 text-neutral-100 fw-bold border-0"
                  :class="{'d-none': isEditProfile}"
                >{{ userInfo?.birthday && dayjs(userInfo?.birthday).format('YYYY 年 MM 月 DD 日') }}</span>
                <div
                  class="d-flex gap-2"
                  :class="{'d-none': !isEditProfile}"
                >
                  <div class="flex-fill">
                    <Field name="年" as="select" class="form-select p-4 text-neutral-80 fw-medium rounded-3" :class="{ 'is-invalid': errors['年'] }" rules="required" @change="resetMonDay">
                      <option
                        v-for="year in 65"
                        :key="year"
                        :value="year + 1958"
                      >
                        {{ year + 1958 }} 年
                      </option>
                    </Field>
                    <ErrorMessage name="年" class="invalid-feedback" />
                  </div>
                  <div class="flex-fill">
                    <Field name="月" as="select" class="form-select p-4 text-neutral-80 fw-medium rounded-3" :class="{ 'is-invalid': errors['月'] }" rules="required" @change="resetDay">
                      <option
                        v-for="month in 12"
                        :key="month"
                        :value="month"
                      >
                        {{ month }} 月
                      </option>
                    </Field>
                    <ErrorMessage name="月" class="invalid-feedback" />
                  </div>
                  <div class="flex-fill">
                    <Field name="日" as="select" class="form-select p-4 text-neutral-80 fw-medium rounded-3" :class="{ 'is-invalid': errors['日'] }" rules="required">
                      <option
                        v-for="day in dayList"
                        :key="day"
                        :value="day"
                      >
                        {{ day }} 日
                      </option>
                    </Field>
                    <ErrorMessage name="日" class="invalid-feedback" />
                  </div>
                </div>
              </div>
    
              <div class="fs-8 fs-md-7">
                <label
                  class="form-label"
                  :class="{'fw-bold text-neutral-100': isEditProfile, 'fw-medium text-neutral-80': !isEditProfile}"
                  for="address"
                >
                  地址
                </label>
                <span
                  class="form-control pe-none p-0 text-neutral-100 fw-bold border-0 mb-3"
                  :class="{'d-none': isEditProfile}"
                >{{ userInfo?.address?.city }}{{ userInfo?.address?.county }}{{ userInfo?.address?.detail }}</span>
                <div :class="{'d-none': !isEditProfile}">
                  <div
                    class="d-flex gap-2 mb-2"
                  >
                    <div class="flex-fill">
                      <Field name="縣市" as="select" class="form-select p-4 text-neutral-80 fw-medium rounded-3" :class="{ 'is-invalid': errors['縣市'] }" rules="required" @change="resetTown">
                        <option selected disabled value="">請選擇縣市</option>
                        <option v-for="city in cityList" :key="city" :value="city">{{ city }}</option>
                      </Field>
                      <ErrorMessage name="縣市" class="invalid-feedback" />
                    </div>
                    <div class="flex-fill">
                      <Field name="行政區" as="select" class="form-select p-4 text-neutral-80 fw-medium rounded-3" :class="{ 'is-invalid': errors['行政區'] }" rules="required">
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
                      class="form-control p-4 rounded-3"
                      placeholder="請輸入詳細地址"
                      :class="{ 'is-invalid': errors['詳細地址'] }"
                    >
                  </Field>
                  <ErrorMessage name="詳細地址" class="invalid-feedback" />
                </div>
              </div>
            </div>
            <button
              :class="{'d-none': isEditProfile}"
              class="btn btn-outline-primary-100 align-self-start px-8 py-4 rounded-3 mt-3"
              type="button"
              @click="isEditProfile = !isEditProfile"
            >
              編輯
            </button>
    
            <button
              :class="{'d-none': !isEditProfile}"
              class="btn btn-neutral-40 align-self-md-start px-8 py-4 text-neutral-60 rounded-3 mt-3"
              type="submit"
            >
              儲存設定
            </button>
          </Form>
        </section>
      </div>
    </div>
  </NuxtLayout>
</template>

<style lang="scss" scoped>
.rounded-3xl {
  border-radius: 1.25rem;
}

input[type="password"] {
  font: small-caption;
}

.form-control::placeholder {
  --neutral-60: #909090;
  color: var(--neutral-60);
  font-weight: 500;
}
</style>