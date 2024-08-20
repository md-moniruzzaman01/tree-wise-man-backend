import { NextFunction, Request, Response } from 'express'
import dayjs from 'dayjs'
//
import ApiError from '../../errors/ApiError'
import prisma from '../../shared/prisma'

const subscriptionCheck =
  () => async (req: Request, res: Response, next: NextFunction) => {
    const userId = req?.user?.id
    if (!userId) {
      throw new ApiError(403, 'Unauthorized')
    }

    try {
      const userInfo = await prisma.userDetails.findUnique({
        where: { id: userId },
        select: {
          id: true,
          user: {
            select: {
              role: true,
              disable: true,
            },
          },
          subscription: {
            select: {
              startDate: true,
              endDate: true,
            },
          },
        },
      })

      if (
        !userInfo ||
        userInfo.user.disable ||
        (!userInfo?.subscription && userInfo.user.role !== 'admin')
      ) {
        throw new ApiError(403, 'No subscription found')
      }
      const subscription = userInfo?.subscription
      const currentDate = dayjs()

      if (
        (!subscription?.endDate || currentDate.isAfter(subscription.endDate)) &&
        userInfo.user.role !== 'admin'
      ) {
        throw new ApiError(403, 'Subscription expired')
      }
      next()
    } catch (error) {
      next(error)
    }
  }

export default subscriptionCheck
