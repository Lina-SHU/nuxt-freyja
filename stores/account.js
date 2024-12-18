export const useAccountStore = defineStore('account', () => {
    const accountInfo = ref(null);

    const setAccountInfo = (account) => {
        accountInfo.value = account;
    };

    return {
        accountInfo,
        setAccountInfo
    }
},
{
    persist: true
});
