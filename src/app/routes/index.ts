import express from 'express'
import { AuthRoutes } from '../modules/auth/auth.route'
import { postRoutes } from '../modules/posts/post.routes'
import { UserRoutes } from '../modules/user/user.routes'
import { adminRoutes } from '../modules/admin/admin.routes'
import { customerRoutes } from '../modules/customer/customer.routes'
import { subscriptionRoutes } from '../modules/subscriptions/subscription.routes'

const router = express.Router()

const moduleRoutes = [
  {
    path: '/',
    routes: AuthRoutes,
  },
  {
    path: '/auth/user',
    routes: UserRoutes,
  },
  {
    path: '/admin',
    routes: adminRoutes,
  },
  {
    path: '/user',
    routes: customerRoutes,
  },
  {
    path: '/post',
    routes: postRoutes,
  },
  {
    path: '/subscription',
    routes: subscriptionRoutes,
  },
]

moduleRoutes.forEach(route => router.use(route.path, route.routes))
export default router
