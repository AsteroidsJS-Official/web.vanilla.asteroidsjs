import express from 'express'
import path from 'path'
import { config } from 'dotenv'

import routes from './assets/ts/routes'
import './assets/ts/socket'

config()

const port = process.env.PORT || 8080

const app = express()

app.use(express.static(path.resolve(__dirname, '../dist/assets')))
app.use('/', routes)

app.listen(port)
