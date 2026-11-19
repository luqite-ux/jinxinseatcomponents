# 产品参数补核：Excel 原表第 9、69 行

- 第 9 行 Golf Sightseeing Cart Backrest：原表 `具体产品!H9` 明确给出整体外形高 × 宽 `420mm×390mm`、高度可按需 `360mm~480mm`，以及背部安装孔距横向 `260mm`、纵向 `120mm`。分别写入该产品公开规格“Overall height × width”和“Rear mounting hole spacing”。
- 第 69 行 KP01-002 Headrest Rod：原表 `具体产品!H69` 明确写明 `20# 精密冷拔钢管`。写入该产品公开规格“Material grade”。同一单元格的盐雾、耐温、镀层等性能数字仍在该产品后台 `extra_data.source_parameters_raw` 原文保留，未转成未经独立核实的公开承诺。
- `scripts/sync-reviewed-product-specs.mjs --apply` 按租户 `d189a65a-480c-4800-ab12-ac21a9d724d7`、产品 ID 定向更新，返回 `updated=2` 并逐条回读规格。`pnpm build` 通过。
