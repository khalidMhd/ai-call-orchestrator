import 'reflect-metadata'
import express from 'express'
import { connectDB } from './db/connect'
import callsRoutes from './routes/calls.routes'
import metricsRoutes from './routes/metrics.routes'
import callbackRoutes from './routes/callback.routes'
import 'dotenv/config'
import cors from 'cors'
import './workers/call.worker'

const port = process.env.PORT || 3000

async function main() {
    try {
        await connectDB()
        // startWorker()
        const app = express()
        app.use(cors())
        // app.use(express.json())
        app.use(express.json({
            verify: (req: any, res, buf) => {
                req.rawBody = buf.toString()
            }
        }))
        app.use(callsRoutes)
        app.use(metricsRoutes)
        app.use(callbackRoutes)


        app.listen(port, () => console.log('Listening on', port))
    } catch (err) {
        console.error('Failed to start server:', err)
        process.exit(1)
    }
}


main()
