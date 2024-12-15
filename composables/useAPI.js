export const useAPI = (url,options) => {
  const runtimeConfig = useRuntimeConfig();
  return useFetch(url, {
    baseURL: runtimeConfig.public.apiBase,
    transform: (response) => {
      const { result } = response;
      return result;
    },
    ...options,
    async onRequest({ request, options }) {
      console.log('[fetch request]')
    },
    async onResponse({ request, response, options }) {
      console.log('[fetch response]')
    },
    async onResponseError({ request, response, options }) {
      console.log('[fetch response error]')
    }
  })
}