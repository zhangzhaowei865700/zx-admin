import dayjs from 'dayjs'

export function formatDate(date?: string | number | Date, format = 'YYYY-MM-DD HH:mm:ss'): string {
  if (!date) return '-'
  return dayjs(date).format(format)
}

export function formatMoney(amount: number | string): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount
  if (isNaN(num)) return '-'
  return `¥${num.toFixed(2)}`
}

export function formatNumber(num: number | string): string {
  const n = typeof num === 'string' ? parseFloat(num) : num
  if (isNaN(n)) return '-'
  return n.toLocaleString()
}
