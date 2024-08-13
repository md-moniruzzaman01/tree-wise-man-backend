import { z } from 'zod'

const create = z.object({
  body: z.object({
    title: z.string({
      required_error: 'name is required',
    }),
    content: z.string({
      required_error: 'content is Empty',
    }),
    image: z.string({
      required_error: 'Image is required',
    }),
    urlLink: z.string({
      required_error: 'Link is required',
    }),
    zipCode: z.string({
      required_error: 'zip code is required',
    }),
    state: z.string({
      required_error: 'state is required',
    }),
    published: z.boolean().optional(),
  }),
})

const update = z.object({
  body: z.object({
    title: z.string().optional(),
    content: z.string().optional(),
    Image: z.string().optional(),
    urlLink: z.string().optional(),
    zipCode: z.string().optional(),
    state: z.string().optional(),
    published: z.boolean().optional(),
    disable: z.boolean().optional(),
  }),
})

export const postValidations = {
  create,
  update,
}
