import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import { sentryVitePlugin } from '@sentry/vite-plugin'
import { viteStaticCopy } from 'vite-plugin-static-copy'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  build: {
    outDir: 'build',
    sourcemap: true,
  },

  server: {
    // host: true, // Listen on all network interfaces (0.0.0.0)
    port: 3000,
    // We don't need HTTPS in development for most cases but when you do you can use the following configuration
    // You will need to generate a self-signed certificate for this to work with the following commands:
    //          openssl req -nodes -new -x509 -keyout .ssl/key.pem -out .ssl/cert.pem
    // https: {
    //   key: fs.readFileSync(path.resolve(__dirname, '.ssl/key.pem')),
    //   cert: fs.readFileSync(path.resolve(__dirname, '.ssl/cert.pem')),
    // },
  },
  optimizeDeps: {
    // Exclude our linked common package but explicitly include 'buffer'
    // so that Vite pre-bundles it and provides proper ESM named exports.
    exclude: ['@regolithco/common'],
    include: ['buffer'],
  },
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: 'node_modules/onnxruntime-web/dist/*.wasm',
          dest: './ort',
        },
        {
          src: 'node_modules/onnxruntime-web/dist/*.mjs',
          dest: './ort',
        },
        {
          src: 'node_modules/@gutenye/ocr-models/assets/*',
          dest: 'assets/models',
        },
      ],
    }),
    react(),
    // Put the Sentry vite plugin after all other plugins
    // sentryVitePlugin({
    //   authToken: process.env.SENTRY_AUTH_TOKEN,
    //   org: 'regolith-co',
    //   project: 'regolith',
    // }),
  ],
  logLevel: 'info', // Enable detailed logging
}))
