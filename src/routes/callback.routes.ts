import { Router } from 'express'
import { handleCallback } from '../controllers/callbacks/callback.controller'

const routes = Router()
routes.post('/callbacks/call-status', handleCallback)
export default routes
