# ScottChain

An educational blockchain implementation in TypeScript, designed to demonstrate fundamental blockchain concepts.

## Features

- ⛓️ Blockchain creation and management
- ⚒️ Block mining with proof of work
- ✏️ Block editing (for educational purposes)
- 🔄 Block re-mining
- ✅ Chain validation
- 🌐 REST API for interaction
- 🔍 Web interface for visualization

## Technologies Used

- TypeScript
- Node.js
- Express.js
- Jest (testing)
- HTML/CSS/JavaScript (frontend)

## Deployment

- **Backend:** Hosted on Render
- **Frontend:** Deployed on Vercel
- **Live Demo:** [ScottChain Live](https://scottchain.vercel.app/)

## Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/chrisgadelha/Scottchain1.git
cd Scottchain1
```

2. Install dependencies:
```bash
npm install
```

3. Compile TypeScript:
```bash
npm run build
```

4. Start the server:
```bash
npm start
```

The server will run at `http://localhost:3000`

## API Usage

All requests must include the `X-Session-ID` header to identify the session.

### Endpoints

- `POST /reset` - Reset the blockchain
- `GET /chain` - Get current blockchain
- `POST /mine` - Mine a new block
- `GET /validate` - Validate blockchain
- `POST /block/update` - Update block data
- `POST /block/remine` - Re-mine a block

### Example Usage

```bash
# Create a new block
curl -X POST http://localhost:3000/mine \
  -H "X-Session-ID: session123" \
  -H "Content-Type: application/json" \
  -d '{"data": "My first block"}'
```

## Testing

Run unit and integration tests:
```bash
npm test
```

To view test coverage:
```bash
npm run test:coverage
```

## Project Structure

```
src/
  ├── lib/           # Core classes
  │   ├── block.ts
  │   └── blockchain.ts
  ├── server/        # Express server
  │   └── server.ts
  ├── __tests__/     # Tests
  │   ├── block.test.ts
  │   └── blockchain.test.ts
  └── frontend/      # Web interface
```

## Quick Start Guide 🚀

### Blockchain Interactions

1. **Add New Blocks**
   - Enter data in the input field
   - Click "Mine Block" to add a new block to the chain
   - Each block contains unique data and a calculated hash

2. **Block Manipulation**
   - Edit any block's data using the input field
   - Click "Update" to modify block content
   - Note: Updating breaks the blockchain's integrity

3. **Block Recovery**
   - Use "Remine" button to recalculate a block's hash
   - Restores blockchain consistency after modifications

4. **Chain Validation**
   - Click "Validate Chain" to check blockchain integrity
   - Identifies corrupted or tampered blocks
   - Ensures data immutability

5. **Reset Blockchain**
   - Use "Reset Chain" to start a fresh blockchain
   - Removes all existing blocks
   - Creates a new genesis block

### Common Use Cases

- Educational blockchain exploration
- Understanding proof-of-work concepts
- Demonstrating blockchain immutability
- Experimenting with block manipulation

## Contributing Guidelines 🤝

### Ways to Contribute

1. **Code Contributions**
   - Fix bugs
   - Implement new features
   - Improve performance
   - Enhance documentation

2. **Reporting Issues**
   - Use GitHub Issues
   - Provide detailed description
   - Include steps to reproduce
   - Attach relevant screenshots/logs

3. **Feature Requests**
   - Open a new issue
   - Describe proposed feature
   - Explain its potential value
   - Discuss implementation approach

### Contribution Process

1. Fork the repository
2. Create a feature branch
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes
   ```bash
   git commit -m 'Add detailed commit message'
   ```
4. Push to your branch
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a Pull Request
   - Describe changes
   - Link related issues
   - Request code review

### Development Setup

- Use Node.js 14+
- Follow existing code style
- Write unit tests for new features
- Ensure all tests pass before submitting

### Code of Conduct

- Be respectful
- Collaborate constructively
- Welcome diverse perspectives
- Focus on learning and improvement

**Happy Coding! 💻🔗**

## License

This project is under the MIT License. See [LICENSE](LICENSE) for details.

## Author

Christian Gadelha - [gadelhaweb3@gmail.com]

## Acknowledgments

- Luiz Tools for the course and inspiration
- Blockchain community for educational resources
