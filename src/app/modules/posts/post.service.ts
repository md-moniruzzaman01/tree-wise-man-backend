import { Post, Prisma } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { IGenericResponse } from "../../../interfaces/common";
import { IPost, IPostFilterRequest } from "./post.interface";
import { postSearchableFields } from "./post.constant";



const insertIntoDB = async (data: IPost): Promise<Post> => {
  //authorId
  const userDetails = await prisma.userDetails.findUnique({
    where: { id: data.authorId },
    include: { user: true, posts: true },
  })

  if (!userDetails) {
    throw new Error('User not found');
  }

  const userRole = userDetails.user.role;

  if (userRole === 'user' && userDetails.posts.length >= 1) {
    throw new Error('users can only create one post');
  }

  const result = await prisma.post.create({
    data,
  });
  return result;
};

const getAllFromDB = async (
  filters: IPostFilterRequest,
  options: IPaginationOptions,
): Promise<IGenericResponse<Post[]>> => {
  const { page, limit, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm } = filters;

  const andConditons = [];

  if (searchTerm) {
    andConditons.push({
      OR: postSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }


  const whereConditons: Prisma.PostWhereInput = {
    AND: andConditons.length > 0 ? { AND: andConditons } : {},
    OR: [
      {
        author: {
          role: 'admin',
        },
      },
      {
        author: {
          subscription: {
            endDate: {
              gte: new Date(),
            },
          },
        },
      },
    ],
  };

  const result = await prisma.post.findMany({
    skip,
    take: limit,
    where: whereConditons,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
          [options.sortBy]: options.sortOrder,
        }
        : {
          createdAt: 'desc',
        },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          role: true,
          profileImage: true,
        }
      },
    },
  });
  const total = await prisma.post.count({
    where: whereConditons,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};



const getAllFromDBForAdmin = async (
  filters: IPostFilterRequest,
  options: IPaginationOptions,
): Promise<IGenericResponse<Post[]>> => {
  const { page, limit, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm } = filters;

  const andConditons = [];

  if (searchTerm) {
    andConditons.push({
      OR: postSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }


  const whereConditons: Prisma.PostWhereInput =
    andConditons.length > 0 ? { AND: andConditons } : {};

  const result = await prisma.post.findMany({
    skip,
    take: limit,
    where: whereConditons,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
          [options.sortBy]: options.sortOrder,
        }
        : {
          createdAt: 'desc',
        },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          role: true,
          profileImage: true,
          subscription: {
            select: {
              endDate: true,
            },
          },
        },

      },
    },
  });

  const total = await prisma.post.count({
    where: whereConditons,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const updateViewCountInDB = async (
  id: string,
) => {
  const postId = parseInt(id)
  const postClick = await prisma.postClick.findFirst({
    where: { postId },
  });
  if (postClick) {
    await prisma.postClick.update({
      where: { id: postClick.id },
      data: { clickCount: { increment: 1 } },
    });
  } else {
    await prisma.postClick.create({
      data: {
        postId,
        clickCount: 1,
      },
    });
  }
};
const updateOneInDB = async (
  id: string,
  payload: Partial<Post>,
): Promise<Post> => {
  const result = await prisma.post.update({
    where: {
      id: parseInt(id),
    },
    data: payload,
  });
  return result;
};

const deleteByIdFromDB = async (id: string): Promise<Post> => {
  const result = await prisma.post.delete({
    where: {
      id: parseInt(id),
    },
  });
  return result;
};

export const postService = {
  insertIntoDB,
  getAllFromDB,
  updateOneInDB,
  updateViewCountInDB,
  deleteByIdFromDB,
  getAllFromDBForAdmin
};

