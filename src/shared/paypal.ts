import paypal from 'paypal-rest-sdk'
import config from '../config'
paypal.configure({
  mode: config?.paypal?.mode || 'sandbox', //sandbox or live
  client_id: config?.paypal?.client_id || '',
  client_secret: config?.paypal?.client_secret || '',
})

export default paypal
