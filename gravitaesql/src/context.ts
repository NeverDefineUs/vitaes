import { PrismaClient } from '@prisma/client'
import express from 'express'
import admin from './firebase'

const prisma = new PrismaClient()

export interface Context {
  firebaseId?: string, 
  prisma: PrismaClient,
}

export async function createContext(req: express.Request): Promise<Context> {
  const tokenWithBearer = (req.headers && req.headers.authorization) ? req.headers.authorization : null
  if (tokenWithBearer == null) {
    return { prisma }
  }
  const token = tokenWithBearer.replace('Bearer ', '')

  const decodedToken = await admin.auth().verifyIdToken(token)
  return {
    firebaseId: decodedToken.uid,
    prisma
  }
}
