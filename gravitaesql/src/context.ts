import { PrismaClient } from '@prisma/client'
import express from 'express'
import * as admin from 'firebase-admin'

const prisma = new PrismaClient()

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: "https://vitaes-57424.firebaseio.com"
});

export interface Context {
  userId?: string, 
  prisma: PrismaClient,
}

export async function createContext(req: express.Request): Promise<Context> {
  const token = (req.headers && req.headers.authorization) ? req.headers.authorization : null
  if (token == null) {
    return { prisma }
  }

  const decodedToken = await admin.auth().verifyIdToken(token)
  return {
    userId: decodedToken.uid,
    prisma
  }
}
