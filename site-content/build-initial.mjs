import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = dirname(fileURLToPath(import.meta.url))
const registeredAssets = JSON.parse(readFileSync(resolve(root, 'assets.json'), 'utf8')).assets
const pageImage = (relative, alt) => {
  const assetId = registeredAssets[relative]?.assetId
  if (!assetId) throw new Error(`Missing registered asset: ${relative}`)
  return { assetId, alt: { en: alt } }
}
const local = (value) => ({ en: value })
const family = (key, label) => ({ key, label })
const type = (key, kind, label, extra = {}) => ({ key, type: kind, label, ...extra })
const text = (key, label, size, weight = 400, familyKey = 'site-sans', kind = 'text') => type(key, kind, label, {
  localized: true, required: true, maxLength: kind === 'textarea' ? 500 : 160,
  typography: {
    fontFamilies: [familyKey], fontWeights: [weight, weight === 400 ? 500 : 400],
    fontSize: { min: 10, max: 80 },
    defaults: { fontFamily: familyKey, fontWeight: weight, fontSizeDesktop: size[0], fontSizeMobile: size[1] },
  },
})
const module = (key, label, fields) => ({ key, type: key, label, canHide: false, canReorder: false, fields })
const assets = { seating: '956964ef-4ccf-451b-9cc2-ab3c1edefbdc', foam: '2ce79809-66b1-4db1-82d8-0fb9386eb648', frames: 'b4022f26-a129-487e-be36-77ed295bb5cb' }
const slideRows = [
  { id: 'seating', label: 'Seat assemblies', eyebrow: 'Assemblies / Frames / Foam', title: 'Automotive Seating, From Structure to Assembly', body: 'Complete seat assemblies, seat frames and molded foam components from one supplier. Browse the range and send us your requirements.', cta_label: 'Explore Products', cta_href: '/products', alt: 'Customer supplied photograph of an ambulance auxiliary seat assembly' },
  { id: 'foam', label: 'Molded foam', eyebrow: 'Molded foam components', title: 'Molded Foam for Seat Applications', body: 'Explore the molded foam range for seat bases and backs. Send your drawing or sample and we will talk through the fit.', cta_label: 'Explore Foam Components', cta_href: '/products?category=molded-foam', alt: 'Customer supplied photograph of a molded seat foam component' },
  { id: 'frames', label: 'Seat frames', eyebrow: 'Seat structural components', title: 'Explore the Structure Beneath the Seat', body: 'Look through the seat frame line, from complete frames to the brackets and members that carry the seat.', cta_label: 'Explore Seat Frames', cta_href: '/products?category=seat-frames', alt: 'Customer supplied photograph of a seat frame component' },
]
const nav = [
  ['home', 'Home', '/'], ['products', 'Products', '/products'], ['applications', 'Applications', '/applications'],
  ['manufacturing', 'Manufacturing', '/manufacturing'], ['about', 'About', '/about'], ['news', 'News', '/news'], ['contact', 'Contact', '/contact'],
]
const definition = {
  version: 3,
  fontFamilies: [family('site-sans', 'Geist Sans'), family('site-mono', 'Geist Mono')],
  pages: [{ key: 'home', path: '/', label: 'Homepage', modules: [
    module('hero', 'Hero carousel', [type('slides', 'repeat', 'Three customer supplied slides', { maxItems: 3, required: true, fields: [
      type('label', 'text', 'Slide label', { localized: true, required: true, maxLength: 50 }),
      text('eyebrow', 'Eyebrow', [12, 12], 400, 'site-mono'),
      text('title', 'Headline', [54, 32], 600),
      text('body', 'Body copy', [18, 16], 400, 'site-sans', 'textarea'),
      type('desktop_image', 'image', 'Desktop customer image', { required: true }),
      type('mobile_image', 'image', 'Mobile customer image', { required: true }),
      type('cta_label', 'text', 'Button label', { localized: true, required: true, maxLength: 50 }),
      type('cta_href', 'link', 'Button link', { required: true }),
    ] })]),
    module('navigation', 'Main navigation', [type('links', 'repeat', 'Main links', { maxItems: 10, required: true, fields: [
      text('label', 'Link label', [14, 16], 500), type('href', 'link', 'Link destination', { required: true }),
    ] })]),
    module('seo', 'Homepage search result', [type('title', 'text', 'Page title', { localized: true, required: true, maxLength: 160 }), type('description', 'textarea', 'Page description', { localized: true, required: true, maxLength: 300 })]),
  ] }],
}
const image = (id, alt) => ({ assetId: assets[id], alt: local(alt) })
const content = { pages: { home: { order: ['hero', 'navigation', 'seo'], modules: {
  hero: { hidden: false, values: { slides: slideRows.map((row) => ({
    id: row.id, label: local(row.label), eyebrow: local(row.eyebrow), title: local(row.title), body: local(row.body),
    desktop_image: image(row.id, row.alt), mobile_image: image(row.id, row.alt), cta_label: local(row.cta_label), cta_href: row.cta_href,
  })) } },
  navigation: { hidden: false, values: { links: nav.map(([id, label, href]) => ({ id, label: local(label), href })) } },
  seo: { hidden: false, values: { title: local('Zhoushan Jinxin Auto Parts | Automotive Seat Assemblies, Frames and Molded Foam'), description: local('Zhoushan Jinxin Auto Parts Co., Ltd. makes automotive seat assemblies, seat frames and molded foam components. Browse products and send an inquiry.') } },
} } } }
const integration = { domain: 'jinxinseatcomponents.com', adapterVersion: '1', capabilities: ['preview'], modules: ['home.hero', 'home.navigation', 'home.seo'] }
const headings = [
  ['product_families', 'Product families', 'Three families, one seat', 'Start with the family that matches your program, then open individual products to inspect specifications.'],
  ['featured_products', 'Featured products', 'Look closely at the parts', 'Every product page lists its own specification table and a direct route to a quote request.'],
  ['applications', 'Applications', 'Seats for different positions', 'From front seating to folding seats with belts, see the configurations we build and the parts behind them.'],
  ['manufacturing', 'Manufacturing', 'Design and production of seat components', 'Structure, foam and complete assemblies are handled across one product scope.'],
  ['quality', 'Quality', 'IATF 16949:2016 quality management', 'Our quality management system is certified by DQS to IATF 16949:2016, covering the design and production of seat components.'],
  ['facility', 'Facility', 'Where the parts are made', 'A press line with robotic loading, photographed on our factory floor in Daishan County, Zhoushan.'],
  ['cooperation', 'Cooperation', 'How working together starts', 'A short, direct process: tell us what you need and we will discuss whether and how we can fit it.'],
  ['faq', 'Ordering', 'Questions before you order', "Practical details from the company's supplied FAQ."],
  ['contact', 'Contact', 'Tell us what your seat needs', 'Send an inquiry for a specific product or describe your requirements.'],
]
for (const [key, eyebrow, title, description] of headings) {
  const fields = [
    text('eyebrow', 'Eyebrow', [12, 12], 400, 'site-mono'),
    text('title', 'Section heading', [36, 30], 600),
    text('description', 'Section introduction', key === 'contact' ? [18, 18] : [18, 16], 400, 'site-sans', 'textarea'),
  ]
  definition.pages[0].modules.splice(-2, 0, module(key, `${eyebrow} section`, fields))
  content.pages.home.order.splice(-2, 0, key)
  content.pages.home.modules[key] = { hidden: false, values: { eyebrow: local(eyebrow), title: local(title), description: local(description) } }
  integration.modules.push(`home.${key}`)
}
const pageIntros = [
  ['about', '/about', 'About', 'Seat components, designed and produced in Zhoushan', 'Zhoushan Jinxin Auto Parts Co., Ltd. makes automotive seat assemblies, seat frames and molded foam components.', 'About', 'Zhoushan Jinxin Auto Parts Co., Ltd. designs and produces automotive seat components: seat assemblies, seat frames and molded foam.'],
  ['applications_page', '/applications', 'Applications', 'Seat configurations we build', 'See complete seats in use positions, then follow through to the frames and foam components that make them up.', 'Applications', 'Seat configurations from Zhoushan Jinxin Auto Parts, including front seating and folding seating with belt, and the frames and foam behind them.'],
  ['manufacturing_page', '/manufacturing', 'Manufacturing', 'From structure to assembly', 'Seat frames, molded foam and complete seat assemblies, designed and produced for seating programs.', 'Manufacturing', 'Design and production of seat components: seat frames, molded foam and seat assemblies from Zhoushan Jinxin Auto Parts, certified to IATF 16949:2016.'],
  ['contact_page', '/contact', 'Contact', 'Send us your requirements', 'Tell us what you need and we will review it with you. Include a drawing or sample reference if you have one.', 'Contact', 'Send your seat assembly, seat frame or molded foam requirements to Zhoushan Jinxin Auto Parts and discuss fit with our team.'],
  ['products_page', '/products', 'Products', 'Seat assemblies, frames and molded foam', 'Choose a product family, then open a product to inspect its specifications and send an inquiry.', 'Products', 'Seat assemblies, seat frames and molded foam components from Zhoushan Jinxin Auto Parts.'],
  ['news_page', '/news', 'News', 'News', 'Company updates and product announcements.', 'News', 'News from Zhoushan Jinxin Auto Parts Co., Ltd.'],
]
for (const [key, path, eyebrow, title, description, seoTitle, seoDescription] of pageIntros) {
  definition.pages.push({ key, path, label: `${eyebrow} page`, modules: [
    module('intro', 'Page introduction', [
      text('eyebrow', 'Eyebrow', [12, 12], 400, 'site-mono'),
      text('title', 'Page heading', [60, 36], 600),
      text('description', 'Page introduction', [18, 18], 400, 'site-sans', 'textarea'),
    ]),
    module('seo', 'Search result', [type('title', 'text', 'Page title', { localized: true, required: true, maxLength: 160 }), type('description', 'textarea', 'Page description', { localized: true, required: true, maxLength: 300 })]),
  ] })
  content.pages[key] = { order: ['intro', 'seo'], modules: {
    intro: { hidden: false, values: { eyebrow: local(eyebrow), title: local(title), description: local(description) } },
    seo: { hidden: false, values: { title: local(seoTitle), description: local(seoDescription) } },
  } }
  integration.modules.push(`${key}.intro`, `${key}.seo`)
}
const aboutCopy = {
  who_eyebrow: 'The company', who_title: 'One supplier across structure, foam and assembly',
  who_paragraph_1: 'We focus on the parts that make up an automotive seat: the structural frame, the molded foam that shapes comfort, and the complete assemblies that bring them together.',
  who_paragraph_2: 'Our quality management system is certified to IATF 16949:2016 for the design and production of seat components.',
  customers_eyebrow: 'Customer experience', customers_title: 'Past supply experience across the automotive sector',
  customers_description: 'Our company presentation names Dongfeng Commercial Vehicle, Lear, GAC Gonow, Geely and Shanghai Daimay among historical customers served. This is a record of past supply experience, not a statement of current partnership or endorsement.',
  facility_eyebrow: 'Our facility', facility_title: 'Made in Daishan County',
  facility_description: 'Production takes place at our site in Dongsha Town, Daishan County, Zhoushan, Zhejiang.',
  cta_title: 'Talk to our team', cta_text: 'Tell us about your seating requirements and we will respond by email.',
}
const aboutPage = definition.pages.find((page) => page.key === 'about')
aboutPage.modules.splice(1, 0, module('copy', 'About page content', Object.keys(aboutCopy).map((key) => type(key, key.includes('paragraph') || key.endsWith('description') || key === 'cta_text' ? 'textarea' : 'text', key.replaceAll('_', ' '), { localized: true, required: true, maxLength: 700 }))))
content.pages.about.order.splice(1, 0, 'copy')
content.pages.about.modules.copy = { hidden: false, values: Object.fromEntries(Object.entries(aboutCopy).map(([key, value]) => [key, local(value)])) }
aboutPage.modules.find((item) => item.key === 'copy').fields.push(type('facility_image', 'image', 'Factory photograph', { required: true }))
content.pages.about.modules.copy.values.facility_image = pageImage('facility/press-line.png', 'Row of stamping presses with yellow robotic arms on the Jinxin factory floor')
integration.modules.push('about.copy')
const manufacturingCopy = {
  scope_eyebrow: 'Product scope', scope_title: 'What we make',
  floor_eyebrow: 'Factory floor', floor_title: 'Press line with robotic loading',
  floor_description: 'A row of stamping presses served by robotic arms, photographed at our facility in Daishan County.',
  quality_eyebrow: 'Quality', quality_title: 'IATF 16949:2016 certified',
  quality_description: 'Our quality management system is certified by DQS to IATF 16949:2016 for the design and production of seat components.',
  certificate_button: 'View full certificate', certificate_title: 'IATF 16949:2016 certificate',
  cta_title: 'Discuss a component or assembly', cta_text: 'Send your drawing or sample reference and we will review the fit.',
}
const areas = [
  { id: 'frames', title: 'Seat frames and structural parts', description: 'Complete seat frames with slide rails, and the stamped brackets and members that carry the seat.' },
  { id: 'foam', title: 'Molded foam components', description: 'Molded foam for seat cushions and backs, produced to the shape of the seat it supports.' },
  { id: 'assembly', title: 'Seat assembly', description: 'Frame, foam and trim brought together into complete seat configurations.' },
]
const companyGallery = [
  ['2', 'Production equipment', 'Rows of production machines with yellow robotic arms'],
  ['3', 'Workshop line', 'Equipment and workstations in a production workshop'],
  ['4', 'Production workshop', 'Worker beside production tanks in a workshop'],
  ['5', 'Seat frame storage', 'Metal seat frames stored on green racks'],
  ['6', 'Trim workstations', 'Rows of workstations in a light industrial workshop'],
  ['7', 'Sewing equipment', 'Rows of industrial sewing machines'],
  ['8', 'Team at work', 'Team members working at office desks'],
  ['9', 'Company building', 'Exterior of the building shown in the company profile'],
]
const manufacturingPage = definition.pages.find((page) => page.key === 'manufacturing_page')
manufacturingPage.modules.splice(1, 0, module('copy', 'Manufacturing content', [
  ...Object.keys(manufacturingCopy).map((key) => type(key, key.endsWith('description') || key === 'cta_text' ? 'textarea' : 'text', key.replaceAll('_', ' '), { localized: true, required: true, maxLength: 500 })),
  type('areas', 'repeat', 'Product scope', { required: true, maxItems: 3, fields: [type('title', 'text', 'Area title', { localized: true, required: true, maxLength: 130 }), type('description', 'textarea', 'Area description', { localized: true, required: true, maxLength: 400 }), type('image', 'image', 'Customer product photograph', { required: true })] }),
  type('floor_image', 'image', 'Factory floor photograph', { required: true }),
  type('certificate_image', 'image', 'IATF certificate scan', { required: true }),
  type('gallery_title', 'text', 'Company photograph gallery heading', { localized: true, required: true, maxLength: 160 }),
  type('gallery_description', 'textarea', 'Company photograph gallery description', { localized: true, required: true, maxLength: 400 }),
  type('gallery', 'repeat', 'Company profile photographs', { required: true, maxItems: 8, fields: [type('title', 'text', 'Photograph title', { localized: true, required: true, maxLength: 130 }), type('image', 'image', 'Customer supplied photograph', { required: true })] }),
]))
content.pages.manufacturing_page.order.splice(1, 0, 'copy')
content.pages.manufacturing_page.modules.copy = { hidden: false, values: { ...Object.fromEntries(Object.entries(manufacturingCopy).map(([key, value]) => [key, local(value)])), areas: areas.map((area) => ({ id: area.id, title: local(area.title), description: local(area.description), image: pageImage(area.id === 'frames' ? 'products/seat-frame-with-slide-rails.jpg' : area.id === 'foam' ? 'products/molded-seat-cushion-foam.jpg' : 'products/front-seat-assembly.jpg', `Customer supplied ${area.title.toLowerCase()} photograph`) })), floor_image: pageImage('facility/press-line.png', 'Row of stamping presses with yellow robotic arms on the Jinxin factory floor'), certificate_image: pageImage('quality/iatf-16949-certificate.jpg', 'DQS IATF 16949:2016 certificate for Zhoushan Jinxin Auto Parts') } }
Object.assign(content.pages.manufacturing_page.modules.copy.values, {
  gallery_title: local('Inside the company profile'),
  gallery_description: local('Workshop, equipment, office and building photographs supplied in the company information workbook.'),
  gallery: companyGallery.map(([number, title, alt]) => ({ id: `profile-${number}`, title: local(title), image: pageImage(`facility/company-gallery/${number}.png`, alt) })),
})
integration.modules.push('manufacturing_page.copy')
const applicationExamples = [
  { id: 'front-seating', title: 'Front seating', summary: 'Front seat assemblies with headrest, backrest and cushion, supported by seat frames and molded foam.', cta: 'Browse seat assemblies', href: '/products?category=seat-assemblies' },
  { id: 'folding-seating', title: 'Folding seating with belt', summary: 'Folding seat configurations with an integrated seat belt and an armrest, shown as a complete assembly.', cta: 'Browse seat assemblies', href: '/products?category=seat-assemblies' },
]
const optimizedGallery = [
  'Seat back assembly', 'Seat frame storage', 'Light upholstery assembly',
  'Molded foam storage', 'Seat frames in production', 'Black seat assembly',
  'Metal frame assemblies', 'Foam profiles', 'Molded foam components',
]
const applicationsPage = definition.pages.find((page) => page.key === 'applications_page')
applicationsPage.modules.splice(1, 0, module('copy', 'Application examples and CTA', [
  type('examples', 'repeat', 'Application examples', { required: true, maxItems: 2, fields: [
    type('title', 'text', 'Example title', { localized: true, required: true, maxLength: 130 }),
    type('summary', 'textarea', 'Example summary', { localized: true, required: true, maxLength: 400 }),
    type('cta', 'text', 'Button label', { localized: true, required: true, maxLength: 80 }),
    type('href', 'link', 'Button destination', { required: true }),
    type('image', 'image', 'Customer product photograph', { required: true }),
  ] }),
  type('cta_title', 'text', 'CTA title', { localized: true, required: true, maxLength: 140 }),
  type('cta_text', 'textarea', 'CTA text', { localized: true, required: true, maxLength: 350 }),
  type('gallery_title', 'text', 'Supplied photograph gallery heading', { localized: true, required: true, maxLength: 160 }),
  type('gallery_description', 'textarea', 'Supplied photograph gallery description', { localized: true, required: true, maxLength: 400 }),
  type('gallery', 'repeat', 'Additional customer supplied photographs', { required: true, maxItems: 9, fields: [type('title', 'text', 'Photograph title', { localized: true, required: true, maxLength: 130 }), type('image', 'image', 'Customer supplied photograph', { required: true })] }),
]))
content.pages.applications_page.order.splice(1, 0, 'copy')
content.pages.applications_page.modules.copy = { hidden: false, values: {
  examples: applicationExamples.map(({ id, title, summary, cta, href }) => ({ id, title: local(title), summary: local(summary), cta: local(cta), href, image: pageImage(id === 'front-seating' ? 'products/front-seat-assembly.jpg' : 'products/folding-seat-assembly.jpg', `Customer supplied ${title.toLowerCase()} photograph`) })),
  cta_title: local('Have a seat position in mind?'), cta_text: local('Describe the application and we will review which products fit.'),
  gallery_title: local('More from the supplied photo collection'),
  gallery_description: local('Additional seat, frame and foam photographs supplied by the company. These images are not assigned to a specific catalog model.'),
  gallery: optimizedGallery.map((title, index) => ({ id: `optimized-${index + 1}`, title: local(title), image: pageImage(`supplied-gallery/${index + 1}.jpg`, `Customer supplied photograph: ${title.toLowerCase()}`) })),
} }
integration.modules.push('applications_page.copy')
const simpleCopies = [
  ['contact_page', {
    hints_title: 'What helps us respond faster',
    hints_product: 'The product or family you are interested in',
    hints_drawing: 'Drawing number, sample or reference photos',
    hints_quantity: 'Expected quantity, if known',
  }],
  ['products_page', {
    all_products: 'All products', empty_title: 'No products in this family yet',
    empty_description: 'Tell us what you are looking for and we will respond with what fits.',
    empty_cta: 'Send your requirements',
  }],
  ['news_page', {
    empty_title: 'No articles published yet',
    empty_description: 'News will appear here when we publish it. In the meantime, browse our products or get in touch.',
    products_cta: 'Browse products', contact_cta: 'Contact us',
  }],
]
for (const [key, values] of simpleCopies) {
  const page = definition.pages.find((item) => item.key === key)
  page.modules.splice(1, 0, module('copy', `${key} fixed copy`, Object.keys(values).map((field) => type(field, field.endsWith('description') ? 'textarea' : 'text', field.replaceAll('_', ' '), { localized: true, required: true, maxLength: 500 }))))
  content.pages[key].order.splice(1, 0, 'copy')
  content.pages[key].modules.copy = { hidden: false, values: Object.fromEntries(Object.entries(values).map(([field, value]) => [field, local(value)])) }
  integration.modules.push(`${key}.copy`)
}
const homeModule = (key) => definition.pages[0].modules.find((item) => item.key === key)
const homeValues = (key) => content.pages.home.modules[key].values
homeModule('facility').fields.push(type('image', 'image', 'Factory floor photograph', { required: true }), type('caption', 'text', 'Photograph caption', { localized: true, required: true, maxLength: 150 }))
Object.assign(homeValues('facility'), { image: pageImage('facility/press-line.png', 'Row of stamping presses with yellow robotic arms on the Jinxin factory floor'), caption: local('Press line with robotic loading arms.') })
homeModule('quality').fields.push(type('certificate_image', 'image', 'Valid DQS IATF certificate scan', { required: true }))
homeValues('quality').certificate_image = pageImage('quality/iatf-16949-certificate.jpg', 'DQS IATF 16949:2016 certificate for Zhoushan Jinxin Auto Parts')
const qualityDetails = {
  scope_label: 'Scope of certification', scope_text: 'Design and production of seat components, with product design included.',
  document_label: 'Read the document itself', document_text: 'Open the certificate to see its registration details, dates and issuing body.',
  certificate_button: 'View full certificate', certificate_title: 'IATF 16949:2016 certificate',
}
for (const [key, value] of Object.entries(qualityDetails)) {
  homeModule('quality').fields.push(type(key, key.endsWith('_text') ? 'textarea' : 'text', key.replaceAll('_', ' '), { localized: true, required: true, maxLength: 350 }))
  homeValues('quality')[key] = local(value)
}
homeModule('applications').fields.push(type('examples', 'repeat', 'Application cards', { required: true, maxItems: 2, fields: [
  type('title', 'text', 'Application title', { localized: true, required: true, maxLength: 120 }),
  type('summary', 'textarea', 'Application summary', { localized: true, required: true, maxLength: 400 }),
  type('cta', 'text', 'Application button', { localized: true, required: true, maxLength: 80 }),
  type('href', 'link', 'Application link', { required: true }),
  type('image', 'image', 'Customer product image', { required: true }),
] }), type('all_cta', 'text', 'Section link label', { localized: true, required: true, maxLength: 80 }))
homeValues('applications').examples = content.pages.applications_page.modules.copy.values.examples
homeValues('applications').all_cta = local('See applications')
homeModule('manufacturing').fields.push(type('areas', 'repeat', 'Manufacturing cards', { required: true, maxItems: 3, fields: [
  type('title', 'text', 'Area title', { localized: true, required: true, maxLength: 130 }),
  type('description', 'textarea', 'Area description', { localized: true, required: true, maxLength: 400 }),
  type('image', 'image', 'Customer product image', { required: true }),
] }), type('all_cta', 'text', 'Section link label', { localized: true, required: true, maxLength: 80 }))
homeValues('manufacturing').areas = content.pages.manufacturing_page.modules.copy.values.areas
homeValues('manufacturing').all_cta = local('Manufacturing overview')
homeModule('featured_products').fields.push(type('all_cta', 'text', 'All products link', { localized: true, required: true, maxLength: 80 }))
homeValues('featured_products').all_cta = local('View all products')
homeModule('contact').fields.push(type('cta_label', 'text', 'Inquiry button', { localized: true, required: true, maxLength: 80 }))
homeValues('contact').cta_label = local('Send an inquiry')
const steps = [
  { id: 'send', title: 'Send your requirements', text: 'Share the product, drawing number or sample reference, and the quantity you have in mind.' },
  { id: 'review', title: 'We review the fit', text: 'We look at your request against the products and components we make.' },
  { id: 'discuss', title: 'Discuss the details', text: 'We talk through specifications and next steps directly with you.' },
]
homeModule('cooperation').fields.push(type('steps', 'repeat', 'Cooperation steps', { required: true, maxItems: 3, fields: [
  type('title', 'text', 'Step title', { localized: true, required: true, maxLength: 120 }),
  type('text', 'textarea', 'Step text', { localized: true, required: true, maxLength: 350 }),
] }))
homeValues('cooperation').steps = steps.map(({ id, title, text }) => ({ id, title: local(title), text: local(text) }))
for (const [name, value] of Object.entries({ definition, content, integration })) {
  const output = resolve(root, `${name}.json`)
  mkdirSync(dirname(output), { recursive: true })
  writeFileSync(output, `${JSON.stringify(value, null, 2)}\n`, 'utf8')
}
console.log(JSON.stringify({ pages: definition.pages.map((page) => page.path), modules: integration.modules, slides: slideRows.length }))
