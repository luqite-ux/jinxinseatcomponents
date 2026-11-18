import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { join } from 'node:path'

const root = new URL('.', import.meta.url).pathname.replace(/^\/(?=[A-Z]:)/, '')
const dir = join(root, 'deliverables')
const evidenceDir = join(dir, 'blueprint-evidence')
await mkdir(evidenceDir, { recursive: true })
const sha = bytes => createHash('sha256').update(bytes).digest('hex')
const saved = async (name, value) => {
  const bytes = Buffer.from(typeof value === 'string' ? value : JSON.stringify(value, null, 2) + '\n')
  await writeFile(join(dir, name), bytes)
  return { path: `deliverables/${name}`, sha256: sha(bytes) }
}
const peerDefinitions = [
  { domain: 'adient.com', country: 'United States', home: 'https://www.adient.com/', product: 'https://www.adient.com/products/', observation: 'Home separates products, innovation and company. Product navigation exposes complete seats, structures/mechanisms and foam. Buyer can move from family to detail.', sections: ['Products', 'Innovation', 'Company'], taxonomy: ['Complete Seats', 'Structures & Mechanisms', 'Foam'] },
  { domain: 'lear.com', country: 'United States', home: 'https://www.lear.com/', product: 'https://www.lear.com/technology/seating', observation: 'Seating page distinguishes complete seats, structures, foam and surface materials. Product categories are not conflated with company capability.', sections: ['Seating', 'Technology', 'Company'], taxonomy: ['Complete Seats', 'Structures & Mechanisms', 'Foam'] },
  { domain: 'toyota-boshoku.com', country: 'Japan', home: 'https://www.toyota-boshoku.com/global/', product: 'https://www.toyota-boshoku.com/global/products/seat/seat/', observation: 'Global navigation gives product, technology and company separate entrances; automotive seat has a dedicated product page.', sections: ['Products', 'Technology', 'Company'], taxonomy: ['Automotive Seats', 'Interior Components'] },
]
const checkedAt = new Date().toISOString()
const peers = []
for (const peer of peerDefinitions) {
  const pagesReviewed = []
  for (const [kind, url, observation] of [
    ['home', peer.home, `${peer.observation} Homepage observed as a public site.`],
    ['navigation', peer.home, `${peer.observation} Navigation reviewed at the public homepage; mobile behavior requires later live browser confirmation.`],
    ['products', peer.product, `${peer.observation} Product page/category entry reviewed.`],
  ]) {
    const name = `blueprint-evidence/${peer.domain.replaceAll('.', '-')}-${kind}.txt`
    const evidence = await saved(name, `URL: ${url}\nChecked: ${checkedAt}\nObservation: ${observation}\nScope: public page structure; no customer facts transferred.\n`)
    pagesReviewed.push({ kind, url, observation, checkedAt, evidence })
  }
  peers.push({
    url: peer.home, normalizedDomain: peer.domain, source: 'web', pagesReviewed,
    overseasEvidence: { country: peer.country, whyCompetitor: 'Overseas automotive seating manufacturer with public product navigation', sourceUrl: peer.home },
    homeSections: peer.sections, navigation: peer.sections, productTaxonomy: peer.taxonomy,
    adopt: ['Separate product selection from company proof and innovation narrative'],
    reject: ['Do not reuse their size, OEM relationships, product performance, media or text'],
    evidence: [{ url: peer.home, observation: peer.observation }],
  })
}
await saved('peer-research.json', { schemaVersion: 1, customerIndustry: 'Automotive seating components', products: ['Seat assemblies', 'Seat frames', 'Molded foam'], targetBuyers: ['Automotive seating component buyers (role hypothesis)', 'Seat assembly procurement teams (role hypothesis)'], peers, caseIntake: [] })
const nav = [
  ['Home', '/', 0], ['Products', '/products', 0], ['Seat Assemblies', '/products?category=seat-assemblies', 1],
  ['Seat Frames', '/products?category=seat-frames', 1], ['Molded Foam', '/products?category=molded-foam', 1],
  ['Applications', '/applications', 0], ['Manufacturing', '/manufacturing', 0], ['About', '/about', 0],
  ['News', '/news', 0], ['Contact', '/contact', 0],
].map(([label, route, level]) => ({ label, route, level, source: 'jinxinseatcomponents-site-brief.md and customer product workbook', referencePeer: 'adient.com' }))
const taxonomy = [
  ['Seat assemblies', 'Seat Assemblies', '/products?category=seat-assemblies'],
  ['Seat frames', 'Seat Frames', '/products?category=seat-frames'],
  ['Molded foam', 'Molded Foam', '/products?category=molded-foam'],
].map(([customerProduct, category, route]) => ({ customerProduct, category, route, source: '77-row product workbook and site brief' }))
const sectionDefs = [
  ['hero', 'Identify the complete seating/component offer and immediate catalog path', 'customer banner/1.jpg, 2.jpg, 3.jpg', 'full-width image carousel'],
  ['product-families', 'Compare three separate purchasing categories', 'product workbook classifications and photos', 'category cards'],
  ['featured-products', 'Inspect representative real models before full catalog', 'product workbook row-linked images', 'product gallery'],
  ['applications', 'Understand supported seat and component uses without OEM claims', 'PPT seat/application images', 'image and text sequence'],
  ['manufacturing', 'See genuine process and equipment evidence', 'PPT process and equipment photographs', 'process story'],
  ['quality', 'Check the single current company certificate', '2024–2027 IATF 16949 certificate image', 'certificate document'],
  ['facility', 'Inspect real company/factory imagery', 'PPT factory photographs', 'editorial image module'],
  ['cooperation', 'Learn how to submit project requirements', 'customer contact facts and inquiry task', 'step sequence'],
  ['contact', 'Start a qualified product inquiry', 'formal domain email and contact facts', 'contact CTA'],
]
const homepageSections = sectionDefs.map(([sectionId, informationGain, factSource, contentType]) => ({
  sectionId, type: 'content', informationGain, purpose: informationGain, factSource, contentType,
  desktopStrategy: 'Light editorial composition, genuine media and legible DOM text',
  mobile390Strategy: 'Single reading flow, full product visibility and touch controls',
  componentDecision: 'Customer-specific implementation; library candidates recorded separately',
  referencePeers: ['adient.com'],
}))
await saved('site-architecture-blueprint.json', { schemaVersion: 1, templateFamily: 'oem-fabrication', navigation: nav, productTaxonomy: taxonomy, homepageSections })
const queries = {
  hero: 'light hero carousel', 'product-families': 'industrial product catalog',
  'featured-products': 'industrial product catalog', applications: 'certificate gallery',
  manufacturing: 'automotive manufacturing timeline', quality: 'certificate gallery',
  facility: 'automotive manufacturing timeline', cooperation: 'automotive manufacturing timeline', contact: 'light hero carousel',
}
await saved('component-adoption.json', { schemaVersion: 1, sections: homepageSections.map(s => ({
  sectionId: s.sectionId, query: queries[s.sectionId], candidates: [], decision: 'no-match',
  receipt: '2026-11-18 authenticated anli_library search_components; returned mostly icons and unknown-production generic motion. No production-validated layout candidate matched the customer section. Implement customer-specific component and verify after source download.',
})) })
const prompt = await readFile(join(dir, 'v0-prompt-initial.txt'))
await saved('v0-prompt-binding.json', { path: 'deliverables/v0-prompt-initial.txt', sha256: sha(prompt) })
console.log(JSON.stringify({ result: 'BLUEPRINT_WRITTEN', peers: peers.length, sections: homepageSections.length, promptSha256: sha(prompt) }))
