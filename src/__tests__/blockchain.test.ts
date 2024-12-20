import { Blockchain } from '../lib/blockchain';
import { Block } from '../lib/block';

describe('Blockchain', () => {
    let blockchain: Blockchain;

    beforeEach(() => {
        blockchain = new Blockchain();
    });

    describe('constructor', () => {
        it('should create blockchain with genesis block', () => {
            const chain = blockchain.getChain();
            expect(chain.length).toBe(1);
            expect(chain[0].index).toBe(0);
            expect(chain[0].data).toBe("Genesis Block");
            expect(chain[0].previousHash).toBe("0");
        });
    });

    describe('getLatestBlock', () => {
        it('should return genesis block when chain just created', () => {
            const latestBlock = blockchain.getLatestBlock();
            expect(latestBlock.index).toBe(0);
            expect(latestBlock.data).toBe("Genesis Block");
        });

        it('should return latest block after adding blocks', () => {
            const block = blockchain.createBlock("Test Block");
            blockchain.addBlock(block);
            const latestBlock = blockchain.getLatestBlock();
            expect(latestBlock.index).toBe(1);
            expect(latestBlock.data).toBe("Test Block");
        });
    });

    describe('createBlock', () => {
        it('should create block with correct properties', () => {
            const block = blockchain.createBlock("Test Data");
            expect(block.index).toBe(1);
            expect(block.data).toBe("Test Data");
            expect(block.previousHash).toBe(blockchain.getLatestBlock().hash);
        });
    });

    describe('addBlock', () => {
        it('should add block to chain after mining', () => {
            const block = blockchain.createBlock("Test Block");
            blockchain.addBlock(block);
            const chain = blockchain.getChain();
            expect(chain.length).toBe(2);
            expect(chain[1]).toBe(block);
        });

        it('should mine block before adding', () => {
            const block = blockchain.createBlock("Test Block");
            const initialHash = block.hash;
            blockchain.addBlock(block);
            expect(block.hash).not.toBe(initialHash);
        });
    });

    describe('isChainValid', () => {
        it('should return true for new blockchain', () => {
            expect(blockchain.isChainValid()).toBeTruthy();
        });

        it('should return true after adding valid blocks', () => {
            const block = blockchain.createBlock("Test Block");
            blockchain.addBlock(block);
            expect(blockchain.isChainValid()).toBeTruthy();
        });

        it('should return false when block is corrupted', () => {
            const block = blockchain.createBlock("Test Block");
            blockchain.addBlock(block);
            blockchain.editBlock(1, "Modified Data");
            expect(blockchain.isChainValid()).toBeFalsy();
        });

        it('should return false when previous hash is invalid', () => {
            const block = blockchain.createBlock("Test Block");
            blockchain.addBlock(block);
            block.previousHash = "invalid_hash";
            expect(blockchain.isChainValid()).toBeFalsy();
        });

        it('should return false when genesis block is invalid', () => {
            const chain = blockchain.getChain();
            chain[0].data = "Modified Genesis";  // This will make the hash invalid
            expect(blockchain.isChainValid()).toBeFalsy();
        });

        it('should validate entire chain including genesis block', () => {
            blockchain.addBlock(blockchain.createBlock("Block 1"));
            blockchain.addBlock(blockchain.createBlock("Block 2"));
            expect(blockchain.isChainValid()).toBeTruthy();
        });
    });

    describe('editBlock', () => {
        it('should edit block data and mark as corrupted', () => {
            const block = blockchain.createBlock("Test Block");
            blockchain.addBlock(block);
            blockchain.editBlock(1, "Modified Data");
            const chain = blockchain.getChain();
            expect(chain[1].data).toBe("Modified Data");
            expect(chain[1].isCorrupted).toBeTruthy();
        });

        it('should mark subsequent blocks as corrupted', () => {
            blockchain.addBlock(blockchain.createBlock("Block 1"));
            blockchain.addBlock(blockchain.createBlock("Block 2"));
            blockchain.editBlock(1, "Modified Block 1");
            const chain = blockchain.getChain();
            expect(chain[2].isCorrupted).toBeTruthy();
        });

        it('should throw error for invalid index', () => {
            expect(() => blockchain.editBlock(-1, "Invalid")).toThrow();
            expect(() => blockchain.editBlock(99, "Invalid")).toThrow();
        });

        it('should handle editing genesis block', () => {
            blockchain.editBlock(0, "Modified Genesis");
            const chain = blockchain.getChain();
            expect(chain[0].data).toBe("Modified Genesis");
            expect(chain[0].isCorrupted).toBeTruthy();
        });
    });

    describe('remineBlock', () => {
        it('should remine block and update hash', () => {
            blockchain.addBlock(blockchain.createBlock("Block 1"));
            const block = blockchain.getChain()[1];
            const originalHash = block.hash;
            blockchain.editBlock(1, "Modified Block 1");
            blockchain.remineBlock(1);
            expect(block.hash).not.toBe(originalHash);
            expect(block.isCorrupted).toBeFalsy();
        });

        it('should update subsequent block previousHash', () => {
            blockchain.addBlock(blockchain.createBlock("Block 1"));
            blockchain.addBlock(blockchain.createBlock("Block 2"));
            const block1 = blockchain.getChain()[1];
            blockchain.editBlock(1, "Modified Block 1");
            blockchain.remineBlock(1);
            const block2 = blockchain.getChain()[2];
            expect(block2.previousHash).toBe(block1.hash);
        });

        it('should throw error for invalid index', () => {
            expect(() => blockchain.remineBlock(-1)).toThrow();
            expect(() => blockchain.remineBlock(99)).toThrow();
        });
    });

    describe('reset', () => {
        it('should reset chain to only genesis block', () => {
            blockchain.addBlock(blockchain.createBlock("Test Block"));
            blockchain.reset();
            const chain = blockchain.getChain();
            expect(chain.length).toBe(1);
            expect(chain[0].data).toBe("Genesis Block");
        });
    });
}); 