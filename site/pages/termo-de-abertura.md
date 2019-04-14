Title: Termo de Abertura
Date: 2019-04-02 19:33
Category: Engenharia de Produto

## 1. Introdução
Este documento abordará os objetivos, descrição geral, propósito e justificativa, requisitos de alto nível e partes interessadas do projeto.

## 2. Descrição geral do UnBrake
O UnBrake é um sistema que tem como finalidade configurar, calibrar, testar e analisar o sistema de frenagem desenvolvido por alunos da engenharia automotiva em conjunto com alunos da engenharia eletrônica.

## 3. Propósito e Justificativa
Atualmente, a interação com o sistema embarcado de aquisição e comando do sistema de frenagem é feita através de um software desenvolvido na plataforma LabView. O UnBrake surge para melhorar o interfaceamento entre o usuário e o sistema de frenagem, além de prover a estrutura necessária para fazer persistência em banco de dados de testes realizados, controle de usuário e também validação de dados de entrada para uso apropriado do sistema.

## 4. Objetivos
O objetivo do UnBrake é poder ajudar usuários a realizarem testes no sistema de frenagem de maneira fácil e segura. Além disso, seus objetivos também incluem: possibilitar o rastreamento de pessoas responsáveis por testes já realizados e analisar os dados coletados pelo sistema embarcado de aquisição e comando do sistema de frenagem.

## 5. Requisitos de alto nível
O UnBrake é composto de 4 grandes módulos: configuração, calibração, ensaio e análise.

### 5.1 Configuração
O módulo de configuração é responsável por definir variáveis de entrada que controlarão a máquina de estado responsável por um ciclo (snub) de teste do sistema. Além disso, nesse módulo são especificados também o arquivo de configuração e calibração que serão utilizados.

### 5.2 Calibração
Este módulo é responsável pela definição dos fatores de conversão da corrente elétrica capturada na aquisição de variáveis de interesse durante um ensaio, tais como: temperatura e velocidade.

### 5.3 Ensaio
Módulo responsável pela validação dos arquivos de configuração e calibração que serão usados e início do ensaio enviando os comandos para o sistema embarcado.

### 5.4 Análise
Módulo responsável pela consulta de testes já realizados para análise de variáveis de interesse e comportamento do sistema de frenagem.

## 6. Partes Interessadas
Segue as principais partes interessadas no projeto

|               Integrante               |             Papel            |
|:--------------------------------------:|:----------------------------:|
|    Evandro Leonardo Silva Teixeira     |             Cliente          |
|        Carla Rocha Silva Aguiar        |           Orientadora        |
|    Vinicius Ferreira Bernardo de Lima  |     Engenheiro de Produto    |
|       João Robson Santos Martins       |          Scrum Master        |
|      Ícaro Pires de Souza Aragão       |             Devops           |
|     Felipe Borges de Souza Chaves      |            Arquiteto         |
|           Victor Levi Peixoto          |          Desenvolvedor       |
|           Lucas Medeiros Rosa          |          Desenvolvedor       |
|Letícia Karla Soares Rodrigues de Araújo|         Desenvolvedora       |
|     Tiago Miguel Caetano da Silva      |          Desenvolvedor       |
|         Gabriel Marques Tiveron        |          Desenvolvedor       |
