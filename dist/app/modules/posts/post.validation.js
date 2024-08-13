"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postValidations = void 0;
const zod_1 = require("zod");
const create = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string({
            required_error: 'name is required',
        }),
        content: zod_1.z.string({
            required_error: 'content is Empty',
        }),
        image: zod_1.z.string({
            required_error: 'Image is required',
        }),
        urlLink: zod_1.z.string({
            required_error: 'Link is required',
        }),
        zipCode: zod_1.z.string({
            required_error: 'zip code is required',
        }),
        state: zod_1.z.string({
            required_error: 'state is required',
        }),
        published: zod_1.z.boolean().optional(),
    }),
});
const update = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().optional(),
        content: zod_1.z.string().optional(),
        Image: zod_1.z.string().optional(),
        urlLink: zod_1.z.string().optional(),
        zipCode: zod_1.z.string().optional(),
        state: zod_1.z.string().optional(),
        published: zod_1.z.boolean().optional(),
        disable: zod_1.z.boolean().optional(),
    }),
});
exports.postValidations = {
    create,
    update,
};
