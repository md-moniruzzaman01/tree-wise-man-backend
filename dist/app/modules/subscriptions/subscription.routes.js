'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
exports.subscriptionRoutes = void 0
const express_1 = __importDefault(require('express'))
//
const user_1 = require('../../../enums/user')
const auth_1 = __importDefault(require('../../middlewares/auth'))
const subscription_controller_1 = require('./subscription.controller')
const validateRequest_1 = __importDefault(
  require('../../middlewares/validateRequest'),
)
const subscription_validation_1 = require('./subscription.validation')
const router = express_1.default.Router()
router.get(
  '/',
  (0, auth_1.default)(
    user_1.ENUM_USER_ROLE.SUPER_ADMIN,
    user_1.ENUM_USER_ROLE.ADMIN,
    user_1.ENUM_USER_ROLE.USER,
  ),
  subscription_controller_1.subscriptionController.getAllFromDB,
)
router.post(
  '/create',
  (0, auth_1.default)(
    user_1.ENUM_USER_ROLE.SUPER_ADMIN,
    user_1.ENUM_USER_ROLE.ADMIN,
    user_1.ENUM_USER_ROLE.USER,
  ),
  (0, validateRequest_1.default)(
    subscription_validation_1.subscriptionValidations.create,
  ),
  subscription_controller_1.subscriptionController.insertIntoDB,
)
router.patch(
  '/:id',
  (0, auth_1.default)(
    user_1.ENUM_USER_ROLE.SUPER_ADMIN,
    user_1.ENUM_USER_ROLE.ADMIN,
    user_1.ENUM_USER_ROLE.USER,
  ),
  (0, validateRequest_1.default)(
    subscription_validation_1.subscriptionValidations.update,
  ),
  subscription_controller_1.subscriptionController.updateOneInDB,
)
exports.subscriptionRoutes = router
