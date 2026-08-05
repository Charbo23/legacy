import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

export default withMermaid(
  defineConfig({
    lang: 'zh-CN',
    title: 'Legacy 交接文档',
    description: '项目概况、问题排查与经验总结',
    cleanUrls: true,
    lastUpdated: true,
    themeConfig: {
      search: { provider: 'local' },
      outline: { level: [2, 3], label: '本页目录' },
      lastUpdated: { text: '最后更新' },
      docFooter: { prev: '上一页', next: '下一页' },
      nav: [
        { text: '项目概况', link: '/project-overview' },
        { text: '问题排查', link: '/troubleshooting' },
        { text: '经验总结', link: '/lessons' }
      ],
      sidebar: [
        {
          text: '交接文档',
          items: [
            { text: '项目概况', link: '/project-overview' },
            { text: '问题排查', link: '/troubleshooting' },
            { text: '经验总结', link: '/lessons' }
          ]
        }
      ]
    }
  })
)
