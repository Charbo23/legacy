import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

export default withMermaid(
  defineConfig({
    lang: 'zh-CN',
    title: '项目接手手册',
    description: '面向接手人的项目关系、排查、发布与验收手册',
    cleanUrls: true,
    lastUpdated: true,
    themeConfig: {
      search: { provider: 'local' },
      outline: { level: [2, 3], label: '本页目录' },
      lastUpdated: { text: '最后更新' },
      docFooter: { prev: '上一页', next: '下一页' },
      nav: [
        { text: '项目地图', link: '/project-overview' },
        { text: '易哈佛前台', link: '/ehafo-frontend/overview' },
        { text: 'team-agent-config', link: '/team-agent-config/overview' },
        { text: '疑难排查', link: '/ehafo-frontend/troubleshooting' },
        { text: '小护排班', link: '/schedule/overview' }
      ],
      sidebar: [
        {
          text: '总览',
          items: [
            { text: '接手导读', link: '/project-overview' }
          ]
        },
        {
          text: '易哈佛前台',
          collapsed: false,
          items: [
            { text: '项目概况', link: '/ehafo-frontend/overview' },
            { text: '仓库与系统关系', link: '/ehafo-frontend/repositories' },
            { text: 'MP 与 subproject', link: '/ehafo-frontend/mp-and-subprojects' },
            { text: 'ehafo-front-lib', link: '/ehafo-frontend/front-lib' },
            { text: 'A/B 测试', link: '/ehafo-frontend/ab-testing' },
            { text: '自研统计', link: '/ehafo-frontend/tracking' },
            { text: '问题排查', link: '/ehafo-frontend/troubleshooting' },
            { text: '测试、验收与项目经验', link: '/ehafo-frontend/lessons' }
          ]
        },
        {
          text: 'team-agent-config',
          collapsed: false,
          items: [
            { text: '项目概况', link: '/team-agent-config/overview' }
          ]
        },
        {
          text: '小护排班',
          collapsed: false,
          items: [
            { text: '项目概况与发布', link: '/schedule/overview' }
          ]
        }
      ]
    }
  })
)
