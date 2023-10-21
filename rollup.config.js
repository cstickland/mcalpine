import { spawn } from 'child_process'
import svelte from 'rollup-plugin-svelte'
import commonjs from '@rollup/plugin-commonjs'
import terser from '@rollup/plugin-terser'
import resolve from '@rollup/plugin-node-resolve'
import livereload from 'rollup-plugin-livereload'
import css from 'rollup-plugin-css-only'
import autoPreprocess from 'svelte-preprocess'
const production = !process.env.ROLLUP_WATCH

function serve() {
  let server

  function toExit() {
    if (server) server.kill(0)
  }

  return {
    writeBundle() {
      if (server) return
      server = spawn('npm', ['run', 'start', '--', '--dev'], {
        stdio: ['ignore', 'inherit', 'inherit'],
        shell: true,
      })

      process.on('SIGTERM', toExit)
      process.on('exit', toExit)
    },
  }
}

export default {
  input: 'src/App.svelte',
  output: {
    sourcemap: true,
    format: 'umd',
    name: 'MapComponent',
    file: 'dist/map-component.js',
  },
  plugins: [
    svelte({
      preprocess: autoPreprocess({
        scss: {
          prependData: `@import './src/variables.scss';`,
        },
      }),
      compilerOptions: {
        dev: !production,
      },
    }),

    css({ output: 'mobile-nav.css' }),
    resolve({
      browser: true,
      dedupe: ['svelte'],
      exportConditions: ['svelte'],
    }),
    commonjs(),
    !production && serve(),
    !production && livereload('public'),
    production && terser(),
  ],
  watch: {
    clearScreen: false,
  },
}
