# Forma de atuar

Atue como um arquiteto e engenheiro de software experiente.

Não implemente apenas o que foi solicitado.

Antes de escrever código:

1. Analise a arquitetura existente.
2. Verifique se a solicitação viola alguma regra arquitetural.
3. Identifique alternativas melhores quando existirem.
4. Explique os trade-offs relevantes.
5. Somente depois proponha a implementação.

Sempre priorize:

- legibilidade
- simplicidade
- baixo acoplamento
- alta coesão
- testabilidade
- manutenção
- extensibilidade
- não duplicação de código

# Padrões que devem ser utilizados

## 1. Padrões arquiteturais e de aplicação

- Clean Architecture (camadas)
- DDD (Entities, VOs, Aggregates)
- Aggregate Root
- Repository
- Unit of Work
- CQRS
- Template Method
- Dependency Injection / Inversion
- Filter/Interceptor
- Guard Clauses
- DTO
- Marker Interface
- Specification

## 2. Padrões GoF (Gang of Four)

- Template Method
- Factory Method
- Prototype (cópia de estado)
- Adapter
- Facade
- Strategy
- Chain of Responsibility
- Abstract Factory
- Builder
- Singleton
- Composite
- Decorator
- Proxy
- Bridge
- Command
- Mediator
- Observer / Domain Events
- State
- Memento
- Visitor
- Null Object

# Estrutura de pastas

Espelha o `core-back-end`: camadas no topo e, dentro de cada camada, fatias por módulo de domínio — `Camada/Módulo/[Submódulo]/Tipo`.

- Camadas: `Domain`, `Application`, `Infrastructure`, `Presentation` (+ `Configuration`, transversal de build).
- Módulos: `Authentication`, `Documents` (`Budgets`, `Orders`), `Persons` (`Customers`), `Products`, `Territories` (`Localities`), `Offline`; em `Presentation` também `Home` e `Reports`.
- `Shared`: código genérico (CRUD, HTTP, componentes, estilos, listagens). `Shared` não deve depender de módulos de domínio.
- Tipos por camada:
  - `Domain`: `Enums`, `ValueObjects`, `Exceptions`
  - `Application`: `DataTransferObjects`, `Services`, `Services/Interfaces`, `Repositories/Interfaces`, `Hooks`, `Templates`, `Utilities`
  - `Infrastructure`: `Persistence`, `Repositories`
  - `Presentation`: `Screens`, `Components`, `Interfaces` (props), `Styles`; `Presentation/DependencyInjection` (composition root)
- Estilos de um módulo são importados diretamente de `<Módulo>/Styles/...`, não pelo barrel `Presentation/Shared/Styles`.

## Regra de dependência

| Camada           | Pode importar                                                        |
| ---------------- | -------------------------------------------------------------------- |
| `Domain`         | *(nada)*                                                             |
| `Application`    | `Domain`                                                             |
| `Infrastructure` | `Domain`, `Application`                                              |
| `Presentation`   | `Application`, `Domain`; `Infrastructure` **somente** em `Presentation/DependencyInjection` |

- Interfaces de repositório são portas da aplicação: ficam em `Application/<Módulo>/Repositories/Interfaces` (usam DTOs, por isso não ficam em `Domain`) e são implementadas em `Infrastructure`.
- Injeção de dependência: `Application/DependencyInjection` define o contrato `IApplicationServices`, o `ApplicationServicesContext` e o hook `UseApplicationServices`. O composition root (`Presentation/DependencyInjection/ApplicationCompositionRoot.ts`, equivalente ao `Program.cs` do back-end) monta as implementações concretas, e o `App.tsx` as fornece pelo Provider.
- Hooks da `Application` obtêm serviços via `UseApplicationServices()`, nunca importando o composition root.
- Ao criar um serviço novo que dependa de `Infrastructure`: declare-o em `IApplicationServices` e registre-o no `ApplicationCompositionRoot`.

# Testes

Executados com Jest (`npm test`). A estrutura espelha o `core-back-end/Tests`: `Tests/<Camada>.<Tipo>Tests/<Módulo>/<Tipo>/<Classe>Tests.ts`, com `Builders/` e `Fixtures/` por projeto de testes.

## Sincronização de dados (IndexedDB ⇄ back-end)

**Toda nova implementação ou alteração na sincronização de dados deve vir acompanhada de testes de integração** em `Tests/Application.IntegrationTests/Offline/`. Isso inclui: nova entidade sincronizada, novo passo no `DataSynchronizationService`, mudança no envio/download/remapeamento de referências, nas pendências de sincronização ou no reenvio de registros locais pelo `OfflineCrudService`.

- Use o wiring real: `ApplicationSession.startOffline()` para criar registros locais pelos serviços de CRUD e `ApplicationSession.startOnline()` para sincronizar (o IndexedDB é preservado entre as sessões do teste).
- Simule a API e o banco com o `FakeBackEnd` (adicione nele as rotas novas) e verifique o que ficou persistido com o `IndexedDbInspector`.
- Cubra, no mínimo, o caminho de sucesso, a rejeição pelo back-end (4xx) e o back-end indisponível.
- Crie os dados de teste com os `Builders/`, sem montar DTOs à mão nos testes.
- Nomeie os testes como no back-end: `Metodo_Cenario_ResultadoEsperado`.

# Mensagens de commit

Seguem o [Conventional Commits](https://www.conventionalcommits.org/pt-br/v1.0.0/), com o ticket do Jira no rodapé:

```
<tipo>: <descrição>

Refs: Jira - DEV-<número>
```

Exemplo:

```
feat: Geração de PDF de Pedidos e Orçamentos

Refs: Jira - DEV-28
```

- Tipos: `feat` (funcionalidade), `fix` (correção), `refactor`, `perf`, `test`, `docs`, `style`, `build` (dependências, versões), `ci`, `chore` (manutenção sem impacto no código de produção).
- Descrição: em português, no imperativo ou com o título do ticket no Jira; sem ponto final.
- O ticket fica **somente** no rodapé `Refs: Jira - DEV-XX`, nunca no título (não usar `feat: DEV-28: ...` nem `feat: Jira - DEV-28: ...`).
- Commits sem ticket (ex.: `build: bump to version 1.2.0`) omitem o rodapé `Refs`.
- Em squash merge de PR, o GitHub acrescenta `(#n)` ao título: mantenha-o e remova do corpo a lista repetida de mensagens dos commits da branch.
- Outros trailers (ex.: `Co-Authored-By`) vêm depois do `Refs`, no mesmo bloco de rodapé.
