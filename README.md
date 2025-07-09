# Painel Delivery - React + Vite

Sistema de administração para restaurante de delivery convertido de HTML para React com Vite.

## 🚀 Tecnologias

- **React 18** - Biblioteca JavaScript para interfaces
- **Vite** - Build tool rápida
- **React Router DOM** - Roteamento
- **Tailwind CSS** - Framework CSS utilitário
- **Chart.js** - Gráficos interativos
- **Font Awesome** - Ícones

## 📦 Instalação

1. Instale as dependências:
```bash
npm install
```

2. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

3. Acesse `http://localhost:5173` no navegador

## 🔐 Login

Use as credenciais de teste:
- **Email:** admin@restaurant.com
- **Senha:** admin123

## 📱 Funcionalidades

### Dashboard
- Cards com resumo de pedidos, receita, clientes e produtos
- Gráfico de vendas dos últimos 7 dias
- Top produtos mais vendidos
- Pedidos recentes

### Pedidos
- Lista de todos os pedidos
- Filtros por status (Pendente, Em preparo, Pronto, Entregue)
- Atualização de status dos pedidos
- Detalhes completos de cada pedido

### Produtos
- Gerenciamento completo do cardápio
- Adicionar, editar e excluir produtos
- Controle de disponibilidade
- Categorização de produtos

### Clientes
- Base de dados de clientes
- Busca por nome, email ou telefone
- Estatísticas de clientes
- Histórico de pedidos por cliente

## 🏗️ Estrutura do Projeto

```
src/
├── components/
│   ├── Login.jsx          # Tela de login
│   ├── Layout.jsx         # Layout com sidebar
│   ├── Dashboard.jsx      # Dashboard principal
│   ├── Pedidos.jsx        # Gerenciamento de pedidos
│   ├── Produtos.jsx       # Gerenciamento de produtos
│   └── Clientes.jsx       # Gerenciamento de clientes
├── App.jsx                # Componente principal com rotas
├── main.jsx              # Ponto de entrada
└── index.css             # Estilos globais
```

## 🎨 Design

- Interface moderna e responsiva
- Tema consistente com cores indigo/purple
- Componentes reutilizáveis
- Animações suaves
- Loading states

## 🔧 Scripts Disponíveis

- `npm run dev` - Servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm run preview` - Preview do build
- `npm run lint` - Linting do código

## 📊 Dados

O projeto está configurado para conectar com uma API REST em `http://localhost:3000/api`. 

### Estrutura da API

#### Autenticação
- `POST /api/auth/login` - Login de administrador
- `POST /api/auth/logout` - Logout
- `GET /api/auth/verify` - Verificar autenticação
- `POST /api/auth/register` - Registrar novo admin
- `POST /api/auth/change-password` - Alterar senha

#### Dashboard
- `GET /api/dashboard` - Dados gerais do dashboard
- `GET /api/dashboard/stats` - Estatísticas (inclui top produtos e pedidos recentes)
- `GET /api/dashboard/grafico` - Dados para gráficos
- `GET /api/dashboard/vendas-chart` - Gráfico de vendas
- `GET /api/dashboard/top-produtos` - Top produtos mais vendidos
- `GET /api/dashboard/pedidos-recentes` - Pedidos mais recentes
- `GET /api/dashboard/relatorios` - Relatórios diversos

#### Pedidos
- `GET /api/pedidos` - Listar todos os pedidos
- `GET /api/pedidos/:id` - Buscar pedido por ID
- `POST /api/pedidos` - Criar novo pedido
- `PUT /api/pedidos/:id` - Atualizar pedido
- `PATCH /api/pedidos/:id/status` - Atualizar status do pedido
- `GET /api/pedidos/status/:status` - Buscar pedidos por status
- `GET /api/pedidos/date/:data` - Buscar pedidos por data
- `DELETE /api/pedidos/:id` - Cancelar pedido

#### Produtos
- `GET /api/produtos` - Listar todos os produtos
- `GET /api/produtos/:id` - Buscar produto por ID
- `POST /api/produtos` - Criar novo produto
- `PUT /api/produtos/:id` - Atualizar produto
- `DELETE /api/produtos/:id` - Deletar produto
- `PUT /api/produtos/:id/disponibilidade` - Atualizar disponibilidade
- `GET /api/produtos/categoria/:categoria` - Buscar produtos por categoria
- `GET /api/produtos/disponiveis` - Buscar produtos disponíveis
- `POST /api/produtos/:id/imagem` - Upload de imagem do produto
- `GET /api/produtos/categorias` - Listar categorias disponíveis

#### Clientes
- `GET /api/clientes` - Listar todos os clientes
- `GET /api/clientes/:id` - Buscar cliente por ID
- `POST /api/clientes` - Criar novo cliente
- `PUT /api/clientes/:id` - Atualizar cliente
- `DELETE /api/clientes/:id` - Deletar cliente
- `GET /api/clientes/email/:email` - Buscar cliente por email
- `GET /api/clientes/telefone/:telefone` - Buscar cliente por telefone
- `GET /api/clientes/:id/pedidos` - Buscar pedidos de um cliente
- `GET /api/clientes/:id/stats` - Estatísticas do cliente
- `PUT /api/clientes/:id/status` - Atualizar status do cliente
- `GET /api/clientes/ativos` - Buscar clientes ativos
- `GET /api/clientes/inativos` - Buscar clientes inativos
- `GET /api/clientes/search` - Buscar clientes por nome

#### API Status
- `GET /api/health` - Health check da API
- `GET /api/status` - Status do servidor

#### Painel
- `GET /api/painel/info` - Informações do painel
- `GET /api/painel/menu` - Menu do painel

#### Configurações
- `GET /api/config` - Listar configurações
- `POST /api/config` - Criar configuração
- `PUT /api/config/:id` - Atualizar configuração
- `DELETE /api/config/:id` - Deletar configuração

### Formato das Respostas

A API retorna respostas no formato JSON com a seguinte estrutura:

```json
{
  "success": true,
  "data": { ... },
  "message": "Mensagem de sucesso"
}
```

**Exemplo de resposta de login:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "email": "admin@restaurant.com",
      "nome": "Administrador",
      "telefone": "(11) 99999-9999",
      "tipo": "admin"
    }
  },
  "message": "Login realizado com sucesso"
}
```

**Exemplo de resposta do dashboard stats:**
```json
{
  "success": true,
  "data": {
    "estatisticas": {
      "pedidosHoje": 15,
      "totalVendasHoje": 450.00,
      "ticketMedio": 30.00,
      "totalClientes": 120
    },
    "topProdutos": [
      {
        "nome": "X-Burger",
        "categoria": "Lanches",
        "quantidade_vendida": 25,
        "total_vendido": 375.00
      }
    ],
    "pedidosRecentes": [
      {
        "id": "1234",
        "cliente": {
          "nome": "João Silva",
          "telefone": "(11) 99999-9999"
        },
        "total": 38.00,
        "status": "Pendente",
        "dataHora": "2024-01-15T14:30:00Z",
        "forma_pagamento": "Dinheiro"
      }
    ]
  }
}
```

**Exemplo de resposta do gráfico de vendas:**
```json
{
  "success": true,
  "data": {
    "periodo": "7dias",
    "dados": [
      {
        "data": "2024-01-09",
        "vendas": 150.00
      },
      {
        "data": "2024-01-10",
        "vendas": 200.00
      }
    ]
  }
}
```

**Exemplo de resposta de produtos:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "nome": "X-Burger",
      "descricao": "Hambúrguer com queijo, alface e tomate",
      "categoria": "Lanches",
      "preco": 15.00,
      "imagem": "https://via.placeholder.com/150",
      "disponivel": true,
      "criado_em": "2024-01-15T10:30:00Z"
    }
  ]
}
```

**Exemplo de resposta de pedidos:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1234",
      "cliente_id": "1",
      "cliente_nome": "João Silva",
      "cliente_telefone": "(11) 99999-9999",
      "total": 38.00,
      "taxa_entrega": 5.00,
      "status": "Pendente",
      "forma_pagamento": "Dinheiro",
      "observacoes": "Sem cebola",
      "endereco_entrega": "Rua das Flores, 123",
      "criado_em": "2024-01-15T14:30:00Z",
      "itens": [
        {
          "id": "1",
          "nome": "X-Burger",
          "quantidade": 2,
          "precoUnitario": 15.00,
          "subtotal": 30.00,
          "observacoes": "Sem cebola"
        }
      ]
    }
  ]
}
```

**Exemplo de resposta de clientes:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "nome": "João Silva",
      "telefone": "(11) 99999-9999",
      "email": "joao@email.com",
      "endereco": "Rua das Flores, 123",
      "bairro": "Centro",
      "cidade": "São Paulo",
      "estado": "SP",
      "cep": "01234-567",
      "observacoes": "Cliente VIP",
      "status": "Ativo",
      "criado_em": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### Autenticação

A API usa autenticação JWT. O token deve ser enviado no header:
```
Authorization: Bearer <token>
```

### Tratamento de Erros

A API deve retornar códigos de status HTTP apropriados:
- `200` - Sucesso
- `201` - Criado
- `400` - Bad Request
- `401` - Não autorizado
- `404` - Não encontrado
- `500` - Erro interno do servidor

## 🚀 Deploy

Para fazer deploy:

```bash
npm run build
```

Os arquivos serão gerados na pasta `dist/` e podem ser hospedados em qualquer servidor web estático.

## 📝 Próximos Passos

- [x] Integração com backend real
- [x] Autenticação com JWT
- [x] Upload de imagens
- [ ] Notificações push
- [ ] PWA (Progressive Web App)
- [ ] Testes automatizados
- [ ] Internacionalização

## 🔧 Configuração da API

Para alterar a URL da API, edite o arquivo `src/config/api.js`:

```javascript
export const API_CONFIG = {
  BASE_URL: 'http://localhost:3000/api', // Altere aqui
  // ...
}
```

## 📝 Tipos TypeScript

O projeto inclui tipos TypeScript completos baseados no arquivo `api-routes-types.json`. Os tipos estão disponíveis em `src/types/api.ts` e incluem:

- **Autenticação**: `LoginRequest`, `LoginResponse`, `User`
- **Dashboard**: `DashboardStats`, `TopProduto`, `PedidoRecente`, `VendasChartData`
- **Produtos**: `Produto`, `CreateProdutoRequest`, `UpdateProdutoRequest`
- **Pedidos**: `Pedido`, `ItemPedido`, `CreatePedidoRequest`, `UpdatePedidoRequest`
- **Clientes**: `Cliente`, `CreateClienteRequest`, `UpdateClienteRequest`
- **Configurações**: `Config`, `CreateConfigRequest`, `UpdateConfigRequest`
- **API**: `ApiResponse<T>`, `ApiError`, `ApiStatus`, `HealthCheck`

Exemplo de uso dos tipos:

```typescript
import { Produto, CreateProdutoRequest } from '../types/api'

const produto: Produto = {
  id: "1",
  nome: "X-Burger",
  descricao: "Hambúrguer com queijo",
  categoria: "Lanches",
  preco: 15.00,
  imagem: "https://via.placeholder.com/150",
  disponivel: true,
  criado_em: "2024-01-15T10:30:00Z"
}

const novoProduto: CreateProdutoRequest = {
  nome: "X-Burger",
  descricao: "Hambúrguer com queijo",
  categoria: "Lanches",
  preco: 15.00,
  disponivel: true
}
```

## 📡 Exemplo de Uso dos Serviços

```javascript
import { 
  authService, 
  dashboardService, 
  pedidosService, 
  produtosService, 
  clientesService,
  apiService,
  painelService,
  configService 
} from '../services'

// Login
const login = async () => {
  try {
    const response = await authService.login({
      email: 'admin@delivery.com',
      senha: 'admin123'
    })
    console.log('Login realizado:', response)
  } catch (error) {
    console.error('Erro no login:', error)
  }
}

// Buscar dados do dashboard
const loadDashboard = async () => {
  try {
    const stats = await dashboardService.getStats()
    const vendasChart = await dashboardService.getVendasChart('7dias')
    const topProdutos = await dashboardService.getTopProdutos(10)
    console.log('Dashboard carregado:', { stats, vendasChart, topProdutos })
  } catch (error) {
    console.error('Erro ao carregar dashboard:', error)
  }
}

// Atualizar status de pedido
const updatePedidoStatus = async (pedidoId, newStatus) => {
  try {
    await pedidosService.updatePedidoStatus(pedidoId, newStatus)
    console.log('Status atualizado com sucesso')
  } catch (error) {
    console.error('Erro ao atualizar status:', error)
  }
}

// Upload de imagem de produto
const uploadProdutoImagem = async (produtoId, imageFile) => {
  try {
    await produtosService.uploadProdutoImagem(produtoId, imageFile)
    console.log('Imagem enviada com sucesso')
  } catch (error) {
    console.error('Erro ao enviar imagem:', error)
  }
}

// Buscar estatísticas de cliente
const getClienteStats = async (clienteId) => {
  try {
    const stats = await clientesService.getClienteStats(clienteId)
    console.log('Estatísticas do cliente:', stats)
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error)
  }
}

// Verificar status da API
const checkApiStatus = async () => {
  try {
    const health = await apiService.getHealth()
    const status = await apiService.getStatus()
    console.log('Status da API:', { health, status })
  } catch (error) {
    console.error('Erro ao verificar status:', error)
  }
}

// Buscar configurações
const loadConfigs = async () => {
  try {
    const configs = await configService.getConfigs()
    console.log('Configurações:', configs)
  } catch (error) {
    console.error('Erro ao carregar configurações:', error)
  }
}
```
