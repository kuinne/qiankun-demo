import { ref } from 'vue'

const cacheKeys = ref<string[]>([])

export const useCacheKeys = () => {
  function addCacheKey(key: string) {
    cacheKeys.value.push(key)
  }
  function removeCacheKey(key: string) {
    cacheKeys.value = cacheKeys.value.filter((k) => k !== key)
  }
  function getCacheKeys() {
    return cacheKeys.value
  }
  return {
    cacheKeys,
    addCacheKey,
    removeCacheKey,
    getCacheKeys,
  }
}
