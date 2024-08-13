import { Post, Prisma, User } from '@prisma/client'
import prisma from '../../../shared/prisma'
import { paginationHelpers } from '../../../helpers/paginationHelper'
import { IPaginationOptions } from '../../../interfaces/pagination'
import { IGenericResponse } from '../../../interfaces/common'
import { IPost, IPostFilterRequest } from './post.interface'
import { postSearchableFields } from './post.constant'

const insertIntoDB = async (data: IPost): Promise<Post> => {
  //authorId
  const userDetails = await prisma.userDetails.findUnique({
    where: { id: data.authorId },
    include: { user: true, posts: true },
  })

  if (!userDetails) {
    throw new Error('User not found')
  }

  const userRole = userDetails.user.role

  if (userRole === 'user' && userDetails.posts.length >= 1) {
    throw new Error('users can only create one post')
  }

  const result = await prisma.post.create({
    data,
  })
  return result
}

const getAllFromDB = async (
  filters: IPostFilterRequest,
  options: IPaginationOptions,
): Promise<IGenericResponse<Post[]>> => {
  const { page, limit, skip } = paginationHelpers.calculatePagination(options)
  const { searchTerm } = filters

  const andConditons = []

  if (searchTerm) {
    andConditons.push({
      OR: postSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    })
  }

  const whereConditons: Prisma.PostWhereInput = {
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
  }

  const result = await prisma.post.findMany({
    skip,
    take: limit,
    where: whereConditons,
    orderBy:
      options.sortBy && options.sortOrder
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
          profileImage: true,
        },
      },
    },
  })
  const total = await prisma.post.count({
    where: whereConditons,
  })

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  }
}

const getAllMyFromDB = async (
  filters: IPostFilterRequest,
  options: IPaginationOptions,
  user: Partial<User>,
): Promise<IGenericResponse<Post[]>> => {
  const { page, limit, skip } = paginationHelpers.calculatePagination(options)
  const { searchTerm } = filters

  const andConditons = []

  if (searchTerm) {
    andConditons.push({
      OR: postSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    })
  }
  if (user?.id) {
    andConditons.push({
      authorId: user.id,
    })
  }

  const whereConditons: Prisma.PostWhereInput =
    andConditons.length > 0 ? { AND: andConditons } : {}

  const result = await prisma.post.findMany({
    skip,
    take: limit,
    where: whereConditons,
    orderBy:
      options.sortBy && options.sortOrder
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
  })

  const total = await prisma.post.count({
    where: whereConditons,
  })

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  }
}

const getAllFromDBForAdmin = async (
  filters: IPostFilterRequest,
  options: IPaginationOptions,
): Promise<IGenericResponse<Post[]>> => {
  const { page, limit, skip } = paginationHelpers.calculatePagination(options)
  const { searchTerm } = filters

  const andConditons = []

  if (searchTerm) {
    andConditons.push({
      OR: postSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    })
  }

  const whereConditons: Prisma.PostWhereInput =
    andConditons.length > 0 ? { AND: andConditons } : {}

  const result = await prisma.post.findMany({
    skip,
    take: limit,
    where: whereConditons,
    orderBy:
      options.sortBy && options.sortOrder
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
  })

  const total = await prisma.post.count({
    where: whereConditons,
  })

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  }
}

const getByIdFromDB = async (id: number): Promise<Post | null> => {
  const result = await prisma.post.findUnique({
    where: {
      id,
    },
  })
  return result
}

const updateViewCountInDB = async (id: string) => {
  const postId = parseInt(id)
  const postClick = await prisma.postClick.findFirst({
    where: { postId },
  })
  if (postClick) {
    await prisma.postClick.update({
      where: { id: postClick.id },
      data: { clickCount: { increment: 1 } },
    })
  } else {
    await prisma.postClick.create({
      data: {
        postId,
        clickCount: 1,
      },
    })
  }
}
const updateOneInDB = async (
  id: string,
  payload: Partial<Post>,
  isAdmin: boolean,
): Promise<Post> => {
  if (!isAdmin && (payload.disable !== null || payload.disable !== undefined)) {
    delete payload.disable
  }

  const result = await prisma.post.update({
    where: {
      id: parseInt(id),
    },
    data: payload,
  })
  return result
}

const deleteByIdFromDB = async (id: string): Promise<Post> => {
  const parsedId = parseInt(id)

  return await prisma.$transaction(async prisma => {
    await prisma.postClick.deleteMany({
      where: {
        postId: parsedId,
      },
    })

    // Delete the post
    const result = await prisma.post.delete({
      where: {
        id: parsedId,
      },
    })

    return result
  })
}
const getAnalyticsFromDB = async () => {
  const totalUsers = await prisma.user.count()
  const totalPosts = await prisma.post.count()
  const totalPostClicks = await prisma.postClick.aggregate({
    _sum: {
      clickCount: true,
    },
  })
  const totalSubscribedUsers = await prisma.subscription.count()
  const result = {
    totalUsers,
    totalPosts,
    totalPostClicks: totalPostClicks._sum.clickCount || 0,
    totalSubscribedUsers,
  }
  return {
    meta: {
      page: 1,
      limit: 1,
      total: 1,
    },
    data: result,
  }
}

export const postService = {
  insertIntoDB,
  getAllFromDB,
  updateOneInDB,
  updateViewCountInDB,
  deleteByIdFromDB,
  getAllFromDBForAdmin,
  getByIdFromDB,
  getAnalyticsFromDB,
  getAllMyFromDB,
}
