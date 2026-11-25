import { defineConfig } from 'vite';
import { cpSync, existsSync } from 'fs'
import { resolve } from 'path'
import glob from 'fast-glob'
// Grab all HTML files inside src (including subfolders)
const htmlFiles = glob.sync('./src/**/*.html')

// blog.js references images as runtime strings (assets/blog/...), so Vite
// never discovers them. Copy the folder into dist after the bundle.
function copyBlogAssets() {
  return {
    name: 'copy-blog-assets',
    closeBundle() {
      const from = resolve(__dirname, 'src/assets/blog')
      const to = resolve(__dirname, 'dist/assets/blog')
      if (!existsSync(from)) return
      cpSync(from, to, { recursive: true })
    },
  }
}

export default defineConfig({
   // Use relative base so the same build works on:
    // - GitHub Pages project URL: https://auxxweb.github.io/vashqofficialsite/
    // - Custom domain root: https://home.vashq.com/
   base: './',
   root: resolve(__dirname, 'src'),   // ✅ keeps dev server working
   publicDir: resolve(__dirname, 'public'),
   plugins: [copyBlogAssets()],
   server: {
    host: true,
    port: 3000,
    hot: true,
    open: true,
  },
  css: {
    preprocessorOptions: {
        scss: {

        },
      }
  },
    build: {
    outDir: resolve(__dirname, 'dist'), // ✅ output outside src
    emptyOutDir: true,
    rollupOptions: {
      input: htmlFiles.length
        ? Object.fromEntries(
            htmlFiles.map(file => [
              file.replace(/^\.\/src\//, '').replace(/\.html$/, ''),
              resolve(__dirname, file),
            ])
          )
        : resolve(__dirname, 'src/index.html'),
         output: {
          chunkFileNames: 'assets/js/[name].js',
          entryFileNames: 'assets/js/[name].js',

          assetFileNames: ({name}) => {
            if (/\.(gif|jpe?g|png|svg)$/.test(name ?? '')){
                return 'assets/images/[name][extname]';
            }

            if (/\.css$/.test(name ?? '')) {
                return 'assets/css/[name][extname]';
            }

            // default value
            // ref: https://rollupjs.org/guide/en/#outputassetfilenames
            return 'assets/[name][extname]';
          },



      },
    },
  },
});
