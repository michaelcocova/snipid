import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'zh-Hans-CN',
  title: 'Snip ID ',
  // <meta name="keywords" content="SnipID, 短 ID 生成器, 唯一 ID, 高性能 ID 生成, 分布式支持, 安全随机性, 批量生成, 可配置 ID 生成器, 时间戳解析, 碰撞检测, 可扩展应用, 灵活的 ID 生成" />
  description:
    'SnipID 是一款现代化、高性能的短 ID 生成器，支持分布式系统、唯一 ID 和安全随机性。易于配置，具有批量生成、碰撞检测和时间戳解析等功能，适用于可扩展的应用场景。',
  srcDir: 'src',
  outDir: 'dist',
  cleanUrls: true,
  cacheDir: '.vitepress/.cache',
  themeConfig: {
    logo: '/logo.svg',
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/examples' },
    ],
    search: {
      provider: 'local',
    },
    sidebar: [
      { text: '简介', link: '/introduction' },
      {
        text: '指南',
        items: [
          { text: '基本用法', link: '/guide/basic-usage' },
          { text: '高级配置', link: '/guide/advanced-config' },
          { text: '分布式场景', link: '/guide/distributed' },
          { text: 'ID解析', link: '/guide/id-parsing' },
          { text: '随机策略', link: '/guide/random-strategy' },
          { text: '性能优化', link: '/guide/performance' },
        ],
      },
      { text: 'Examples', link: '/examples' },
    ],
    footer: {
      copyright: 'MIT Licensed | Copyright © 2025-present Michael Cocova',
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/michaelcocova/snipid' },
    ],
  },
})
