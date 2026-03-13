# Task Manager — Frontend

SPA Vue 3 para gestão de tarefas por projeto.  
Consome a API REST do backend Laravel 12.

---

## Stack

| Tecnologia   | Versão | Função                              |
| ------------ | ------ | ----------------------------------- |
| Vue 3        | ^3.4   | Framework reativo (Composition API) |
| Vue Router 4 | ^4.3   | Roteamento client-side              |
| Pinia        | ^2.1   | Gestão de estado global             |
| Axios        | ^1.7   | Cliente HTTP                        |
| Tailwind CSS | ^4.0   | Estilos utility-first               |
| Vite         | ^5.3   | Build tool + dev server             |
| Vitest       | ^1.6   | Testes unitários                    |

---

## Instalação

```bash
npm install
cp .env.example .env
npm run dev
```

### Variáveis de ambiente

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

---

## Scripts

```bash
npm run dev      # Servidor de desenvolvimento (porta 5173)
npm run build    # Build de produção
npm run preview  # Preview do build
npm run test     # Rodar testes Vitest
npm run test:watch  # Testes em modo watch
```

---

## Estrutura

```
src/
├── components/
│   ├── common/
│   │   ├── AppToast.vue        # Notificações globais (stack)
│   │   └── BaseModal.vue       # Modal reutilizável com Teleport
│   ├── projects/
│   │   ├── ProjectCard.vue     # Card clicável com nome/status/count
│   │   └── ProjectForm.vue     # Formulário de criação de projeto
│   └── tasks/
│       ├── TaskCard.vue        # Card com status, prioridade, is_overdue
│       ├── TaskFilters.vue     # Selects v-model:status / v-model:priority
│       └── TaskForm.vue        # Formulário de criação de tarefa
├── composables/
│   ├── useDebounce.js          # Ref debounced com deep watch
│   ├── useProjects.js          # Lógica de projetos + toast feedback
│   └── useTasks.js             # Lógica de tarefas + filtros debounced
├── router/
│   └── index.js                # 2 rotas lazy-loaded
├── services/
│   └── api.js                  # Instância Axios + interceptor de erros
├── stores/
│   ├── projects.js             # Estado dos projetos (Pinia)
│   ├── tasks.js                # Estado das tarefas + optimistic update
│   └── toast.js                # Fila de toasts com auto-dismiss
├── views/
│   ├── ProjectsView.vue        # Lista de projetos em grid
│   └── ProjectDetailView.vue   # Detalhe + filtros + lista de tarefas
├── App.vue                     # Layout root + RouterView com transição
├── main.js                     # Entrada: Vue + Pinia + Router
└── style.css                   # @import "tailwindcss"
```

---

## Decisões técnicas

### Separação Store ↔ Composable

A camada de **stores (Pinia)** contém apenas o estado e as chamadas à API.  
Os **composables** envolvem a store e adicionam feedback de UX (toasts de sucesso/erro).  
As **views** não acedem diretamente à store — usam sempre o composable.

Isto permite:

- Trocar a implementação da store sem alterar as views
- Testar composables e stores independentemente
- Feedback centralizado sem duplicação nas views

### Optimistic Updates

Em `stores/tasks.js → updateTaskStatus()`, o status é atualizado localmente **antes** da resposta da API. Se a chamada falhar, o valor anterior é restaurado automaticamente. Isto elimina a latência percebida ao mudar status de uma tarefa.

### Debounce nos filtros

`useTasks` expõe uma ref `filters` que é observada via `useDebounce(filters, 400)`.  
O `watch` sobre os filtros debounced aciona o re-fetch automaticamente, sem que a view precise de gerir temporizadores.

### Proxy Vite

Em desenvolvimento, o Vite faz proxy de `/api/*` para `http://localhost:8000`, evitando problemas de CORS e tornando a configuração de produção idêntica à de desenvolvimento.

### Tailwind 4

Usa a nova integração via plugin Vite (`@tailwindcss/vite`), sem ficheiro `tailwind.config.js`. A entrada é apenas `@import "tailwindcss"` em `style.css`.

### JSDoc em vez de TypeScript

O `TaskCard.vue` usa JSDoc `@typedef` para tipar as props, alcançando segurança de tipos no editor sem a complexidade de setup do TypeScript num projecto de hiring test com prazo definido.

---

## O que ficou por implementar (e porquê)

| Funcionalidade           | Motivo de exclusão                                                                                                        |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| Drag-and-drop de tarefas | Requer biblioteca externa (vue-draggable-next); o dropdown de status cobre o requisito funcional                          |
| Autenticação (Sanctum)   | Não requerida pelo enunciado; backend sem auth                                                                            |
| Modo escuro              | Enunciado não requer; aumentaria complexidade de CSS sem ganho funcional                                                  |
| Paginação no frontend    | A API usa cursor pagination; foi omitido no front para simplicidade, os primeiros 20 registos são suficientes para testar |

## Testes

```bash
npm run test
```

Ficheiro: `tests/composables/useProjects.test.js`

Cobre:

- Estado inicial (`projects: [], loading: false, error: null`)
- `fetchProjects`: popula lista, controla loading, trata erro
- `createProject`: adiciona ao topo da lista, relança erro para o chamador
- `deleteProject`: remove da lista por ID
