import httpStatus from 'http-status';
import { IAdminFilterRequest } from './admin.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { Prisma, UserDetails } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { adminSearchableFields } from './admin.constant';
import prisma from '../../../shared/prisma';
import { CreateUserInput } from '../user/user.interface';
import ApiError from '../../../errors/ApiError';

const getAllFromDB = async (
    filters: IAdminFilterRequest,
    options: IPaginationOptions,
  ): Promise<IGenericResponse<UserDetails[]>> => {
    const { limit, page, skip } = paginationHelpers.calculatePagination(options);
    const { searchTerm, ...filterData } = filters;
  
    const andConditions = [];
  
    if (searchTerm) {
      andConditions.push({
        OR: adminSearchableFields.map(field => ({
          [field]: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        })),
      });
    }
  
    if (Object.keys(filterData).length > 0) {
      andConditions.push({
        AND: Object.entries(filterData).map(([field, value]) => ({
          [field]: value,
        })),
      });
    }
  
    const whereConditions: Prisma.UserDetailsWhereInput =
      andConditions.length > 0 ? { AND: andConditions } : {};
  
    const result = await prisma.userDetails.findMany({
      where: whereConditions,
      skip,
      take: limit,
    });
  
    const total = await prisma.userDetails.count({
      where: whereConditions,
    });
  
    return {
      meta: {
        total,
        page,
        limit,
      },
      data: result,
    };
  };

  const getByIdFromDB = async (id: number): Promise<UserDetails | null> => {
      const result = await prisma.userDetails.findUnique({
          where: {
              id
          }
      });
      return result;
  };
  
  const updateIntoDB = async (
    id: string,
    payload: CreateUserInput,
  ): Promise<UserDetails> => {
    const result = await prisma.userDetails.update({
      where: {
        id: parseInt(id),
      },
      data: {
        ...payload,
        user: payload.email
          ? {
              update: {
                email: payload.email,
              },
            }
          : undefined,
      },
      include: {
        user: true,
      },
    });
    return result;
  };
  
  const deleteFromDB = async (id: string): Promise<UserDetails> => {
    const user = await prisma.userDetails.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        user: true,
      },
    });
    if (!user) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'user not found');
    }
    const result = await prisma.userDetails.delete({
      where: {
        id: parseInt(id),
      },
    });
    await prisma.user.delete({
      where: {
        id: result.userId,
      },
    });
  
    return result;
  };
  
  export const adminService = {
    getAllFromDB,
    getByIdFromDB,
    deleteFromDB,
    updateIntoDB
  };