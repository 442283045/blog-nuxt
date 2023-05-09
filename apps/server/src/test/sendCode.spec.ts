import { test, describe, expect, vi } from 'vitest'
import { MySQLPromisePool } from '@fastify/mysql'
import axios, { AxiosError } from 'axios'
import type { AxiosInstance } from 'axios'

declare module 'fastify' {
    interface FastifyInstance {
        mysql: MySQLPromisePool
    }
}
const emailAndCodeMessages = new Map()

const sendMail = (email: string, code: string, callback: any) => {
    // Code for sending mock email
}
// interface MyAxiosInstance extends AxiosInstance {
//     mysql: any // replace 'any' with the correct type definitions
// }
const instance = axios.create({
    baseURL: 'http://localhost:3000'
})
describe('Server tests', () => {
    test('No email provided', async () => {
        const response = await instance
            .post('/sendEmail')
            .catch((err) => err.response)

        expect(response.status).toBe(400)
        expect(response.data).toBe(
            'The email is empty, please provide the email'
        )
    })

    test('Invalid email format', async () => {
        const response = await instance
            .post('/sendEmail', { email: 'abc' })
            .catch((err) => err.response)

        expect(response.status).toBe(400)
        expect(response.data).toBe('The email is illegal')
    })

    test('Email already exists', async () => {
        // Mocking the query function for returning a user's email.
        ;(instance as any).mysql.query = vi
            .fn()
            .mockResolvedValueOnce([{ email: 'test@test.com' }])
        const response = await instance
            .post('/sendEmail', { email: 'test@test.com' })
            .catch((err) => err.response)

        expect(response.status).toBe(400)
        expect(response.data).toBe('The email already exists')
    })

    test('Email already sended within last 30 seconds', async () => {
        // Adding an email to cache.
        const email = 'test@test.com'
        emailAndCodeMessages.set(email, {
            code: '123456',
            sendTime: Date.now()
        })

        const response = await instance
            .post('/sendEmail', { email })
            .catch((err) => err.response)

        expect(response.status).toBe(400)
        expect(response.data).toContain(
            'Email has been sended, if want to resend, please wait'
        )
    })

    test('Email sent successfully', async () => {
        // Mocking the sendMail function for returning success message.
        let sendMail = vi.fn().mockImplementation((email, code, callback) => {
            callback(null, { response: 'Email sent!' })
        })

        const response = await instance
            .post('/sendEmail', { email: 'test@test.com' })
            .catch((err) => err.response)

        expect(response.status).toBe(200)
        expect(response.data).toContain('Email sending successful')
    })
})
