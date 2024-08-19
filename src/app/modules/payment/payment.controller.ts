import { Request, Response } from 'express'
import httpStatus from 'http-status'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import pick from '../../../shared/pick'
import { paginationFields } from '../../../constants/pagination'
import { Payment } from '@prisma/client'
import { paymentFilterableFields } from './payment.constant'
import { paymentService } from './payment.service'

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, paymentFilterableFields)
  const options = pick(req.query, paginationFields)
  const result = await paymentService.getAllFromDB(filters, options)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Post fetched successfully',
    meta: result.meta,
    data: result.data,
  })
})

const getByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const parseId = parseInt(id)
  const result = await paymentService.getByIdFromDB(parseId)
  sendResponse<Payment | null>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Post fetched successfully',
    data: result,
  })
})

const deleteByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await paymentService.deleteByIdFromDB(id)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Post delete successfully',
    data: result,
  })
})

export const paymentController = {
  getAllFromDB,
  getByIdFromDB,
  deleteByIdFromDB,
}
