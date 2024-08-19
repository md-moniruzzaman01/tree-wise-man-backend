'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.subscriptionValidations = void 0
const zod_1 = require('zod')
// Custom date validation to ensure startDate is not in the past
// const futureDate = z.date().refine(date => date >= new Date(), {
//   message: "Date must be in the future or today",
// });
// Helper to parse date strings into Date objects
const parseDateString = dateString => {
  const date = new Date(dateString)
  if (isNaN(date.getTime())) {
    throw new Error('Invalid date string')
  }
  return date
}
// Schema for create validation
const create = zod_1.z.object({
  body: zod_1.z.object({
    userId: zod_1.z.string({
      required_error: 'User ID is required',
    }),
    startDate: zod_1.z
      .string()
      .transform(parseDateString)
      .refine(date => date >= new Date(), {
        message: 'Start date must be in the future or today',
      }),
    endDate: zod_1.z
      .string()
      .transform(parseDateString)
      .refine(date => date > new Date(), {
        message: 'End date must be in the future',
      }),
  }),
})
// Schema for update validation
const update = zod_1.z.object({
  body: zod_1.z
    .object({
      startDate: zod_1.z
        .string()
        .optional()
        .transform(dateString => {
          const date = dateString ? parseDateString(dateString) : undefined
          return date
        }),
      endDate: zod_1.z
        .string()
        .optional()
        .transform(dateString => {
          const date = dateString ? parseDateString(dateString) : undefined
          return date
        }),
    })
    .refine(
      data => {
        const { startDate, endDate } = data
        if (startDate && endDate) {
          return endDate > startDate
        }
        return true
      },
      {
        message: 'End date must be after the start date',
      },
    ),
})
exports.subscriptionValidations = {
  create,
  update,
}
