import { Router } from 'express'
import * as ctrl from '../controllers/call/calls.controller'

const routes = Router()
routes.post('/calls', ctrl.createCall)
routes.get('/calls/:id', ctrl.getCall)
routes.patch('/calls/:id', ctrl.updateCall)
routes.get('/calls', ctrl.listCalls)
export default routes
