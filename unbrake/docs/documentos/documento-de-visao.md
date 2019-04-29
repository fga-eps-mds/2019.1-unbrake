# Documento de Visão

## Sumário

[1. Introdução](#1-Introdução)

[2. Posicionamento](#2-Posicionamento)

[3. Descrição dos Envolvidos e dos Usuários](#3-Descrição-dos-Envolvidos-e-dos-Usuários)

[4. Visão Geral do Produto](#4-Visão-Geral-do-Produto)

[5. Recursos do Produto](#5-Recursos-do-Produto)

[6. Restrições](#6-Restrições)

[7. Requisitos não funcionais](#7-Requisitos-não-funcionais)

[8. Referências Bibliográficas](#8-Referências-Bibliográficas)

-----------------------------------------

### 1. Introdução

#### 1.1 Visão Geral

Este documento visa o esclarecimento do projeto expondo a forma com que este software de controle de um simulador de frenagem será desenvolvido e o que se espera de seu estado como produto final. 

#### 1.2 Escopo
Hodiernamente, a Universidade de Brasília - Campus Gama tem como uma de suas dependências o Galpão - FGA no qual se encontram os principais laboratórios de Engenharia Automotiva. Dentre as diversas tecnologias e ferramentas que se situam no Galpão exite um simulador de freio, o qual é o cerne do projeto em questão.

O simulador de freio consiste em um equipamento mecânico envolvendo um motor, uma roda, um freio e um equipamento para liberar água, além dos equipamentos eletrônicos utilizados para a retirada de dados do mesmo. Sendo assim, esse simulador, munido de instruções previamente dadas ao software atual, gera uma rotina de execução chamadas de Snubs, tendo cada Snub vários parâmetros. Após finalizar as Snubs, é gerado um relatório com os dados para a análise do usuário.

Apesar do software atual conseguir realizar a simulação e gerar o devido relatório, ele sofre de alguns problemas, como não possuir usuário secundário com restrições de acesso, não possui banco de dados para armazenamento de configurações, calibração e histórico de simulaçoes com os seus devidos relatórios e também é possível acessar este sistema apenas localmente.

Com isso, a solução proposta é uma aplicação web, o UnBrake, para o fornecimento de dados e envio da rotina programável ao simulador de freio com uma interface intuitiva para mais fácil análise dos dados, além de também resolver todas as limitações do software atual.

### 2. Posicionamento

#### 2.1 Oportunidade de Negócios

Sabendo-se da necessidade de validar e estudar sistemas de frenagem em projetos automotivos, a **UnBrake** representa uma solução de baixo custo para instituições de ensino técnico e superior. Por se tratar de uma aplicação adapatável, nosso software pode ser modificado para atender as especificações de hardware apresentas pelo clente.

#### 2.2 Descrição do Problema

<table style="width:100%">
    <tr>
        <td align="right"><b>O problema é</b></td>
        <td align="left"><b>a dificuldade em enviar e receber informações sobre os procedimentos realizados durante um ensaio de frenagem, utilizando uma bancada automatizada, e produzir um relatório com os dados adquiridos</b></td>
    </tr>
    <tr>
    <td align="right"><b>que afeta</b></td>
    <td align="left">os alunos e professores do curso de Engenharia Automotiva da Universidade de Brasília - Campus Gama</td>
    </tr><tr>
    <td align="right"><b>cujo impacto é</b></td>
    <td align="left">impossibilitar estudos mais aprofundados sobre sistemas de frenagem e seu comportamento em diferentes situações</td>
    </tr><tr>
    <td align="right"><b>uma boa solução seria</b></td>
    <td align="left">uma plataforma que enviasse as requisições de testes para o sistema automatizado, recebesse as leiturar dos sensores e gerasse relatórios condizentes com o ensaio realizado</td>
    </tr>
</table>


#### 2.3 Instrução de Posição do Produto

**Para** | os alunos de gradução e pós-graduação e professores do curso de Engenharia Automotiva da Universidade de Brasília
--: | :--
**que** | tem enteresse em realizar estudos relacionados a frenagem em sistemas automotivos
**a** | **UnBrake** é uma plataforma web
**que** | desponibiliza uma interface simples e intuitiva para que os ensaios sejam realizados, e os devidos dados desponibilizados para o usuário
**diferente de** | soluçoes temporárias criadas pelos professores
**nosso produto** | apresenta uma interface de fácil utilização, armazena os dados coletados durante os ensaios em um banco de dados e possibilita que os testes sejam feitos remotamente

### 3. Descrição dos Envolvidos e dos Usuários

#### 3.1 Resumo da Parte Interessada

 Nome     | Representa   | Função 
 :--------: | :--------:     | :--------: 
Equipe de desenvolvimento | Alunos matriculados na disciplina de Métodos de Desenvolvimento de Software | Desenvolver, testar e implantar o software com os requisitos apresentados neste documento
Equipe de Gestão do Projeto | Alunos matriculados na matéria de Engenharia de Produto de Software | Planejar, organizar e supervisionar o desenvolvimento do software. Identificar e solucionar problemas durante o processo
Cliente | Professores e alunos envolvidos em projetos relacionados a ensaios de frenagem automotiva | Apresentar os requisitos que devem ser atendidos pelo software

#### 3.2 Resumo do Usuário

Nome | Descrição
:----: | :----:
Comunidade acadêmica | Pessoa que realizará os ensaios de frenagem e gerará os devidos relatórios
Administrador da plataforma | Pessoa que terá liberdade de modificar os arquivos padrão utilizados como parâmetros dos ensaios

#### 3.3 Ambiente do Usuário

O UnBrake será uma plataforma web, voltada para o uso em desktop ou notebook, ainda assim, a plataforma é responsiva, é possível que o acesso seja feito por um aparelho mobile, mas, faze-lo pode prejudicar a plena experiência do usuário. Existirão áreas restritas, onde, apenas usuários com username e senha cadastrados terão livre acesso.

#### 3.4 Perfil dos Envolvidos

##### 3.4.1 Equipe de Desenvolvimento

<table style="width:100%">
    <tr>
        <td align="center"><b>Representantes</b></td>
        <td align="center">Gabriel Marques Tiveron<br>Letícia Karla Araújo<br>Lucas Medeiros Rosa<br>Tiago Miguel Caitano<br>Victor Levi Peixoto</td>
    </tr>
    <tr>
        <td align="center"><b>Descrição</b></td>
        <td align="center">Desenvolvedores</td>
    </tr>
    <tr>
        <td align="center"><b>Tipo</b></td>
        <td align="center">Estudantes da Universidade de Brasília, cursando Engenharia de Software, matriculados na disciplina de Métodos de Desenvolvimeto de Software</td>
    </tr>
    <tr>
        <td align="center"><b>Responsabilidades</b></td>
        <td align="center">Desenvolver, testar, implementar e implantar a plataforma</td>
    </tr>
    <tr>
        <td align="center"><b>Cretérios de Sucesso</b></td>
        <td align="center">Terminar o software no tempo estipulado e com todos os requisitos corretamente implementedos e operantes</td>
    </tr>
    <tr>
        <td align="center"><b>Envolvimento</b></td>
        <td align="center">Alto</td>
    </tr>
    <tr>
        <td align="center"><b>Comentários ou Problemas</b></td>
        <td align="center">Pouco domínio das tecnologias aplicadas no desenvolvimento do software, assim como as ferramentas utilizadas para o controle de qualidade dos códigos</td>
    </tr>
</table>

##### 3.4.2 Equipe de Gestão do Projeto

<table style="width:100%">
    <tr>
        <td align="center"><b>Repesentantes</b></td>
        <td align="center">Ícaro Pires de Souza Aragão<br>Felipe Borges de Souza Chaves<br>João Robson<br>Vinicius Lima</td>
    </tr>
    <tr>
        <td align="center"><b>Descrição</b></td>
        <td align="center">Gestão do Projeto</td>
    </tr>
    <tr>
        <td align="center"><b>Tipo</b></td>
        <td align="center">Estudantes da Universidade de Brasília, cursando Engenharia de Software, matriculados na disciplina de Engenharia de Produto de Software</td>
    </tr>
    <tr>
        <td align="center"><b>Responsabilidades</b></td>
        <td align="center">Realizar o planejamento, monitorar e guiar o projeto, conciliar conflitos e auxiliar a equipe de desenvolvimento</td>
    </tr>
    <tr>
        <td align="center"><b>Critérios de Sucesso</b></td>
        <td align="center">Dividir o projeto em entregáveis e atribui-los a equipe de forma que os prazos sejam cumpridos. Avaliar o trabalho realizado pela equipe de Desenvolvimento, mantendo-se o padrão de qualidade do projeto segundo as metodologias de desenvolvimento</td>
    </tr>
    <tr>
        <td align="center"><b>Envolvimento</b></td>
        <td align="center">Alto</td>
    </tr>
    <tr>
        <td align="center"><b>Comentários ou problemas</b></td>
        <td align="center">Conciliar a falta de domínio técnico da equipe de desenvolvimento com a necessidade de entregas constantes para que os prazos sejam cumpridos</td>
    </tr>
    
</table>

##### 3.4.3 Gerenciadores da plataforma



| Repesentantes | Descrição |
| :--------: | :--------: |
| Descrição | Professor responsável pelo simulador de frenagem do galpão |
| Tipo | Designar os principais requisitos e as informações para elaboração do software |
| Critérios de sucesso | Ao final do processo, ter disponível uma aplicação que realize os testes no simulador e realize a apresentação de formulários e gráficos através das informações obtidas |
| Envolvimento | Alto |
| Comentários ou problemas | Devido a complexidade da aplicação, a uma expectativa que consiga aplicar ao sistema todas as funcionalidades planejadas |


#### 3.5 Perfis dos Usuários
##### 3.5.1 Administrador da Plataforma

<table style="width:100%">
    <tr>
        <td align="center"><b>Representantes</b></td>
        <td align="center">Evandro ou outra pessoa indicada por ele</td>
    </tr>
    <tr>
        <td align="center"><b>Tipo</b></td>
        <td align="center">Usuário com conhecimento sobre o projeto e o software para auxiliar os demais usuários a utilizar o software</td>
    </tr>
    <tr>
        <td align="center"><b>Responsibilidades</b></td>
        <td align="center">Monitorar e auxiliar a equipe</td>
    </tr>
    <tr>
        <td align="center"><b>Critérios de Sucesso</b></td>
        <td align="center">Os usuários conseguirem utilizar o software</td>
    </tr>
    <tr>
        <td align="center"><b>Envolvimento</b></td>
        <td align="center">Alto</td>
    </tr>
    <tr>
    <td align="center"><b>Comentários ou problemas</b></td>
        <td align="center">Possível sobrecarga do administrador</td>
    </tr>
    
</table>

##### 3.5.2 Comunidade Acadêmica

<table style="width:100%">
    <tr>
        <td align="center"><b>Representantes</b></td>
        <td align="center">Alunos de graduação ou pós-graduação, professores envolvidos no simulador de frenagem</td>
    </tr>
    <tr>
        <td align="center"><b>Tipo</b></td>
        <td align="center">Usuários que desejam utilizar os dados gerados para pesquisas, projetos e disciplinas</td>
    </tr>
    <tr>
        <td align="center"><b>Responsibilidades</b></td>
        <td align="center">Simular a frenagem</td>
    </tr>
    <tr>
        <td align="center"><b>Critérios de Sucesso</b></td>
        <td align="center">Ter uma análise clara da frenagem. Tendo como base os dados obtidos e o gráfico</td>
    </tr>
    <tr>
        <td align="center"><b>Envolvimento</b></td>
        <td align="center">Médio</td>
    </tr>
    <tr>
    <td align="center"><b>Comentários ou problemas</b></td>
        <td align="center">Falta de compreensão dos resultados apresentados</td>
    </tr>
    
</table>


#### 3.6 Principais necessidades dos Usuários ou dos Envolvidos


|Necessidade | Solução atual | Solução proposta |
| :--------: | :--------: | :--------: |
|Ter uma interface que auxilie os usufruidores do simulador de frenagem a interagirem com o mesmo. Recebendo os dados do simulador e expondo-os.|  O projeto Unbrake visa realizar essa correlação entre o simulador de frenagem e a participação do usuário.  |   Realizar um software que recebesse as informações geradas pelo simulador e apresentá-las para o usuário.  |

#### 3.7 Alternativas e Concorrência

<p align="justify">Por se tratar de um projeto com requisitos e aplicações muito específicas, não há conhecimento de outras plataformas que apresentem um grau considerável de concorrência com o software descrito neste documento.
</p>

### 4. Visão Geral do Produto
#### 4.1 Perspectiva do Produto

O produto irá auxiliar alunos e professores, de graduação e pós-graduação, a realizar e analisar testes de frenagem em sistemas automotivos

#### 4.2 Recursos do produto

| Benefícios para o Cliente  | Recursos de Suporte | 
| :--------: | :--------: |
| Sistema que impõem poucas dificuldades tecnicas | Interface direta e intuitiva |
| Testes realizados podem ser compartilhados dentro da comunidade | Banco de dados compartilhado entre os usuários, com parâmetros e resultados dos testes |
| Personalizar o testes de acordo com as necessidades do usuário | Possibilidade de alterar os parâmetros utilizados durantes os testes  |
| Capacidade de realizar os testes remotamente | Por se tratar de um plataforma web não existe a obrigatoriedade de que o teste seja feito presencialmente

### 5. Recursos do Produto

O sistema irá oferecer as seguintes funcionalidades para o usuário:

*  **Calibração:** Esta funcionalidade permite ao usuário realizar a calibração do sistema de simulação;
*  **Configuração:** Esta funcionalidade permite ao usuário inserir as informações de cada teste;
*  **Iniciar simulação:** Esta funcionalidade irá iniciar o teste de acordo com as informações do usuário;
*  **Análise:** Esta funcionalidade permite ao usuário realizar a visualização dos testes realizados no sistema;
*  **Filtro de testes:** Esta funcionalidade permite ao usuário realizar filtros entre testes já realizados de acordo com a data de realização e por parâmetros do arquivo de configuração.

| Funcionalidade | Benefícios |
| :--------: | :--------: |
| Calibração | O usuário podera subir um arquivo para o sistema com as calibrações pré definidas ou também utilizar uma calibração ja cadastrada no sistema |
| Configuração | O usuário podera subir um arquivo para o sistema um arquivo com as calibrações pré definidas ou também utilizar uma configração ja cadastrada no sistema |
| Iniciar simulação | Permite ao usuário iniciar o teste através de um simples clique em um botão |
| Análise | Permite ao usuário consultar facilmente todos os testes já realizados no sistema |
| Filtro de testes | O usuário poderar localizar de maneira fácil um teste já realizado |


### 6. Restrições

#### 6.1 Restrições de Implementação
A implementação do software será realizada com a utilização de Go para a interpretação dos dados provenientes do simulador, Python e GraphQL para gerenciar a API que armazena as informações de rotinas de simulação e dados dos usuários e, por fim, JavaScript para a interface gráfica do projeto.

#### 6.2 Restrições de Design
É necessário o acesso a internet para a utilização so software, pois a comunicação com a API é crucial para a utilização do mesmo.

#### 6.3 Restrições Externas
O software está restrito ao uso conciliado à bancada de freio localizada no Galpão - FGA, sendo assim, deve-se também ter um conhecimento prévio sobre o simuladra que possa manusear o sistema.

### 7. Requisitos não Funcionais

#### 7.1 Requisitos de Suportabilidade
* O software desenvolvido deve poder ser utilizado em qualquer navegador moderno.

#### 7.2 Requisitos de Design
* O sistema deve ter uma interface organizada e intuitiva suficiente para o uso adequado. Por conseguinte, a aplicação precisa ter uma boa usabilidade. 

#### 7.3 Requisitos de Segurança
* O sistema utiliza a autenticação de usuários via token armazenado em cookies, para garantir a segurança de acesso e dados de usuários.
* O sistema garante que os dados enviados não danifiquem o sistema mecânico vigente no projeto.

#### 7.4 Requisitos de Desempenho
* O sistema deverá ter uma resposta rápida às requisições dos usuários.
### 8. Referências Bibliográficas

*Guia Auxiliar do Documento de Visão.*  Disponível em: https://www.ibm.com/support/knowledgecenter/pt-br/SSYMRC_6.0.5/com.ibm.rational.rrm.help.doc/topics/r_vision_doc.html. Acesso em 25 de março de 2019 ás 20:50.

_Guia de Professores FGA_.  Disponível em: https://fga.unb.br/evandro.teixeiraa Acesso em 27 de março de 2019 ás 23:42.

_Guia de Estrutura FGA_.  Disponível em: https://fga.unb.br/guia-fga/estrutura Acesso em 27 de março de 2019 ás 02:32.