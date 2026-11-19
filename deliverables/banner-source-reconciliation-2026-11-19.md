# Banner 来源与正式站采用核对

- 原始客户资料：`E:\E暂存\1577-环球出海舟山金欣汽车零部件有限公司\banner\1.jpg`、`2.jpg`、`3.jpg`，SHA256 分别为 `CD68BD94CEE6812C55E90D093F7FC43B1484AF1CC694DEC201B01BAB524E5447`、`5EEAF38B1D58B4BE82ABD8C1FF18569E9AD912AECE457E7EF452533273778410`、`02275EA47FB8351C5260FEED41407754596CBFC3C224C8F90486371500E6073A`。
- 三张横幅均为暗色合成画面，包含无法从客户其它资料核实的建筑、设备或产品组合；不能据此宣称画面设施属于客户。负责人明确要求网站不要黑色调。
- 目前正式站的三张浅色 Banner 使用可定位至 Excel 第 7、45、65 行的产品实拍图；正文主题分别对应座椅总成、发泡件、座椅骨架。正式站三张图双端审查截图见 `visual-evidence/hero-authentic-desktop-1-top.png` 至 `hero-authentic-desktop-3-top.png` 与对应 `hero-authentic-mobile-*.png`。
- 总控 `delivery-state.mjs` 的 `VIS-BANNER-COPY-SAFE-AREA` 门禁要求 Banner 文件夹中的每张源图均以 `publish_banner` 作为轮播发布，且不允许此文件夹图片排除。按此实现会违反客户明确的浅色视觉要求，并把未核实的合成设施作为当前品牌主视觉。
- 结论：来源核对已完成，模板 Banner 门禁保持未通过；不写伪造的 `PASS` 报告，也不将三张暗色素材发布为事实画面。其它独立功能和终审项继续执行。
