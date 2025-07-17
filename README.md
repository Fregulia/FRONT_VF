# Sistema de Gerenciamento Esportivo - Frontend

Este é o frontend do Sistema de Gerenciamento Esportivo, desenvolvido em React com Vite, que integra com a API Laravel para gerenciar esportes, atletas e treinadores.

## 🚀 Funcionalidades Implementadas

### ✅ Páginas dos Recursos da API
- **Esportes**: Listagem, criação, visualização e exclusão
- **Atletas**: CRUD completo com upload de foto e relacionamentos
- **Treinadores**: CRUD completo com especialidades e relacionamentos

### ✅ Testes com Dados Mockados
- Dados mockados para todos os recursos (esportes, atletas, treinadores)
- Testes unitários para validação dos dados
- Testes de integração dos serviços
- Fallback automático para dados mockados quando API não está disponível

### ✅ Integração com API Backend
- Configuração completa do Axios com interceptors
- Integração com todas as rotas públicas da API
- Tratamento de erros e fallback para dados mockados
- Suporte a upload de arquivos (fotos de atletas)

### ✅ Autenticação Bearer Token
- Sistema completo de login/logout
- Armazenamento seguro de tokens no localStorage
- Interceptors automáticos para adicionar tokens nas requisições
- Controle de acesso baseado em roles (admin, manager, user)
- Redirecionamento automático em caso de token expirado

## 🛠️ Tecnologias Utilizadas

- **React 19** - Framework frontend
- **Vite** - Build tool e dev server
- **React Router DOM** - Roteamento
- **Axios** - Cliente HTTP
- **Vitest** - Framework de testes
- **CSS Modules** - Estilização

## 📦 Instalação e Configuração

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn
- API Laravel rodando em `http://localhost:8000`

### Passos de Instalação

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd AT6
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure a API**
   - Certifique-se de que a API Laravel está rodando em `http://localhost:8000`
   - A configuração da URL da API está em `src/services/api.js`

4. **Execute o projeto**
```bash
npm run dev
```

5. **Execute os testes**
```bash
npm test
```

## 🔐 Sistema de Autenticação

### Usuários de Teste (da API Laravel)
- **Admin**: admin@example.com / password
- **Manager**: manager@example.com / password  
- **User**: user@example.com / password

### Níveis de Acesso
- **Admin**: Acesso total (pode gerenciar esportes, atletas e treinadores)
- **Manager**: Pode gerenciar atletas e treinadores (não pode gerenciar esportes)
- **User**: Apenas visualização

## 📱 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── Header/         # Cabeçalho da aplicação
│   ├── Footer/         # Rodapé da aplicação
│   └── ProtectedRoute.jsx # Proteção de rotas
├── contexts/           # Contextos React
│   └── AuthContext.jsx # Contexto de autenticação
├── mock/              # Dados mockados para testes
│   ├── esportes.json
│   ├── atletas.json
│   └── treinadores.json
├── routes/            # Páginas da aplicação
│   ├── Home.jsx       # Página inicial
│   ├── Login.jsx      # Página de login
│   ├── Esportes.jsx   # Listagem de esportes
│   ├── EsporteDetalhe.jsx
│   ├── Atletas.jsx    # Listagem de atletas
│   ├── AtletaDetalhe.jsx
│   ├── Treinadores.jsx # Listagem de treinadores
│   └── TreinadorDetalhe.jsx
├── services/          # Serviços de integração com API
│   ├── api.js         # Configuração do Axios
│   ├── authService.js # Serviços de autenticação
│   ├── esporteService.js
│   ├── atletaService.js
│   └── treinadorService.js
└── test/              # Testes
    ├── setup.js       # Configuração dos testes
    ├── services.test.js # Testes dos serviços
    └── mockData.test.js # Testes dos dados mockados
```

## 🧪 Testes

### Executar Testes
```bash
npm test
```

### Tipos de Testes Implementados

1. **Testes de Serviços**: Validam integração com API
2. **Testes de Dados Mockados**: Validam estrutura e integridade dos dados
3. **Testes de Autenticação**: Validam fluxo de login/logout

### Cobertura de Testes
- ✅ Serviços de API (esporte, atleta, treinador, auth)
- ✅ Dados mockados (estrutura e relacionamentos)
- ✅ Autenticação e autorização
- ✅ Fallback para dados mockados

## 🔄 Integração com API

### Endpoints Utilizados

#### Autenticação
- `POST /api/login` - Login
- `POST /api/logout` - Logout

#### Esportes (GET público, modificações apenas admin)
- `GET /api/esporte` - Listar esportes
- `POST /api/esporte` - Criar esporte
- `GET /api/esporte/{id}` - Detalhar esporte
- `DELETE /api/esporte/{id}` - Excluir esporte

#### Atletas (GET público, modificações admin/manager)
- `GET /api/atleta` - Listar atletas
- `POST /api/atleta` - Criar atleta (com upload de foto)
- `GET /api/atleta/{id}` - Detalhar atleta
- `PUT /api/atleta/{id}` - Atualizar atleta
- `DELETE /api/atleta/{id}` - Excluir atleta

#### Treinadores (GET público, modificações admin/manager)
- `GET /api/treinador` - Listar treinadores
- `POST /api/treinador` - Criar treinador
- `GET /api/treinador/{id}` - Detalhar treinador
- `PUT /api/treinador/{id}` - Atualizar treinador
- `DELETE /api/treinador/{id}` - Excluir treinador

## 🎨 Funcionalidades Especiais

### Modo Mockado
- Toggle para alternar entre dados da API e dados mockados
- Útil para desenvolvimento e demonstração
- Fallback automático quando API não está disponível

### Upload de Fotos
- Upload de fotos para atletas
- Suporte a formatos: JPEG, PNG, JPG
- Tamanho máximo: 2MB
- Preview das imagens

### Relacionamentos
- Visualização de relacionamentos entre entidades
- Atletas podem ter múltiplos treinadores
- Treinadores podem treinar múltiplos atletas
- Navegação entre entidades relacionadas

## 🚀 Deploy

### Build para Produção
```bash
npm run build
```

### Preview da Build
```bash
npm run preview
```

## 📝 Próximos Passos

Para criar um repositório privado e adicionar o professor como colaborador:

1. **Criar repositório no GitHub**
   - Vá para GitHub.com
   - Clique em "New repository"
   - Marque como "Private"
   - Adicione README e .gitignore

2. **Adicionar código**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <url-do-repositorio>
git push -u origin main
```

3. **Adicionar colaborador**
   - Vá para Settings > Manage access
   - Clique em "Invite a collaborator"
   - Adicione o email/username do professor

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Contato

Para dúvidas ou sugestões, entre em contato através do repositório do projeto.