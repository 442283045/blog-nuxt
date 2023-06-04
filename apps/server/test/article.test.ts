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

describe('GET /articles', () => {
    it('should return a list of articles when there are articles in the database', async () => {
        const response = await supertest(app.server).get('/fastify/articles')
        // console.log(response.body)
        expect(response.statusCode).toBe(200)
        expect(Array.isArray(response.body)).toEqual(true)
        expect(response.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    article_author_user_id: expect.any(Number),
                    article_comments_count: expect.any(Number),
                    article_favorites_count: expect.any(Number),
                    article_id: expect.any(Number),
                    article_published_date: expect.any(String),
                    article_thumbs_up_count: expect.any(Number),
                    article_title: expect.any(String),
                    // article_updated_date: expect.anything(),
                    article_view_count: expect.any(Number)
                })
            ])
        )
    })
})
describe('GET /is_favorite ', () => {
    it('returns status false and message "user is not login" if user is not logged in', async () => {
        const response = await supertest(app.server).get('/fastify/is_favorite')
        expect(response.status).toEqual(200)
        expect(response.body).toEqual({
            status: false,
            message: 'user is not login'
        })
    })

    it('returns status false and message "Please provide the article id" if article id is not provided', async () => {
        const response = await supertest(app.server)
            .get('/fastify/is_favorite')
            .set(
                'Cookie',
                'token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjozOSwiaWF0IjoxNjg1ODg0ODg2fQ.BTqkSMSaHsILxhXXO5vYAVyVXrhJoeNFpMOd-0xaKO8'
            )
        expect(response.status).toEqual(400)
        expect(response.body).toEqual({
            status: false,
            message: 'Please provide the article id'
        })
    })

    it('returns status true if article is liked by user', async () => {
        const response = await supertest(app.server)
            .get('/fastify/is_favorite')
            .query({ article_id: '2' })
        expect(response.status).toEqual(200)
        expect(response.body).toEqual({
            status: true
        })
    })

    it('returns status false and message "user is not favorite" if article is not liked by user', async () => {
        const response = await supertest(app.server)
            .get('/fastify/is_favorite')
            .query({ article_id: '456' })
        expect(response.status).toEqual(200)
        expect(response.body).toEqual({
            status: false,
            message: 'user is not favorite'
        })
    })
})
