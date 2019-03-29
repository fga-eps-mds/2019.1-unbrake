Title: Cenários do UnBrake
Date: 2018-03-29 23:03
Category: Requisitos

**Título** | <a name= "enviando_calibracao"> Enviando um arquivo de calibração/configuração </a>
-- | --
**Objetivo** | Fluxo para enviar uma pre-configuração via arquivo
**Contexto** | Inicio da configuração de um experimento
**Autores**  | Usuário
**Recurso** | Acesso ao sistema
**Episódios** | O usuário clica para enviar o arquivo de configuração, a caixa de seleção abre, o usuário realiza o upload do arquivo.
**Exceção** |

**Título** | <a name= "iniciando_experiemnto"> Iniciando um experimento </a>
-- | --
**Objetivo** | Iniciando uma análise de um freio
**Contexto** | Iniciando um experimento
**Autores**  | Usuário
**Recurso** | Acesso ao sistema
**Episódios** | O usuário [envia um arquivo de calibração e configuração](#enviando_calibracao)[1], o arquivo passa por uma validação e após isso o experimento vai para a fila.
**Exceção** | [1] caso o arquivo esteja inválido um erro será apresentado
