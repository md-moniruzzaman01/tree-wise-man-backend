"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const customer_constant_1 = require("./customer.constant");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const getAllFromDB = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip } = paginationHelper_1.paginationHelpers.calculatePagination(options);
    const { searchTerm } = filters, filterData = __rest(filters, ["searchTerm"]);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            OR: customer_constant_1.customerSearchableFields.map(field => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive',
                },
            })),
        });
    }
    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.entries(filterData).map(([field, value]) => ({
                [field]: value,
            })),
        });
    }
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = yield prisma_1.default.userDetails.findMany({
        where: whereConditions,
        skip,
        take: limit,
    });
    const total = yield prisma_1.default.userDetails.count({
        where: whereConditions,
    });
    return {
        meta: {
            total,
            page,
            limit,
        },
        data: result,
    };
});
const getByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.userDetails.findUnique({
        where: {
            id,
        },
    });
    return result;
});
const updateIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.userDetails.update({
        where: {
            id: parseInt(id),
        },
        data: Object.assign(Object.assign({}, payload), { user: payload.email
                ? {
                    update: {
                        email: payload.email,
                    },
                }
                : undefined }),
        include: {
            user: true,
        },
    });
    return result;
});
const deleteFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedId = parseInt(id);
    const user = yield prisma_1.default.userDetails.findUnique({
        where: {
            id: parsedId,
        },
        include: {
            user: true,
            posts: true,
            subscription: {
                include: {
                    payments: true,
                },
            },
        },
    });
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'user not found');
    }
    return yield prisma_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.post.deleteMany({
            where: {
                authorId: parsedId,
            },
        });
        if (user.subscription) {
            yield prisma.payment.deleteMany({
                where: {
                    subscriptionId: user.subscription.id,
                },
            });
            yield prisma.subscription.delete({
                where: {
                    id: user.subscription.id,
                },
            });
        }
        const result = yield prisma.userDetails.delete({
            where: {
                id: parsedId,
            },
        });
        yield prisma.user.delete({
            where: {
                id: result.userId,
            },
        });
        return result;
    }));
});
exports.customerService = {
    getAllFromDB,
    getByIdFromDB,
    deleteFromDB,
    updateIntoDB,
};
