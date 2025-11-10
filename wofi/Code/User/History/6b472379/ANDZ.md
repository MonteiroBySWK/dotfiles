## Formulário para Orientação do Relatório de Iniciação Científica

### Informações Básicas do Projeto

1.  **Qual o título provisório do seu projeto de IC?**
Desenvolvimento de um Back-End para um Sistema Multiplataforma para a Empresa Júnior do Curso de Bacharelado em Engenharia de Computação da UEMA

2.  **Qual era o principal objetivo do seu projeto de IC?**
Melhorar e organizar a empresa, fazendo controle interno atraves da aplicação.

3.  **Para qual "Empresa Júnior de Engenharia de Computação" o backend foi desenvolvido?**
Technos

4.  **O backend já está em produção? Se sim, desde quando? Se não, qual o status atual?**
Sim, desde o final de Janeiro de 2025
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
---Terminar a migração seguindo as práticas de desenvolvimento e arquitetura de software, bem como fazer manutenção do sistema legado (prototipo em django que ta em produção) além de eventualemnte subir em um Servidor em Nuvem para acesso além das dependecias da rede da Uema.


### Impacto e Contribuições

15. **Qual o impacto ou benefício que o backend trouxe (ou trará) para a Empresa Júnior?**
Os processos foram centralizados e padronizados, as informações ficaram de facil acesso assim como a organização ficou melhor em função de um controle interno melhor. Reduziu os erros manuais e automatizou o processo de geração de relatorio (umas das funcionanlides do sistemas que não era um grande modulo)

16. **Quais foram os principais aprendizados técnicos e/ou pessoais que você obteve ao desenvolver este projeto?**
Definitivamente teve muita coisa, desde de habilidades tecnicas sobre backend, banco de dados (algumas logicas do backend viraram uma storage procedure), devops, infraestrura e segurança de aplicação  ate habilidades não tecnico porque tambem tive um contato maior com a empresa junior para entender suas necessidades, levantar requisitos, negociar funcionalidades receber feedbacks do sistema e fazer a melhoria continua com base nesses feedbacks.

17. **Existem funcionalidades que você planejou, mas não conseguiu implementar? Quais seriam e por quê?**
Todos os modulos foram bem implementados

18. **Quais são os próximos passos ou melhorias futuras que você sugere para o backend?**
Terminar a migração seguindo as práticas de desenvolvimento e arquitetura de software, bem como fazer manutenção do sistema legado (prototipo em django que ta em produção) além de eventualemnte subir em um Servidor em Nuvem para acesso além das dependecias da rede da Uema.


### **Formulário de Informações Adicionais**

**1. Introdução e Contexto (Problemática):**
* Antes do sistema, quais eram os principais problemas ou ineficiências na gestão da Technos que o seu back-end visava resolver? Descreva o cenário.
Antes do sistema, a gestão da Technos sofria com informações descentralizadas em múltiplas planilhas, documentos do word e outros. Isso causava ineficiência no controle de projetos e finanças.

**2. Metodologia (Detalhes Adicionais):**
* Como exatamente foram levantados os requisitos do sistema junto à Technos (e.g., reuniões semanais, entrevistas formais, análise de documentos, prototipagem interativa)?
Foram feitas reuniões entre mim e a technos para que eles explicassem o que eles queriam e conforme eu ia modelagem eu ia atras do feedback deles para garnatir que estava na forma como eles queriam.

* Quais ferramentas ou bibliotecas de teste foram usadas para os "testes unitários" (ex: `unittest`, `pytest`)? Qual foi a cobertura aproximada dos testes (em %) ou a estratégia geral de teste (e.g., apenas funcionalidades críticas, todos os modelos)?
para cada modelo/funcionalidas tinha tinha testes unitarios, o que foi usado foi o pytest

* No *deploy* para o servidor local da UEMA, quais foram as principais ferramentas e tecnologias adicionais utilizadas para configuração de rede e orquestração (ex: Nginx, Docker Compose, Kubernetes, certbot para HTTPS se aplicável)? Poderia descrever brevemente a topologia da implantação local?
Docker, NGINX basicamente


**3. Resultados (Aprofundamento de Módulos e Métricas):**
* Para cada um dos três módulos principais (Gerenciamento de Clientes, Serviços, Finanças), poderia detalhar um pouco mais as funcionalidades ou as regras de negócio implementadas?
    * **Gerenciamento de Clientes:** Que tipos de dados de cliente são armazenados? Há histórico de serviços por cliente?
    * **Serviços:** Quais são os fluxos ou estados de um pedido (e.g., desde a abertura até a conclusão, com detalhes sobre transições)?
    * **Finanças:** Como o "registro fiscal" é implementado? Há relatórios financeiros gerados?

Gerenciamento de Clientes
Tipos de dados armazenados:

Nome (nome)
Telefone (fone, com validação de formato internacional)
E-mail (email, com validação)
Categoria (categoria): Professor, Aluno ou Externo
Curso (apenas para alunos)
Prioridade (definida automaticamente: Professor > Aluno > Externo)
Data de registro
Regras de negócio:

Alunos devem ter um curso definido; externos não podem ter curso.
A prioridade é atribuída automaticamente conforme a categoria.
Validações customizadas no método clean.
Histórico de serviços por cliente:

O relacionamento com serviços é feito via chave estrangeira nos modelos de pedidos em servicos.models.Pedido, permitindo rastrear todos os pedidos associados a um cliente.
Serviços
Fluxos/estados de um pedido:

Os pedidos (Pedido) possuem os seguintes estados: Pendente, Em Andamento, Concluído.
Transições:
Ao criar, o pedido inicia como "Pendente".
Pode ser atribuído a um atendente e técnico (não podem ser a mesma pessoa).
Só pode ser salvo se tiver técnico e cliente definidos.
O prazo de orçamento não pode ser no passado.
Ao ser concluído, é gerada uma entrada financeira vinculada ao pedido.
Campos relevantes:
Título, descrição, cliente, atendente, técnico, datas de registro, prazos, orçamento, status.
Existem subclasses de pedido: Manutencao, Consultoria, Software (com tipos e requisitos específicos).
Regras de negócio:

Validações para garantir integridade dos dados e papéis distintos.
Serviços gerais possuem valores automáticos conforme o tipo de serviço.
Finanças
Registro fiscal:

O modelo Caixa mantém o saldo atual, atualizado automaticamente a cada entrada ou saída.
Só pode existir um único caixa.
Entradas (Entrada) e saídas (Saida) registram descrição, valor, data e podem ser vinculadas a pedidos.
Toda vez que uma entrada ou saída é salva, o saldo do caixa é recalculado.
Entradas não podem ter valor negativo.
Relatórios financeiros:

Não há um modelo explícito de relatório financeiro, mas o sistema permite rastrear todas as entradas e saídas, possibilitando a geração de relatórios via consultas ou templates.

**4. Discussões (Exemplos e Impacto Qualitativo):**
* Você poderia fornecer um ou dois exemplos mais concretos dos "desafios de tipagem em Python" que causaram problemas de depuração no seu projeto?
* Poderia descrever um cenário ou anedota que ilustre o "alto acoplamento" entre módulos e como isso afetou o desenvolvimento/manutenção?
* Houve algum *feedback* formal ou informal significativo dos usuários da Technos (e.g., "melhorou X", "agora conseguimos fazer Y mais rápido") que possa ser mencionado para ilustrar o impacto positivo?
Desafios de Tipagem em Python
Exemplo 1: Erro silencioso ao acessar atributos No modelo Pedido, o campo tecnico espera um objeto do tipo usuário. Se, por engano, uma função recebe um ID (int) ao invés do objeto, o erro só aparece em tempo de execução, dificultando a depuração:

Esse tipo de erro não é detectado pelo interpretador, apenas em tempo de execução, tornando o bug difícil de rastrear.

Exemplo 2: Funções que retornam tipos inesperados Uma função que deveria retornar um queryset pode, por erro, retornar uma lista comum. Como Python é dinâmico, o erro só aparece quando métodos específicos de queryset são chamados, causando falhas inesperadas.


Percebi que o alto acoplamento é mais um erro na modelagem do sistema  do que do Python/Django em si, apesar de ser algo facil de cair em função da liberdade que a linguagem dá

.feedback mais significativo é que o ERP centralizou todas as operações, permitindo acesso instantâneo ao histórico de clientes e agilizando processos, como a geração de relatórios financeiros, o que tornou nossa gestão mais profissional e estratégica.

**5. Perspectivas (Detalhes de Continuidade):**
* Existe um planejamento ou cronograma (mesmo que estimado) para a migração para microsserviços em Java/Spring? Há recursos (humanos, financeiros) designados para essa próxima fase?
* No contexto da migração, há tecnologias ou *frameworks* específicos dentro do ecossistema Java/Spring que já estão sendo considerados (e.g., Spring Boot para microsserviços, Spring Data JPA para persistência, Eureka/Consul para service discovery)?

**6. Outras Atividades (Detalhes):**
* Quais outras atividades relevantes você realizou durante o período de sua Iniciação Científica que não foram diretamente ligadas ao desenvolvimento do back-end, mas que foram parte do seu envolvimento com a pesquisa ou a UEMA? (Ex: participação em eventos, cursos, mentorias, etc.) Por favor, seja o mais específico possível.


