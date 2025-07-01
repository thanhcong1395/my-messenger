import { format, formatDistanceToNow } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'
import { enUS } from 'date-fns/locale'
import type { FieldValue, Timestamp } from 'firebase/firestore'

export function formatFriendlyTime(
  input: FieldValue | Timestamp | Date | null | undefined,
  timeZone: string = 'Asia/Ho_Chi_Minh',
): string {
  if (!input) return ''

  let date: Date

  if (input instanceof Date) {
    date = input
  } else if ('toDate' in input && typeof input.toDate === 'function') {
    try {
      date = input.toDate()
    } catch {
      return 'Sending...'
    }
  } else {
    return 'Sending...'
  }

  const zoned = toZonedTime(date, timeZone)
  const diffInMs = Date.now() - zoned.getTime()

  if (diffInMs < 60_000) return 'Moment'
  if (diffInMs < 86_400_000) return formatDistanceToNow(zoned, { locale: enUS, addSuffix: true })

  return format(zoned, 'HH:mm, dd/MM/yyyy', { locale: enUS })
}
