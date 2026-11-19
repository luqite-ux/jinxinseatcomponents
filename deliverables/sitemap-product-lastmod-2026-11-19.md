# 正式域名 Sitemap 产品更新时间核验

- 客户仓库 `main` 与 Vercel Production 部署 SHA 均为 `ba97f497abf3c6791844a59de3e7f70bf84d97be`；部署 `dpl_8V7xj3qwBF4cH1ukgGutdvSkEMWu` 返回 `READY`，正式裸域及 www 均已列为 alias。
- `https://jinxinseatcomponents.com/sitemap.xml` 返回 HTTP 200，包含 84 个 URL（7 个静态页和 77 个产品详情页）。
- 正式 XML 中有 77 个 `<lastmod>`，分别附着在产品详情 URL；抽样产品更新时间 `2026-11-18T15:12:21.692174+00:00` 来自产品表 `updated_at`，不是构建时刻。
- 文章当前 0 篇，没有创建演示新闻。此核验仅覆盖 Sitemap 更新时间，不替代全站 SEO、GSC、视觉和内容覆盖终审。
