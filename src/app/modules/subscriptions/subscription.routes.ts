import express from 'express'
//
import { ENUM_USER_ROLE } from '../../../enums/user'
import auth from '../../middlewares/auth'
import { subscriptionController } from './subscription.controller'
import validateRequest from '../../middlewares/validateRequest'
import { subscriptionValidations } from './subscription.validation'

const router = express.Router()

router.get(
  '/',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  subscriptionController.getAllFromDB,
)

router.post(
  '/create',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),

  validateRequest(subscriptionValidations.create),
  subscriptionController.insertIntoDB,
)

router.patch(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),

  validateRequest(subscriptionValidations.update),
  subscriptionController.updateOneInDB,
)

export const subscriptionRoutes = router
