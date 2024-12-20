import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { Blockchain } from '../lib/blockchain';

export const app = express();
const port = process.env.PORT || 3000;

// Store blockchains for each session
const blockchains = new Map<string, Blockchain>();

// Configuração de CORS com base nas variáveis de ambiente
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];

// Middleware
app.use(express.json());
app.use(cors({
    origin: '*',  // Permite todas as origens em desenvolvimento
    exposedHeaders: ['X-Session-ID'],
    allowedHeaders: ['X-Session-ID', 'Content-Type', 'Origin', 'Accept']
}));

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, '../../frontend')));

// Middleware to check for session ID
const requireSession = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const sessionId = req.header('X-Session-ID');
    if (!sessionId) {
        return res.status(400).json({
            success: false,
            timestamp: new Date().toISOString(),
            error: 'X-Session-ID header is required'
        });
    }
    
    if (!blockchains.has(sessionId)) {
        const blockchain = new Blockchain();
        blockchains.set(sessionId, blockchain);
    }
    
    next();
};

// API Routes
app.post('/reset', requireSession, (req, res) => {
    const sessionId = req.header('X-Session-ID')!;
    const blockchain = new Blockchain();
    blockchains.set(sessionId, blockchain);
    
    res.json({
        success: true,
        timestamp: new Date().toISOString(),
        data: blockchain.getChain()
    });
});

app.get('/chain', requireSession, (req, res) => {
    const sessionId = req.header('X-Session-ID')!;
    const blockchain = blockchains.get(sessionId)!;
    
    res.json({
        success: true,
        timestamp: new Date().toISOString(),
        data: blockchain.getChain()
    });
});

app.post('/mine', requireSession, (req, res) => {
    const sessionId = req.header('X-Session-ID')!;
    const blockchain = blockchains.get(sessionId)!;
    const { data } = req.body;

    if (!data || typeof data !== 'string') {
        return res.status(400).json({
            success: false,
            timestamp: new Date().toISOString(),
            error: 'Block data must be a string'
        });
    }

    try {
        const newBlock = blockchain.createBlock(data);
        blockchain.addBlock(newBlock);
        
        res.json({
            success: true,
            timestamp: new Date().toISOString(),
            data: blockchain.getChain()
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            timestamp: new Date().toISOString(),
            error: error instanceof Error ? error.message : 'Unknown error occurred'
        });
    }
});

app.get('/validate', requireSession, (req, res) => {
    const sessionId = req.header('X-Session-ID')!;
    const blockchain = blockchains.get(sessionId)!;
    
    res.json({
        success: true,
        timestamp: new Date().toISOString(),
        data: {
            isValid: blockchain.isChainValid()
        }
    });
});

app.post('/block/update', requireSession, (req, res) => {
    const sessionId = req.header('X-Session-ID')!;
    const blockchain = blockchains.get(sessionId)!;
    const { index, data } = req.body;

    if (typeof index !== 'number' || !data) {
        return res.status(400).json({
            success: false,
            timestamp: new Date().toISOString(),
            error: 'Block index and data are required'
        });
    }

    try {
        blockchain.editBlock(index, data);
        res.json({
            success: true,
            timestamp: new Date().toISOString(),
            data: blockchain.getChain()
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            timestamp: new Date().toISOString(),
            error: error instanceof Error ? error.message : 'Unknown error occurred'
        });
    }
});

app.post('/block/remine', requireSession, (req, res) => {
    const sessionId = req.header('X-Session-ID')!;
    const blockchain = blockchains.get(sessionId)!;
    const { index } = req.body;

    if (typeof index !== 'number') {
        return res.status(400).json({
            success: false,
            timestamp: new Date().toISOString(),
            error: 'Block index is required'
        });
    }

    try {
        blockchain.remineBlock(index);
        res.json({
            success: true,
            timestamp: new Date().toISOString(),
            data: blockchain.getChain()
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            timestamp: new Date().toISOString(),
            error: error instanceof Error ? error.message : 'Unknown error occurred'
        });
    }
});

// Start server
export const server = app.listen(port, () => {
    console.log('\x1b[32m%s\x1b[0m', '🚀 Blockchain Server Started Successfully!');
    console.log('\x1b[36m%s\x1b[0m', `📡 Server running at http://localhost:${port}`);
    console.log('\x1b[33m%s\x1b[0m', '📝 API Endpoints:');
    console.log('\x1b[37m%s\x1b[0m', '   POST /reset    - Reset blockchain');
    console.log('\x1b[37m%s\x1b[0m', '   GET  /chain    - Get current blockchain');
    console.log('\x1b[37m%s\x1b[0m', '   POST /mine     - Mine a new block');
    console.log('\x1b[37m%s\x1b[0m', '   GET  /validate - Validate blockchain');
    console.log('\x1b[37m%s\x1b[0m', '   POST /block/update  - Update block data');
    console.log('\x1b[37m%s\x1b[0m', '   POST /block/remine  - Remine a block');
    console.log('\x1b[35m%s\x1b[0m', '\n💡 Remember: Always use X-Session-ID header in your requests\n');
}); 