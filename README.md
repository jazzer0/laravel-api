# Task Manager — Full Stack

Mini-aplicação de gestão de tarefas por projeto.

task-manager/
├── backend/ # Laravel 12 API
└── frontend/ # Vue 3 SPA

## Requisitos

| Ferramenta | Versão mínima      |
| ---------- | ------------------ |
| PHP        | 8.3                |
| Composer   | 2.x                |
| Node.js    | 20.x               |
| npm        | 10.x               |
| SQLite     | 3.x (ou MySQL 8.0) |

---

## Instalação rápida

### 1. Clonar o repositório

```bash
git clone https://github.com/<user>/task-manager.git
cd task-manager
```

### 2. Backend

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate

# Configurar DB_* no .env
# Para SQLite (zero-config):
# DB_CONNECTION=sqlite
touch database/database.sqlite

php artisan migrate --seed
php artisan serve
# API disponível em http://localhost:8000
```

### 3. Frontend (outro terminal)

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
# SPA disponível em http://localhost:5173
```

---

## Testes

```bash
# Backend — PHPUnit
cd backend && php artisan test

# Frontend — Vitest
cd frontend && npm run test
```

---

## O que o projeto faz

Permite criar e listar projetos e, em cada projeto, criar tarefas com título, prioridade e data. As tarefas podem ser filtradas por status/prioridade, o status pode ser alterado na própria lista e tarefas em atraso são assinaladas. A API é REST (JSON) e a interface é uma SPA que consome essa API.

**Stack**

- **Backend:** Laravel 12, PHPUnit.
- **Frontend:** Vue 3, Vue Router, Pinia, Tailwind CSS 4, Axios, TypeScript, Vite, Vitest.

