### O qué entendido como a função do Arquiteto do nosso projeto

O arquiteto do projeto tem a função de planejar e documentar os serviços que compõe o sistema. A documentação do arquiteto também está relacionada ao cenários de uso da aplicação, uma vez que é necessários entender as funcionalidades presentes na aplicação planejar as mesmas.

### Objetivos

* Documentar as decisões feitas pelo time
* Planejar a interação entre os serviços
* Revisar inconsistências na implementação da arquitura
* Analisar a viablidade de algumas tecnologias
* Se preciso escrever o core da aplicação para que seja evoluída posteriormente por outros membros

### Planejamento das metas por Sprint:

<table>
  <tr>
    <th colspan="2"><br>Release 1</th>
  </tr>
  <tr>
    <td>Sprint 0</td>
    <td>Reunião com cliente e coleta de requisitos</td>
  </tr>
  <tr>
    <td>Sprint 1</td>
    <td>Escrever cenários base do documento de arquitetura</td>
  </tr>
  <tr>
    <td rowspan="4">Sprint 2</td>
    <td>Template Inicial da arquitetura com as definições dos serviços</td>
  </tr>
  <tr>
    <td>Definição do protocolo de comunicação para gráficos real time</td>
  </tr>
  <tr>
    <td>Análise da viabilidade do uso do GraphQL</td>
  </tr>
  <tr>
    <td>Apresentar ao grupo como documentar decisões arquiteturais (Design Docs)</td>
  </tr>
  <tr>
    <td>Sprint 3</td>
    <td>Analisar a viabilidade da linguagem Go para o servidor que terá contato com o simulador</td>
  </tr>
  <tr>
    <td>Sprint 4</td>
    <td>Escrever MVP da comunicação serial com o simulador</td>
  </tr>
  <tr>
    <td rowspan="2">Sprint 5</td>
    <td>Completar as definições da arquitetura no documento inicial</td>
  </tr>
  <tr>
    <td>Documentar todas as decisões que foram feitas antes da definição dos Design Docs</td>
  </tr>
  <tr>
    <th colspan="2"> Release2</th>
  </tr>
  <tr>
    <td><br>Sprint 6</td>
    <td>Realizar Inspeção dos cenários</td>
  </tr>
  <tr>
    <td><br>Sprint 7</td>
    <td>Separar serviço de autenticação da API</td>
    <td>Levantar tarefas necessarias para integração com o novo serviço</td>
  </tr>
  <tr>
    <td>Sprint 9</td>
    <td>Adicionar suporte ao consul nos modulos</td>
  </tr>
</table>
