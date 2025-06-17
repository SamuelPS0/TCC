---

# DivulgAí - Plataforma de Conexão para Serviços Alimentícios Locais

## Sobre o Projeto

O DivulgAí é uma plataforma digital que conecta consumidores a prestadores de serviços locais do ramo alimentício. Com foco em valorizar pequenos negócios, facilitar a divulgação e fortalecer a economia local, o DivulgAí oferece uma experiência prática e direta para encontrar sabores caseiros perto de você.

---

## Funcionalidades

* Pesquisa de prestadores de serviços por categoria e localização
* Cadastro e login de usuários (consumidores e prestadores)
* Recuperação de senha via perguntas de segurança
* Perfis de usuários com informações personalizadas
* Interface responsiva e intuitiva com React.js e React Router

---

## Tecnologias Utilizadas

* React.js (hooks, react-router-dom)
* React Hook Form (validação e manipulação de formulários)
* CSS Modules / CSS puro para estilização
* Vite (configuração e bundling)
* React Icons (ícones no front-end)

---

## Estrutura do Projeto

```
my-project-TCC/
├── node_modules/
├── public/
├── src/
│   ├── assets/
│   │   └── react.svg
│   ├── Components/
│   │   ├── Cards/
│   │   │   ├── Cards.jsx
│   │   │   └── Cards.css
│   │   ├── Flash/
│   │   │   ├── Flash.jsx
│   │   │   └── Flash.css
│   │   ├── Header/
│   │   │   ├── Header.jsx
│   │   │   └── Header.css
│   │   ├── Input/
│   │   │   ├── Input.jsx
│   │   │   └── Input.css
│   │   ├── Login/
│   │   │   ├── Login.jsx
│   │   │   └── Login.css
│   │   ├── PerfilList/
│   │   │   ├── PerfilList.jsx
│   │   │   └── PerfilList.css
│   │   ├── SearchBar/
│   │   │   ├── SearchBar.jsx
│   │   │   └── SearchBar.css
│   │   ├── SideMenu/
│   │   │   ├── SideMenu.jsx
│   │   │   └── SideMenu.css
│   │   └── AppRoutes.jsx
│   ├── img/
│   │   ├── divulgai-logo-branca.png
│   │   └── DivulgAÍ-removebg-preview.png
│   ├── pages/
│   │   ├── AccInfo/
│   │   │   ├── AccInfo.jsx
│   │   │   └── AccInfo.css
│   │   ├── CreatePerfil/
│   │   │   ├── CreatePerfil.jsx
│   │   │   └── CreatePerfil.css
│   │   ├── ForgotPassword/
│   │   │   ├── ForgotPassword.jsx
│   │   │   └── ForgotPassword.css
│   │   ├── HomeList/
│   │   │   ├── HomeList.jsx
│   │   │   └── HomeList.css
│   │   ├── LandingPage/
│   │   │   ├── LandingPage.jsx
│   │   │   └── LandingPage.css
│   │   ├── LoginForm/
│   │   │   ├── LoginForm.jsx
│   │   │   └── LoginForm.css
│   │   ├── Profile/
│   │   │   ├── Profile.jsx
│   │   │   └── Profile.css
│   │   ├── Register/
│   │   │   ├── Register.jsx
│   │   │   └── Register.css
│   │   └── SobreNos/
│   │       ├── SobreNos.jsx
│   │       └── SobreNos.css
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── package.json
├── README.md
└── vite.config.js
```

---

## Como Rodar o Projeto Localmente

### Pré-requisitos

* Node.js (versão 16+ recomendada)
* npm

### Passos para rodar

1. Clone este repositório:

   ```bash
   git clone https://github.com/SamuelPS0/my-project-TCC.git
   cd my-project-TCC
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Rode o projeto em modo desenvolvimento:

   ```bash
   npm run dev
   ```

4. Abra [http://localhost:3000](http://localhost:3000) (OU O QUE O TERMINAL SUGERIR)
no seu navegador para ver a aplicação.

