'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
exports.postRoutes = void 0
const express_1 = __importDefault(require('express'))
const auth_1 = __importDefault(require('../../middlewares/auth'))
const user_1 = require('../../../enums/user')
const validateRequest_1 = __importDefault(
  require('../../middlewares/validateRequest'),
)
const post_validation_1 = require('./post.validation')
const post_controller_1 = require('./post.controller')
//
const router = express_1.default.Router()
router.get(
  '/',
  // auth(
  //   ENUM_USER_ROLE.SUPER_ADMIN,
  //   ENUM_USER_ROLE.ADMIN,
  //   ENUM_USER_ROLE.USER,
  // ),
  post_controller_1.postController.getAllFromDB,
)
router.get(
  '/my-post',
  (0, auth_1.default)(
    user_1.ENUM_USER_ROLE.SUPER_ADMIN,
    user_1.ENUM_USER_ROLE.ADMIN,
    user_1.ENUM_USER_ROLE.USER,
  ),
  post_controller_1.postController.getAllMyPostFromDB,
)
router.get(
  '/analytics',
  (0, auth_1.default)(
    user_1.ENUM_USER_ROLE.SUPER_ADMIN,
    user_1.ENUM_USER_ROLE.ADMIN,
    user_1.ENUM_USER_ROLE.USER,
  ),
  post_controller_1.postController.getAnalytics,
)
router.get(
  '/admin',
  (0, auth_1.default)(
    user_1.ENUM_USER_ROLE.SUPER_ADMIN,
    user_1.ENUM_USER_ROLE.ADMIN,
    user_1.ENUM_USER_ROLE.USER,
  ),
  post_controller_1.postController.getAllFromDBForAdmin,
)
router.post(
  '/create',
  (0, auth_1.default)(
    user_1.ENUM_USER_ROLE.SUPER_ADMIN,
    user_1.ENUM_USER_ROLE.ADMIN,
    user_1.ENUM_USER_ROLE.USER,
  ),
  (0, validateRequest_1.default)(post_validation_1.postValidations.create),
  post_controller_1.postController.insertIntoDB,
)
router.patch(
  '/click/:id',
  (0, auth_1.default)(
    user_1.ENUM_USER_ROLE.SUPER_ADMIN,
    user_1.ENUM_USER_ROLE.ADMIN,
    user_1.ENUM_USER_ROLE.USER,
  ),
  post_controller_1.postController.updateViewCount,
)
router.patch(
  '/admin/:id',
  (0, auth_1.default)(
    user_1.ENUM_USER_ROLE.SUPER_ADMIN,
    user_1.ENUM_USER_ROLE.ADMIN,
  ),
  (0, validateRequest_1.default)(post_validation_1.postValidations.update),
  post_controller_1.postController.AdvanceUpdateOneInDB,
)
router.patch(
  '/:id',
  (0, auth_1.default)(
    user_1.ENUM_USER_ROLE.SUPER_ADMIN,
    user_1.ENUM_USER_ROLE.ADMIN,
    user_1.ENUM_USER_ROLE.USER,
  ),
  (0, validateRequest_1.default)(post_validation_1.postValidations.update),
  post_controller_1.postController.updateOneInDB,
)
router.get(
  '/:id',
  (0, auth_1.default)(
    user_1.ENUM_USER_ROLE.SUPER_ADMIN,
    user_1.ENUM_USER_ROLE.ADMIN,
    user_1.ENUM_USER_ROLE.USER,
  ),
  post_controller_1.postController.getByIdFromDB,
)
router.delete(
  '/:id',
  (0, auth_1.default)(
    user_1.ENUM_USER_ROLE.SUPER_ADMIN,
    user_1.ENUM_USER_ROLE.ADMIN,
  ),
  post_controller_1.postController.deleteByIdFromDB,
)
exports.postRoutes = router
