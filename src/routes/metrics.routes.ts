import { Router } from 'express'
import { getMetrics } from '../controllers/metrics/metrics.controller'

const r = Router()
r.get('/metrics', getMetrics)
export default r
