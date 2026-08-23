import express from 'express'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { app } from './app'
import { config } from './config'

if (config.nodeEnv === 'production') {
  const directory = path.dirname(fileURLToPath(import.meta.url))
  app.use(express.static(path.resolve(directory, '../dist')))
  app.get('*', (_request, response) => response.sendFile(path.resolve(directory, '../dist/index.html')))
}
app.listen(config.port, () => console.log(`FS Archives API listening on :${config.port}`))
