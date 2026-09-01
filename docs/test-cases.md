# Test Cases — qa-selenium-sd

Cada test case referencia o `.feature` correspondente via tag (`@TC-XXX`) para rastreabilidade entre este documento e a automação. Um `Scenario Outline` com múltiplas linhas de `Examples` conta como um único test case (a variação de dados é parte do mesmo caso, não um caso novo por linha).

| ID     | Módulo   | Título                                                          | Tipo      | Prioridade | Automação    | Cenário Gherkin                               |
| ------ | -------- | ---------------------------------------------------------------- | --------- | ---------- | ------------ | ---------------------------------------------- |
| TC-001 | Login    | Exibir formulários de login e cadastro                            | Funcional | Média      | Automatizado | `login.feature` `@TC-001`                      |
| TC-002 | Login    | Tentar login com credenciais inválidas                             | Negativo  | Alta       | Automatizado | `login.feature` `@TC-002`                      |
| TC-003 | Carrinho | Adicionar um produto ao carrinho                                   | Funcional | Alta       | Automatizado | `cart.feature` `@TC-003`                       |
| TC-004 | Carrinho | Remover um produto do carrinho                                     | Funcional | Alta       | Automatizado | `cart.feature` `@TC-004`                       |
| TC-005 | Carrinho | Visualizar o carrinho vazio sem adicionar nenhum produto           | Funcional | Baixa      | Automatizado | `cart.feature` `@TC-005`                       |
| TC-006 | Checkout | Tentar finalizar a compra sem estar logado                         | Negativo  | Alta       | Automatizado | `checkout.feature` `@TC-006`                   |
| TC-007 | Checkout | Finalizar a compra com sucesso estando logado                      | Funcional | Crítica    | Automatizado | `checkout.feature` `@TC-007` `@smoke`          |
| TC-008 | Checkout | Tentar pagar sem preencher os dados do cartão                      | Negativo  | Alta       | Automatizado | `checkout.feature` `@TC-008`                   |
| TC-009 | Cadastro | Criar uma nova conta com sucesso                                    | Funcional | Crítica    | Automatizado | `signup.feature` `@TC-009` `@smoke`            |
| TC-010 | Cadastro | Tentar cadastrar com um e-mail já existente                         | Negativo  | Média      | Automatizado | `signup.feature` `@TC-010`                     |
| TC-011 | Cadastro | Tentar cadastrar sem preencher campo obrigatório (7 variações)      | Negativo  | Média      | Automatizado | `signup.feature` `@TC-011` (Scenario Outline)  |

## Legenda

- **Tipo**: `Funcional` (caminho feliz) ou `Negativo` (validação de bloqueio/erro esperado).
- **Prioridade**: importância do caso para o negócio — `Crítica` > `Alta` > `Média` > `Baixa`. Não confundir com a prioridade (P0–P3) usada nos [bug reports](../.github/ISSUE_TEMPLATE/bug_report.md), que mede urgência de correção de um defeito, não importância de um caso de teste.
- **Automação**: `Automatizado`, `Manual` ou `Planejado` (caso ainda não implementado, mas já identificado como necessário).
- **`@smoke`**: cenários ponta-a-ponta críticos, candidatos a uma suíte rápida (`cucumber-js --tags @smoke`) separada da suíte de regressão completa.
