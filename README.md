# GeekShop

Projeto simples de e-commerce geek criado como base para a **disciplina de Programação Web** e para o **módulo 8** do conteúdo da FATEC.

## O que o projeto entrega

- Front-end com **HTML semântico**
- **CSS responsivo** com abordagem mobile first
- **JavaScript com DOM**
- Consumo da API via **fetch**
- Feedback visual de **loading** e **erro**
- Back-end com **Node.js + Express**
- API REST com **CRUD de produtos**
- **MongoDB + Mongoose**
- **Autenticação JWT**
- **Validações** e **error handler**

## Estrutura

- `public/` — interface do e-commerce
- `src/` — API, modelos, controllers e middlewares
- `.env.example` — exemplo das variáveis de ambiente

## Como rodar

1. Instale as dependências:
   ```bash
   npm install
   ```

2. O projeto já vem preparado para o Atlas com a URI padrão `mongodb://` dos três hosts do cluster.
   - Se você trocar de cluster, basta substituir os hosts, o `replicaSet` e o usuário/senha.
   - No cluster deste projeto, o `replicaSet` real é `atlas-npzhnr-shard-0`.

3. Inicie o projeto:
   ```bash
   npm run start
   ```

4. Acesse:
   - `http://localhost:3000`

## Variáveis de ambiente

- `PORT` — porta do servidor
- `MONGODB_URI` — string de conexão do MongoDB
- `JWT_SECRET` — segredo para assinatura do token
- `ADMIN_EMAIL` — e-mail do administrador padrão
- `ADMIN_PASSWORD` — senha do administrador padrão

## Conta admin padrão

Se você usar o `.env.example`, o seed cria um admin com:

- E-mail: `admin@geekshop.com`
- Senha: `Admin123!`

## Rotas principais

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/products`
- `POST /api/products`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`

## Observações

- O deploy na Vercel e a configuração de DNS não foram incluídos por escolha de escopo.
- O projeto foi mantido simples para servir como base de apresentação e evolução futura.
- Para o Atlas funcionar, confira se seu IP está liberado em *Network Access* e se o usuário do banco existe em *Database Access*.
- Se preferir, cole a string do Atlas no `.env` e eu posso te ajudar a validar cada parâmetro.
