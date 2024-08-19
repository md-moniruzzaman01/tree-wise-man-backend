import { subcriptionFilterableFields } from './subscription.constant'
import {
  ISubscription,
  ISubcriptionFilterRequest,
} from './subscription.interface'
import { Prisma, Subscription } from '@prisma/client'
import prisma from '../../../shared/prisma'
import { IPaginationOptions } from '../../../interfaces/pagination'
import { paginationHelpers } from '../../../helpers/paginationHelper'
import { IGenericResponse } from '../../../interfaces/common'
import config from '../../../config'
import paypal from '../../../shared/paypal'
import ApiError from '../../../errors/ApiError'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const insertIntoDB = async (data: ISubscription): Promise<any> => {
  const paymentResult = await MakePayment(data.amount)

  if (paymentResult?.state === 'created') {
    let subscription = await prisma.subscription.findUnique({
      where: {
        userId: data.userId,
      },
    })
    if (!subscription) {
      subscription = await prisma.subscription.create({
        data: {
          userId: data.userId,
        },
      })
    }

    await prisma.payment.create({
      data: {
        amount: data.amount,
        subscriptionId: subscription.id,
        paymentId: paymentResult.id,
        status: 'pending',
      },
    })

    return paymentResult
  } else {
    throw new ApiError(500, 'Payment was not created successfully')
  }
}

const executePayment = async (data: { PayerID: string; paymentId: string }) => {
  const payerId = data.PayerID
  const paymentId = data.paymentId

  const paymentHistory = await prisma.payment.findUnique({
    where: {
      paymentId,
    },
  })
  if (!paymentHistory) {
    throw new ApiError(400, 'payment history not found')
  }
  const execute_payment_json = {
    payer_id: payerId,
    transactions: [
      {
        amount: {
          currency: 'USD',
          total: paymentHistory.amount.toString(),
        },
      },
    ],
  }

  const paymentResult = await new Promise((resolve, reject) => {
    paypal.payment.execute(
      data.paymentId,
      execute_payment_json,
      async (error, payment) => {
        if (error) {
          const subscription = await prisma.subscription.findFirst({
            where: {
              id: paymentHistory.subscriptionId,
            },
          })
          if (subscription) {
            await prisma.subscription.delete({
              where: { id: subscription.id },
            })
          }

          reject(new ApiError(500, 'Payment execution failed'))
        } else {
          resolve(payment)
        }
      },
    )
  })

  const subscription = await prisma.subscription.findUnique({
    where: { id: paymentHistory.subscriptionId },
  })

  if (subscription) {
    const currentDate = new Date()
    const chargeAmount = config.paypal.charge_amount || 12
    const monthsToAdd = paymentHistory.amount / chargeAmount

    let newStartDate = subscription.startDate
    let newEndDate = subscription.endDate
      ? new Date(subscription.endDate)
      : currentDate

    if (newEndDate > currentDate) {
      // Subscription is still active, only extend endDate
      newEndDate.setMonth(newEndDate.getMonth() + monthsToAdd)
    } else {
      // Subscription has expired, reset startDate and calculate new endDate
      newStartDate = currentDate
      newEndDate = new Date(currentDate)
      newEndDate.setMonth(currentDate.getMonth() + monthsToAdd)
    }

    await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        startDate: newStartDate,
        endDate: newEndDate,
      },
    })
  }
  await prisma.payment.update({
    where: { paymentId: data.paymentId },
    data: { status: 'completed' },
  })
  return paymentResult
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MakePayment = async (amount: number): Promise<any> => {
  const create_payment_json = {
    intent: 'sale',
    payer: {
      payment_method: 'paypal',
    },
    redirect_urls: {
      return_url: config.paypal.return_url,
      cancel_url: config.paypal.cancel_url,
    },
    transactions: [
      {
        amount: {
          currency: 'USD',
          total: amount.toString(),
        },
        description: 'Monthly Subscription',
      },
    ],
  }

  const paymentResult = await new Promise((resolve, reject) => {
    paypal.payment.create(create_payment_json, (error, payment) => {
      if (error) {
        reject(new ApiError(500, 'Payment creation failed'))
      } else {
        resolve(payment)
      }
    })
  })

  return paymentResult
}

const updateOneInDB = async (
  id: string,
  payload: Partial<Subscription>,
): Promise<Subscription> => {
  const result = await prisma.subscription.update({
    where: {
      id: parseInt(id),
    },
    data: payload,
  })
  return result
}

const deleteByIdFromDB = async (id: string): Promise<Subscription> => {
  const result = await prisma.subscription.delete({
    where: {
      id: parseInt(id),
    },
  })
  return result
}

const getAllFromDB = async (
  filters: ISubcriptionFilterRequest,
  options: IPaginationOptions,
): Promise<IGenericResponse<Subscription[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options)
  const { searchTerm, ...filterData } = filters

  const andConditions = []

  if (searchTerm) {
    andConditions.push({
      OR: subcriptionFilterableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    })
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.entries(filterData).map(([field, value]) => ({
        [field]: value,
      })),
    })
  }

  const whereConditions: Prisma.SubscriptionWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {}

  const result = await prisma.subscription.findMany({
    where: whereConditions,
    skip,
    take: limit,
  })

  const total = await prisma.subscription.count({
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

export const subscriptionService = {
  insertIntoDB,
  getAllFromDB,
  updateOneInDB,
  deleteByIdFromDB,
  executePayment,
}
