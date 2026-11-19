# 产品原文参数公开纠正

Excel `具体产品!H` 有原文参数的 39 行已逐产品保存在本租户 `products.extra_data.source_parameters_raw`，后台精确回读 39/39。资料覆盖清单将这些原文列为 `backend_only`，原因是部分参考区间、承重和营销措辞尚未逐字段审校。

提交 `2d5116f` 与 `ea0dbd0` 曾短暂在对应 39 个公开产品详情显示整段原文；这是对来源分级的错误判断。提交 `ffb0ecf9d55a45cfd96063671a3c9982e3a61a56` 撤回原文展示及静态回退副本，保留已筛选的英文规格。公司 GitHub `main` 与 Vercel Production 已回读为该 SHA，正式域名对应 39 页均未出现原文入口或原文开头。逐页结果见 `source-parameter-withdrawal-2026-11-19.json`。

两条已替代部署的专属 `*.vercel.app` URL 公开请求均返回 302 到 Vercel 鉴权页；正式域名当前指向撤回版。未审校的原文不计为公开参数交付完成，后续只能按 Excel 单元格逐项审核后写入对应产品规格。
