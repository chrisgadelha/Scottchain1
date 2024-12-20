# ScottChain

Uma implementação educacional de blockchain em TypeScript, desenvolvida para demonstrar os conceitos fundamentais de uma blockchain.

## Funcionalidades

- ⛓️ Criação e gerenciamento de blockchains
- ⚒️ Mineração de blocos com proof of work
- ✏️ Edição de blocos (para fins educacionais)
- 🔄 Remineração de blocos
- ✅ Validação da cadeia
- 🌐 API REST para interação
- 🔍 Interface web para visualização

## Tecnologias Utilizadas

- TypeScript
- Node.js
- Express.js
- Jest (testes)
- HTML/CSS/JavaScript (frontend)

## Pré-requisitos

- Node.js (versão 14 ou superior)
- npm ou yarn

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/scottchain.git
cd scottchain
```

2. Instale as dependências:
```bash
npm install
```

3. Compile o TypeScript:
```bash
npm run build
```

4. Inicie o servidor:
```bash
npm start
```

O servidor estará rodando em `http://localhost:3000`

## Uso da API

Todas as requisições devem incluir o header `X-Session-ID` para identificar a sessão.

### Endpoints

- `POST /reset` - Reseta a blockchain
- `GET /chain` - Obtém a blockchain atual
- `POST /mine` - Minera um novo bloco
- `GET /validate` - Valida a blockchain
- `POST /block/update` - Atualiza dados de um bloco
- `POST /block/remine` - Reminera um bloco

### Exemplo de Uso

```bash
# Criar um novo bloco
curl -X POST http://localhost:3000/mine \
  -H "X-Session-ID: session123" \
  -H "Content-Type: application/json" \
  -d '{"data": "Meu primeiro bloco"}'
```

## Testes

Execute os testes unitários e de integração:
```bash
npm test
```

Para ver a cobertura de testes:
```bash
npm run test:coverage
```

## Estrutura do Projeto

```
src/
  ├── lib/           # Classes principais
  │   ├── block.ts
  │   └── blockchain.ts
  ├── server/        # Servidor Express
  │   └── server.ts
  ├── __tests__/     # Testes
  │   ├── block.test.ts
  │   └── blockchain.test.ts
  └── frontend/      # Interface web
```

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## Autor

Seu Nome - [seu-email@exemplo.com](mailto:seu-email@exemplo.com)

## Agradecimentos

- Luiz Tools pelo curso e inspiração
- Comunidade de blockchain por recursos educacionais 