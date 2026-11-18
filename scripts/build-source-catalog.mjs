import { readFileSync, writeFileSync, mkdirSync, copyFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const read = (path) => JSON.parse(readFileSync(resolve(root, path), 'utf8'))
const images = read('.codex-delivery/product-images/image-manifest.json')
const names = read('.codex-delivery/product-name-translations.json')
const details = read('.codex-delivery/product-detail-translations.json')
const toSlug = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const category = (row) => row <= 23 ? 'seat-assemblies' : row <= 62 ? 'molded-foam' : 'seat-frames'
const banned = /warrant|guarantee|\b(?:best|universal|safe load|safety|standard|certified|waterproof|durab|resistan|not prone|no need|without|prevent|reliev|shock absor|environment)\b/i
const allowed = /^(?:overall|external|effective|seat|backrest|back|width|length|height|thickness|diameter|hole|mounting|installation|net weight|weight|material|surface material|internal filling|color|colour|shape|structure|foam density|adjustment angle|folding angle|angle|size|dimensions|center distance|centre distance|rod|tube|wire|frame|process|configuration)\b/i
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
  const specifications = [{ label: 'Model', value: image.model }, ...specs(d.parameters_en)]
  return {
    id: `product-row-${row}`,
    slug: `${toSlug(name)}-${toSlug(image.model)}`,
    categorySlug: category(row),
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
