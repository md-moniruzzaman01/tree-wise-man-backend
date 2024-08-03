import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import { adminFilterableFields } from './admin.constant';
import { paginationFields } from '../../../constants/pagination';
import sendResponse from '../../../shared/sendResponse';
import { adminService } from './admin.service';


const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, adminFilterableFields);
    const options = pick(req.query, paginationFields);
    const result = await adminService.getAllFromDB(filters, options);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Users fetched successfully',
      meta: result.meta,
      data: result.data,
    });
  });

  
  const getByIdFromDB = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const parseId = parseInt(id);
    const result = await adminService.getByIdFromDB(parseId);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'user fetched successfully',
      data: result,
    });
  });
  
  const updateIntoDB = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const payload = req.body;
    const result = await adminService.updateIntoDB(id, payload);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User updated successfully',
      data: result,
    });
  });
  
  const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await adminService.deleteFromDB(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User deleted successfully',
      data: result,
    });
  });
  export const adminController = {
    getAllFromDB,
    getByIdFromDB,
    updateIntoDB,
    deleteFromDB
  };