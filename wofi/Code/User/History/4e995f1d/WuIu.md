# Especificação de Casos de Uso - Sistema NeoLab

## 1. Landing Page Pública (LAICOPI)

### UC-01: Visualizar Página Inicial
| **Campo** | **Descrição** |
|-----------|---------------|
| **ID** | UC-01 |
| **Nome** | Visualizar Página Inicial |
| **Ator Principal** | Visitante |
| **Pré-condições** | Nenhuma |
| **Pós-condições** | Página inicial é exibida com informações do laboratório |
| **Fluxo Principal** | 1. Visitante acessa a URL do sistema<br>2. Sistema exibe página inicial com textos descritivos<br>3. Sistema apresenta imagens e destaques do laboratório |
| **Requisitos** | REQ-01 |

### UC-02: Visualizar Portfólio
| **Campo** | **Descrição** |
|-----------|---------------|
| **ID** | UC-02 |
| **Nome** | Visualizar Portfólio |
| **Ator Principal** | Visitante |
| **Pré-condições** | Nenhuma |
| **Pós-condições** | Lista de projetos é exibida |
| **Fluxo Principal** | 1. Visitante acessa seção de portfólio<br>2. Sistema exibe lista de projetos desenvolvidos<br>3. Sistema permite visualização detalhada de cada projeto (UC-03) |
| **Inclui** | UC-03 (Visualizar Detalhes do Projeto) |
| **Requisitos** | REQ-02 |

### UC-03: Visualizar Detalhes do Projeto
| **Campo** | **Descrição** |
|-----------|---------------|
| **ID** | UC-03 |
| **Nome** | Visualizar Detalhes do Projeto |
| **Ator Principal** | Visitante |
| **Pré-condições** | UC-02 foi iniciado |
| **Pós-condições** | Detalhes do projeto são exibidos |
| **Fluxo Principal** | 1. Visitante seleciona um projeto<br>2. Sistema exibe título, descrição e objetivos<br>3. Sistema apresenta resultados e imagens do projeto |
| **Requisitos** | REQ-03 |

### UC-04: Visualizar Catálogo de Equipamentos
| **Campo** | **Descrição** |
|-----------|---------------|
| **ID** | UC-04 |
| **Nome** | Visualizar Catálogo de Equipamentos |
| **Ator Principal** | Visitante |
| **Pré-condições** | Nenhuma |
| **Pós-condições** | Catálogo de equipamentos é exibido |
| **Fluxo Principal** | 1. Visitante acessa seção de equipamentos<br>2. Sistema exibe lista de equipamentos disponíveis<br>3. Sistema apresenta fotos das bancadas<br>4. Sistema permite visualização detalhada de cada equipamento (UC-05) |
| **Inclui** | UC-05 (Visualizar Detalhes do Equipamento) |
| **Requisitos** | REQ-04 |

### UC-05: Visualizar Detalhes do Equipamento
| **Campo** | **Descrição** |
|-----------|---------------|
| **ID** | UC-05 |
| **Nome** | Visualizar Detalhes do Equipamento |
| **Ator Principal** | Visitante |
| **Pré-condições** | UC-04 foi iniciado |
| **Pós-condições** | Detalhes do equipamento são exibidos |
| **Fluxo Principal** | 1. Visitante seleciona um equipamento<br>2. Sistema exibe nome e especificações técnicas<br>3. Sistema apresenta imagens do equipamento |
| **Requisitos** | REQ-05 |

### UC-06: Visualizar Perfis dos Pesquisadores
| **Campo** | **Descrição** |
|-----------|---------------|
| **ID** | UC-06 |
| **Nome** | Visualizar Perfis dos Pesquisadores |
| **Ator Principal** | Visitante |
| **Pré-condições** | Nenhuma |
| **Pós-condições** | Perfis dos pesquisadores são exibidos |
| **Fluxo Principal** | 1. Visitante acessa seção de equipe<br>2. Sistema exibe lista de pesquisadores e membros<br>3. Sistema apresenta foto, nome, formação e currículo resumido |
| **Requisitos** | REQ-06 |

### UC-07: Visualizar Informações de Contato
| **Campo** | **Descrição** |
|-----------|---------------|
| **ID** | UC-07 |
| **Nome** | Visualizar Informações de Contato |
| **Ator Principal** | Visitante |
| **Pré-condições** | Nenhuma |
| **Pós-condições** | Informações de contato são exibidas |
| **Fluxo Principal** | 1. Visitante acessa seção de contato<br>2. Sistema exibe endereço, telefone e e-mail<br>3. Sistema apresenta horários de funcionamento<br>4. Sistema exibe mapa de localização (UC-08)<br>5. Sistema disponibiliza formulário de contato (UC-09) |
| **Inclui** | UC-08 (Visualizar Mapa de Localização)<br>UC-09 (Enviar Mensagem de Contato) |
| **Requisitos** | REQ-07 |

### UC-08: Visualizar Mapa de Localização
| **Campo** | **Descrição** |
|-----------|---------------|
| **ID** | UC-08 |
| **Nome** | Visualizar Mapa de Localização |
| **Ator Principal** | Visitante |
| **Pré-condições** | UC-07 foi iniciado |
| **Pós-condições** | Mapa de localização é exibido |
| **Fluxo Principal** | 1. Sistema integra com Google Maps<br>2. Sistema exibe mapa com localização do laboratório |
| **Requisitos** | REQ-08 |

### UC-09: Enviar Mensagem de Contato
| **Campo** | **Descrição** |
|-----------|---------------|
| **ID** | UC-09 |
| **Nome** | Enviar Mensagem de Contato |
| **Ator Principal** | Visitante |
| **Pré-condições** | UC-07 foi iniciado |
| **Pós-condições** | Mensagem é enviada ao laboratório |
| **Fluxo Principal** | 1. Visitante preenche formulário de contato<br>2. Visitante confirma envio<br>3. Sistema valida dados<br>4. Sistema envia mensagem<br>5. Sistema exibe confirmação |
| **Fluxo Alternativo** | **3a.** Dados inválidos:<br>&nbsp;&nbsp;1. Sistema exibe mensagem de erro<br>&nbsp;&nbsp;2. Retorna ao passo 1 |
| **Requisitos** | REQ-09 |

---

## 2. Autenticação e Controle de Acesso

### UC-10: Fazer Login
| **Campo** | **Descrição** |
|-----------|---------------|
| **ID** | UC-10 |
| **Nome** | Fazer Login |
| **Ator Principal** | Usuário Não Autenticado, Membro do Laboratório |
| **Pré-condições** | Usuário deve ter cadastro ativo |
| **Pós-condições** | Usuário é autenticado e tem acesso à área restrita |
| **Fluxo Principal** | 1. Usuário acessa área de login<br>2. Usuário informa e-mail institucional e senha<br>3. Sistema valida e-mail institucional (UC-11)<br>4. Sistema autentica credenciais<br>5. Sistema mantém sessão ativa (UC-15)<br>6. Sistema concede acesso à área restrita |
| **Fluxo Alternativo** | **4a.** Credenciais inválidas:<br>&nbsp;&nbsp;1. Sistema exibe mensagem de erro<br>&nbsp;&nbsp;2. Sistema incrementa contador de tentativas<br>&nbsp;&nbsp;3. Retorna ao passo 2<br><br>**4b.** Múltiplas tentativas falhas:<br>&nbsp;&nbsp;1. Sistema bloqueia temporariamente o acesso<br>&nbsp;&nbsp;2. Sistema notifica usuário |
| **Inclui** | UC-11 (Validar E-mail Institucional)<br>UC-15 (Manter Sessão Ativa) |
| **Requisitos** | REQ-11, REQ-12, REQ-13, REQ-19 |

### UC-11: Validar E-mail Institucional
| **Campo** | **Descrição** |
|-----------|---------------|
| **ID** | UC-11 |
| **Nome** | Validar E-mail Institucional |
| **Ator Principal** | Sistema |
| **Pré-condições** | E-mail foi informado |
| **Pós-condições** | E-mail é validado como institucional ou rejeitado |
| **Fluxo Principal** | 1. Sistema verifica domínio do e-mail<br>2. Sistema valida se é @uema.br ou domínio autorizado<br>3. Sistema confirma validação |
| **Fluxo Alternativo** | **2a.** Domínio inválido:<br>&nbsp;&nbsp;1. Sistema rejeita e-mail<br>&nbsp;&nbsp;2. Sistema exibe mensagem de erro |
| **Requisitos** | REQ-13 |

### UC-12: Cadastrar Novo Usuário
| **Campo** | **Descrição** |
|-----------|---------------|
| **ID** | UC-12 |
| **Nome** | Cadastrar Novo Usuário |
| **Ator Principal** | Usuário Não Autenticado |
| **Pré-condições** | Usuário possui e-mail institucional UEMA |
| **Pós-condições** | Cadastro é criado e aguarda confirmação |
| **Fluxo Principal** | 1. Usuário acessa página de cadastro<br>2. Usuário preenche dados (nome, e-mail institucional, senha)<br>3. Sistema valida e-mail institucional (UC-11)<br>4. Sistema registra dados<br>5. Sistema envia e-mail de confirmação (UC-13)<br>6. Sistema exibe mensagem de confirmação pendente |
| **Fluxo Alternativo** | **3a.** E-mail não institucional:<br>&nbsp;&nbsp;1. Sistema rejeita cadastro<br>&nbsp;&nbsp;2. Sistema exibe mensagem informativa<br><br>**4a.** E-mail já cadastrado:<br>&nbsp;&nbsp;1. Sistema informa que e-mail já existe<br>&nbsp;&nbsp;2. Sistema oferece recuperação de senha |
| **Inclui** | UC-11 (Validar E-mail Institucional)<br>UC-13 (Confirmar E-mail) |
| **Requisitos** | REQ-14, REQ-15 |

### UC-13: Confirmar E-mail
| **Campo** | **Descrição** |
|-----------|---------------|
| **ID** | UC-13 |
| **Nome** | Confirmar E-mail |
| **Ator Principal** | Usuário Não Autenticado |
| **Pré-condições** | UC-12 foi executado |
| **Pós-condições** | E-mail é confirmado e cadastro ativado |
| **Fluxo Principal** | 1. Sistema envia e-mail com link de confirmação<br>2. Usuário acessa link recebido<br>3. Sistema valida token de confirmação<br>4. Sistema ativa cadastro<br>5. Sistema exibe mensagem de sucesso |
| **Fluxo Alternativo** | **3a.** Token inválido ou expirado:<br>&nbsp;&nbsp;1. Sistema exibe mensagem de erro<br>&nbsp;&nbsp;2. Sistema oferece reenvio de e-mail |
| **Requisitos** | REQ-15 |

### UC-14: Recuperar Senha
| **Campo** | **Descrição** |
|-----------|---------------|
| **ID** | UC-14 |
| **Nome** | Recuperar Senha |
| **Ator Principal** | Usuário Não Autenticado |
| **Pré-condições** | Usuário possui cadastro ativo |
| **Pós-condições** | Nova senha é definida |
| **Fluxo Principal** | 1. Usuário acessa opção de recuperar senha<br>2. Usuário informa e-mail institucional<br>3. Sistema valida e-mail no cadastro<br>4. Sistema envia link de recuperação por e-mail<br>5. Usuário acessa link recebido<br>6. Usuário define nova senha<br>7. Sistema atualiza senha<br>8. Sistema exibe confirmação |
| **Fluxo Alternativo** | **3a.** E-mail não encontrado:<br>&nbsp;&nbsp;1. Sistema exibe mensagem genérica por segurança<br>&nbsp;&nbsp;2. Sistema não revela se e-mail existe ou não |
| **Requisitos** | REQ-16 |

### UC-15: Manter Sessão Ativa
| **Campo** | **Descrição** |
|-----------|---------------|
| **ID** | UC-15 |
| **Nome** | Manter Sessão Ativa |
| **Ator Principal** | Sistema |
| **Pré-condições** | Usuário realizou login (UC-10) |
| **Pós-condições** | Sessão permanece ativa pelo período configurado |
| **Fluxo Principal** | 1. Sistema cria sessão autenticada<br>2. Sistema define tempo de expiração<br>3. Sistema renova sessão a cada atividade<br>4. Sistema mantém estado autenticado |
| **Fluxo Alternativo** | **4a.** Sessão expirada:<br>&nbsp;&nbsp;1. Sistema encerra sessão<br>&nbsp;&nbsp;2. Sistema redireciona para login |
| **Requisitos** | REQ-19 |

### UC-16: Fazer Logout
| **Campo** | **Descrição** |
|-----------|---------------|
| **ID** | UC-16 |
| **Nome** | Fazer Logout |
| **Ator Principal** | Membro do Laboratório |
| **Pré-condições** | Usuário está autenticado |
| **Pós-condições** | Sessão é encerrada |
| **Fluxo Principal** | 1. Usuário acessa opção de logout<br>2. Sistema encerra sessão<br>3. Sistema limpa dados de autenticação<br>4. Sistema redireciona para área pública |
| **Requisitos** | REQ-20 |

### UC-17: Acessar Área Restrita
| **Campo** | **Descrição** |
|-----------|---------------|
| **ID** | UC-17 |
| **Nome** | Acessar Área Restrita |
| **Ator Principal** | Membro do Laboratório |
| **Pré-condições** | Usuário está autenticado |
| **Pós-condições** | Área restrita é acessível conforme nível de permissão |
| **Fluxo Principal** | 1. Usuário tenta acessar área restrita<br>2. Sistema verifica autenticação<br>3. Sistema verifica nível de permissão<br>4. Sistema libera acesso às funcionalidades permitidas |
| **Fluxo Alternativo** | **2a.** Usuário não autenticado:<br>&nbsp;&nbsp;1. Sistema bloqueia acesso<br>&nbsp;&nbsp;2. Sistema redireciona para login |
| **Requisitos** | REQ-17, REQ-18 |

---

## 3. Gerenciamento de Pessoas

### UC-18: Cadastrar Membro
| **Campo** | **Descrição** |
|-----------|---------------|
| **ID** | UC-18 |
| **Nome** | Cadastrar Membro |
| **Ator Principal** | Administrador |
| **Pré-condições** | Administrador está autenticado |
| **Pós-condições** | Novo membro é cadastrado no sistema |
| **Fluxo Principal** | 1. Administrador acessa módulo de gerenciamento de pessoas<br>2. Administrador seleciona opção de cadastrar membro<br>3. Sistema registra informações pessoais (UC-19)<br>4. Sistema registra informações acadêmicas (UC-20)<br>5. Sistema define tipo/função do membro (UC-21)<br>6. Sistema registra período de vínculo (UC-22)<br>7. Sistema permite upload de foto de perfil (UC-23)<br>8. Administrador confirma cadastro<br>9. Sistema valida dados<br>10. Sistema salva cadastro<br>11. Sistema exibe confirmação |
| **Fluxo Alternativo** | **9a.** Dados inválidos:<br>&nbsp;&nbsp;1. Sistema exibe erros de validação<br>&nbsp;&nbsp;2. Retorna ao passo apropriado para correção |
| **Inclui** | UC-19 (Registrar Informações Pessoais)<br>UC-20 (Registrar Informações Acadêmicas)<br>UC-21 (Definir Tipo/Função)<br>UC-22 (Registrar Período de Vínculo)<br>UC-23 (Upload de Foto) |
| **Requisitos** | REQ-21, REQ-22, REQ-23, REQ-24, REQ-25 |

### UC-19: Registrar Informações Pessoais
| **Campo** | **Descrição** |
|-----------|---------------|
| **ID** | UC-19 |
| **Nome** | Registrar Informações Pessoais |
| **Ator Principal** | Administrador |
| **Pré-condições** | UC-18 foi iniciado |
| **Pós-condições** | Informações pessoais são registradas |
| **Fluxo Principal** | 1. Administrador preenche nome completo<br>2. Administrador preenche e-mail<br>3. Administrador preenche telefone<br>4. Sistema valida dados |
| **Requisitos** | REQ-21 |

### UC-20: Registrar Informações Acadêmicas
| **Campo** | **Descrição** |
|-----------|---------------|
| **ID** | UC-20 |
| **Nome** | Registrar Informações Acadêmicas |
| **Ator Principal** | Administrador |
| **Pré-condições** | UC-18 foi iniciado |
| **Pós-condições** | Informações acadêmicas são registradas |
| **Fluxo Principal** | 1. Administrador preenche formação<br>2. Administrador preenche instituição<br>3. Administrador preenche área de pesquisa<br>4. Sistema valida dados |
| **Requisitos** | REQ-22 |

### UC-21: Definir Tipo/Função do Membro
| **Campo** | **Descrição** |
|-----------|---------------|
| **ID** | UC-21 |
| **Nome** | Definir Tipo/Função do Membro |
| **Ator Principal** | Administrador |
| **Pré-condições** | UC-18 foi iniciado |
| **Pós-condições** | Tipo/função é definido |
| **Fluxo Principal** | 1. Sistema exibe opções (Aluno, Pesquisador, Professor, Técnico)<br>2. Administrador seleciona tipo/função<br>3. Sistema registra seleção |
| **Requisitos** | REQ-23 |

### UC-22: Registrar Período de Vínculo
| **Campo** | **Descrição** |
|-----------|---------------|
| **ID** | UC-22 |
| **Nome** | Registrar Período de Vínculo |
| **Ator Principal** | Administrador |
| **Pré-condições** | UC-18 foi iniciado |
| **Pós-condições** | Período de vínculo é registrado |
| **Fluxo Principal** | 1. Administrador informa data de início<br>2. Administrador informa data de fim (opcional)<br>3. Sistema valida datas<br>4. Sistema registra período |
| **Requisitos** | REQ-24 |

### UC-23: Upload de Foto de Perfil
| **Campo** | **Descrição** |
|-----------|---------------|
| **ID** | UC-23 |
| **Nome** | Upload de Foto de Perfil |
| **Ator Principal** | Administrador |
| **Pré-condições** | UC-18 foi iniciado |
| **Pós-condições** | Foto de perfil é armazenada |
| **Fluxo Principal** | 1. Administrador seleciona arquivo de imagem<br>2. Sistema valida tipo de arquivo (JPG, PNG)<br>3. Sistema valida tamanho<br>4. Sistema faz upload<br>5. Sistema armazena foto |
| **Fluxo Alternativo** | **2a.** Tipo de arquivo inválido:<br>&nbsp;&nbsp;1. Sistema exibe erro<br>&nbsp;&nbsp;2. Retorna ao passo 1<br><br>**3a.** Arquivo muito grande:<br>&nbsp;&nbsp;1. Sistema exibe erro<br>&nbsp;&nbsp;2. Retorna ao passo 1 |
| **Requisitos** | REQ-25 |

### UC-24: Editar Informações de Membro
| **Campo** | **Descrição** |
|-----------|---------------|
| **ID** | UC-24 |
| **Nome** | Editar Informações de Membro |
| **Ator Principal** | Administrador |
| **Pré-condições** | Administrador está autenticado e membro existe |
| **Pós-condições** | Informações do membro são atualizadas |
| **Fluxo Principal** | 1. Administrador busca membro<br>2. Administrador seleciona membro<br>3. Sistema exibe dados atuais<br>4. Administrador edita informações desejadas<br>5. Administrador confirma alterações<br>6. Sistema valida dados<br>7. Sistema atualiza registro<br>8. Sistema exibe confirmação |
| **Requisitos** | REQ-26 |

### UC-25: Inativar Membro
| **Campo** | **Descrição** |
|-----------|---------------|
| **ID** | UC-25 |
| **Nome** | Inativar Membro |
| **Ator Principal** | Administrador |
| **Pré-condições** | Administrador está autenticado e membro existe ativo |
| **Pós-condições** | Membro é marcado como inativo sem perder histórico |
| **Fluxo Principal** | 1. Administrador busca membro<br>2. Administrador seleciona membro<br>3. Administrador seleciona opção de inativar<br>4. Sistema solicita confirmação<br>5. Administrador confirma<br>6. Sistema marca membro como inativo<br>7. Sistema mantém histórico<br>8. Sistema exibe confirmação |
| **Fluxo Alternativo** | **5a.** Administrador cancela:<br>&nbsp;&nbsp;1. Sistema cancela operação<br>&nbsp;&nbsp;2. Retorna à lista de membros |
| **Requisitos** | REQ-27 |

### UC-26: Listar Membros
| **Campo** | **Descrição** |
|-----------|---------------|
| **ID** | UC-26 |
| **Nome** | Listar Membros |
| **Ator Principal** | Administrador, Membro do Laboratório |
| **Pré-condições** | Usuário está autenticado |
| **Pós-condições** | Lista de membros é exibida |
| **Fluxo Principal** | 1. Usuário acessa módulo de gerenciamento de pessoas<br>2. Sistema exibe lista de membros<br>3. Sistema permite visualizar detalhes (UC-29) |
| **Extensões** | **2a.** Usuário filtra membros (UC-27)<br>**2b.** Usuário busca membro (UC-28) |
| **Inclui** | UC-29 (Visualizar Detalhes do Membro) |
| **Requisitos** | REQ-28 |

### UC-27: Filtrar Membros
| **Campo** | **Descrição** |
|-----------|---------------|
| **ID** | UC-27 |
| **Nome** | Filtrar Membros |
| **Ator Principal** | Administrador, Membro do Laboratório |
| **Pré-condições** | UC-26 foi iniciado |
| **Pós-condições** | Lista filtrada é exibida |
| **Fluxo Principal** | 1. Usuário seleciona filtro (ativo/inativo, tipo)<br>2. Sistema aplica filtro<br>3. Sistema exibe resultados filtrados |
| **Estende** | UC-26 (Listar Membros) |
| **Requisitos** | REQ-28 |

### UC-28: Buscar Membro
| **Campo** | **Descrição** |
|-----------|---------------|
| **ID** | UC-28 |
| **Nome** | Buscar Membro |
| **Ator Principal** | Administrador, Membro do Laboratório |
| **Pré-condições** | UC-26 foi iniciado |
| **Pós-condições** | Resultados da busca são exibidos |
| **Fluxo Principal** | 1. Usuário digita termo de busca (nome ou e-mail)<br>2. Sistema realiza busca<br>3. Sistema exibe resultados |
| **Fluxo Alternativo** | **3a.** Nenhum resultado:<br>&nbsp;&nbsp;1. Sistema exibe mensagem informativa |
| **Estende** | UC-26 (Listar Membros) |
| **Requisitos** | REQ-29 |

### UC-29: Visualizar Detalhes do Membro
| **Campo** | **Descrição** |
|-----------|---------------|
| **ID** | UC-29 |
| **Nome** | Visualizar Detalhes do Membro |
| **Ator Principal** | Administrador, Membro do Laboratório |
| **Pré-condições** | UC-26 foi iniciado |
| **Pós-condições** | Detalhes completos do membro são exibidos |
| **Fluxo Principal** | 1. Usuário seleciona membro da lista<br>2. Sistema exibe todas as informações do membro<br>3. Sistema exibe foto de perfil<br>4. Sistema exibe histórico de vínculo |
| **Requisitos** | REQ-30 |

---

## 4. Controle de Patrimônio

### UC-30: Cadastrar Equipamento
| **Campo** | **Descrição** |
|-----------|---------------|
| **ID** | UC-30 |
| **Nome** | Cadastrar Equipamento |
| **Ator Principal** | Administrador, Estagiário/Auxiliar |
| **Pré-condições** | Usuário está autenticado com permissão |
| **Pós-condições** | Equipamento é cadastrado no sistema |
| **Fluxo Principal** | 1. Usuário acessa módulo de patrimônio<br>2. Usuário seleciona cadastrar equipamento<br>3. Sistema registra informações básicas (UC-31)<br>4. Sistema registra quantidade (UC-32)<br>5. Sistema categoriza item (UC-33)<br>6. Sistema permite upload de fotos (UC-34)<br>7. Sistema registra localização física (UC-35)<br>8. Sistema registra informações adicionais (UC-36)<br>9. Usuário confirma cadastro<br>10. Sistema valida dados<br>11. Sistema salva registro<br>12. Sistema exibe confirmação |
| **Inclui** | UC-31 (Registrar Informações Básicas)<br>UC-32 (Registrar Quantidade)<br>UC-33 (Categorizar Item)<br>UC-34 (Upload de Fotos)<br>UC-35 (Registrar Localização)<br>UC-36 (Registrar Informações Adicionais) |
| **Requisitos** | REQ-31, REQ-32, REQ-33, REQ-34, REQ-35, REQ-36 |

### UC-31: Registrar Informações Básicas
| **Campo** | **Descrição** |
|-----------|---------------|
| **ID** | UC-31 |
| **Nome** | Registrar Informações Básicas |
| **Ator Principal** | Administrador, Estagiário/Auxiliar |
| **Pré-condições** | UC-30 foi iniciado |
| **Pós-condições** | Informações básicas são registradas |
| **Fluxo Principal** | 1. Usuário preenche nome do equipamento<br>2. Usuário preenche descrição<br>3. Usuário preenche especificações técnicas<br>4. Sistema valida dados |
| **Requisitos** | REQ-31 |

### UC-32: Registrar Quantidade
| **Campo** | **Descrição** |
|-----------|---------------|
| **ID** | UC-32 |
| **Nome** | Registrar Quantidade |
| **Ator Principal** | Administrador, Estagiário/Auxiliar |
| **Pré-condições** | UC-30 foi iniciado |
| **Pós-condições** | Quantidade disponível é registrada |
| **Fluxo Principal** | 1. Usuário informa quantidade disponível<br>2. Sistema valida valor numérico<br>3. Sistema registra quantidade |
| **Requisitos** | REQ-32 |

### UC-33: Categorizar Item
| **Campo** | **Descrição** |
|-----------|---------------|
| **ID** | UC-33 |
| **Nome** | Categorizar Item |
| **Ator Principal** | Administrador, Estagiário/Auxiliar |
| **Pré-condições** | UC-30 foi iniciado |
| **Pós-condições** | Categoria do item é definida |
| **Fluxo Principal** | 1. Sistema exibe categorias (Equipamento, Componente, Ferramenta, Bancada)<br>2. Usuário seleciona categoria<br>3. Sistema registra categoria |
| **Requisitos** | REQ-33 |

### UC-34: Upload de Fotos
| **Campo** | **Descrição** |
|-----------|---------------|
| **ID** | UC-34 |
| **Nome** | Upload de Fotos |
| **Ator Principal** | Administrador, Estagiário/Auxiliar |
| **Pré-condições** | UC-30 foi iniciado |
| **Pós-condições** | Fotos do equipamento são armazenadas |
| **Fluxo Principal** | 1. Usuário seleciona múltiplas imagens<br>2. Sistema valida tipo de arquivo<br>3. Sistema valida tamanho<br>4. Sistema faz upload<br>5. Sistema armazena fotos<br>6. Sistema permite adicionar mais fotos |
| **Fluxo Alternativo** | **2a.** Tipo inválido:<br>&nbsp;&nbsp;1. Sistema rejeita arquivo<br>&nbsp;&nbsp;2. Sistema continua com arquivos válidos |
| **Requisitos** | REQ-34 |

### UC-35: Registrar Localização Física
| **Campo** | **Descrição** |
|-----------|---------------|
| **ID** | UC-35 |
| **Nome** | Registrar Localização Física |
| **Ator Principal** | Administrador, Estagiário/Auxiliar |
| **Pré-condições** | UC-30 foi iniciado |
| **Pós-condições** | Localização física é registrada |
| **Fluxo Principal** | 1. Usuário informa localização no laboratório<br>2. Usuário pode especificar sala, bancada, prateleira<br>3. Sistema registra localização |
| **Requisitos** | REQ-35 |

### UC-36: Registrar Informações Adicionais
| **Campo** | **Descrição** |
|-----------|---------------|
| **ID** | UC-36 |
| **Nome** | Registrar Informações Adicionais |
| **Ator Principal** | Administrador, Estagiário/Auxiliar |
| **Pré-condições** | UC-30 foi iniciado |
| **Pós-condições** | Informações adicionais são registradas |
| **Fluxo Principal** | 1. Usuário preenche fabricante (opcional)<br>2. Usuário preenche modelo (opcional)<br>3. Usuário preenche número de série (opcional)<br>4. Usuário preenche data de aquisição (opcional)<br>5. Sistema registra informações |
| **Requisitos** | REQ-36 |

### UC-37: Editar Item
| **Campo** | **Descrição** |
|-----------|---------------|
| **ID** | UC-37 |
| **Nome** | Editar Item |
| **Ator Principal** | Administrador, Estagiário/Auxiliar |
| **Pré-condições** | Usuário está autenticado e item existe |
| **Pós-condições** | Informações do item são atualizadas |
| **Fluxo Principal** | 1. Usuário busca item<br>2. Usuário seleciona item<br>3. Sistema exibe dados atuais<br>4. Usuário edita informações<br>5. Usuário confirma alterações<br>6. Sistema valida dados<br>7. Sistema atualiza registro<br>8. Sistema exibe confirmação |
| **Requisitos** | REQ-37 |

### UC-38: Alterar Status do Item
| **Campo** | **Descrição** |
|-----------|---------------|
| **ID** | UC-38 |
| **Nome** | Alterar Status do Item |
| **Ator Principal** | Administrador |
| **Pré-condições** | Administrador está autenticado e item existe |
| **Pós-condições** | Status do item é atualizado |
| **Fluxo Principal** | 1. Administrador busca item<br>2. Administrador seleciona item<br>3. Sistema exibe status atual<br>4. Administrador seleciona novo status (Disponível/Indisponível/Em Manutenção)<br>5. Administrador confirma alteração<br>6. Sistema atualiza status<br>7. Sistema exibe confirmação |
| **Requisitos** | REQ-38 |

### UC-39: Listar Patrimônio
| **Campo** | **Descrição** |
|-----------|---------------|
| **ID** | UC-39 |
| **Nome** | Listar Patrimônio |
| **Ator Principal** | Administrador, Estagiário/Auxiliar, Membro do Laboratório |
| **Pré-condições** | Usuário está autenticado |
| **Pós-condições** | Lista de patrimônio é exibida |
| **Fluxo Principal** | 1. Usuário acessa módulo de patrimônio<br>2. Sistema exibe lista de itens<br>3. Sistema permite visualizar detalhes (UC-42) |
| **Extensões** | **2a.** Usuário filtra por categoria/status (UC-40)<br>**2b.** Usuário busca item (UC-41) |
| **Inclui** | UC-42 (Visualizar Detalhes do Item) |
| **Requisitos** | REQ-39 |

### UC-40: Filtrar por Categoria e Status
| **Campo** | **Descrição** |
|-----------|---------------|
| **ID** | UC-40 |
| **Nome** | Filtrar por Categoria e Status |
| **Ator Principal** | Administrador, Estagiário/Auxiliar, Membro do Laboratório |
| **Pré-condições** | UC-39 foi iniciado |
| **Pós-condições** | Lista filtrada é exibida |
| **Fluxo Principal** | 1. Usuário seleciona filtros (categoria e/ou status)<br>2. Sistema aplica filtros<br>3. Sistema exibe resultados filtrados |
| **Estende** | UC-39 (Listar Patrimônio) |
| **Requisitos** | REQ-39 |

### UC-41: Buscar Item
| **Campo** | **Descrição** |
|-----------|---------------|
| **ID** | UC-41 |
| **Nome** | Buscar Item |
| **Ator Principal** | Administrador, Estagiário/Auxiliar, Membro do Laboratório |
| **Pré-condições** | UC-39 foi iniciado |
| **Pós-condições** | Resultados da busca são exibidos |
| **Fluxo Principal** | 1. Usuário digita termo de busca (nome ou descrição)<br>2. Sistema realiza busca<br>3. Sistema exibe resultados |
| **Estende** | UC-39 (Listar Patrimônio) |
| **Requisitos** | REQ-40 |

### UC-42: Visualizar Detalhes do Item
| **Campo** | **Descrição** |
|-----------|---------------|
| **ID** | UC-42 |
| **Nome** | Visualizar Detalhes do Item |
| **Ator Principal** | Administrador, Estagiário/Auxiliar, Membro do Laboratório |
| **Pré-condições** | UC-39 foi iniciado |
| **Pós-condições** | Detalhes completos do item são exibidos |
| **Fluxo Principal** | 1. Usuário seleciona item<br>2. Sistema exibe informações completas<br>3. Sistema exibe galeria de fotos (UC-43) |
| **Inclui** | UC-43 (Ver Galeria de Fotos) |
| **Requisitos** | REQ-41 |

### UC-43: Ver Galeria de Fotos
| **Campo** | **Descrição** |
|-----------|---------------|
| **ID** | UC-43 |
| **Nome** | Ver Galeria de Fotos |
| **Ator Principal** | Administrador, Estagiário/Auxiliar, Membro do Laboratório |
| **Pré-condições** | UC-42 foi iniciado |
| **Pós-condições** | Galeria de fotos é exibida |
| **Fluxo Principal** | 1. Sistema exibe todas as fotos do item<br>2. Usuário pode ampliar fotos<br>3. Usuário pode navegar entre fotos |
| **Requisitos** | REQ-41 |

### UC-44: Exportar Lista para Excel
| **Campo** | **Descrição** |
|-----------|---------------|
| **ID** | UC-44 |
| **Nome** | Exportar Lista para Excel |
| **Ator Principal** | Administrador |
| **Pré-condições** | Administrador está autenticado |
| **Pós-condições** | Arquivo Excel é gerado e baixado |
| **Fluxo Principal** | 1. Administrador acessa módulo de patrimônio<br>2. Administrador seleciona opção de exportar<br>3. Sistema gera arquivo Excel com lista completa<br>4. Sistema disponibiliza download<br>5. Administrador baixa arquivo |
| **Requisitos** | REQ-42 |

---

## 5. Gestão de Conteúdo Acadêmico

### UC-45: Fazer Upload de Material
| **Campo** | **Descrição** |
|-----------|---------------|
| **ID** | UC-45 |
| **Nome** | Fazer Upload de Material |
| **Ator Principal** | Administrador, Membro Autorizado |
| **Pré-condições** | Usuário está autenticado com permissão |
| **Pós-condições** | Material acadêmico é armazenado no sistema |
| **Fluxo Principal** | 1. Usuário acessa módulo de conteúdo acadêmico<br>2. Usuário seleciona opção de upload<br>3. Usuário seleciona arquivo<br>4. Sistema valida tipo de arquivo (UC-46)<br>5. Sistema valida tamanho do arquivo (UC-47)<br>6. Sistema solicita categorização (UC-48)<br>7. Sistema solicita informações do material (UC-49)<br>8. Usuário confirma upload<br>9. Sistema faz upload do arquivo<br>10. Sistema registra data e autor<br>11. Sistema exibe confirmação |
| **Fluxo Alternativo** | **4a.** Tipo de arquivo não suportado:<br>&nbsp;&nbsp;1. Sistema exibe erro<br>&nbsp;&nbsp;2. Retorna ao passo 3<br><br>**5a.** Arquivo excede tamanho máximo:<br>&nbsp;&nbsp;1. Sistema exibe erro<br>&nbsp;&nbsp;2. Retorna ao passo 3 |
| **Inclui** | UC-46 (Validar Tipo de Arquivo)<br>UC-47 (Validar Tamanho)<br>UC-48 (Categorizar Material)<br>UC-49 (Registrar Informações) |
| **Requisitos** | REQ-43, REQ-44, REQ-45, REQ-46, REQ-47 |

### UC-46: Validar Tipo de Arquivo
| **Campo** | **Descrição** |
|-----------|---------------|
| **ID** | UC-46 |
| **Nome** | Validar Tipo de Arquivo |
| **Ator Principal** | Sistema |
| **Pré-condições** | UC-45 foi iniciado |
| **Pós-condições** | Tipo de arquivo é validado |
| **Fluxo Principal** | 1. Sistema verifica extensão do arquivo<br>2. Sistema valida se é PDF, DOCX, XLSX, PPT ou ZIP<br>3. Sistema confirma validação |
| **Fluxo Alternativo** | **2a.** Tipo não suportado:<br>&nbsp;&nbsp;1. Sistema rejeita arquivo |
| **Requisitos** | REQ-44 |

### UC-47: Validar Tamanho do Arquivo
| **Campo** | **Descrição** |
|-----------|---------------|
| **ID** | UC-47 |
| **Nome** | Validar Tamanho do Arquivo |
| **Ator Principal** | Sistema |
| **Pré-condições** | UC-45 foi iniciado |
| **Pós-condições** | Tamanho do arquivo é validado |
| **Fluxo Principal** | 1. Sistema verifica tamanho do arquivo<br>2. Sistema valida se não excede 50MB<br>3. Sistema confirma validação |
| **Fluxo Alternativo** | **2a.** Arquivo muito grande:<br>&nbsp;&nbsp;1. Sistema rejeita arquivo |
| **Requisitos** | REQ-45 |

### UC-48: Categorizar Material
| **Campo** | **Descrição** |
|-----------|---------------|
| **ID** | UC-48 |
| **Nome** | Categorizar Material |
| **Ator Principal** | Administrador, Membro Autorizado |
| **Pré-condições** | UC-45 foi iniciado |
| **Pós-condições** | Categoria do material é definida |
| **Fluxo Principal** | 1. Sistema exibe categorias (Notas de Aula, Artigos, Manuais, Tutoriais, Outros)<br>2. Usuário seleciona categoria<br>3. Sistema registra categoria |
| **Requisitos** | REQ-46 |

### UC-49: Registrar Informações do Material
| **Campo** | **Descrição** |
|-----------|---------------|
| **ID** | UC-49 |
| **Nome** | Registrar Informações do Material |
| **Ator Principal** | Administrador, Membro Autorizado |
| **Pré-condições** | UC-45 foi iniciado |
| **Pós-condições** | Informações do material são registradas |
| **Fluxo Principal** | 1. Usuário preenche título<br>2. Usuário preenche descrição<br>3. Sistema registra autor automaticamente<br>4. Sistema registra data de upload<br>5. Sistema valida dados |
| **Requisitos** | REQ-47 |

### UC-50: Editar Informações do Material
| **Campo** | **Descrição** |
|-----------|---------------|
| **ID** | UC-50 |
| **Nome** | Editar Informações do Material |
| **Ator Principal** | Administrador, Membro Autorizado |
| **Pré-condições** | Usuário está autenticado e material existe |
| **Pós-condições** | Informações do material são atualizadas |
| **Fluxo Principal** | 1. Usuário busca material<br>2. Usuário seleciona material<br>3. Sistema exibe informações atuais<br>4. Usuário edita título e/ou descrição<br>5. Usuário confirma alterações<br>6. Sistema valida dados<br>7. Sistema atualiza registro<br>8. Sistema exibe confirmação |
| **Requisitos** | REQ-51 |

### UC-51: Excluir Material
| **Campo** | **Descrição** |
|-----------|---------------|
| **ID** | UC-51 |
| **Nome** | Excluir Material |
| **Ator Principal** | Administrador |
| **Pré-condições** | Administrador está autenticado e material existe |
| **Pós-condições** | Material é removido do sistema |
| **Fluxo Principal** | 1. Administrador busca material<br>2. Administrador seleciona material<br>3. Administrador seleciona opção de excluir<br>4. Sistema solicita confirmação<br>5. Administrador confirma exclusão<br>6. Sistema remove arquivo e registro<br>7. Sistema exibe confirmação |
| **Fluxo Alternativo** | **5a.** Administrador cancela:<br>&nbsp;&nbsp;1. Sistema cancela operação |
| **Requisitos** | REQ-52 |

### UC-52: Listar Materiais
| **Campo** | **Descrição** |
|-----------|---------------|
| **ID** | UC-52 |
| **Nome** | Listar Materiais |
| **Ator Principal** | Membro do Laboratório |
| **Pré-condições** | Membro está autenticado |
| **Pós-condições** | Lista de materiais é exibida |
| **Fluxo Principal** | 1. Membro acessa módulo de conteúdo acadêmico<br>2. Sistema exibe lista de materiais<br>3. Sistema permite visualizar detalhes (UC-56) |
| **Extensões** | **2a.** Membro filtra por categoria (UC-53)<br>**2b.** Membro busca material (UC-54) |
| **Inclui** | UC-56 (Visualizar Detalhes do Material) |
| **Requisitos** | REQ-48, REQ-54 |

### UC-53: Filtrar por Categoria
| **Campo** | **Descrição** |
|-----------|---------------|
| **ID** | UC-53 |
| **Nome** | Filtrar por Categoria |
| **Ator Principal** | Membro do Laboratório |
| **Pré-condições** | UC-52 foi iniciado |
| **Pós-condições** | Lista filtrada é exibida |
| **Fluxo Principal** | 1. Membro seleciona categoria<br>2. Sistema aplica filtro<br>3. Sistema exibe materiais da categoria selecionada |
| **Estende** | UC-52 (Listar Materiais) |
| **Requisitos** | REQ-48 |

### UC-54: Buscar Material
| **Campo** | **Descrição** |
|-----------|---------------|
| **ID** | UC-54 |
| **Nome** | Buscar Material |
| **Ator Principal** | Membro do Laboratório |
| **Pré-condições** | UC-52 foi iniciado |
| **Pós-condições** | Resultados da busca são exibidos |
| **Fluxo Principal** | 1. Membro digita termo de busca (título ou palavra-chave)<br>2. Sistema realiza busca<br>3. Sistema exibe resultados |
| **Estende** | UC-52 (Listar Materiais) |
| **Requisitos** | REQ-49 |

### UC-55: Fazer Download de Material
| **Campo** | **Descrição** |
|-----------|---------------|
| **ID** | UC-55 |
| **Nome** | Fazer Download de Material |
| **Ator Principal** | Membro do Laboratório |
| **Pré-condições** | Membro está autenticado |
| **Pós-condições** | Material é baixado |
| **Fluxo Principal** | 1. Membro seleciona material<br>2. Membro clica em download<br>3. Sistema verifica autenticação<br>4. Sistema disponibiliza arquivo<br>5. Membro baixa arquivo |
| **Requisitos** | REQ-50, REQ-54 |

### UC-56: Visualizar Detalhes do Material
| **Campo** | **Descrição** |
|-----------|---------------|
| **ID** | UC-56 |
| **Nome** | Visualizar Detalhes do Material |
| **Ator Principal** | Membro do Laboratório |
| **Pré-condições** | UC-52 foi iniciado |
| **Pós-condições** | Detalhes do material são exibidos |
| **Fluxo Principal** | 1. Membro seleciona material<br>2. Sistema exibe título e descrição<br>3. Sistema exibe categoria<br>4. Sistema exibe autor e data de upload<br>5. Sistema exibe tamanho do arquivo |
| **Requisitos** | REQ-48, REQ-49 |

---

## Resumo Quantitativo

| **Módulo** | **Quantidade de Casos de Uso** | **Requisitos Cobertos** |
|------------|-------------------------------|------------------------|
| Landing Page Pública | 9 | REQ-01 a REQ-10 |
| Autenticação e Controle de Acesso | 8 | REQ-11 a REQ-20 |
| Gerenciamento de Pessoas | 12 | REQ-21 a REQ-30 |
| Controle de Patrimônio | 15 | REQ-31 a REQ-42 |
| Gestão de Conteúdo Acadêmico | 12 | REQ-43 a REQ-54 |
| **Total** | **56** | **54 requisitos** |

---

## Matriz de Rastreabilidade (Casos de Uso × Requisitos)

| **Caso de Uso** | **Requisitos Atendidos** |
|-----------------|-------------------------|
| UC-01 | REQ-01 |
| UC-02 | REQ-02 |
| UC-03 | REQ-03 |
| UC-04 | REQ-04 |
| UC-05 | REQ-05 |
| UC-06 | REQ-06 |
| UC-07 | REQ-07 |
| UC-08 | REQ-08 |
| UC-09 | REQ-09 |
| UC-10 | REQ-11, REQ-12, REQ-13, REQ-19 |
| UC-11 | REQ-13 |
| UC-12 | REQ-14, REQ-15 |
| UC-13 | REQ-15 |
| UC-14 | REQ-16 |
| UC-15 | REQ-19 |
| UC-16 | REQ-20 |
| UC-17 | REQ-17, REQ-18 |
| UC-18 | REQ-21, REQ-22, REQ-23, REQ-24, REQ-25 |
| UC-19 | REQ-21 |
| UC-20 | REQ-22 |
| UC-21 | REQ-23 |
| UC-22 | REQ-24 |
| UC-23 | REQ-25 |
| UC-24 | REQ-26 |
| UC-25 | REQ-27 |
| UC-26 | REQ-28 |
| UC-27 | REQ-28 |
| UC-28 | REQ-29 |
| UC-29 | REQ-30 |
| UC-30 | REQ-31, REQ-32, REQ-33, REQ-34, REQ-35, REQ-36 |
| UC-31 | REQ-31 |
| UC-32 | REQ-32 |
| UC-33 | REQ-33 |
| UC-34 | REQ-34 |
| UC-35 | REQ-35 |
| UC-36 | REQ-36 |
| UC-37 | REQ-37 |
| UC-38 | REQ-38 |
| UC-39 | REQ-39 |
| UC-40 | REQ-39 |
| UC-41 | REQ-40 |
| UC-42 | REQ-41 |
| UC-43 | REQ-41 |
| UC-44 | REQ-42 |
| UC-45 | REQ-43, REQ-44, REQ-45, REQ-46, REQ-47 |
| UC-46 | REQ-44 |
| UC-47 | REQ-45 |
| UC-48 | REQ-46 |
| UC-49 | REQ-47 |
| UC-50 | REQ-51 |
| UC-51 | REQ-52 |
| UC-52 | REQ-48, REQ-54 |
| UC-53 | REQ-48 |
| UC-54 | REQ-49 |
| UC-55 | REQ-50, REQ-54 |
| UC-56 | REQ-48, REQ-49 |
