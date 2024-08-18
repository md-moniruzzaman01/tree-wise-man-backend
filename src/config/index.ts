/* eslint-disable no-undef */
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.join(process.cwd(), '.env') })

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  default_pass: process.env.DEFAULT_USER_PASSWORD,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,

  jwt: {
    secret: process.env.JWT_SECRET,
    refresh_secret: process.env.JWT_REFRESH_SECRET,
    expires_in: process.env.JWT_EXPIRES_IN,
    refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  },
  paypal: {
    mode: process.env.PAYPAL_MODE,
    client_id: process.env.PAYPAL_CLIENT_ID,
    client_secret: process.env.PAYPAL_CLIENT_SECRET,
    return_url: process.env.PAYPAL_RETURN_URL,
    cancel_url: process.env.PAYPAL_CANCEL_URL,
    success_url: process.env.PAYPAL_SUCCESS_URL,
    currency_code: process.env.PAYPAL_CURRENCY_CODE,
    error_url: process.env.PAYPAL_ERROR_URL,
    charge_amount: process.env.MONTHLY_CHARGE,
  },
  resetlink: process.env.RESET_PASS_UI_LINK,
  email: process.env.EMAIL,
  appPass: process.env.APP_PASS,
}
