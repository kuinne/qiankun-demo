import { reactive } from 'vue'

const cacheKeys = reactive(new Set<string>())
export function useRouteCache() {
  function addCachePath(path: string) {
    cacheKeys.add(path)
  }
  function removeCachePath(path: string) {
    cacheKeys.delete(path)
  }
  function getCachePaths() {
    return Array.from(cacheKeys)
  }

  function clearCachePaths(pathReg: RegExp) {
    cacheKeys.forEach((path) => {
      if (pathReg.test(path)) {
        cacheKeys.delete(path)
      }
    })
  }
  return {
    addCachePath,
    removeCachePath,
    getCachePaths,
    clearCachePaths,
  }
}
