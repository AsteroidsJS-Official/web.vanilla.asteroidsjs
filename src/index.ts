import express from 'express'

import routes from './assets/ts/routes'
import { config } from 'dotenv'
import path from 'path'

import './assets/ts/socket'
import './global.scss'

config()

const app = express()

app.use(express.static(path.resolve(__dirname, '../dist/assets')))
app.use('/', routes)

app.listen(process.env.PORT || 8080)
