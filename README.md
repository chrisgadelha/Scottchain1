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
- **Live Demo:** [ScottChain Live](https://your-vercel-url.vercel.app)

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

## Contributing

1. Fork the project
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

## License

This project is under the MIT License. See [LICENSE](LICENSE) for details.

## Author

Christian Gadelha - [gadelhaweb3@gmail.com]

## Acknowledgments

- Luiz Tools for the course and inspiration
- Blockchain community for educational resources
