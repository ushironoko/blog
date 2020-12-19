export const toJPFormat = (date: Date | number) =>
  new Intl.DateTimeFormat('jp').format(date)
