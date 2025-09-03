# Efeitos de Transição Implementados

Este documento descreve os 4 efeitos de transição diferentes implementados no projeto.

## 📁 Arquivo CSS Principal
- **Localização**: `src/transitions.css`
- **Importado em**: `src/App.jsx`

## 🎨 Efeitos Implementados

### 1. **Hover Scale Effect** (`.btn-hover-scale`)
**Descrição**: Efeito de escala e sombra ao passar o mouse sobre botões.

**Onde foi aplicado**:
- `src/routes/Home.jsx` - Botões "Ver Esportes", "Ver Atletas", "Ver Treinadores" e links de login/registro
- `src/routes/Login.jsx` - Botão "Entrar"
- `src/routes/Atletas.jsx` - Botão "Novo Atleta"
- `src/routes/Esportes.jsx` - Botão "Novo Esporte"

**Características**:
- Aumenta o elemento em 5% (scale 1.05)
- Adiciona sombra suave
- Transição de 0.3s
- Variações para botões success, danger e warning

### 2. **Slide In Animation** (`.slide-in`)
**Descrição**: Animação de entrada deslizando da esquerda para a direita.

**Onde foi aplicado**:
- `src/routes/Atletas.jsx` - Formulário de criação de atleta
- `src/routes/Esportes.jsx` - Formulário de criação de esporte

**Características**:
- Desliza de -100% para 0% no eixo X
- Fade in simultâneo (opacity 0 para 1)
- Duração de 0.5s com ease-out

### 3. **Fade In Effect** (`.fade-in`)
**Descrição**: Animação de entrada com fade e movimento vertical sutil.

**Onde foi aplicado**:
- `src/routes/Home.jsx` - Cards dos três módulos principais (com delays escalonados)
- `src/routes/Login.jsx` - Container do formulário de login
- `src/routes/Esportes.jsx` - Cards individuais de esportes

**Características**:
- Fade in com movimento de 20px para cima
- Duração de 0.6s com ease-in
- Suporte a animation-delay para efeitos escalonados

### 4. **Pulse Effect** (`.pulse-effect`)
**Descrição**: Animação de pulsação contínua para elementos de destaque.

**Onde foi aplicado**:
- `src/routes/Home.jsx` - Mensagem de boas-vindas do usuário logado

**Características**:
- Escala sutil (1 para 1.02)
- Efeito de onda com box-shadow
- Animação infinita de 2s
- Cor azul (#007bff) para o efeito de onda

## 🔧 Efeito Adicional: Input Transitions (`.input-transition`)
**Descrição**: Transições suaves para campos de formulário.

**Onde foi aplicado**:
- `src/routes/Login.jsx` - Campos email e senha
- `src/routes/Atletas.jsx` - Campo nome do formulário

**Características**:
- Transição suave na borda e sombra
- Destaque azul no focus
- Duração de 0.3s

## 🎯 Resumo de Localização dos Efeitos

| Arquivo | Efeitos Aplicados |
|---------|-------------------|
| `src/routes/Home.jsx` | Fade In (cards), Hover Scale (botões), Pulse (mensagem) |
| `src/routes/Login.jsx` | Fade In (container), Hover Scale (botão), Input Transition |
| `src/routes/Atletas.jsx` | Slide In (formulário), Hover Scale (botão), Input Transition |
| `src/routes/Esportes.jsx` | Slide In (formulário), Hover Scale (botão), Fade In (cards) |

## 🚀 Como Usar

1. Importe o CSS no componente principal:
```jsx
import './transitions.css';
```

2. Aplique as classes nos elementos:
```jsx
<button className="btn-hover-scale">Botão</button>
<div className="fade-in">Conteúdo</div>
<form className="slide-in">Formulário</form>
<div className="pulse-effect">Destaque</div>
```

3. Para delays escalonados:
```jsx
<div className="fade-in" style={{animationDelay: '0.2s'}}>
  Conteúdo com delay
</div>
```

## 📱 Responsividade
Todos os efeitos são otimizados para diferentes tamanhos de tela e respeitam as preferências de movimento reduzido do usuário quando configurado no sistema.