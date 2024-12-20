import { Block } from './block';

export class Blockchain {
    private chain: Block[] = [];
    private difficulty: number = 4;

    constructor() {
        this.createGenesisBlock();
    }

    /**
     * Creates and adds the genesis block to the chain
     */
    private createGenesisBlock(): void {
        const genesisBlock = new Block(0, "Genesis Block", "0");
        genesisBlock.mineBlock(this.difficulty);
        this.chain.push(genesisBlock);
    }

    /**
     * Gets the latest block in the chain
     */
    public getLatestBlock(): Block {
        return this.chain[this.chain.length - 1];
    }

    /**
     * Creates a new block with the given data
     * @param data The data to be stored in the new block
     */
    public createBlock(data: string): Block {
        const previousBlock = this.getLatestBlock();
        const newBlock = new Block(
            previousBlock.index + 1,
            data,
            previousBlock.hash
        );
        return newBlock;
    }

    /**
     * Adds a block to the chain after mining it
     * @param block The block to be added
     */
    public addBlock(block: Block): void {
        block.mineBlock(this.difficulty);
        this.chain.push(block);
    }

    /**
     * Validates the entire blockchain
     * A chain is valid if:
     * 1. Each block's hash is valid (matches its contents)
     * 2. Each block's previousHash matches the previous block's hash
     * 3. No blocks are marked as corrupted
     */
    public isChainValid(): boolean {
        // First check the genesis block
        if (!this.chain[0].isValid()) {
            return false;
        }

        // Then check the rest of the chain
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            // Check if the block's hash is valid
            if (!currentBlock.isValid()) {
                return false;
            }

            // Check if the block's previous hash matches the previous block's hash
            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }

            // Check if any block is marked as corrupted
            if (currentBlock.isCorrupted) {
                return false;
            }
        }
        return true;
    }

    /**
     * Edits a block's data and marks it and subsequent blocks as corrupted
     * @param index The index of the block to edit
     * @param newData The new data for the block
     */
    public editBlock(index: number, newData: string): void {
        if (index < 0 || index >= this.chain.length) {
            throw new Error("Invalid block index");
        }

        // Update the block data and mark it as corrupted
        this.chain[index].updateData(newData);
        
        // Mark all subsequent blocks as corrupted since their previousHash is now invalid
        for (let i = index + 1; i < this.chain.length; i++) {
            this.chain[i].isCorrupted = true;
        }
    }

    /**
     * Remines a specific block and updates the chain links
     * @param index The index of the block to remine
     */
    public remineBlock(index: number): void {
        if (index < 0 || index >= this.chain.length) {
            throw new Error("Invalid block index");
        }

        const block = this.chain[index];
        const previousBlock = index > 0 ? this.chain[index - 1] : null;

        // Update previousHash if not genesis block
        if (previousBlock) {
            block.previousHash = previousBlock.hash;
        }

        // Remine the block and remove corrupted flag
        block.mineBlock(this.difficulty);
        block.isCorrupted = false;

        // If this block is valid and the next block exists, update its previousHash
        if (index < this.chain.length - 1) {
            this.chain[index + 1].previousHash = block.hash;
        }
    }

    /**
     * Gets the entire blockchain
     */
    public getChain(): Block[] {
        return this.chain;
    }

    /**
     * Resets the blockchain to its initial state with only the genesis block
     */
    public reset(): void {
        this.chain = [];
        this.createGenesisBlock();
    }
} 