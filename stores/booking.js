export const useBookingStore = defineStore('booking', () => {
    const bookingInfo = ref(null);

    const setBookingInfo = (booking) => {
        bookingInfo.value = booking;
    };

    const userInfo = ref(null);
    const setUserInfo = (user) => {
        userInfo.value = user;
    }

    return {
        bookingInfo,
        setBookingInfo,
        userInfo,
        setUserInfo
    }
},
{
    persist: true
});
