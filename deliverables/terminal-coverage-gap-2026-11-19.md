# 原始资料终态覆盖复核：未通过

本次用总控 Skill 的 `product-coverage.mjs --phase terminal` 与 `material-fact-coverage.mjs --phase terminal` 重新核对原始清单。结果文件分别为 `product-coverage-terminal.json` 和 `material-fact-coverage-terminal.json`，两项 `pass=false`，不得登记为终审通过。

- 产品原始侧：77 个表格行、77 张逐行图片、17 个分类均已登记，原始图片无未归属项；原始产品身份审计 `SOURCE_SCOPE_RECONCILED`。
- 产品终态清单：后台和前台产品键、图片 URL、字段哈希、分类目标仍未回填，因此报告显示前后台 0/77；这是**清单证据缺失**，不能解释为数据库或网页实际上没有产品。正式站 77 个详情页的桌面和 390px 无头浏览器加载、图片可见性和 `contain` 适配已有单独审计，但该审计尚未提供全部逐字段 DOM 哈希。
- 资料终态清单：11 个事实目标、171 个嵌入图片目标、12 个独立图片目标缺少 `terminal_targets`。其中公司名称、地址、电话及 IATF 证书需要核对后台字段和前台实际落点；历史过期、其他主体的证书不得为了通过覆盖审计而公开。
- 原始 `Banner` 文件夹的暗色合成图带有未经证实的场景或设备。当前公开首屏采用已核实的产品表图片；总控的 Banner 安全区核验要求原文件夹每张均公开，与客户明确的浅色风格和素材真实性相冲突。冲突另见 `banner-source-reconciliation-2026-11-19.md`，不能伪造 `PASS`。

下一步按实际数据库、R2 URL 和正式页面逐项回填目标证据；对不适合公开的素材逐张记载排除依据，并重跑两项终态审计。
