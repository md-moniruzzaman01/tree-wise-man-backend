import bcrypt from 'bcrypt'
import prisma from '../../../shared/prisma'

type UserWithPowers = {
  id: number
  email: string
  password: string
  role: string
  details?: {
    id: number
  } | null
}
export async function isUserExist(
  email: string,
): Promise<UserWithPowers | null> {
  const result = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      role: true,
      password: true,
      details: {
        select: {
          id: true
        }
      }
    },
  })

  if (!result) return null

  return result
}

export async function isPasswordMatched(
  givenPassword: string,
  savedPassword: string,
): Promise<boolean> {
  return await bcrypt.compare(givenPassword, savedPassword)
}
