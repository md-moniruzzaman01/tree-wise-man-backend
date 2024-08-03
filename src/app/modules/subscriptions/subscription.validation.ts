import { z } from 'zod';

// Custom date validation to ensure startDate is not in the past
// const futureDate = z.date().refine(date => date >= new Date(), {
//   message: "Date must be in the future or today",
// });

// Helper to parse date strings into Date objects
const parseDateString = (dateString: string) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    throw new Error("Invalid date string");
  }
  return date;
};

// Schema for create validation
const create = z.object({
  body: z.object({
    startDate: z.string().transform(parseDateString).refine(date => date >= new Date(), {
      message: "Start date must be in the future or today",
    }),
    endDate: z.string().transform(parseDateString).refine(date => date > new Date(), {
      message: "End date must be in the future",
    }),
  }),
});

// Schema for update validation
const update = z.object({
  body: z.object({
    startDate: z.string().optional().transform(dateString => {
      const date = dateString ? parseDateString(dateString) : undefined;
      return date;
    }),
    endDate: z.string().optional().transform(dateString => {
      const date = dateString ? parseDateString(dateString) : undefined;
      return date;
    }),
  }).refine((data) => {
    const { startDate, endDate } = data;
    if (startDate && endDate) {
      return endDate > startDate;
    }
    return true;
  }, {
    message: "End date must be after the start date",
  }),
});

export const subscriptionValidations = {
  create,
  update,
};



// import { z } from 'zod';

// // Custom date validation to ensure startDate is not in the past
// const futureDate = z.date().refine(date => date >= new Date(), {
//   message: "Date must be in the future or today",
// });

// // Schema for create validation
// const create = z.object({
//   body: z.object({
//     startDate: futureDate,
//     endDate: z.date({
//       required_error: 'End date is required',
//     }).refine(endDate => {
//       return endDate > new Date();
//     }, {
//       message: "End date must be after the start date",
//     }),
//   }),
// });

// // Schema for update validation
// const update = z.object({
//   body: z.object({
//     startDate: futureDate.optional(),
//     endDate: z.date().optional(),
//   }).refine((data) => {
//     const { startDate, endDate } = data;
//     if (startDate && endDate) {
//       return endDate > startDate;
//     }
//     return true;
//   }, {
//     message: "End date must be after the start date",
//   }),
// });
// export const subscriptionValidations = {
//   create,
//   update,
// };
