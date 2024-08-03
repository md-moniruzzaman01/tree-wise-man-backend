import bcrypt from 'bcrypt'
import httpStatus from 'http-status'
import jwt from 'jsonwebtoken'
//
import config from '../../../config'
import ApiError from '../../../errors/ApiError'
import { jwtHelpers } from '../../../helpers/jwtHelpers'
import prisma from '../../../shared/prisma'
import { ILoginUser, ILoginUserResponse } from './auth.interface'
import { isPasswordMatched, isUserExist } from './auth.utils'

async function loginUser(payload: ILoginUser): Promise<ILoginUserResponse> {
  const { email: userEmail, password } = payload

  const user = await isUserExist(userEmail)

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist')
  }

  if (user.password && !(await isPasswordMatched(password, user.password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect')
  }

  const { details,email, role, } = user
  const secret = config.jwt.secret

  if (!secret) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'secret is not defined')
  }

  const accessToken = jwt.sign({ id:details?.id, email, role }, secret, {
    expiresIn: config.jwt.expires_in,
  })

  const refreshToken = jwt.sign({ id:details?.id, email, role, }, secret, {
    expiresIn: config.jwt.refresh_expires_in,
  })

  return {
    accessToken,
    refreshToken,
  }
}

const resetPassword = async (
  payload: { email: string; newPassword: string },
  token: string,
) => {
  const { email, newPassword } = payload

  // Find the user by id
  const user = await prisma.user.findUnique({ where: { email } })

  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User not found!')
  }

  const isVerified = await jwtHelpers.verifyToken(
    token,
    config.jwt.secret as string,
  )

  if (!isVerified) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Token verification failed!')
  }

  // Hash the new password
  const hashedPassword = await bcrypt.hash(
    newPassword,
    Number(config.bcrypt_salt_rounds),
  )

  // Update the user's password
  await prisma.user.update({
    where: { email },
    data: { password: hashedPassword },
  })
}

export const AuthService = {
  loginUser,
  resetPassword,
}
