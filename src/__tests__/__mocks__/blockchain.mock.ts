import { MockBlock } from './block.mock';

export class MockBlockchain {
    private chain: MockBlock[] = [];
    private difficulty: number = 4;

    constructor() {
        this.createGenesisBlock();
    }

    private createGenesisBlock = jest.fn().mockImplementation(() => {
        const genesisBlock = new MockBlock(0, "Genesis Block", "0");
        this.chain.push(genesisBlock);
    });

    getLatestBlock = jest.fn().mockImplementation(() => {
        return this.chain[this.chain.length - 1];
    });

    createBlock = jest.fn().mockImplementation((data: string) => {
        const previousBlock = this.getLatestBlock();
        return new MockBlock(
            previousBlock.index + 1,
            data,
            previousBlock.hash
        );
    });

    addBlock = jest.fn().mockImplementation((block: MockBlock) => {
        block.mineBlock(this.difficulty);
        this.chain.push(block);
    });

    isChainValid = jest.fn().mockReturnValue(true);

    editBlock = jest.fn().mockImplementation((index: number, newData: string) => {
        if (index < 0 || index >= this.chain.length) {
            throw new Error("Invalid block index");
        }
        this.chain[index].updateData(newData);
        for (let i = index + 1; i < this.chain.length; i++) {
            this.chain[i].isCorrupted = true;
        }
    });

    remineBlock = jest.fn().mockImplementation((index: number) => {
        if (index < 0 || index >= this.chain.length) {
            throw new Error("Invalid block index");
        }
        this.chain[index].mineBlock(this.difficulty);
    });

    getChain = jest.fn().mockImplementation(() => {
        return this.chain;
    });

    reset = jest.fn().mockImplementation(() => {
        this.chain = [];
        this.createGenesisBlock();
    });
} 