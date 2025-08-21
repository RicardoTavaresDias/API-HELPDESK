# API-HELPDESK
API moderna e escalável para gerenciamento de chamados e suporte técnico, desenvolvida como parte do desafio prático da formação Full-Stack. Projetada para suportar helpdesks, service desks e integrações com sistemas como GLPI, CRMs e ERPs, com uma arquitetura robusta e segura.

## 🚀 Tecnologias
- **Node.js** - Ambiente de execução para o backend
- **Express.js** - Framework web para construção de APIs
- **TypeScript** - Tipagem estática para maior robustez
- **PostgreSQL** - Banco de dados relacional
- **Prisma ORM** - Operações type-safe com banco de dados
- **Zod** - Validação de schemas para entradas seguras
- **JWT + bcrypt** - Autenticação e autorização seguras
- **Supabase** - Armazenamento de arquivos (anexos de chamados)
- **Jest** - Framework para testes unitários
- **Swagger** - Documentação interativa da API
- **Docker** - Containerização para ambiente consistente

## 🏗️ Arquitetura
O projeto segue uma arquitetura modular e organizada, com:
- **Separação de responsabilidades** entre rotas, middlewares, repositórios e utilitários
- **Validação de dados** com Zod para garantir consistência
- **ORM type-safe** com Prisma para operações seguras no banco
- **Autenticação segura** com JWT e controle de permissões por perfil (Admin, Técnico, Cliente)
- **Documentação automatizada** com Swagger para facilitar integração
- **Escalabilidade** para suportar grandes volumes de chamados com paginação e filtros
- **Soft Delete** para desativação de serviços, mantendo históricos de chamados

## ⚙️ Setup e Configuração
### Pré-requisitos
- Node.js (>= 18.x)
- npm (>= 9.x)
- Docker (opcional, para containerização)
- PostgreSQL configurado

### 1. Clone o repositório
```bash
git clone https://github.com/RicardoTavaresDias/API-HELPDESK
cd API-HELPDESK
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto:
```env
PORT=porta_para_rodar
DATABASE_URL=postgresql://user:password@localhost:5432/helpdesk
SECRET=sua_chave_segura
SUPABASE_URL=sua_url
SUPABASE_KEY=sua_key
```

### 4. Execute as migrações do banco
```bash
npx prisma migrate dev

npx prisma generate
```

### 5. Execute o projeto
**Desenvolvimento:**
```bash
npm start
```
**Com Docker:**
```bash
docker-compose up --build
```

A API estará disponível em: `http://localhost:3000`

### 6. Deploy
- **Backend**: Deploy realizado no Render. Acesse [inserir link do deploy].
- **Frontend**: Integra-se com [WEB-HELPDESK](https://github.com/RicardoTavaresDias/WEB-HELPDESK), implantado no Vercel/Netlify.

## 📚 Scripts Disponíveis
- `npm start` - Executa o servidor
- `npm test` - Executa os testes unitários
- `npx prisma migrate dev` - Aplica as migrações do banco de dados

## 🌐 Endpoints
Acesse a documentação Swagger em: `http://localhost:3000/doc`

### Principais Endpoints
- **Autenticação**:
  - `POST /auth/login` - Autentica usuário e retorna JWT
- **Usuários**:
  - `POST /users/customer` - Cria usuário cliente
  - `POST /users/technician` - Cria técnico (Admin)
  - `GET /users/technicians` - Lista técnicos (Admin)
  - `PUT /users/:id` - Edita perfil (Admin/Técnico/Cliente)
  - `DELETE /users/:id` - Exclui cliente com chamados em cascata (Admin)
- **Serviços**:
  - `POST /services` - Cria serviço (Admin)
  - `GET /services` - Lista serviços ativos (Admin/Cliente)
  - `PUT /services/:id` - Edita serviço (Admin)
  - `DELETE /services/:id` - Desativa serviço (soft delete, Admin)
- **Chamados**:
  - `POST /tickets` - Cria chamado com técnico e serviço (Cliente)
  - `GET /tickets?page=1&limit=10` - Lista chamados com filtros (Admin/Técnico/Cliente)
  - `PUT /tickets/:id` - Atualiza status ou serviços (Admin/Técnico)
  - `GET /tickets/history` - Histórico de chamados do cliente (Cliente)

### Exemplo de Autenticação
```bash
curl -X POST http://localhost:3000/auth/login \
-H "Content-Type: application/json" \
-d '{"email": "cliente@empresa.com", "password": "123456"}'
```
Resposta:
```json
{
  "user": {
    "id": "clx123abc",
    "name": "João Silva",
    "email": "cliente@empresa.com",
    "role": "customer"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI..."
}
```

### Exemplo de Criação de Chamado
```bash
curl -X POST http://localhost:3000/tickets \
-H "Authorization: Bearer <seu_token_jwt>" \
-H "Content-Type: application/json" \
-d '{
  "title": "Impressora não funciona",
  "description": "A impressora do setor Financeiro parou de imprimir.",
  "priority": "high",
  "serviceId": "srv001",
  "technicianId": "tech123"
}'
```
Resposta:
```json
{
  "id": "tkt456ghi",
  "title": "Impressora não funciona",
  "description": "A impressora do setor Financeiro parou de imprimir.",
  "priority": "high",
  "status": "open",
  "createdAt": "2025-08-19T22:50:10.000Z",
  "customerId": "clx123abc",
  "technicianId": "tech123",
  "services": [
    {
      "id": "srv001",
      "name": "Suporte a impressoras",
      "value": 150.00
    }
  ],
  "totalValue": 150.00
}
```

## 📖 Funcionalidades
### Personas
- **Admin**:
  - Criar/editar/listar técnicos (com senha provisória e horários padrão: 08:00-12:00, 14:00-18:00)
  - Criar/editar/desativar (soft delete) serviços
  - Listar/editar/excluir (com cascata) clientes
  - Listar/editar status de todos os chamados
- **Técnico**:
  - Editar perfil (incluindo upload de imagem via Supabase)
  - Listar chamados atribuídos
  - Adicionar serviços adicionais a chamados
  - Alterar status (Aberto → Em atendimento → Encerrado)
- **Cliente**:
  - Criar/editar/excluir conta (com cascata de chamados)
  - Upload de imagem para perfil
  - Criar chamados com escolha de técnico e serviço
  - Visualizar histórico de chamados
- **Chamado**:
  - Criado por clientes com técnico e serviço
  - Exibe valores de serviços (individual e total)
  - Status: Aberto, Em atendimento, Encerrado
- **Serviço**:
  - Gerenciado pelo admin
  - Mínimo de 5 serviços (ex.: Suporte a impressoras, Diagnóstico de vírus, etc.)

### Regras
- Autenticação via JWT obrigatória
- Clientes não alteram/excluem contas alheias ou editam chamados após criação
- Técnicos não criam/excluem clientes ou chamados
- Mínimo de 3 técnicos com horários:
  - Técnico 1: 08:00-12:00, 14:00-18:00
  - Técnico 2: 10:00-14:00, 16:00-20:00
  - Técnico 3: 12:00-16:00, 18:00-22:00
- Soft delete para serviços desativados
- Exclusão de clientes em cascata com chamados

## 📌 Observações
- Todos os endpoints protegidos requerem `Authorization: Bearer <seu_token_jwt>`
- Erros seguem o padrão:
  ```json
  {
    "status": <http_status>,
    "error": "<nome_do_erro>",
    "message": "<descrição>"
  }
  ```
- A API suporta upload de arquivos via Supabase
- Testes unitários com Jest garantem confiabilidade

## 🤝 Contribuindo
1. Faça um fork do projeto
2. Crie uma branch (`git checkout -b feature/minha-feature`)
3. Commit suas alterações (`git commit -m 'feat: nova feature'`)
4. Faça push (`git push origin feature/minha-feature`)
5. Abra um Pull Request

## 📄 Licença
Este projeto é licenciado sob a [MIT License](LICENSE).

## 🙌 Agradecimentos
- Comunidade **Prisma**, **Express.js** e **Zod** pela base sólida
- Formação Full-Stack pelo desafio e diretrizes
- Inspiração em sistemas de helpdesk corporativo
- Contribuidores que tornam o projeto melhor