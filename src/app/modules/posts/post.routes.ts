import express from 'express'
import auth from '../../middlewares/auth'
import { ENUM_USER_ROLE } from '../../../enums/user'
import validateRequest from '../../middlewares/validateRequest'
import { postValidations } from './post.validation'
import { postController } from './post.controller'
import subscriptionCheck from '../../middlewares/subscriptionCheck'
//
const router = express.Router()

router.get(
  '/',
  // auth(
  //   ENUM_USER_ROLE.SUPER_ADMIN,
  //   ENUM_USER_ROLE.ADMIN,
  //   ENUM_USER_ROLE.USER,
  // ),
  postController.getAllFromDB,
)
router.get(
  '/my-post',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  postController.getAllMyPostFromDB,
)
router.get(
  '/analytics',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  postController.getAnalytics,
)

router.get(
  '/admin',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  postController.getAllFromDBForAdmin,
)

router.post(
  '/create',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  subscriptionCheck(),
  validateRequest(postValidations.create),
  postController.insertIntoDB,
)

router.patch(
  '/click/:id',
  // auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  postController.updateViewCount,
)
router.patch(
  '/admin/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validateRequest(postValidations.update),
  postController.AdvanceUpdateOneInDB,
)

router.patch(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  subscriptionCheck(),
  validateRequest(postValidations.update),
  postController.updateOneInDB,
)

router.get(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  postController.getByIdFromDB,
)
router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  postController.deleteByIdFromDB,
)

export const postRoutes = router
