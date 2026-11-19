# 产品覆盖校验器口径差异

当前终态报告 `product-coverage-terminal-working-report.json` 的真实剩余项：`frontend_specification_mismatch_keys` 39、`missing_backend_category_keys` 17、`missing_frontend_category_keys` 17。77 个产品身份、77 张源图映射、77 个产品详情正式页面、154 个公开名称/型号字段及后台 241 个原始字段均已单独验证。

39 个 Excel H 列参数原文的资料账本处置是 `backend_only`。它们完整保存在当前租户对应产品的 `extra_data.source_parameters_raw`，但包含需核实的承重、温度等表述；公开页仅展示已逐字段审校的规格。公共 `product-coverage.mjs` 在 `source.specifications.source_status=provided` 时无条件要求前台 `specification_keys` 等于原始 `parameters_raw`，没有按 `backend_only` 处置跳过。直接填写该键会虚称原文已公开，不能这样做。

17 个分类在源材料中为中文名称，首发网站为英文。当前公共校验器只允许源 `name_hash` 与后台/前台 `name_hash` 完全相同，没有类似产品字段的 `published_hash`/`faithful_rewrite` 转换契约。为英文页面填入中文哈希也会冒充真实 DOM。应补足可验证的源中文名称、后台多语言字段、前台英文译名、分类归属及 DOM 证据后，在公共验证器独立任务中建立对应映射规则；本客户任务不修改共享验证器源码。

本项是局部校验器依赖，不能登记产品覆盖 PASS，也不能放行受影响的交付出口或最终清理。客户站内容与其它独立终审继续。
