import { Prisma, UserDetails } from '@prisma/client'
import httpStatus from 'http-status'
//
import { IGenericResponse } from '../../../interfaces/common'
import { IPaginationOptions } from '../../../interfaces/pagination'
import { ICustomerFilterRequest } from './customer.interface'
import { paginationHelpers } from '../../../helpers/paginationHelper'
import { customerSearchableFields } from './customer.constant'
import prisma from '../../../shared/prisma'
import { CreateUserInput } from '../user/user.interface'

import ApiError from '../../../errors/ApiError'

const getAllFromDB = async (
  filters: ICustomerFilterRequest,
  options: IPaginationOptions,
): Promise<IGenericResponse<UserDetails[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options)
  const { searchTerm, ...filterData } = filters

  const andConditions = []

  if (searchTerm) {
    andConditions.push({
      OR: customerSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    })
  }

  andConditions.push({
    role: 'user',
  })

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.entries(filterData).map(([field, value]) => ({
        [field]: value,
      })),
    })
  }

  const whereConditions: Prisma.UserDetailsWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {}

  const result = await prisma.userDetails.findMany({
    where: whereConditions,
    skip,
    take: limit,
    include: {
      subscription: {
        select: {
          startDate: true,
          endDate: true,
        },
      },
    },
  })

  const total = await prisma.userDetails.count({
    where: whereConditions,
  })

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  }
}

const getByIdFromDB = async (id: number): Promise<UserDetails | null> => {
  const result = await prisma.userDetails.findUnique({
    where: {
      id,
      role: 'user',
    },
    include: {
      subscription: true,
    },
  })
  return result
}

const updateIntoDB = async (
  id: string,
  payload: CreateUserInput,
): Promise<UserDetails> => {
  const result = await prisma.userDetails.update({
    where: {
      id: parseInt(id),
      role: 'user',
    },
    data: {
      ...payload,
      user: payload.email
        ? {
            update: {
              email: payload.email,
            },
          }
        : undefined,
    },
    include: {
      user: true,
    },
  })
  return result
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const deleteFromDB = async (id: string, ReqUser: any): Promise<UserDetails> => {
  const parsedId = parseInt(id)

  const user = await prisma.userDetails.findUnique({
    where: {
      id: parsedId,
      role: 'user',
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
  })

  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'user not found')
  }
  const isAdmin = user.role === 'admin'
  const isOwner = user.userId === ReqUser.id

  if (!isAdmin && !isOwner) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      'You are not authorized to delete this user',
    )
  }

  return await prisma.$transaction(async prisma => {
    await prisma.post.deleteMany({
      where: {
        authorId: parsedId,
      },
    })

    if (user.subscription) {
      await prisma.payment.deleteMany({
        where: {
          subscriptionId: user.subscription.id,
        },
      })

      await prisma.subscription.delete({
        where: {
          id: user.subscription.id,
        },
      })
    }

    const result = await prisma.userDetails.delete({
      where: {
        id: parsedId,
      },
    })

    await prisma.user.delete({
      where: {
        id: result.userId,
      },
    })

    return result
  })
}

export const customerService = {
  getAllFromDB,
  getByIdFromDB,
  deleteFromDB,
  updateIntoDB,
}
