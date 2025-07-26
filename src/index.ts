import 'reflect-metadata'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import 'dotenv/config'
import { connectDB } from './db/connect'
import callsRoutes from './routes/calls.routes'
import metricsRoutes from './routes/metrics.routes'
import callbackRoutes from './routes/callback.routes'
import './workers/call.worker'
import { Request, Response, NextFunction } from 'express'

const port = process.env.PORT || 3000

async function main() {
  try {
    await connectDB()

    const app = express()

    app.use(cors())
    app.use(helmet())
    app.use(morgan('combined'))

    app.use(express.json({
      verify: (req: any, res, buf) => {
        req.rawBody = buf.toString()
      }
    }))

    app.use(callsRoutes)
    app.use(metricsRoutes)
    app.use(callbackRoutes)

    // 404 handler
    app.use((req, res) => {
      res.status(404).json({ error: 'Not Found' })
    })

    // Global error handler
    interface ErrorHandlerRequest extends Request {
      rawBody?: string
    }

    app.use((err: Error, req: ErrorHandlerRequest, res: Response, next: NextFunction) => {
      console.error(err)
      res.status(500).json({ error: 'Internal Server Error' })
    })

    app.listen(port, () => console.log('Listening on', port))
  } catch (err) {
    console.error('Failed to start server:', err)
    process.exit(1)
  }
}

main()
