export const use$API = (url,options) => {
  const { $swal } = useNuxtApp();
  const runtimeConfig = useRuntimeConfig();
  const auth = useCookie('auth');
  const data = $fetch(url, {
    baseURL: runtimeConfig.public.apiBase,
    headers: {
        Authorization: auth.value
    },
    ...options,
    async onResponseError({ request, response, options }) {
      const { message } = response._data;
      $swal.fire({
        position: "center",
        icon: 'error',
        title: message
      });
      if (response.status === 403) {
        await navigateTo('/account/login');
      }
    }
  });
  return data;
}