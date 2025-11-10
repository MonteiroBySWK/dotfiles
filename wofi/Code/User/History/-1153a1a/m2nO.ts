export const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" })
    .format(date)
    .replace(" de ", ", ");
