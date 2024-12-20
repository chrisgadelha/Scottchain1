import { Block } from '../lib/block';

describe('Block', () => {
    let block: Block;

    beforeEach(() => {
        block = new Block(1, "Test Block", "previous123");
    });

    describe('constructor', () => {
        it('should create a block with correct properties', () => {
            expect(block.index).toBe(1);
            expect(block.data).toBe("Test Block");
            expect(block.previousHash).toBe("previous123");
            expect(block.hash).toBeDefined();
            expect(block.isCorrupted).toBeFalsy();
        });

        it('should calculate initial hash', () => {
            const initialHash = block.hash;
            expect(initialHash).toBeDefined();
            expect(initialHash).toBe(block.calculateHash());
        });
    });

    describe('calculateHash', () => {
        it('should return different hashes for different data', () => {
            const hash1 = block.calculateHash();
            block.data = "Modified Data";
            const hash2 = block.calculateHash();
            expect(hash1).not.toBe(hash2);
        });

        it('should return different hashes for different nonces', () => {
            const hash1 = block.calculateHash();
            block.nonce = 100;
            const hash2 = block.calculateHash();
            expect(hash1).not.toBe(hash2);
        });
    });

    describe('mineBlock', () => {
        it('should mine block with correct difficulty', () => {
            const difficulty = 2;
            block.mineBlock(difficulty);
            expect(block.hash.substring(0, difficulty)).toBe('0'.repeat(difficulty));
        });

        it('should reset nonce and recalculate hash when mining starts', () => {
            block.nonce = 100;
            const oldHash = block.hash;
            block.mineBlock(1);
            expect(block.hash).not.toBe(oldHash);
        });

        it('should mark block as not corrupted after mining', () => {
            block.isCorrupted = true;
            block.mineBlock(1);
            expect(block.isCorrupted).toBeFalsy();
        });
    });

    describe('isValid', () => {
        it('should return true for valid hash', () => {
            expect(block.isValid()).toBeTruthy();
        });

        it('should return false when data is modified without mining', () => {
            block.mineBlock(2); // First mine to get a valid state
            block.data = "Modified without mining";
            expect(block.isValid()).toBeFalsy();
        });
    });

    describe('updateData', () => {
        it('should update data and mark as corrupted', () => {
            const newData = "Updated Data";
            block.updateData(newData);
            expect(block.data).toBe(newData);
            expect(block.isCorrupted).toBeTruthy();
        });

        it('should recalculate hash when data is updated', () => {
            const oldHash = block.hash;
            block.updateData("New Data");
            expect(block.hash).not.toBe(oldHash);
            expect(block.hash).toBe(block.calculateHash());
        });
    });
}); 