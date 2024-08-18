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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const post_constant_1 = require("./post.constant");
const insertIntoDB = (data) => __awaiter(void 0, void 0, void 0, function* () {
    //authorId
    const userDetails = yield prisma_1.default.userDetails.findUnique({
        where: { id: data.authorId },
        include: { user: true, posts: true },
    });
    if (!userDetails) {
        throw new Error('User not found');
    }
    const userRole = userDetails.user.role;
    if (userRole === 'user' && userDetails.posts.length >= 1) {
        throw new Error('users can only create one post');
    }
    const result = yield prisma_1.default.post.create({
        data,
    });
    return result;
});
const getAllFromDB = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelpers.calculatePagination(options);
    const { searchTerm } = filters;
    const andConditons = [];
    if (searchTerm) {
        andConditons.push({
            OR: post_constant_1.postSearchableFields.map(field => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive',
                },
            })),
        });
    }
    const whereConditons = {
        AND: andConditons.length > 0 ? { AND: andConditons } : {},
        OR: [
            {
                author: {
                    role: 'admin',
                },
            },
            {
                author: {
                    subscription: {
                        endDate: {
                            gte: new Date(),
                        },
                    },
                },
            },
        ],
    };
    const result = yield prisma_1.default.post.findMany({
        skip,
        take: limit,
        where: whereConditons,
        orderBy: options.sortBy && options.sortOrder
            ? {
                [options.sortBy]: options.sortOrder,
            }
            : {
                createdAt: 'desc',
            },
        include: {
            author: {
                select: {
                    id: true,
                    name: true,
                    role: true,
                    designation: true,
                    contactNo: true,
                    profileImage: true,
                },
            },
        },
    });
    const total = yield prisma_1.default.post.count({
        where: whereConditons,
    });
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const getAllMyFromDB = (filters, options, user) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelpers.calculatePagination(options);
    const { searchTerm } = filters;
    const andConditons = [];
    if (searchTerm) {
        andConditons.push({
            OR: post_constant_1.postSearchableFields.map(field => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive',
                },
            })),
        });
    }
    if (user === null || user === void 0 ? void 0 : user.id) {
        andConditons.push({
            authorId: user.id,
        });
    }
    const whereConditons = andConditons.length > 0 ? { AND: andConditons } : {};
    const result = yield prisma_1.default.post.findMany({
        skip,
        take: limit,
        where: whereConditons,
        orderBy: options.sortBy && options.sortOrder
            ? {
                [options.sortBy]: options.sortOrder,
            }
            : {
                createdAt: 'desc',
            },
        include: {
            clicks: {
                select: {
                    clickCount: true,
                },
            },
            author: {
                select: {
                    id: true,
                    name: true,
                    role: true,
                    profileImage: true,
                    subscription: {
                        select: {
                            endDate: true,
                        },
                    },
                },
            },
        },
    });
    const total = yield prisma_1.default.post.count({
        where: whereConditons,
    });
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const getAllFromDBForAdmin = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelpers.calculatePagination(options);
    const { searchTerm } = filters;
    const andConditons = [];
    if (searchTerm) {
        andConditons.push({
            OR: post_constant_1.postSearchableFields.map(field => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive',
                },
            })),
        });
    }
    const whereConditons = andConditons.length > 0 ? { AND: andConditons } : {};
    const result = yield prisma_1.default.post.findMany({
        skip,
        take: limit,
        where: whereConditons,
        orderBy: options.sortBy && options.sortOrder
            ? {
                [options.sortBy]: options.sortOrder,
            }
            : {
                createdAt: 'desc',
            },
        include: {
            clicks: {
                select: {
                    clickCount: true,
                },
            },
            author: {
                select: {
                    id: true,
                    name: true,
                    role: true,
                    profileImage: true,
                    subscription: {
                        select: {
                            endDate: true,
                        },
                    },
                },
            },
        },
    });
    const total = yield prisma_1.default.post.count({
        where: whereConditons,
    });
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const getByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.post.findUnique({
        where: {
            id,
        },
    });
    return result;
});
const updateViewCountInDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = parseInt(id);
    const postClick = yield prisma_1.default.postClick.findFirst({
        where: { postId },
    });
    if (postClick) {
        yield prisma_1.default.postClick.update({
            where: { id: postClick.id },
            data: { clickCount: { increment: 1 } },
        });
    }
    else {
        yield prisma_1.default.postClick.create({
            data: {
                postId,
                clickCount: 1,
            },
        });
    }
});
const updateOneInDB = (id, payload, isAdmin) => __awaiter(void 0, void 0, void 0, function* () {
    if (!isAdmin && (payload.disable !== null || payload.disable !== undefined)) {
        delete payload.disable;
    }
    const result = yield prisma_1.default.post.update({
        where: {
            id: parseInt(id),
        },
        data: payload,
    });
    return result;
});
const deleteByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedId = parseInt(id);
    return yield prisma_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.postClick.deleteMany({
            where: {
                postId: parsedId,
            },
        });
        // Delete the post
        const result = yield prisma.post.delete({
            where: {
                id: parsedId,
            },
        });
        return result;
    }));
});
const getAnalyticsFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const totalUsers = yield prisma_1.default.user.count();
    const totalPosts = yield prisma_1.default.post.count();
    const totalPostClicks = yield prisma_1.default.postClick.aggregate({
        _sum: {
            clickCount: true,
        },
    });
    const totalSubscribedUsers = yield prisma_1.default.subscription.count();
    const result = {
        totalUsers,
        totalPosts,
        totalPostClicks: totalPostClicks._sum.clickCount || 0,
        totalSubscribedUsers,
    };
    return {
        meta: {
            page: 1,
            limit: 1,
            total: 1,
        },
        data: result,
    };
});
exports.postService = {
    insertIntoDB,
    getAllFromDB,
    updateOneInDB,
    updateViewCountInDB,
    deleteByIdFromDB,
    getAllFromDBForAdmin,
    getByIdFromDB,
    getAnalyticsFromDB,
    getAllMyFromDB,
};
