/**
 * 站点级元数据集中定义。
 *
 * 品牌名、联系方式、备案信息只在此处维护，避免散落到各个组件里。
 * 需要改名或换联系方式时，改这一个文件即可。
 */
export const SITE = {
  /** 产品名，用于浏览器标题、页头、OG 分享卡片 */
  name: '遍知评论助手',

  /** 备案主体公司全称 */
  company: '四川遍知网络科技有限公司',

  /** 默认 meta description，页面未单独指定时使用 */
  description:
    '遍知评论助手面向账号运营人员，集中查看已发布视频的评论列表，并以账号主人身份直接回复，让观众提问得到及时回应。',

  /** ICP 备案信息，法规要求备案号需链接至工信部查询站点 */
  icp: {
    number: '蜀ICP备20014462号-1',
    url: 'https://beian.miit.gov.cn/',
  },

  /** 对外联系方式 */
  contact: {
    phone: '17781373872',
    email: 'bianzhixiaoyuan@163.com',
  },

  /** 页头与页脚的导航锚点 */
  nav: [
    { href: '#features', label: '功能' },
    { href: '#scenario', label: '使用场景' },
    { href: '#about', label: '关于' },
    { href: '#contact', label: '联系' },
  ],
} as const;
