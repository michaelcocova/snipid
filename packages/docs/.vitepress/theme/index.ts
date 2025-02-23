/* eslint-disable ts/ban-ts-comment */

import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import './style.css'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    })
  },
  enhanceApp({ router }) {
    router.onBeforeRouteChange = (to: string) => {
      // @ts-ignore
      if (typeof _hmt != 'undefined') {
        if (to) {
          // @ts-ignore
          _hmt.push(['_trackPageview', to])
        }
        return true
      }
      return true
    }
  },
} satisfies Theme
