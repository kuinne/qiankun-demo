import viteConfig from '../common/src/vite-config'

export default viteConfig({
  microAppName: 'sub-app-2',
  viteConfig: {
    server: {
      port: 5002,
    },
  },
})
