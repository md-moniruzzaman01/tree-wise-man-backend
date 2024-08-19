export type ISubcriptionFilterRequest = {
  searchTerm?: string
}

export type ISubscription = {
  startDate: Date
  endDate: Date
  amount: number
  userId: number
  month: number
}
