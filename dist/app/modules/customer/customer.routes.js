"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../../enums/user");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const user_validation_1 = require("../user/user.validation");
const customer_controller_1 = require("./customer.controller");
const router = express_1.default.Router();
router.get('/', 
// auth(
//     ENUM_USER_ROLE.ADMIN,
//     ENUM_USER_ROLE.SUPER_ADMIN,
// ),
customer_controller_1.customerController.getAllFromDB);
router.get('/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.USER), customer_controller_1.customerController.getByIdFromDB);
router.patch('/:id', (0, validateRequest_1.default)(user_validation_1.UserValidation.update), (0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN), customer_controller_1.customerController.updateIntoDB);
router.delete('/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN), customer_controller_1.customerController.deleteFromDB);
exports.customerRoutes = router;
