"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_route_1 = require("../modules/auth/auth.route");
const post_routes_1 = require("../modules/posts/post.routes");
const user_routes_1 = require("../modules/user/user.routes");
const admin_routes_1 = require("../modules/admin/admin.routes");
const customer_routes_1 = require("../modules/customer/customer.routes");
const subscription_routes_1 = require("../modules/subscriptions/subscription.routes");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: '/',
        routes: auth_route_1.AuthRoutes,
    },
    {
        path: '/auth/user',
        routes: user_routes_1.UserRoutes,
    },
    {
        path: '/admin',
        routes: admin_routes_1.adminRoutes,
    },
    {
        path: '/user',
        routes: customer_routes_1.customerRoutes,
    },
    {
        path: '/post',
        routes: post_routes_1.postRoutes,
    },
    {
        path: '/subscription',
        routes: subscription_routes_1.subscriptionRoutes,
    },
];
moduleRoutes.forEach(route => router.use(route.path, route.routes));
exports.default = router;
