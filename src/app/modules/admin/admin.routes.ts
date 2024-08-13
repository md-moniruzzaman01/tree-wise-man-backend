import express from 'express'
import auth from '../../middlewares/auth'
import { ENUM_USER_ROLE } from '../../../enums/user'
import { adminController } from './admin.controller'
import validateRequest from '../../middlewares/validateRequest'
import { UserValidation } from '../user/user.validation'

const router = express.Router()

router.get(
  '/',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.USER),
  adminController.getAllFromDB,
)

router.get(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.USER),
  adminController.getByIdFromDB,
)

router.patch(
  '/:id',
  validateRequest(UserValidation.update),
  // auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  adminController.updateIntoDB,
)

router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  adminController.deleteFromDB,
)

export const adminRoutes = router
