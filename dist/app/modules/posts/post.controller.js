'use strict'
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value)
          })
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value))
        } catch (e) {
          reject(e)
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value))
        } catch (e) {
          reject(e)
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected)
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next())
    })
  }
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
exports.postController = void 0
const http_status_1 = __importDefault(require('http-status'))
const catchAsync_1 = __importDefault(require('../../../shared/catchAsync'))
const sendResponse_1 = __importDefault(require('../../../shared/sendResponse'))
const pick_1 = __importDefault(require('../../../shared/pick'))
const pagination_1 = require('../../../constants/pagination')
const post_constant_1 = require('./post.constant')
const post_service_1 = require('./post.service')
const insertIntoDB = (0, catchAsync_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user
    req.body.authorId = user === null || user === void 0 ? void 0 : user.id
    const result = yield post_service_1.postService.insertIntoDB(req.body)
    ;(0, sendResponse_1.default)(res, {
      statusCode: http_status_1.default.OK,
      success: true,
      message: 'Post created successfully',
      data: result,
    })
  }),
)
const getAllFromDB = (0, catchAsync_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(
      req.query,
      post_constant_1.postFilterableFields,
    )
    const options = (0, pick_1.default)(
      req.query,
      pagination_1.paginationFields,
    )
    const result = yield post_service_1.postService.getAllFromDB(
      filters,
      options,
    )
    ;(0, sendResponse_1.default)(res, {
      statusCode: http_status_1.default.OK,
      success: true,
      message: 'Post fetched successfully',
      meta: result.meta,
      data: result.data,
    })
  }),
)
const getAllMyPostFromDB = (0, catchAsync_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(
      req.query,
      post_constant_1.postFilterableFields,
    )
    const options = (0, pick_1.default)(
      req.query,
      pagination_1.paginationFields,
    )
    const user = req.user
    const result = yield post_service_1.postService.getAllMyFromDB(
      filters,
      options,
      user,
    )
    ;(0, sendResponse_1.default)(res, {
      statusCode: http_status_1.default.OK,
      success: true,
      message: 'My Post fetched successfully',
      meta: result.meta,
      data: result.data,
    })
  }),
)
const getAllFromDBForAdmin = (0, catchAsync_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(
      req.query,
      post_constant_1.postFilterableFields,
    )
    const options = (0, pick_1.default)(
      req.query,
      pagination_1.paginationFields,
    )
    const result = yield post_service_1.postService.getAllFromDBForAdmin(
      filters,
      options,
    )
    ;(0, sendResponse_1.default)(res, {
      statusCode: http_status_1.default.OK,
      success: true,
      message: 'Post fetched successfully',
      meta: result.meta,
      data: result.data,
    })
  }),
)
const getByIdFromDB = (0, catchAsync_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params
    const parseId = parseInt(id)
    const result = yield post_service_1.postService.getByIdFromDB(parseId)
    ;(0, sendResponse_1.default)(res, {
      statusCode: http_status_1.default.OK,
      success: true,
      message: 'Post fetched successfully',
      data: result,
    })
  }),
)
const updateOneInDB = (0, catchAsync_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params
    const result = yield post_service_1.postService.updateOneInDB(
      id,
      req.body,
      false,
    )
    ;(0, sendResponse_1.default)(res, {
      statusCode: http_status_1.default.OK,
      success: true,
      message: 'Post updated successfully',
      data: result,
    })
  }),
)
const AdvanceUpdateOneInDB = (0, catchAsync_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params
    const result = yield post_service_1.postService.updateOneInDB(
      id,
      req.body,
      true,
    )
    ;(0, sendResponse_1.default)(res, {
      statusCode: http_status_1.default.OK,
      success: true,
      message: 'Post updated successfully',
      data: result,
    })
  }),
)
const deleteByIdFromDB = (0, catchAsync_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params
    const result = yield post_service_1.postService.deleteByIdFromDB(id)
    ;(0, sendResponse_1.default)(res, {
      statusCode: http_status_1.default.OK,
      success: true,
      message: 'Post delete successfully',
      data: result,
    })
  }),
)
const updateViewCount = (0, catchAsync_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params
    const result = yield post_service_1.postService.updateViewCountInDB(id)
    ;(0, sendResponse_1.default)(res, {
      statusCode: http_status_1.default.OK,
      success: true,
      message: 'Post click successfully',
      data: result,
    })
  }),
)
const getAnalytics = (0, catchAsync_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const result = yield post_service_1.postService.getAnalyticsFromDB()
    ;(0, sendResponse_1.default)(res, {
      statusCode: http_status_1.default.OK,
      success: true,
      message: 'Analytics successfully',
      meta: result.meta,
      data: result.data,
    })
  }),
)
exports.postController = {
  insertIntoDB,
  getAllFromDB,
  updateOneInDB,
  AdvanceUpdateOneInDB,
  getByIdFromDB,
  deleteByIdFromDB,
  getAllFromDBForAdmin,
  updateViewCount,
  getAnalytics,
  getAllMyPostFromDB,
}
