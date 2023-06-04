import { afterAll, expect, test, describe, it, beforeAll, vi } from 'vitest'
import supertest from 'supertest'

import {} from 'vitest'
import app from '../src/new-app.js'

beforeAll(async () => {
    await app.listen()
})
afterAll(async () => {
    await app.close()
})

describe('/fastify/register endpoint', () => {
    it('returns status 400 and error message if verification information is invalid', async () => {
        const response = await supertest(app.server)
            .post('/fastify/register')
            .send({})
        expect(response.status).toEqual(400)
        expect(response.body).toEqual({
            message: 'the verification information is invalid',
            status: false
        })
    })

    it('returns status 400 and error message if email is illegal', async () => {
        const response = await supertest(app.server)
            .post('/fastify/register')
            .send({
                email: 'invalidEmail',
                password: 'validPassword',
                code: '123456'
            })
        expect(response.status).toEqual(400)
        expect(response.body).toEqual({
            message: 'The email is illegal',
            status: false
        })
    })

    it('returns status 400 and error message if password does not meet requirements', async () => {
        const response = await supertest(app.server)
            .post('/fastify/register')
            .send({
                email: 'validEmail@example.com',
                password: 'short',
                code: '123456'
            })
        expect(response.status).toEqual(400)
        expect(response.body).toEqual(
            'The password does not meet the requirements'
        )
    })

    it('returns status 400 and error message if verification code is invalid', async () => {
        const response = await supertest(app.server)
            .post('/fastify/register')
            .send({
                email: 'validEmail@example.com',
                password: 'validPassword',
                code: 'invalidCode'
            })
        expect(response.status).toEqual(400)
        expect(response.body).toEqual({
            status: 'no',
            msg: 'the verification code is invalid'
        })
    })

    it('returns status 200 and success message if registration is successful', async () => {
        const response = await supertest(app.server)
            .post('/fastify/register')
            .send({
                email: 'validEmail@example.com',
                password: 'validPassword',
                code: '123456'
            })
        expect(response.status).toEqual(200)
        expect(response.body).toEqual({
            status: true,
            message: 'register successfully',
            user: {
                email: 'validEmail@example.com',
                avatar_path: '/avatar/default.png',
                username: 'validEmail@example.com',
                userId: expect.any(Number),
                userBio: null
            }
        })
    })
})
