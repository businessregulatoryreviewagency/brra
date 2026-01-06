// Zambian Public Holidays 2025
export const zambianHolidays2025 = [
  '2025-01-01', // New Year's Day
  '2025-03-08', // International Women's Day
  '2025-03-12', // Youth Day
  '2025-04-18', // Good Friday
  '2025-04-19', // Holy Saturday
  '2025-04-21', // Easter Monday
  '2025-04-28', // Kenneth Kaunda Birthday
  '2025-05-01', // Labour Day
  '2025-05-26', // Africa Day
  '2025-07-07', // Heroes Day
  '2025-07-08', // Unity Day
  '2025-08-04', // Zambia Farmers Day
  '2025-10-18', // National Day of Prayer
  '2025-10-24', // Independence Day
  '2025-12-25', // Christmas
]

// Zambian Public Holidays 2026
export const zambianHolidays2026 = [
  '2026-01-01', // New Year's Day
  '2026-03-08', // International Women's Day
  '2026-03-12', // Youth Day
  '2026-04-03', // Good Friday
  '2026-04-04', // Holy Saturday
  '2026-04-06', // Easter Monday
  '2026-04-28', // Kenneth Kaunda Birthday
  '2026-05-01', // Labour Day
  '2026-05-25', // Africa Day
  '2026-07-06', // Heroes Day
  '2026-07-07', // Unity Day
  '2026-08-03', // Zambia Farmers Day
  '2026-10-24', // Independence Day
  '2026-10-19', // National Day of Prayer
  '2026-12-25', // Christmas
]

export const allHolidays = [...zambianHolidays2025, ...zambianHolidays2026]

/**
 * Check if a date is a weekend (Saturday or Sunday)
 */
export const isWeekend = (date) => {
  const day = date.getDay()
  return day === 0 || day === 6 // 0 = Sunday, 6 = Saturday
}

/**
 * Format date to YYYY-MM-DD
 */
export const formatDateString = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Check if a date is a Zambian public holiday
 */
export const isPublicHoliday = (date) => {
  const dateString = formatDateString(date)
  return allHolidays.includes(dateString)
}

/**
 * Calculate working days between two dates (excluding weekends and public holidays)
 */
export const calculateWorkingDays = (startDate, endDate) => {
  if (!startDate || !endDate) return 0

  const start = new Date(startDate)
  const end = new Date(endDate)

  if (start > end) return 0

  let workingDays = 0
  const currentDate = new Date(start)

  while (currentDate <= end) {
    if (!isWeekend(currentDate) && !isPublicHoliday(currentDate)) {
      workingDays++
    }
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return workingDays
}

/**
 * Calculate months between two dates
 */
export const calculateMonthsBetween = (startDate, endDate) => {
  if (!startDate || !endDate) return 0

  const start = new Date(startDate)
  const end = new Date(endDate)

  const yearsDiff = end.getFullYear() - start.getFullYear()
  const monthsDiff = end.getMonth() - start.getMonth()

  return yearsDiff * 12 + monthsDiff
}

/**
 * Format date for display (e.g., "Jan 15, 2026")
 */
export const formatDisplayDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

/**
 * Get status badge color
 */
export const getStatusColor = (status) => {
  const colors = {
    'Pending Supervisor': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'Pending HR': 'bg-blue-100 text-blue-800 border-blue-200',
    'Pending ED': 'bg-purple-100 text-purple-800 border-purple-200',
    'Approved': 'bg-green-100 text-green-800 border-green-200',
    'Rejected': 'bg-red-100 text-red-800 border-red-200',
    'Cancelled': 'bg-gray-100 text-gray-800 border-gray-200',
  }
  return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200'
}

/**
 * Get status icon
 */
export const getStatusIcon = (status) => {
  const icons = {
    'Pending Supervisor': 'ri-time-line',
    'Pending HR': 'ri-user-line',
    'Pending ED': 'ri-user-star-line',
    'Approved': 'ri-checkbox-circle-line',
    'Rejected': 'ri-close-circle-line',
    'Cancelled': 'ri-close-line',
  }
  return icons[status] || 'ri-information-line'
}
