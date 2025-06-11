import express, { Router, Request, Response, RequestHandler } from 'express'
import { generateCode } from '../utils/generateCode'
import { sendVerificationEmail } from '../utils/mailer'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import crypto from 'crypto'

dotenv.config()

const router: Router = express.Router()

const verificationMap = new Map<string, { code: string; expiresAt: number }>()

const sendCodeHandler: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body

    if (!email) {
        res.status(400).json({ message: 'Email is required' })
        return
    }

    const code = generateCode()
    const expiresAt = Date.now() + 20 * 60 * 1000
    verificationMap.set(email, { code, expiresAt })

    try {
        await sendVerificationEmail(email, code)
        res.status(200).json({ message: 'Verification code sent' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Failed to send email' })
    }
}

router.post('/send-code', sendCodeHandler)

const handleSignIn: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { email, code } = req.body

    if (!email || !code) {
        res.status(400).json({ message: 'Email or code is required' })
        return
    }

    const record = verificationMap.get(email)

    if (!record) {
        res.status(400).json({ message: 'The email you entered and the code do not match my data. Please get a new authentication code and try again' })
        return
    }

    const { code: storedCode, expiresAt } = record

    if (expiresAt < Date.now()) {
        res.status(400).json({ message: 'Code expired please register again' })
        return
    }

    if (code !== storedCode) {
        res.status(400).json({ message: 'Verification code is not match' })
        return
    }

    const uid = crypto.createHash('sha256').update(email).digest('hex').slice(0, 28)

    const token = jwt.sign({ email }, process.env.JWT_SECRET as string, {
        expiresIn: '1h'
    })

    const userData = {
        'accessToken': token,
        'email': email,
        'displayName': email,
        'avatar': null,
        'photoURL': null,
        'provider': 'email verify code',
        'uid': uid
    }

    verificationMap.delete(email)
    

    res.status(200).json(userData)
}

router.post('/signin', handleSignIn)

export { verificationMap }
export default router