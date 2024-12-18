<script setup>
const isEmailAndPasswordValid = ref(false);
const signupRef = ref(null);
const agreementCheck = ref(null);

import distinctList from '../../../public/taiwan_districts.json';
const cityList = computed(() => distinctList.map((item) => item.name));
const resetTown = () => {
  signupRef.value.setFieldValue('行政區', null);
};
const townList = computed(() => {
  if (!signupRef.value) return;
  if (!signupRef.value.values['縣市']) return;
  const selectedCity = distinctList.find((item) => item.name === signupRef.value.values['縣市']);
  return selectedCity.districts;
});

const resetMonDay = () => {
  signupRef.value.setFieldValue('月', '');
  signupRef.value.setFieldValue('日', '');
};
const resetDay = () => { signupRef.value.setFieldValue('日', '')};
const dayList = computed(() => {
  if (!signupRef.value) return;
  const month = signupRef.value.values['月'];
  const year = signupRef.value.values['年']; 
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

const onSubmit = async (value = {}, { resetForm }) => {
  console.log(value);
  const obj = {
    name: value['姓名'],
    email: value['電子信箱'],
    password: value['密碼'],
    phone: value['手機號碼'],
    birthday: `${value['年']}/${value['月']}/${value['日']}`,
    address: {
      zipcode: value['行政區'],
      detail: value['詳細地址'],
    }
  }
};
</script>

<template>
  <NuxtLayout name="account">
    <div class="p-5 px-md-0 py-md-30">
      <div class="mb-10">
        <p class="mb-2 text-primary-100 fs-8 fs-md-7 fw-bold">
          享樂酒店，誠摯歡迎
        </p>
        <h1 class="mb-4 text-neutral-0 fw-bold">
          立即註冊
        </h1>
  
        <div class="d-flex align-items-center py-4 gap-2">
          <div class="d-flex flex-column align-items-center gap-1 text-neutral-0">
            <span
              :class="{'d-none': isEmailAndPasswordValid}"
              class="step p-2 bg-primary-100 rounded-circle"
            >1</span>
            <Icon
              :class="{'d-none': !isEmailAndPasswordValid}"
              class="p-2 fs-3 bg-primary-100 rounded-circle"
              icon="material-symbols:check"
            />
            <p class="mb-0 fs-8 fs-md-7 fw-bold">
              輸入信箱及密碼
            </p>
          </div>
  
          <hr class="flex-grow-1 my-0 border border-neutral-60 opacity-100">
  
          <div
            :class="{
              'text-neutral-0': isEmailAndPasswordValid, 'text-neutral-60': !isEmailAndPasswordValid
            }"
            class="d-flex flex-column align-items-center gap-1"
          >
            <span
              :class="{
                'bg-primary-100': isEmailAndPasswordValid, 'bg-transparent border border-neutral-60': !isEmailAndPasswordValid
              }"
              class="step p-2 rounded-circle"
            >2</span>
            <p class="mb-0 fs-8 fs-md-7 fw-bold">
              填寫基本資料
            </p>
          </div>
        </div>
      </div>
  
      <div class="mb-4">
        <Form @submit="onSubmit" ref="signupRef" v-slot="{ errors }">
          <div
            :class="{'d-none': isEmailAndPasswordValid}"
            class="mb-4"
          >
            <div class="mb-4 fs-8 fs-md-7">
              <label
                class="mb-2 text-neutral-0 fw-bold"
                for="email"
              >
                電子信箱
              </label>
              <Field name="電子信箱" v-slot="{ field }" rules="required|email">
                <input
                  id="email"
                  type="email"
                  class="form-control p-4 text-neutral-100 fw-medium border-neutral-40"
                  v-bind="field"
                  placeholder="請輸入電子信箱"
                  :class="{ 'is-invalid': errors['電子信箱'] }"
                >
                <ErrorMessage name="電子信箱" class="invalid-feedback" />
              </Field>
            </div>
            <div class="mb-4 fs-8 fs-md-7">
              <label
                class="mb-2 text-neutral-0 fw-bold"
                for="password"
              >
                密碼
              </label>
              <Field name="密碼" v-slot="{ field }" rules="required">
                <input
                  id="password"
                  type="password"
                  class="form-control p-4 text-neutral-100 fw-medium border-neutral-40"
                  placeholder="請輸入密碼"
                  v-bind="field"
                  :class="{ 'is-invalid': errors['密碼'] }"
                >
                <ErrorMessage name="密碼" class="invalid-feedback" />
              </Field>
            </div>
            <div class="mb-10 fs-8 fs-md-7">
              <label
                class="mb-2 text-neutral-0 fw-bold"
                for="confirmPassword"
              >
                確認密碼
              </label>
              <Field name="確認密碼" v-slot="{ field }" rules="required">
                <input
                  id="confirmPassword"
                  type="password"
                  class="form-control p-4 text-neutral-100 fw-medium border-neutral-40"
                  placeholder="請再輸入一次密碼"
                  v-bind="field"
                  :class="{ 'is-invalid': errors['確認密碼'] }"
                >
                <ErrorMessage name="確認密碼" class="invalid-feedback" />
              </Field>
            </div>
            <button
              class="btn btn-neutral-40 w-100 py-4 text-neutral-60 fw-bold"
              type="button"
              @click="isEmailAndPasswordValid = true"
            >
              下一步
            </button>
          </div>
          <div
            :class="{'d-none': !isEmailAndPasswordValid}"
            class="mb-4"
          >
            <div class="mb-4 fs-8 fs-md-7">
              <label
                class="mb-2 text-neutral-0 fw-bold"
                for="name"
              >
                姓名
              </label>
              <Field
                id="name"
                name="姓名"
                class="form-control p-4 text-neutral-100 fw-medium border-neutral-40  rounded-3"
                placeholder="請輸入姓名"
                type="text"
                rules="required|min:2"
                :class="{ 'is-invalid': errors['姓名'] }"
              />
              <ErrorMessage name="姓名" class="invalid-feedback" />
            </div>
            <div class="mb-4 fs-8 fs-md-7">
              <label
                class="mb-2 text-neutral-0 fw-bold"
                for="phone"
              >
                手機號碼
              </label>
              <Field name="手機號碼" v-slot="{ field }" rules="required|isPhone">
                <input
                  id="phone"
                  type="tel"
                  class="form-control p-4 text-neutral-100 fw-medium border-neutral-40  rounded-3"
                  placeholder="請輸入手機號碼"
                  v-bind="field"
                  :class="{ 'is-invalid': errors['手機號碼'] }"
                >
                <ErrorMessage name="手機號碼" class="invalid-feedback" />
              </Field>
            </div>
            <div class="mb-4 fs-8 fs-md-7">
              <label
                class="mb-2 text-neutral-0 fw-bold"
                for="birth"
              >
                生日
              </label>
              <div
                class="d-flex gap-2"
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
            <div class="mb-4 fs-8 fs-md-7">
              <label
                class="form-label text-neutral-0 fw-bold"
                for="address"
              >
                地址
              </label>
              <div>
                <div
                  class="d-flex gap-2 mb-2"
                >
                  <Field name="縣市" as="select" class="form-select p-4 text-neutral-80 fs-8 fs-md-7 fw-medium rounded-3" :class="{ 'is-invalid': errors['縣市'] }" rules="required" @change="resetTown">
                    <option selected disabled value="">請選擇縣市</option>
                    <option v-for="city in cityList" :key="city" :value="city">{{ city }}</option>
                  </Field>
                  <ErrorMessage name="縣市" class="invalid-feedback" />
                  <Field name="行政區" as="select" class="form-select p-4 text-neutral-80 fs-8 fs-md-7 fw-medium rounded-3" :class="{ 'is-invalid': errors['行政區'] }" rules="required">
                    <option selected disabled value="">請選擇行政區</option>
                    <option v-for="town in townList" :key="town.zip" :value="town.zip">{{ town.name }}</option>
                    <ErrorMessage name="行政區" class="invalid-feedback" />
                  </Field>
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
                  <ErrorMessage name="詳細地址" class="invalid-feedback" />
                </Field>
              </div>
            </div>
          
            <div class="form-check d-flex align-items-end gap-2 mb-10 text-neutral-0">
              <input
                id="agreementCheck"
                class="form-check-input"
                type="checkbox"
                value=""
                v-model="agreementCheck"
              >
              <label
                class="form-check-label fw-bold"
                for="agreementCheck"
              >
                我已閱讀並同意本網站個資使用規範
              </label>
            </div>
            <button
              class="btn btn-primary-100 w-100 py-4 text-neutral-0 fw-bold"
              type="submit"
            >
              完成註冊
            </button>
          </div>
        </Form>
      </div>
  
      <p class="mb-0 fs-8 fs-md-7">
        <span class="me-2 text-neutral-0 fw-medium">已經有會員了嗎？</span>
        <NuxtLink
          to="/account/login"
          class="text-primary-100 fw-bold text-decoration-underline bg-transparent border-0"
        >
          <span>立即登入</span>
        </NuxtLink>
      </p>
    </div>
  </NuxtLayout>
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


input[type="password"] {
  font: small-caption;
  font-size: 1.5rem;
}

input::placeholder {
  color: #909090;
  font-size: 1rem;
  font-weight: 500;

  @include media-breakpoint-down(md) {
    font-size: 14px;
  }
}

.form-check-input {
  width: 1.5rem;
  height: 1.5rem;
}

.form-check-input:checked {
  background-color: #BF9D7D;
  border-color: #BF9D7D;
}

.step {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
}
</style>