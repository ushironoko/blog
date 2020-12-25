import dayjs from 'dayjs'
export const dateFormat = (date: Date) => dayjs(date).format('YYYY/MM/DD')
