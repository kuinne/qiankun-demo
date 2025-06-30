import viteConfig from '../common/src/vite-config'

// https://vite.dev/config/

export default viteConfig({
  microAppName: 'sub-app-1',
  viteConfig: {
    server: {
      port: 5001,
    },
    preview: {
      port: 5001,
    },
  },
})
