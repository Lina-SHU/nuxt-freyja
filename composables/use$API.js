export const use$API = (url,options) => {
  const { $swal } = useNuxtApp();
  const runtimeConfig = useRuntimeConfig();
  const data = $fetch(url, {
    baseURL: runtimeConfig.public.apiBase,
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