"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const http_status_1 = __importDefault(require("http-status"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
//
const config_1 = __importDefault(require("../../../config"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const jwtHelpers_1 = require("../../../helpers/jwtHelpers");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const auth_utils_1 = require("./auth.utils");
function loginUser(payload) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email: userEmail, password } = payload;
        const user = yield (0, auth_utils_1.isUserExist)(userEmail);
        if (!user) {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User does not exist');
        }
        if (user.password && !(yield (0, auth_utils_1.isPasswordMatched)(password, user.password))) {
            throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Password is incorrect');
        }
        const { details, email, role, } = user;
        const secret = config_1.default.jwt.secret;
        if (!secret) {
            throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'secret is not defined');
        }
        const accessToken = jsonwebtoken_1.default.sign({ id: details === null || details === void 0 ? void 0 : details.id, email, role }, secret, {
            expiresIn: config_1.default.jwt.expires_in,
        });
        const refreshToken = jsonwebtoken_1.default.sign({ id: details === null || details === void 0 ? void 0 : details.id, email, role, }, secret, {
            expiresIn: config_1.default.jwt.refresh_expires_in,
        });
        return {
            accessToken,
            refreshToken,
        };
    });
}
const resetPassword = (payload, token) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, newPassword } = payload;
    // Find the user by id
    const user = yield prisma_1.default.user.findUnique({ where: { email } });
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'User not found!');
    }
    const isVerified = yield jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.secret);
    if (!isVerified) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Token verification failed!');
    }
    // Hash the new password
    const hashedPassword = yield bcrypt_1.default.hash(newPassword, Number(config_1.default.bcrypt_salt_rounds));
    // Update the user's password
    yield prisma_1.default.user.update({
        where: { email },
        data: { password: hashedPassword },
    });
});
exports.AuthService = {
    loginUser,
    resetPassword,
};
