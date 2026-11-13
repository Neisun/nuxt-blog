// 下载文章封面图（数据源：wallpaperhub.app，Bing 每日壁纸镜像站）
// 流程：sitemap 拿全部壁纸 ID → 详情 API 拿标题/标签 → 关键词筛选 → 下载 1080p → md5 去重
// 用法：
//   node scripts/download-covers.mjs        # 补齐到 93 张
//   node scripts/download-covers.mjs 20     # 本次最多再下 20 张（分批执行）
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'

const OUT_DIR = 'public/images/covers'
const PROGRESS_FILE = 'scripts/.covers-progress.json'
const TOTAL = 93 // 需要的图片总数
const TIMEOUT = 10000 // 单次请求超时（毫秒）
const API_CONCURRENCY = 3 // 详情接口并发数（过高会触发站点限流导致挂起）

// 排除的主题关键词：动物 / 人物 / 食物 / 产品 logo，不属于科技、文化、风景
const EXCLUDE = [
  'animal',
  'bird',
  'deer',
  'fox',
  'bear',
  'penguin',
  'elephant',
  'lion',
  'tiger',
  'leopard',
  'wildlife',
  'dog',
  'cat',
  'kitten',
  'puppy',
  'horse',
  'butterfly',
  'insect',
  'fish',
  'whale',
  'dolphin',
  'seal',
  'otter',
  'monkey',
  'owl',
  'eagle',
  'flamingo',
  'zebra',
  'giraffe',
  'rabbit',
  'squirrel',
  'hedgehog',
  'koala',
  'panda',
  'wolf',
  'sheep',
  'goat',
  'lizard',
  'snake',
  'turtle',
  'frog',
  'bee',
  'spider',
  'swan',
  'duck',
  'parrot',
  'reindeer',
  'camel',
  'cheetah',
  'lynx',
  'octopus',
  'jellyfish',
  'crab',
  'shark',
  'hummingbird',
  'toucan',
  'raccoon',
  'sloth',
  'people',
  'portrait',
  'selfie',
  'child',
  'children',
  'baby',
  'family',
  'woman',
  'girl',
  'boy',
  'human',
  'face',
  'crowd',
  'dancer',
  'athlete',
  'man',
  'kids',
  'food',
  'cake',
  'fruit',
  'vegetable',
  'recipe',
  'cuisine',
  'chef',
  'cooking',
  'bread',
  'coffee',
  'dish',
  'meal',
  'restaurant',
  // 多语言动物/人物词（法文/德文/西文等）
  'grues',
  'oiseau',
  'oiseaux',
  'ours',
  'cerf',
  'renard',
  'loup',
  'pingouin',
  'manchot',
  'ecureuil',
  'papillon',
  'abeille',
  'poisson',
  'baleine',
  'dauphin',
  'phoque',
  'chouette',
  'aigle',
  'vogel',
  'tier',
  'fuchs',
  'hirsch',
  'katze',
  'hund',
  'elefant',
  'lowe',
  'fisch',
  'wal',
  'delfin',
  'eule',
  'adler',
  'schmetterling',
  'pajaro',
  'oso',
  'zorro',
  'ciervo',
  'gato',
  'perro',
  'elefante',
  'leon',
  'tigre',
  'pez',
  'ballena',
  'buho',
  'aguila',
  'mariposa',
  'wildlife',
  'fauna',
  'mammal',
  'reptile',
]

const EXCLUDE_RE = new RegExp(`\\b(${EXCLUDE.join('|')})\\b`, 'i')

// CJK（中日文）词无单词边界，改用包含匹配
const CJK_EXCLUDE = [
  'ペンギン',
  'ナマケモノ',
  '子グマ',
  '小熊',
  '小鳥',
  '小鸟',
  '鳥たち',
  '鸟儿',
  'シャチ',
  '小魚',
  '小鱼',
  '鲨鱼',
  '蝶',
  '蝴蝶',
  '皮毛',
  '羽ばたく',
  'キノコ',
  '干し柿',
  '蘑菇',
  'キツネ',
  'シカ',
  'ネコ',
  'イヌ',
  'サル',
  'ゾウ',
  'ライオン',
  'ウサギ',
  'リス',
  'ハチ',
  'クジラ',
  'イルカ',
  'アザラシ',
  'ラッコ',
  'フクロウ',
  'ワシ',
  'フラミンゴ',
  'シマウマ',
  'キリン',
  'オオカミ',
  'ヒツジ',
  'ヤギ',
  'トカゲ',
  'ヘビ',
  'カメ',
  'カエル',
  'ハクチョウ',
  'オウム',
  'トナカイ',
  'ラクダ',
  'タコ',
  'クラゲ',
  'カニ',
  'サメ',
  'ハチドリ',
  'コアラ',
  'パンダ',
  'ハリネズミ',
  '動物',
  '动物',
  '野生',
]

function isExcluded(text) {
  if (!text) return false
  const lower = text.toLowerCase()
  if (EXCLUDE_RE.test(lower)) return true
  return CJK_EXCLUDE.some((w) => lower.includes(w))
}

// 下载文本，超时返回 null
async function fetchText(url, ms = TIMEOUT) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), ms)
  try {
    const res = await fetch(url, { signal: controller.signal })
    if (!res.ok) return null
    return await res.text()
  } catch {
    return null
  } finally {
    clearTimeout(timer)
  }
}

// 请求 JSON，超时或失败返回 null
async function fetchJson(url, ms = TIMEOUT) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), ms)
  try {
    const res = await fetch(url, { signal: controller.signal })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  } finally {
    clearTimeout(timer)
  }
}

// 下载整个响应（含 body），超时返回 null
async function downloadBuffer(url, ms = TIMEOUT) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), ms)
  try {
    const res = await fetch(url, { signal: controller.signal })
    if (!res.ok) return null
    return Buffer.from(await res.arrayBuffer())
  } catch {
    return null
  } finally {
    clearTimeout(timer)
  }
}

function md5(buf) {
  return crypto.createHash('md5').update(buf).digest('hex')
}

// 从 sitemap 提取全部壁纸 ID（按数字倒序，最新优先）
async function fetchAllIds() {
  const ids = new Set()
  for (const n of [1, 2, 3, 4]) {
    const xml = await fetchText(`https://www.wallpaperhub.app/sitemap-wallpapers-${n}.xml`)
    if (!xml) continue
    for (const m of xml.matchAll(/\/wallpapers\/(\d+)/g)) {
      ids.add(Number(m[1]))
    }
  }
  return [...ids].sort((a, b) => b - a)
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

// 简单的并发池（每次任务之间加随机间隔，避免触发站点限流）
async function mapLimit(items, limit, fn) {
  let next = 0
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length) {
      const idx = next++
      await fn(items[idx], idx)
      await sleep(300 + Math.random() * 400)
    }
  })
  await Promise.all(workers)
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true })

  // 断点续传：保留已下载图片，统计 md5 用于去重
  const existing = fs.readdirSync(OUT_DIR).filter((f) => /^\d{3}\.jpg$/.test(f))
  const seen = new Set()
  for (const f of existing) {
    seen.add(md5(fs.readFileSync(path.join(OUT_DIR, f))))
  }
  let saved = existing.length

  // 本次目标数量：默认补齐到 TOTAL，也可传参分批（如 20）
  const extra = Number(process.argv[2]) || TOTAL - saved
  const target = Math.min(TOTAL, saved + extra)

  // 进度文件：记录已检查过的壁纸 ID，重跑时跳过
  let done = new Set()
  if (fs.existsSync(PROGRESS_FILE)) {
    try {
      done = new Set(JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8')))
    } catch {
      done = new Set()
    }
  }
  const saveProgress = () => fs.writeFileSync(PROGRESS_FILE, JSON.stringify([...done]))

  const ids = await fetchAllIds()
  const pending = ids.filter((id) => !done.has(id))
  console.log(
    `共有 ${ids.length} 个壁纸，未检查 ${pending.length} 个；已有 ${saved} 张，本次目标 ${target} 张`,
  )

  let checked = 0
  await mapLimit(pending, API_CONCURRENCY, async (id) => {
    if (saved >= target) return
    done.add(id)
    checked++

    try {
      const d = await fetchJson(`https://wallpaperhub.app/api/v1/wallpapers/${id}`)
      if (!d?.entity) return
      const e = d.entity
      const title = e.title || ''
      const desc = e.description || ''

      // 标签过滤：只保留摄影（风景/自然/文化）与数字艺术（科技/抽象），
      // 排除 windows/surface/microsoft/logos 等产品渲染图
      const tags = e.tags || []
      if (!tags.some((t) => t === 'photography' || t === 'digital')) return

      // 主题过滤：排除动物 / 人物 / 食物（同时匹配标题与描述）
      if (isExcluded(title) || isExcluded(desc)) return

      // 优先 1080p（1920x1080），其次原图
      const resolutions = e.variations?.[0]?.resolutions || []
      const r = resolutions.find((x) => x.resolutionLabel === '1080p') || resolutions[0]
      if (!r?.url) return

      const buf = await downloadBuffer(r.url)
      if (!buf) return

      const hash = md5(buf)
      if (seen.has(hash)) return

      if (saved >= target) return
      seen.add(hash)
      const name = String(saved + 1).padStart(3, '0') + '.jpg'
      fs.writeFileSync(path.join(OUT_DIR, name), buf)
      saved++
      console.log(`[${saved}/${target}] #${id} ${e.title} [${tags.join(',')}]`)
    } catch {
      // 忽略单条失败，继续下一条
    }

    if (checked % 50 === 0) {
      saveProgress()
      process.stdout.write(`已检查 ${checked}/${pending.length}\r`)
    }
  })

  saveProgress()
  console.log(`\n完成！当前共 ${saved} 张，保存在 ${OUT_DIR}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
