import { Request, RequestHandler, Response } from 'express'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import { userService } from './user.service'

const createEmployee: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const result = await userService.insertIntoDB(req.body, 'user')
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'employee created successfully!',
      data: result,
    })
  },
)

const createAdmin: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const result = await userService.insertIntoDB(req.body, 'admin')
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'admin created successfully!',
      data: result,
    })
  },
)

export const UserController = {
  createEmployee,
  createAdmin,
}
