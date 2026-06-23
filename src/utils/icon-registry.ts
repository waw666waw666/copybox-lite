import {
  Mail, FileText, Link, MessageSquare, User, Code,
  Folder, Tag, Star, Bookmark, Flag, Globe,
  Briefcase, Monitor, Command, Box, Database, Image,
  Send, Lightbulb, Settings, Target, Shield, Heart,
  type LucideIcon,
} from 'lucide-react'

export const ICON_REGISTRY: Record<string, LucideIcon> = {
  mail: Mail,
  'file-text': FileText,
  link: Link,
  'message-square': MessageSquare,
  user: User,
  code: Code,
  folder: Folder,
  tag: Tag,
  star: Star,
  bookmark: Bookmark,
  flag: Flag,
  globe: Globe,
  briefcase: Briefcase,
  monitor: Monitor,
  command: Command,
  box: Box,
  database: Database,
  image: Image,
  send: Send,
  lightbulb: Lightbulb,
  settings: Settings,
  target: Target,
  shield: Shield,
  heart: Heart,
}

export const COLOR_OPTIONS = [
  { name: '蓝', value: '#2563EB' },
  { name: '绿', value: '#10B981' },
  { name: '紫', value: '#8B5CF6' },
  { name: '橙', value: '#F97316' },
  { name: '粉', value: '#EC4899' },
  { name: '青', value: '#06B6D4' },
  { name: '黄', value: '#EAB308' },
  { name: '灰', value: '#9CA3AF' },
  { name: '红', value: '#EF4444' },
  { name: '靛', value: '#6366F1' },
  { name: '青绿', value: '#14B8A6' },
  { name: '棕', value: '#A16207' },
]

export function getIcon(name: string): LucideIcon {
  return ICON_REGISTRY[name] || Mail
}
