import { Request, Response } from 'express'
import httpStatus from 'http-status'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import pick from '../../../shared/pick'
import { paginationFields } from '../../../constants/pagination'
import { postFilterableFields } from './post.constant'
import { postService } from './post.service'
import { Post, User } from '@prisma/client'

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const user = req.user
  req.body.authorId = user?.id
  const result = await postService.insertIntoDB(req.body)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Post created successfully',
    data: result,
  })
})

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, postFilterableFields)
  const options = pick(req.query, paginationFields)
  const result = await postService.getAllFromDB(filters, options)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Post fetched successfully',
    meta: result.meta,
    data: result.data,
  })
})

const getAllMyPostFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, postFilterableFields)
  const options = pick(req.query, paginationFields)
  const user = req.user
  const result = await postService.getAllMyFromDB(
    filters,
    options,
    user as User,
  )
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'My Post fetched successfully',
    meta: result.meta,
    data: result.data,
  })
})

const getAllFromDBForAdmin = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, postFilterableFields)
  const options = pick(req.query, paginationFields)
  const result = await postService.getAllFromDBForAdmin(filters, options)
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
  const result = await postService.getByIdFromDB(parseId)
  sendResponse<Post>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Post fetched successfully',
    data: result,
  })
})

const updateOneInDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await postService.updateOneInDB(id, req.body, false)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Post updated successfully',
    data: result,
  })
})

const AdvanceUpdateOneInDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await postService.updateOneInDB(id, req.body, true)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Post updated successfully',
    data: result,
  })
})

const deleteByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const user = req.user
  const result = await postService.deleteByIdFromDB(id, user)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Post delete successfully',
    data: result,
  })
})
const updateViewCount = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await postService.updateViewCountInDB(id)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Post click successfully',
    data: result,
  })
})

const getAnalytics = catchAsync(async (req: Request, res: Response) => {
  const result = await postService.getAnalyticsFromDB()
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Analytics successfully',
    meta: result.meta,
    data: result.data,
  })
})

export const postController = {
  insertIntoDB,
  getAllFromDB,
  updateOneInDB,
  AdvanceUpdateOneInDB,
  getByIdFromDB,
  deleteByIdFromDB,
  getAllFromDBForAdmin,
  updateViewCount,
  getAnalytics,
  getAllMyPostFromDB,
}
