import { Request, Response } from 'express';
import httpStatus from 'http-status';
//
import catchAsync from "../../../shared/catchAsync";
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';
import sendResponse from '../../../shared/sendResponse';
import { customerFilterableFields } from './customer.constant';
import { customerService } from './customer.service';

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, customerFilterableFields);
    const options = pick(req.query, paginationFields);
    const result = await customerService.getAllFromDB(filters, options);
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
    const result = await customerService.getByIdFromDB(parseId);
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
    const result = await customerService.updateIntoDB(id, payload);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User updated successfully',
      data: result,
    });
  });
  
  const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await customerService.deleteFromDB(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User deleted successfully',
      data: result,
    });
  });
  export const customerController = {
    getAllFromDB,
    getByIdFromDB,
    updateIntoDB,
    deleteFromDB
  };