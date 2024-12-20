import { MockBlock } from './__mocks__/block.mock';

jest.mock('../lib/block', () => ({
    Block: MockBlock
}));

describe('Block with Mocks', () => {
    let block: MockBlock;

    beforeEach(() => {
        block = new MockBlock(1, "Test Block", "previous123");
        // Reset all mock implementations
        jest.clearAllMocks();
    });

    describe('mineBlock', () => {
        it('should call mineBlock with correct difficulty', () => {
            block.mineBlock(4);
            expect(block.mineBlock).toHaveBeenCalledWith(4);
        });

        it('should update hash with correct number of leading zeros', () => {
            block.mineBlock(3);
            expect(block.hash).toBe('mined-hash-000');
        });

        it('should mark block as not corrupted after mining', () => {
            block.isCorrupted = true;
            block.mineBlock(2);
            expect(block.isCorrupted).toBeFalsy();
        });
    });

    describe('calculateHash', () => {
        it('should return mocked hash value', () => {
            expect(block.calculateHash()).toBe('mock-hash');
            expect(block.calculateHash).toHaveBeenCalled();
        });
    });

    describe('isValid', () => {
        it('should call isValid method', () => {
            block.isValid();
            expect(block.isValid).toHaveBeenCalled();
        });

        it('should return mocked validity', () => {
            expect(block.isValid()).toBeTruthy();
        });
    });

    describe('updateData', () => {
        it('should update data and mark as corrupted', () => {
            block.updateData('New Data');
            expect(block.updateData).toHaveBeenCalledWith('New Data');
            expect(block.data).toBe('New Data');
            expect(block.isCorrupted).toBeTruthy();
        });
    });
}); 