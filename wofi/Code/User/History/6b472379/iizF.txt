## Formulário para Orientação do Relatório de Iniciação Científica

### Informações Básicas do Projeto

1.  **Qual o título provisório do seu projeto de IC?**
Desenvolvimento de um Back-End para um Sistema Multiplataforma para a Empresa Júnior do Curso de Bacharelado em Engenharia de Computação da UEMA

2.  **Qual era o principal objetivo do seu projeto de IC?**
Melhorar e organizar a empresa, fazendo controle interno atraves da aplicação.

3.  **Para qual "Empresa Júnior de Engenharia de Computação" o backend foi desenvolvido?**
Technos

4.  **O backend já está em produção? Se sim, desde quando? Se não, qual o status atual?**
Sim, desde o final de Janeiro
---

### Aspectos Técnicos do Backend

5.  **Quais foram as principais tecnologias (linguagens de programação, frameworks, bibliotecas) que você utilizou no desenvolvimento do backend?**
Django, Python, Docker, (HTML, CSS, JS: customização do django admin)

6.  **Qual banco de dados foi utilizado e por quê?**
PostgreSQL, não tenho uma justificativa tecnica, eu apenas escolhi por ter familiaridade

7.  **Qual a arquitetura geral do backend?**
Era um monolito baseado em Django, mas agora está sendo migrado para Spring para servir outros serviços, então está virando um microserviço

8.  **Quais foram as principais funcionalidades (endpoints/rotas) implementadas no backend?**
Autenticação, Cadastro de Clientes, Registro Fiscal (Valor em caixa e extrato), Registro e Controle de Demandas/Atividaes, Registro e Controle de Estoque de Materiais
9.  **Como você lidou com a segurança do backend?**
Basicamente estou confiando na segurança do Django, mas no Spring estou aplicando JWT entre outras questões sobre segurança de aplicação seguindo os guia do OWASP

10. **Como foi feito o deploy (publicação) do backend?**
Inicialmente foi posto na Railway em um plano de testes que tinha 5 dolares e recursos limitados, apos o fim do plano o sistema foi migrado para um servidor dentro da Uema no laboratorio de desenvolvimento de sistemas onde foi configurado para servir em rede local
---

### Processo de Desenvolvimento e Desafios

11. **Qual metodologia de desenvolvimento você utilizou (mesmo que informalmente)?**
Eu não tinha muito conhecimento desses padrões, comecei a estudar recentemente, eu basicamente tinha alguns requisitos de sistemas e ia fazendo, não estipulei sprint ou backlog (seria os requisitos nesse contexto) e como não trabalhei em equipe apenas segui o meu ritmo.

12. **Quais foram os 2-3 maiores desafios técnicos que você enfrentou durante o desenvolvimento do backend?**
O Django facilita muita coisa mas eu senti que a manutenção era muito custosa, os modulos eram muito fortemente acoplados e pequenas mudanças em uma parte quebravam em outras e como eu usava o django admin para usar como front a aplicação inteira morria. Python me deu muita dor de cabeça com tipagem, muita coisa passa batido e eu demoro muito tempo em logs e stack traces para identificar o problema enquanto que em Java / Sprint, por seguir padrões mais bem estabelecidos e me obrigar a seguir eles não tive problemas desse tipo e quando tinha era facil de identificar. Cheguei a conclusão que para projetos maiores python não é muito bom. A performance do Django é boa e estudei sobre as Lazy Query dele que realemnte dão um up nas consultas. Meus maiores problemas foram para colocar em produção em um servidor local onde tive que reestudar redes de computadores e orquestração de conteiners.

13. **Como você superou esses desafios?**
Falei muita coisa e meio que já respondi, estudei, fiz muita pesquisa, e agora estou migrabdo o sistema pra utra stack

14. **Houve algum tipo de teste (unitário, integração, performance) realizado no backend? Se sim, quais e com quais ferramentas?**
Eu apenas fiz testes unitarios, não segui nenhuma estrategia de TDD, pretendo fazer isso agora nessa migração.
---

### Impacto e Contribuições

15. **Qual o impacto ou benefício que o backend trouxe (ou trará) para a Empresa Júnior?**
Os processos foram centralizados e padronizados, as informações ficaram de facil acesso assim como a organização ficou melhor em função de um controle interno melhor. Reduziu os erros manuais e automatizou o processo de geração de relatorio (umas das funcionanlides do sistemas que não era um grande modulo)

16. **Quais foram os principais aprendizados técnicos e/ou pessoais que você obteve ao desenvolver este projeto?**
Definitivamente teve muita coisa, desde de habilidades tecnicas sobre backend, banco de dados (algumas logicas do backend viraram uma storage procedure), devops, infraestrura e segurança de aplicação  ate habilidades não tecnico porque tambem tive um contato maior com a empresa junior para entender suas necessidades, levantar requisitos, negociar funcionalidades receber feedbacks do sistema e fazer a melhoria continua com base nesses feedbacks.

17. **Existem funcionalidades que você planejou, mas não conseguiu implementar? Quais seriam e por quê?**
Todos os modulos foram bem implementados

18. **Quais são os próximos passos ou melhorias futuras que você sugere para o backend?**
Terminar a migração seguindo as práticas de desenvolvimento e arquitetura de software, bem como fazer manutenção do sistema legado (prototipo em django que ta em produção) além de eventualemnte subir em um Servidor em Nuvem para acesso além das dependecias da rede da Uema.
---

Assim que você preencher, poderei te dar um feedback mais específico e te ajudar a montar o esqueleto do seu relatório!