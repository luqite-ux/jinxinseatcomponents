import { readFileSync, writeFileSync, mkdirSync, copyFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const read = (path) => JSON.parse(readFileSync(resolve(root, path), 'utf8'))
const images = read('.codex-delivery/product-images/image-manifest.json')
const names = read('.codex-delivery/product-name-translations.json')
const details = read('.codex-delivery/product-detail-translations.json')
const toSlug = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const category = (row) => row <= 23 ? 'seat-assemblies' : row <= 62 ? 'molded-foam' : 'seat-frames'
const subcategory = (row) => row <= 7 ? 'ambulance-seats'
  : row <= 10 ? 'golf-cart-seats' : row <= 12 ? 'atv-seats'
  : row <= 22 ? 'commercial-seats' : row <= 23 ? 'special-seats'
  : row <= 32 ? 'lumbar-cushions' : row <= 35 ? 'pet-foam'
  : row <= 44 ? 'headrest-foam' : row <= 54 ? 'seat-foam'
  : row <= 62 ? 'integral-skin-foam' : row <= 68 ? 'seat-frames-sub'
  : row <= 73 ? 'headrest-rods' : row <= 76 ? 'headrest-frames' : 'armrest-frames'
const banned = /warrant|guarantee|\b(?:best|universal|safe load|safety|standard|certified|waterproof|durab|resistan|not prone|no need|without|prevent|reliev|shock absor|environment)\b/i
const allowed = /^(?:overall|external|effective|seat|backrest|back|width|length|height|thickness|diameter|hole|mounting|installation|net weight|weight|material|surface material|internal filling|color|colour|shape|structure|foam density|adjustment angle|folding angle|angle|size|dimensions|center distance|centre distance|rod|tube|wire|frame|process|configuration)\b/i
// These rows use nested prose and table-style parameter blocks in the source workbook.
// Only concrete source-supplied materials, dimensions and mechanisms are surfaced;
// performance, certification and service-life claims remain in the source ledger.
const reviewedSpecs = {
  33: [['Material options', 'Slow-rebound memory foam with supporting foam; molded memory foam options'], ['Density options', '35D, 40D and 50D']],
  45: [['Main substrate', 'Polyether polyol'], ['Coloring', 'Carbon black pigment system'], ['Blowing agent', 'Water'], ['Foam stabilizer', 'Silicone surfactant']],
  46: [['Resilience', '≥60%'], ['Tensile strength', '≥110 kPa'], ['Tear strength', '≥1.9 N/mm']],
  48: [['Open-cell rate', '≥92%'], ['Air permeability', '12–18 mm/s']],
  53: [['Surface zone density', '32–38 kg/m³'], ['Load-bearing zone density', '42–48 kg/m³'], ['Side bolster density', '50–55 kg/m³']],
  54: [['Surface zone density', '32–38 kg/m³'], ['Load-bearing zone density', '42–48 kg/m³'], ['Side bolster density', '50–55 kg/m³']],
  63: [['Main frame', 'Q235 steel tube, 1.2–1.5 mm wall thickness'], ['Support spring wire', 'High-carbon manganese steel, φ3.2–3.8 mm'], ['Buffer sleeve', 'EPDM rubber']],
  64: [['Main frame', 'Q235 steel tube, 1.2–1.5 mm wall thickness'], ['Support spring wire', 'High-carbon manganese steel, φ3.2–3.8 mm'], ['Buffer sleeve', 'EPDM rubber']],
  67: [['Main frame', 'Q235 steel tube, 1.2–1.4 mm wall thickness'], ['Support spring wire', '65Mn steel, φ2.8–3.4 mm'], ['Split structure', '4/6']],
  68: [['Main frame', 'Q235 steel tube, 1.2–1.4 mm wall thickness'], ['Buffer sleeve', 'EPDM rubber'], ['Welding process', 'CO₂ welding']],
  74: [['Vertical lift travel', '70–110 mm'], ['Tilt adjustment', 'Forward 5°–15°; rearward 0°–8°'], ['Assembly weight', 'Approximately 150–220 g']],
  75: [['Maximum folding angle', '90° rearward'], ['Unlocking method', 'Cable-operated mechanical release'], ['Cable operating force', '25–40 N']],
  76: [['Tilt adjustment', 'Forward 5°–18°; rearward 0°–10°'], ['Vertical travel', '70–100 mm'], ['Unlock pressing force', '20–35 N']],
  77: [['Armrest structure', 'Foldable frame with hinged locking mechanism'], ['Frame integration', 'Embedded in molded PU foam']],
  79: [['Armrest structure', 'Multi-position angle adjustment and vertical fold-up']],
}
function specs(text) {
  return text.split(/\r?\n/).flatMap((line) => {
    const normalized = line.trim().replace(/^\d+[).]\s*/, '')
    const cut = normalized.indexOf(':')
    const pipe = normalized.indexOf('|')
    if (!allowed.test(normalized) || (cut < 0 && pipe < 0)) return []
    const delimiter = cut >= 0 && (pipe < 0 || cut < pipe) ? ':' : '|'
    const [rawLabel, rawValue] = normalized.split(delimiter)
    const label = rawLabel?.trim() ?? ''
    const value = rawValue?.split(';')[0].trim() ?? ''
    if (banned.test(`${label}: ${value}`)) return []
    return label && value ? [{ label, value }] : []
  })
}
if (images.length !== 77 || Object.keys(names).length !== 77 || Object.keys(details).length !== 77) throw new Error('Incomplete source catalog')
const publicDir = resolve(root, 'public/catalog')
mkdirSync(publicDir, { recursive: true })
const catalog = images.map((image) => {
  const row = image.excel_row
  const n = names[row]
  const d = details[row]
  if (!n || !d || n.model !== image.model) throw new Error(`Row mapping mismatch: ${row}`)
  let name = n.name_en.trim()
  if (row === 11) name = 'ATV One-Piece Front Seat Cushion Assembly'
  if ([8, 9, 10].includes(row)) name = name.replace(' Dedicated', '')
  copyFileSync(resolve(root, '.codex-delivery/product-images', image.web_image), resolve(publicDir, image.web_image))
  const specifications = [
    { label: 'Model', value: image.model },
    ...specs(d.parameters_en),
    ...(reviewedSpecs[row] ?? []).map(([label, value]) => ({ label, value })),
  ]
  return {
    id: `product-row-${row}`,
    slug: `${toSlug(name)}-${toSlug(image.model)}`,
    categorySlug: category(row),
    subcategorySlug: subcategory(row),
    name: { en: name },
    summary: { en: `${name}, model ${image.model}. Review the listed specifications and confirm final requirements with our team.` },
    images: [{ src: `/catalog/${image.web_image}`, width: image.width, height: image.height, alt: { en: `${name}, model ${image.model}` } }],
    specifications: specifications.map(({ label, value }) => ({ label: { en: label }, value: { en: value } })),
    sourceRow: row,
    featured: [7, 17, 45, 65].includes(row),
    sortOrder: row - 4,
  }
})
if (new Set(catalog.map((x) => x.slug)).size !== 77) throw new Error('Duplicate product slug')
writeFileSync(resolve(root, 'lib/product-catalog.json'), JSON.stringify(catalog, null, 2) + '\n')
console.log(JSON.stringify({ rows: catalog.length, images: readdirSync(publicDir).length, withExtraSpecs: catalog.filter((p) => p.specifications.length > 1).length }))
