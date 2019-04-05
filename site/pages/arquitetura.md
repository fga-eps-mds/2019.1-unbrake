Title: Arquitetura do projeto
Date: 2018-4-2 21:11
Category: Arquitetura

## Documento de Arquitetura

Este documento tem como objetivo relatar de forma técnica o software utilizando várias visões da arquitetura do mesmo. Este documento é conhecido na literatura como *4+1 architecture blueprints*.

### Cenários

Os cenários estão escritos neste [documento]({filename}cenarios.md)

### Visão Lógica

#### Uma breve visão de nossa arquitetura

Nosso projeto está sendo modelado com uma arquitetura de microserviços que tem 4 serviços base:

* **Simulador:** Um servidor escrito em [golang](https://golang.org/) que é responsável tanto por receber os arquivos de configuração quanto de fornecer dados em *stream* para o requisitante.

* **API:** A API contém as regras de negócio do nosso sistema, ela recebe os arquivos de configuração e relaciona ele com os ensaios.

* **Usuários:** Serviço que guarda realiza a autenticação dos usuários.

* **Front-End:** A interface com o usuário do nosso sistema que usa todos os serviços anteriores.

#### Front End

Descrevam aqui o Front

#### API

Descreva aqui a api com diagrama de classes etc

#### Simulador

O serviço que tem contato com o simulador tem as seguintes funcionalidades:

* Recebe informações sobre o ensaio
* Realiza o controle de acesso ao simulador
* Realiza todas as validações necessárias no arquivo de configuração.
* Roda o ensaio recebendo as configurações ou os comandos interativos.
* Fornece os resultados realizando uma *stream* de dados para um determinado endereço



##### Autenticação de usuário

### Visão de Processo
### Visão de desenvolvimento

As interações entre os serviços estão representadas no diagram de componente abaixo.


### Visão física
