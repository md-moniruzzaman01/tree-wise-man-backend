import { subcriptionFilterableFields } from './subscription.constant';
import { ISubcription, ISubcriptionFilterRequest } from './subscription.interface';
import { Prisma, Subscription } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { IPaginationOptions } from '../../../interfaces/pagination';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';


const insertIntoDB = async (data: ISubcription): Promise<Subscription> => {
  console.log("data",data )
    const result = await prisma.subscription.create({
      data,
    });
    return result;
  };

  const updateOneInDB = async (
    id: string,
    payload: Partial<Subscription>,
  ): Promise<Subscription> => {
    const result = await prisma.subscription.update({
      where: {
        id: parseInt(id),
      },
      data: payload,
    });
    return result;
  };
  
  const deleteByIdFromDB = async (id: string): Promise<Subscription> => {
    const result = await prisma.subscription.delete({
      where: {
        id: parseInt(id),
      },
    });
    return result;
  };

  const getAllFromDB = async (
    filters: ISubcriptionFilterRequest,
    options: IPaginationOptions,
  ): Promise<IGenericResponse<Subscription[]>> => {
    const { limit, page, skip } = paginationHelpers.calculatePagination(options);
    const { searchTerm, ...filterData } = filters;
  
    const andConditions = [];
  
    if (searchTerm) {
      andConditions.push({
        OR: subcriptionFilterableFields.map(field => ({
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
  
    const whereConditions: Prisma.SubscriptionWhereInput =
      andConditions.length > 0 ? { AND: andConditions } : {};
  
    const result = await prisma.subscription.findMany({
      where: whereConditions,
      skip,
      take: limit,
    });
  
    const total = await prisma.subscription.count({
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

  export const subscriptionService = {
    insertIntoDB,
    getAllFromDB,
    updateOneInDB,
    deleteByIdFromDB,
  };
  