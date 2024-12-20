export class MockBlock {
    public hash: string = 'mock-hash';
    public isCorrupted: boolean = false;
    public nonce: number = 0;

    constructor(
        public index: number,
        public data: string,
        public previousHash: string,
        public timestamp: number = Date.now()
    ) {}

    calculateHash = jest.fn().mockReturnValue('mock-hash');
    mineBlock = jest.fn().mockImplementation((difficulty: number) => {
        this.hash = 'mined-hash-' + '0'.repeat(difficulty);
        this.isCorrupted = false;
    });
    isValid = jest.fn().mockReturnValue(true);
    updateData = jest.fn().mockImplementation((newData: string) => {
        this.data = newData;
        this.isCorrupted = true;
    });
} 