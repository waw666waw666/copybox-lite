const DOMAIN_ICON_MAP: Record<string, string> = {
  'qq.com': 'mail',
  '163.com': 'mail',
  '126.com': 'mail',
  'gmail.com': 'mail',
  'outlook.com': 'mail',
  'hotmail.com': 'mail',
  'live.com': 'mail',
  'yahoo.com': 'mail',
  'icloud.com': 'mail',
  'google.com': 'globe',
  'github.com': 'code',
  'twitter.com': 'message-square',
  'x.com': 'message-square',
  'facebook.com': 'globe',
  'instagram.com': 'image',
  'youtube.com': 'monitor',
  'bilibili.com': 'monitor',
  'zhihu.com': 'globe',
  'juejin.cn': 'code',
  'csdn.net': 'code',
  'stackoverflow.com': 'code',
  'npmjs.com': 'box',
  'figma.com': 'image',
  'notion.so': 'file-text',
  't.me': 'send',
  'telegram.org': 'send',
  'slack.com': 'message-square',
  'discord.com': 'message-square',
  'weibo.com': 'globe',
  'taobao.com': 'tag',
  'jd.com': 'tag',
  'alipay.com': 'shield',
  'baidu.com': 'globe',
  'douyin.com': 'monitor',
}

const CONTENT_PATTERN_MAP: Array<{ pattern: RegExp; icon: string }> = [
  { pattern: /\S+@\S+\.\S+/, icon: 'mail' },
  { pattern: /github\.com/i, icon: 'code' },
  { pattern: /api[_\s]/i, icon: 'code' },
  { pattern: /https?:\/\//i, icon: 'link' },
  { pattern: /密码|password|pwd/i, icon: 'shield' },
  { pattern: /用户名|username|user/i, icon: 'user' },
  { pattern: /ssh|token|key/i, icon: 'shield' },
]

export function detectIconFromContent(content: string): string | null {
  for (const { pattern, icon } of CONTENT_PATTERN_MAP) {
    if (pattern.test(content)) return icon
  }
  return null
}

export function detectIconFromUrl(url: string): string | null {
  try {
    const hostname = new URL(url).hostname.replace('www.', '')
    for (const [domain, icon] of Object.entries(DOMAIN_ICON_MAP)) {
      if (hostname === domain || hostname.endsWith('.' + domain)) return icon
    }
  } catch {}
  return null
}

export function autoDetectIcon(title: string, content: string): string | null {
  const combined = title + ' ' + content
  const fromContent = detectIconFromContent(combined)
  if (fromContent) return fromContent

  const urlMatch = combined.match(/https?:\/\/[^\s]+/)
  if (urlMatch) {
    const fromUrl = detectIconFromUrl(urlMatch[0])
    if (fromUrl) return fromUrl
  }

  return null
}
