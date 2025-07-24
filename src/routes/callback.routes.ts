import { Router } from 'express'
import { handleCallback } from '../controllers/callbacks/callback.controller'

const r = Router()
r.post('/callbacks/call-status', handleCallback)
export default r
