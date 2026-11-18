export const site = {
  name: 'Zhoushan Jinxin Auto Parts Co., Ltd.',
  nameZh: '舟山市金欣汽车零部件有限公司',
  shortName: 'Jinxin',
  url: 'https://jinxinseatcomponents.com',
  email: 'info@jinxinseatcomponents.com',
  address: {
    lines: ['No. 16 Fuyu Road, Dongsha Town', 'Daishan County, Zhoushan, Zhejiang', 'China 316216'],
  },
} as const

export type NavItem = {
  label: string
  href: string
  children?: { label: string; href: string; description: string }[]
}

export const navItems: NavItem[] = [
  { label: 'Home', href: '/' },
  {
    label: 'Products',
    href: '/products',
    children: [
      {
        label: 'Seat Assemblies',
        href: '/products?category=seat-assemblies',
        description: 'Complete seat configurations',
      },
      { label: 'Seat Frames', href: '/products?category=seat-frames', description: 'Seat structural components' },
      { label: 'Molded Foam', href: '/products?category=molded-foam', description: 'Seat foam components' },
    ],
  },
  { label: 'Applications', href: '/applications' },
  { label: 'Manufacturing', href: '/manufacturing' },
  { label: 'About', href: '/about' },
  { label: 'News', href: '/news' },
  { label: 'Contact', href: '/contact' },
]

export const buttonPrimary =
  'inline-flex items-center justify-center gap-2 rounded-sm bg-jx px-5 py-3 text-sm font-semibold text-white transition-[background-color,transform] duration-200 hover:bg-jx-deep active:translate-y-px focus-visible:outline-offset-4'

export const buttonSecondary =
  'inline-flex items-center justify-center gap-2 rounded-sm border border-ink/20 bg-white px-5 py-3 text-sm font-semibold text-ink transition-[border-color,background-color,transform] duration-200 hover:border-ink hover:bg-mist active:translate-y-px'
