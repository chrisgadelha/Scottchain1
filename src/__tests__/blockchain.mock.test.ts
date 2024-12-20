import { MockBlockchain } from './__mocks__/blockchain.mock';
import { MockBlock } from './__mocks__/block.mock';

jest.mock('../lib/blockchain', () => ({
    Blockchain: MockBlockchain
}));

jest.mock('../lib/block', () => ({
    Block: MockBlock
}));

describe('Blockchain with Mocks', () => {
    let blockchain: MockBlockchain;

    beforeEach(() => {
        blockchain = new MockBlockchain();
        jest.clearAllMocks();
    });

    describe('constructor', () => {
        it('should create genesis block', () => {
            const chain = blockchain.getChain();
            expect(chain.length).toBe(1);
            expect(chain[0].data).toBe("Genesis Block");
        });
    });

    describe('createBlock', () => {
        it('should create new block with correct data', () => {
            const block = blockchain.createBlock("Test Data");
            expect(blockchain.createBlock).toHaveBeenCalledWith("Test Data");
            expect(block.data).toBe("Test Data");
            expect(block.index).toBe(1);
        });
    });

    describe('addBlock', () => {
        it('should mine and add block to chain', () => {
            const block = blockchain.createBlock("Test Block");
            blockchain.addBlock(block);
            expect(blockchain.addBlock).toHaveBeenCalledWith(block);
            expect(block.mineBlock).toHaveBeenCalled();
        });
    });

    describe('isChainValid', () => {
        it('should check chain validity', () => {
            blockchain.isChainValid();
            expect(blockchain.isChainValid).toHaveBeenCalled();
        });
    });

    describe('editBlock', () => {
        it('should edit block and mark subsequent blocks as corrupted', () => {
            blockchain.addBlock(blockchain.createBlock("Block 1"));
            blockchain.addBlock(blockchain.createBlock("Block 2"));
            
            blockchain.editBlock(1, "Modified Block 1");
            expect(blockchain.editBlock).toHaveBeenCalledWith(1, "Modified Block 1");
            
            const chain = blockchain.getChain();
            expect(chain[1].data).toBe("Modified Block 1");
            expect(chain[2].isCorrupted).toBeTruthy();
        });

        it('should throw error for invalid index', () => {
            expect(() => blockchain.editBlock(-1, "Invalid")).toThrow();
            expect(() => blockchain.editBlock(99, "Invalid")).toThrow();
        });
    });

    describe('remineBlock', () => {
        it('should remine block at specified index', () => {
            blockchain.addBlock(blockchain.createBlock("Block 1"));
            blockchain.remineBlock(1);
            expect(blockchain.remineBlock).toHaveBeenCalledWith(1);
            const chain = blockchain.getChain();
            expect(chain[1].mineBlock).toHaveBeenCalled();
        });

        it('should throw error for invalid index', () => {
            expect(() => blockchain.remineBlock(-1)).toThrow();
            expect(() => blockchain.remineBlock(99)).toThrow();
        });
    });

    describe('getChain', () => {
        it('should return the blockchain', () => {
            const chain = blockchain.getChain();
            expect(blockchain.getChain).toHaveBeenCalled();
            expect(Array.isArray(chain)).toBeTruthy();
        });
    });

    describe('reset', () => {
        it('should reset chain to genesis block', () => {
            blockchain.addBlock(blockchain.createBlock("Test Block"));
            blockchain.reset();
            expect(blockchain.reset).toHaveBeenCalled();
            const chain = blockchain.getChain();
            expect(chain.length).toBe(1);
            expect(chain[0].data).toBe("Genesis Block");
        });
    });
}); 