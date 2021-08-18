import { Router } from 'express'

import path from 'path'

const router = Router()

router.get('/', (_, res) => {
  res.sendFile(path.resolve(__dirname, './assets/index.html'))
})

export default router
