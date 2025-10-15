# 🌐 DivulgAí

Este projeto é uma **aplicação web** desenvolvida para conectar usuários a **prestadores de serviços**, oferecendo uma experiência simples, segura e intuitiva de **cadastro, login, busca, feedback e gerenciamento de conta**.

---

## 🚀 Funcionalidades

- 🔍 **Busca dinâmica de prestadores** com filtros por categoria e localização.  
- 👤 **Cadastro de usuários** com perguntas de segurança.  
- 🔐 **Login seguro** com validações de e-mail e senha.  
- 🔄 **Recuperação e redefinição de senha** via perguntas de segurança.  
- ⭐ **Avaliação e feedback de prestadores**.  
- ⚠️ **Registro de ocorrências** (somente visível para administradores).  
- ⚙️ **Gerenciamento de conta** e edição de informações pessoais.  

---

## 🧭 Navegação do Sistema

- **Cabeçalho fixo** com acesso rápido a “Buscar Prestadores”, “Cadastro” e “Login”.  
- **Ícones interativos** presentes em todas as páginas principais.  
- **Interface responsiva e intuitiva**, com foco na experiência do usuário.

---

## 🧑‍💻 Tecnologias Utilizadas

| Categoria | Tecnologia |
|------------|-------------|
| Linguagem principal | JavaScript / TypeScript |
| Framework web | React + Vite |
| Estilização | CSS / Bootstrap |
| Backend (opcional) | Node.js / Express |
| Banco de Dados (opcional) | MySQL ou MongoDB |
| Hospedagem | GitHub Pages / Vercel / Render |
| IDE recomendada | Visual Studio Code |

---

## 📱 Estrutura das Telas

### 🏠 Landing Page
Página inicial com navegação principal e atalhos para as principais seções do sistema.

### 🧾 Cadastro
Formulário com validação de campos obrigatórios.  
Botão **“Cadastre-se”** que redireciona o usuário às perguntas de segurança.

### 🔒 Perguntas de Segurança
Etapa obrigatória após o cadastro.  
Perguntas:
- Qual o nome completo da sua mãe?  
- Qual o nome do seu melhor amigo(a) de infância?

### 🔑 Login e Redefinição de Senha
Login com verificação de formato de e-mail e comprimento da senha.  
Opção **“Esqueci minha senha”** com validação das perguntas de segurança.

### 🔍 Busca de Prestadores
Barra de pesquisa dinâmica.  
Filtros por **categoria** e **localização**.  
Cards com nome, descrição e localização do prestador.

### 👨‍🔧 Perfil do Prestador
Exibe nome, imagem, descrição e contatos.  
Permite **visualizar avaliações e registrar feedbacks**.  

### 💬 Registro de Feedback
Campos: título e descrição.  
Feedbacks são públicos e ajudam outros usuários.

### 🚨 Registro de Ocorrência
Destinado à equipe administrativa.  
Dados são confidenciais e não exibidos publicamente.

### ⚙️ Informações da Conta
Permite editar nome, e-mail e senha.  
Opção para **logout** e retorno à tela de login.

---

## ⚙️ Instalação e Execução

```bash
# 1️⃣ Clone o repositório
git clone https://github.com/SEU_USUARIO/NOME_DO_PROJETO.git](https://github.com/SamuelPS0/TCC.git)

# 2️⃣ Acesse a pasta
cd my-project-TCC

# 3️⃣ Instale as dependências
npm install

# 4️⃣ Execute o projeto localmente
npm run dev
```

Abra o navegador e acesse **http://localhost:5173** para visualizar o sistema.

---

## 👥 Equipe de Desenvolvimento

| Nome | Função |
|------|---------|
| Samuel Pereira Silva | Desenvolvedor Front-End |
| (adicione outros nomes) | (descrição das funções) |

---

## 🧾 Licença

Este projeto é de uso **restrito**.  
Somente pessoas **autorizadas pelos desenvolvedores** podem modificar, redistribuir ou publicar este código.  
Qualquer alteração sem permissão prévia será considerada **uso indevido**.

---
