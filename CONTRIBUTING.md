# Guia de Contribuição para o UnBrake

## Como contribuir

Você pode contribuir com o projeto de várias formas: complementando a
documentação, reportando bugs, adicionando funcionalidades, consertando bugs
ou revisando PRs.

O primeiro passo é consultar nossas
[issues](https://github.com/fga-eps-mds/2019.1-unbrake/issues) e
[pull requests](https://github.com/fga-eps-mds/2019.1-unbrake/pulls)
em aberto.

Não há restrições entre issues reservadas para a equipe principal para
desenvolvedores e comunidade.

### Como utilizar as issues

Para acompanhar todo o projeto a UnBrake usa issues de tarefas. Para criar essas
issues de forma fácil nós disponibilizamos um template no próprio github,
responda todas as questões do template e continue o trabalho.

Além disso todas as *issues* devem ter:

* Todas as decisões, links, imagens e conversas relacionadas a *issue* em seu conteúdo.
* Sempre deve haver uma pessoa assinada a uma *issue*
* Utiliza *labels* para acompanhamento

Apenas as *issues* de tarefas devem ter:

* Um épico
* Uma estimativa
* *Milestone* associada

### Criando suas branches

O primeiro passo para criar sua branch é definir um nome para ela, o padrão
adotado pelo projeto é:

Nosso repositório segue alguns padrões para as issues:

* Nomes em portuguès
* São relacionadas a issues abertas
* Padrão de nome no seguinte formato: <número da issue>-<titulo>-<da>-<issue>

#### Propondo mudanças

Nesse ponto estamos considerando que você já tem uma issue e um branch para sua
tarefa, uma fez que sua tarefa está pronta, testada e validada agora é hora de
realizarmos um *pull request*.

Via github inicie o *pull request* utilizando o template fornecido, após isso as
ferramentas de análise automática entram em ação e avaliam se sua contribuição
está correta com relação a vários aspectos (estilo, linting, testes).
Se a build da integração contínua for aprovada, não haja conflitos e sua branch
esteja atualizada, o PR estará pronto para revisão de código por algum
contribuidor.

## Guia de Desenvolvimento
### Subindo parte Web localmente

*Todos os comandos incluem o comando de build para envitar erros de iniciante
mas não é necessário em todas as execuções

A aplicação pode ser executada localmente com o seguinte comando na raiz do repositório:

``` bash
sudo docker-compose up --build
```

ou os serviços podem ser executados individualmente:

``` bash
# Serviços disponíveis atualmente: frontend e api
sudo docker-compose up --build frontend
```

### Executando checagens de código

Desde que o serviço do frontend já tenha sido construído
(build executado pelo menos uma vez) no ambiente do usuário, algumas checagens
serão executadas através de _git hooks_.

Como comportamento _pre-commit_, são executados os seguintes scripts: `fix`,
`check_lint` e `check_format`, sem ser necessário nenhuma configuração ou
execução manual de comandos por parte do usuário, tanto no frontend quanto na API.

Como _pre-push_, o comportamento difere um pouco entre o frontend e a API, no
frontend são executados os testes e na API, além dos testes, a checagem padrão
do django (script `check`). Da mesma forma que antes do commit, são executados
sem ser necessário comandos por parte do usuário.

Caso alguma das checagens falhe, antes do commit ou antes do push, o
procedimento é abortado. Como isso é feito através de _git hooks_, é possível
evitar as checagens utilizando-se a flag `--no-verify` nos comandos do git,
**embora isso seja altamente desencorajado**.

#### Frontend

##### Scripts disponíveis (frontend)

* **check_all:** Executa todos os outros scripts de checagem em sequência,
  na checagem de testes é executado o com coverage sem html
* **check_lint**: Checa por erros apontados pelo linter `eslint`
* **check_format**: Checa por erros de formatação apontados pelo `prettier`
* **check_tests**: Checa se todos os testes estão passando sem warnings ou
  mensagens de console utilizando o `jest`
* **check_tests:coverage**: Executa o que o check_tests faz, mas também
  gera arquivos de coverage para análise
* **check_tests:coverage:html**:  Executa o que o check_tests faz, mas gera
  o relatório em HTML sobre as estatísticas de testes
* **fix**: Corrige automaticamente erros de formatação possíveis de serem
  consertados pelo `eslint` e pelo `prettier`

##### Execução de um script (frontend)

Uma das possíveis formas de se executar os scripts no
frontend é executando o seguinte comando:

``` bash
# 'npm' é o entrypoint
$ sudo docker-compose run --rm frontend run [nome_do_script]
```

#### API

##### Scripts disponíveis (API)

* **check_all:** Todos os outros scripts de checagem são executados
  em sequência, na checagem de testes é executado o com coverage sem html
* **check:** Executa checagem padrão do django por erros em geral
* **check_lint**: Checa por erros apontados pelo linter `pylint`
* **check_format**: Checa por erros de formatação apontados pelo `flake8`
  ou falta de execução do `autopep8`
* **check_tests**: Checa se todos os testes estão passando, utilizando o `pytest`
* **check_tests_coverage**: Executa o que o check_tests faz, mas também gera
  arquivos de coverage para análise
* **check_tests_coverage_html**:  Executa o que o check_tests faz, mas gera o
  relatório em HTML sobre as estatísticas de testes
* **fix**: Corrige automaticamente erros de formatação possíveis de serem
  consertados pelo `autopep8`

##### Execução de um script (API)

Uma das possíveis formas de se executar os scripts da API
  é executando o seguinte comando:

``` bash
# 'manage.py' é o entrypoint
$ sudo docker-compose run --rm api [nome_do_script]
```

#### Local

A parte local funciona diferente das outras, como o entrypoint `go` não é
personálizável, optamos por deixar transparente ao desenvolvedor a
utilização do docker. Então o usuário já executa diretamente o script
que quer sem fazer chamadas explícitas ao docker e ação desejada
continua sendo executada num container.

##### Scripts disponíveis (Local)
_Todos os comandos estão relativos a pasta `unbrake-local`_
_Se a execução estiver demorando muito, pode ser que o container esteja sendo baixado,
para acompanhar o progresso, é possível executar o comando `sudo docker pull unbrake/local` separadamente_

* **./scripts/run**: equivalente a se chamar `go` porém é executado dentro do container
* **./scripts/compile**: gera o binário da parte local para Windows e Linux
* **./scripts/check_all**: executa o `check_format`, `check_lint` e `check_tests_coverage`
* **./scripts/check_format**: checa se a formatação do código está de acordo com a comunidade
* **./scripts/check_lint**: checa por erros gerais no código
* **./scripts/check_tests**: checa se os testes estão passando
* **./scripts/check_tests_coverage**: checa se os testes estão passando e da informações de cobertura
* **./scripts/check_tests_coverage_html**: checa se os testes estão passando e gera informações de cobertura em html
* **./scripts/fix**: corrige erros fáceis de serem automaticamente corrigidos


#### CodeClimate CLI

O codeclimate irá checar algumas coisas já checadas localmente e outras
menos importantes, que só serão exigidas de serem consertadas antes do
do pull request, ao invés de em cada commit.
Para executar as ferramentas do codeclimate localmente, execute o seguinte comando:

``` bash
sudo docker-compose run -e CODECLIMATE_CODE=${PWD} --rm codeclimate analyze
```

Nesse caso foi usado o comando `analyze`, a lista completa de comandos
pode ser encontrada [aqui](/codeclimate/codeclimate#commands),
ou então executando o serviço disponível no docker-compose sem passar nenhum
comando em específico.

### Scripts úteis

Existem alguns scripts úteis para realizar debug e/ou auxiliar no desenvolvimento na pasta `utils` na raiz do projeto.

**Não esquecer de instalar as dependências necessárias para o script que irá utilizar**

#### Scripts disponíveis (utils)

##### get_mqtt_data

Obtém todos os dados enviados em subchannels de unbrake/galpao/

**Exemplo de uso:**
``` sh
MQTT_KEY='minhakeyquetempermissãodefazeroqestoutentando' MQTT_HOST='unbrake-hom.ml' python3 get_mqtt_data.py
```

##### get_mqtt_data

Envia dados aleatórios simulando dados de todos os principais sensores abrangidos pela aplicação

**Exemplo de uso:**
``` sh
MQTT_KEY='minhakeyquetempermissãodefazeroqestoutentando' MQTT_HOST='unbrake.ml' python3 send_mqtt_mock_data.py
```
