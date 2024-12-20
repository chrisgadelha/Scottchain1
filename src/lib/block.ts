import SHA256 from 'crypto-js/sha256';

export class Block {
    public hash: string;
    public isCorrupted: boolean = false;

    constructor(
        public index: number,
        public data: string,
        public previousHash: string,
        public timestamp: number = Date.now(),
        public nonce: number = 0
    ) {
        this.hash = this.calculateHash();
    }

    /**
     * Calculates the hash of the block using its properties
     */
    public calculateHash(): string {
        return SHA256(
            this.index +
            this.data +
            this.previousHash +
            this.timestamp +
            this.nonce
        ).toString();
    }

    /**
     * Mines the block with the given difficulty
     * @param difficulty The number of leading zeros required in the hash
     */
    public mineBlock(difficulty: number): void {
        const target = Array(difficulty + 1).join("0");
        
        // Reset nonce when mining starts
        this.nonce = 0;
        this.hash = this.calculateHash();
        
        while (this.hash.substring(0, difficulty) !== target) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        
        this.isCorrupted = false;
    }

    /**
     * Checks if the block's hash is valid
     */
    public isValid(): boolean {
        return this.hash === this.calculateHash();
    }

    /**
     * Updates the block's data and marks it as corrupted
     * @param newData The new data to be stored in the block
     */
    public updateData(newData: string): void {
        this.data = newData;
        // Recalculate hash immediately when data changes
        this.hash = this.calculateHash();
        this.isCorrupted = true;
    }
} 