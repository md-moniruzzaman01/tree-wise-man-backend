import { z } from "zod";

const create = z.object({
    body: z.object({
        name: z.string({
            required_error: 'name is required',
        }),
        email: z
            .string({
                required_error: 'email is required',
            })
            .email(),
        profileImage: z.string({
            required_error: 'Profile image is required',
        }),
        contactNo: z.string({
            required_error: 'Contact no is required',
        }),
        designation: z.string({
            required_error: 'designation is required',
        }),
        company: z.string({
            required_error: 'company name is required',
        }),

    }),
});
const update = z.object({
    body: z.object({
        name: z.string().optional(),
        email: z.string().email().optional(),
        profileImage: z.string().optional(),
        contactNo: z.string().optional(),
        designation: z.string().optional(),
        company: z.string().optional(),

    }),
});

export const UserValidation = {
    create,
    update
};
