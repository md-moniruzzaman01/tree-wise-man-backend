import { subcriptionFilterableFields } from './subscription.constant'
import {
  ISubcription,
  ISubcriptionFilterRequest,
} from './subscription.interface'
import { Prisma, Subscription } from '@prisma/client'
import prisma from '../../../shared/prisma'
import { IPaginationOptions } from '../../../interfaces/pagination'
import { paginationHelpers } from '../../../helpers/paginationHelper'
import { IGenericResponse } from '../../../interfaces/common'
import config from '../../../config'
import paypal from '../../../shared/paypal'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const insertIntoDB = async (data: any): Promise<any> => {
  console.log('data', data)
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
          total: '50.00',
        },
        description: 'Monthly Subscription',
      },
    ],
  }
  return new Promise((resolve, reject) => {
    paypal.payment.create(create_payment_json, (error, payment) => {
      if (error) {
        reject(error)
      } else {
        resolve(payment)
      }
    })
  })

  // const result = await paypal.payment.create(create_payment_json, function (error, payment) {
  //   if (error) {
  //     console.error(error);
  //     throw new ApiError(500,'Payment failed');
  //   } else {
  //     console.log("Create Payment Response");
  //     // console.log(payment);
  //     // data = payment;
  //     return payment

  //   }
  // });
  // return result
}

// const insertIntoDB = async (data: ISubcription): Promise<Subscription> => {
//   const result = await prisma.subscription.create({
//     data: {
//       startDate: data.startDate,
//       endDate: data.endDate,
//       userId: parseInt(data.userId),
//     },
//   })
//   return result
// }

const executePayment = async (data: { PayerID: string; paymentId: string }) => {
  const payerId = data.PayerID
  const paymentId = data.paymentId
  console.log('data', data)
  const execute_payment_json = {
    payer_id: payerId,
    transactions: [
      {
        amount: {
          currency: 'USD',
          total: '50.00',
        },
      },
    ],
  }

  return new Promise((resolve, reject) => {
    paypal.payment.execute(
      paymentId,
      execute_payment_json,
      (error, payment) => {
        if (error) {
          reject(error)
        } else {
          resolve(payment)
        }
      },
    )
  })
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
