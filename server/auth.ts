import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { config } from './config.js'

export type AuthRequest = Request & { admin?: { role: 'admin' } }
export const signAdminToken = () => jwt.sign({ role: 'admin' }, config.jwtSecret, { expiresIn: '8h', issuer: 'maison-rose' })
export function requireAdmin(request: AuthRequest, response: Response, next: NextFunction) { const token = request.get('authorization')?.replace(/^Bearer\s+/i, ''); if (!token) return response.status(401).json({ error: 'Unauthorized' }); try { const payload = jwt.verify(token, config.jwtSecret, { issuer: 'maison-rose' }) as { role?: string }; if (payload.role !== 'admin') throw new Error('Unauthorized'); request.admin = { role: 'admin' }; return next() } catch { return response.status(401).json({ error: 'Unauthorized' }) } }
