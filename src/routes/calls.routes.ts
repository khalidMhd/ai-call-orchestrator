import { Router } from 'express'
import * as ctrl from '../controllers/call/calls.controller'

const r = Router()
r.post('/calls', ctrl.createCall)
r.get('/calls/:id', ctrl.getCall)
r.patch('/calls/:id', ctrl.updateCall)
r.get('/calls', ctrl.listCalls)
export default r
