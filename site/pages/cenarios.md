Title: Cenários do UnBrake
Date: 2018-03-29 23:03
Category: Requisitos

**Título** | <a name= "enviando_calibracao"> Enviando um arquivo de calibração/configuração </a>
-- | --
**Objetivo** | Fluxo para enviar uma pre-configuração via arquivo
**Contexto** | Inicio da configuração de um experimento
**Autores**  | Usuário
**Recurso** | Acesso ao sistema
**Episódios** | O usuário clica para enviar o arquivo de configuração, a caixa de seleção abre, o usuário realiza o upload do arquivo. [1]
**Exceção** |O usuário pode usar o botão de emergencia para cancelar o experimento.

**Título** | <a name= "iniciando_experiemnto"> Iniciando um experimento </a>
-- | --
**Objetivo** | Iniciando uma análise de um freio
**Contexto** | Iniciando um experimento
**Autores**  | Usuário
**Recurso** | Acesso ao sistema
**Episódios** | O usuário [envia um arquivo de calibração e configuração](#enviando_calibracao)[1], o arquivo passa por uma validação e após isso o experimento vai para a fila de execução.
**Exceção** | [1] caso o arquivo esteja inválido um erro será apresentado

**Título** | <a name= "iniciando_experiemnto"> Experimento na fila de execução</a>
-- | --
**Objetivo** | Experimento esperando para ser executado na fila
**Contexto** | Experimento enviado
**Autores**  | Sistema
**Recurso** | Acesso ao sistema
**Episódios** | O experimento espera na fila de execução até ser executado pelo simulador
**Exceção** |

**Título** | <a name= "iniciando_experiemnto">Modo interativo</a>
-- | --
**Objetivo** | O usuário pode realizar operações com o simulador sem o uso de arquivos
**Contexto** | Programa aberto e calibração feita
**Autores**  | Usuário
**Recurso** | Acesso ao sistema
**Episódios** |O usuário seleciona cada operação que deseja trabalhar no simulador naquele momento [1]
**Exceção** | O usuário pode usar o botão de emergencia para cancelar a operação

**Título** | <a name= "iniciando_experiemnto">Cancelamento do experimento</a>
-- | --
**Objetivo** | Cancelar o experimento enquanto ele está sendo executado
**Contexto** | Experimento rodando
**Autores**  | Sistema e Usuário
**Recurso** | Acesso ao sistema
**Episódios** | O usuário pede para cancelar o ensaio em tempo de execução e o experimento e cancelado.
**Exceção** |
