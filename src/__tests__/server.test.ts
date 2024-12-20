import request from 'supertest';
import express from 'express';
import { app, server } from '../server/server';

describe('Blockchain Server', () => {
    const sessionId = 'test-session-123';

    // Cleanup after all tests
    afterAll(done => {
        server.close(done);
    });

    describe('Middleware', () => {
        it('should require X-Session-ID header', async () => {
            const response = await request(app)
                .get('/chain');
            
            expect(response.status).toBe(400);
            expect(response.body.success).toBeFalsy();
            expect(response.body.error).toBe('X-Session-ID header is required');
        });
    });

    describe('POST /reset', () => {
        it('should reset blockchain to genesis block', async () => {
            const response = await request(app)
                .post('/reset')
                .set('X-Session-ID', sessionId);
            
            expect(response.status).toBe(200);
            expect(response.body.success).toBeTruthy();
            expect(response.body.data.length).toBe(1);
            expect(response.body.data[0].data).toBe('Genesis Block');
        });
    });

    describe('GET /chain', () => {
        it('should return blockchain for session', async () => {
            const response = await request(app)
                .get('/chain')
                .set('X-Session-ID', sessionId);
            
            expect(response.status).toBe(200);
            expect(response.body.success).toBeTruthy();
            expect(Array.isArray(response.body.data)).toBeTruthy();
        });
    });

    describe('POST /mine', () => {
        it('should add new block with provided data', async () => {
            const response = await request(app)
                .post('/mine')
                .set('X-Session-ID', sessionId)
                .send({ data: 'Test Block' });
            
            expect(response.status).toBe(200);
            expect(response.body.success).toBeTruthy();
            expect(response.body.data.slice(-1)[0].data).toBe('Test Block');
        });

        it('should require block data', async () => {
            const response = await request(app)
                .post('/mine')
                .set('X-Session-ID', sessionId)
                .send({});
            
            expect(response.status).toBe(400);
            expect(response.body.success).toBeFalsy();
            expect(response.body.error).toBe('Block data must be a string');
        });

        it('should handle invalid data type', async () => {
            const response = await request(app)
                .post('/mine')
                .set('X-Session-ID', sessionId)
                .send({ data: { invalid: 'object' } });
            
            expect(response.status).toBe(400);
            expect(response.body.success).toBeFalsy();
            expect(response.body.error).toBe('Block data must be a string');
        });

        it('should handle null data', async () => {
            const response = await request(app)
                .post('/mine')
                .set('X-Session-ID', sessionId)
                .send({ data: null });
            
            expect(response.status).toBe(400);
            expect(response.body.success).toBeFalsy();
            expect(response.body.error).toBe('Block data must be a string');
        });
    });

    describe('GET /validate', () => {
        it('should validate blockchain', async () => {
            const response = await request(app)
                .get('/validate')
                .set('X-Session-ID', sessionId);
            
            expect(response.status).toBe(200);
            expect(response.body.success).toBeTruthy();
            expect(typeof response.body.data.isValid).toBe('boolean');
        });
    });

    describe('POST /block/update', () => {
        it('should update block data', async () => {
            // First add a block
            await request(app)
                .post('/mine')
                .set('X-Session-ID', sessionId)
                .send({ data: 'Original Data' });

            const response = await request(app)
                .post('/block/update')
                .set('X-Session-ID', sessionId)
                .send({ index: 1, data: 'Updated Data' });
            
            expect(response.status).toBe(200);
            expect(response.body.success).toBeTruthy();
            expect(response.body.data[1].data).toBe('Updated Data');
        });

        it('should require valid index and data', async () => {
            const response = await request(app)
                .post('/block/update')
                .set('X-Session-ID', sessionId)
                .send({ index: 'invalid' });
            
            expect(response.status).toBe(400);
            expect(response.body.success).toBeFalsy();
        });

        it('should handle update errors', async () => {
            const response = await request(app)
                .post('/block/update')
                .set('X-Session-ID', sessionId)
                .send({ index: 999, data: "Invalid" });
            
            expect(response.status).toBe(400);
            expect(response.body.success).toBeFalsy();
        });

        it('should validate data type', async () => {
            const response = await request(app)
                .post('/block/update')
                .set('X-Session-ID', sessionId)
                .send({ index: 1, data: null });
            
            expect(response.status).toBe(400);
            expect(response.body.success).toBeFalsy();
        });

        it('should handle both missing index and data', async () => {
            const response = await request(app)
                .post('/block/update')
                .set('X-Session-ID', sessionId)
                .send({});
            
            expect(response.status).toBe(400);
            expect(response.body.success).toBeFalsy();
        });
    });

    describe('POST /block/remine', () => {
        it('should remine block at index', async () => {
            // First add and update a block
            await request(app)
                .post('/mine')
                .set('X-Session-ID', sessionId)
                .send({ data: 'Test Block' });

            await request(app)
                .post('/block/update')
                .set('X-Session-ID', sessionId)
                .send({ index: 1, data: 'Modified Data' });

            const response = await request(app)
                .post('/block/remine')
                .set('X-Session-ID', sessionId)
                .send({ index: 1 });
            
            expect(response.status).toBe(200);
            expect(response.body.success).toBeTruthy();
        });

        it('should require valid index', async () => {
            const response = await request(app)
                .post('/block/remine')
                .set('X-Session-ID', sessionId)
                .send({ index: 'invalid' });
            
            expect(response.status).toBe(400);
            expect(response.body.success).toBeFalsy();
        });

        it('should handle remine errors', async () => {
            const response = await request(app)
                .post('/block/remine')
                .set('X-Session-ID', sessionId)
                .send({ index: 999 });
            
            expect(response.status).toBe(400);
            expect(response.body.success).toBeFalsy();
        });
    });

    describe('Error handling', () => {
        it('should handle unknown errors', async () => {
            // Force an error by passing invalid data type
            const response = await request(app)
                .post('/mine')
                .set('X-Session-ID', sessionId)
                .send({ data: { invalid: 'object' } });
            
            expect(response.status).toBe(400);
            expect(response.body.success).toBeFalsy();
        });
    });

    describe('Session handling', () => {
        it('should create new blockchain for new session', async () => {
            const newSessionId = 'new-session-123';
            const response = await request(app)
                .get('/chain')
                .set('X-Session-ID', newSessionId);
            
            expect(response.status).toBe(200);
            expect(response.body.success).toBeTruthy();
            expect(response.body.data.length).toBe(1); // Should have genesis block
        });

        it('should maintain separate blockchains for different sessions', async () => {
            const session1 = 'session-1';
            const session2 = 'session-2';

            // Add block to first session
            await request(app)
                .post('/mine')
                .set('X-Session-ID', session1)
                .send({ data: 'Block for session 1' });

            // Check second session has only genesis block
            const response = await request(app)
                .get('/chain')
                .set('X-Session-ID', session2);
            
            expect(response.body.data.length).toBe(1);
        });
    });
}); 