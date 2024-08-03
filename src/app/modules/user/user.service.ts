import { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import config from '../../../config';
import prisma from '../../../shared/prisma';
import { CreateUserInput } from './user.interface';

const insertIntoDB = async (
    data: CreateUserInput,
    role: string,
  ): Promise<User> => {
    const hashedPassword = await bcrypt.hash(
    config.default_pass || "123456",
      Number(config.bcrypt_salt_rounds),
    );
    const result = await prisma.user.create({
      data: {
        email: data.email,
        role: role,
        password: hashedPassword,
        details: {
          create: {
            email: data.email,
            name: data.name,
            contactNo: data.contactNo,
            designation: data.designation,
            profileImage: data.profileImage,
            role: role,
            company: data.company
          },
        },
      },
      include: {
        details: true,
      },
    });
    return result;
  };




export const userService = {
    insertIntoDB,
  };
  