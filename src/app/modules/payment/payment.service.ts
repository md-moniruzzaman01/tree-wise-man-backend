import { Payment, Prisma } from '@prisma/client'
import prisma from '../../../shared/prisma'
import { paginationHelpers } from '../../../helpers/paginationHelper'
import { IPaginationOptions } from '../../../interfaces/pagination'
import { IGenericResponse } from '../../../interfaces/common'
import { paymentSearchableFields } from './payment.constant'
import { IPaymentFilterRequest } from './payment.interface'

const getAllFromDB = async (
  filters: IPaymentFilterRequest,
  options: IPaginationOptions,
): Promise<IGenericResponse<Payment[]>> => {
  const { page, limit, skip } = paginationHelpers.calculatePagination(options)
  const { searchTerm } = filters

  const andConditons = []

  if (searchTerm) {
    andConditons.push({
      OR: paymentSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    })
  }

  const whereConditons: Prisma.PaymentWhereInput =
    andConditons.length > 0 ? { AND: andConditons } : {}

  const result = await prisma.payment.findMany({
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
  })
  const total = await prisma.payment.count({
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

const getByIdFromDB = async (id: number): Promise<Payment | null> => {
  const result = await prisma.payment.findUnique({
    where: {
      id,
    },
  })
  return result
}

const deleteByIdFromDB = async (id: string): Promise<Payment> => {
  const parsedId = parseInt(id)

  return await prisma.$transaction(async prisma => {
    const result = await prisma.payment.delete({
      where: {
        id: parsedId,
      },
    })

    return result
  })
}

export const paymentService = {
  getAllFromDB,
  deleteByIdFromDB,
  getByIdFromDB,
}
