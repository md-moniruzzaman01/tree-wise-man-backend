"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const zod_1 = require("zod");
const create = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({
            required_error: 'name is required',
        }),
        email: zod_1.z
            .string({
            required_error: 'email is required',
        })
            .email(),
        profileImage: zod_1.z.string({
            required_error: 'Profile image is required',
        }),
        contactNo: zod_1.z.string({
            required_error: 'Contact no is required',
        }),
        designation: zod_1.z.string({
            required_error: 'designation is required',
        }),
        company: zod_1.z.string({
            required_error: 'company name is required',
        }),
    }),
});
const update = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().optional(),
        email: zod_1.z.string().email().optional(),
        profileImage: zod_1.z.string().optional(),
        contactNo: zod_1.z.string().optional(),
        designation: zod_1.z.string().optional(),
        company: zod_1.z.string().optional(),
        role: zod_1.z.enum(["user", "admin", "super_admin"]).optional(),
    }),
});
exports.UserValidation = {
    create,
    update,
};
