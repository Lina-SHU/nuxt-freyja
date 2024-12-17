export const useBookingStore = defineStore('booking', () => {
    const bookingInfo = ref({});

    const setBookingInfo = (booking) => {
        bookingInfo.value = booking;
    };

    const userInfo = ref({});
    const setUserInfo = (user) => {
        userInfo.value = user;
    }

    const orderInfo = ref({});
    const setOrderInfo = (order) => {
        orderInfo.value = order
    }
    return {
        bookingInfo,
        setBookingInfo,
        userInfo,
        setUserInfo,
        orderInfo,
        setOrderInfo
    }
});
