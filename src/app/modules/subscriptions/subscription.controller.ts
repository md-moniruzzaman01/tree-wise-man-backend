import { Request, Response } from 'express'
import httpStatus from 'http-status'
//
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import pick from '../../../shared/pick'
import { subcriptionFilterableFields } from './subscription.constant'
import { paginationFields } from '../../../constants/pagination'
import { subscriptionService } from './subcriptions.service'
import config from '../../../config'
import ApiError from '../../../errors/ApiError'

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const { month } = req.body
  if (typeof month !== 'number' || month <= 0) {
    throw new ApiError(400, 'Invalid month value')
  }

  const chargeAmount = config.paypal.charge_amount
  req.body.amount = month * chargeAmount

  const result = await subscriptionService.insertIntoDB(req.body)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'subscription created successfully',
    data: result,
  })
})

const executePayment = catchAsync(async (req: Request, res: Response) => {
  const result = await subscriptionService.executePayment(req.body)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'subscription verify successfully',
    data: result,
  })
})

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, subcriptionFilterableFields)
  const options = pick(req.query, paginationFields)
  const result = await subscriptionService.getAllFromDB(filters, options)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'subscription fetched successfully',
    meta: result.meta,
    data: result.data,
  })
})

const updateOneInDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await subscriptionService.updateOneInDB(id, req.body)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'subscription updated successfully',
    data: result,
  })
})

const deleteByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await subscriptionService.deleteByIdFromDB(id)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'subscription delete successfully',
    data: result,
  })
})

export const subscriptionController = {
  insertIntoDB,
  getAllFromDB,
  updateOneInDB,
  deleteByIdFromDB,
  executePayment,
}
