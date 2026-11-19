# 金欣站点内容编辑器真实界面抽测

- 正式域名：`https://jinxinseatcomponents.com/admin/site-content`，客户账号仅访问本租户；无头浏览器会话 `jinxin-admin`，完成后退出并关闭。
- 后台当前配置 v1；已发布版本 `dd061f11-1725-414e-b53e-1ac72342f21f`；初始草稿首屏标题默认桌面 54px、手机 32px、字重 600。首页真实浏览器计算样式分别为 54px、32px、600。
- 在「Homepage / → Hero carousel → 首张 Headline」控件改为桌面 56px、手机 34px、字重 400，点击「保存草稿」，刷新后台仍回显 56/34/400；后台明确显示「草稿已保存，尚未改变网站」。
- 点击「保存并准备网站预览」与一次性「打开已准备的预览」。预览的首屏标题真实计算样式为桌面 56px、手机 34px、字重 400，预览版本标记为草稿 revision `6b9d015e-3e98-4a23-bec3-d234e6df84a1`；截图为 `visual-evidence/content-preview-headline-desktop-56.png`、`visual-evidence/content-preview-headline-mobile-34.png`。
- 在后台点击「恢复网站原样」并保存草稿，刷新后回显 54/32/600，恢复按钮禁用。数据库当前草稿 revision `e3c16e50-d745-4c93-8cf6-e2a76e045f33`，首张 Hero 的 `styles` 无测试覆盖。点击预览页「Exit preview」后，公开首页版本仍为 `dd061f11-1725-414e-b53e-1ac72342f21f`，计算样式回到手机 32px、桌面 54px、字重 600。
- 本次新增的后台登录会话已按精确 session token 与本租户用户删除，回读 `1 → 0`；临时浏览器状态文件已删除。其它任务持有的浏览器会话未触碰。
- 这是首个文字样式字段的真实抽测，不能代替五组全部字段、所有可选属性的 `typography-delivery-v1` 门禁，亦不能代替完整发布／历史恢复验收。
