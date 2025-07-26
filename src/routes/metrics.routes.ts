import { Router } from 'express'
import { getMetrics } from '../controllers/metrics/metrics.controller'

const routes = Router()
routes.get('/metrics', getMetrics)
export default routes
