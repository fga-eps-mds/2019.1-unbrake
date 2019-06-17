# UnBrake

<p align="center">
  <a href="https://travis-ci.com/fga-eps-mds/2019.1-unbrake" alt="Build Status" >
    <img src="https://travis-ci.com/fga-eps-mds/2019.1-unbrake.svg?branch=master" />
  </a>
  <a href="https://codeclimate.com/github/fga-eps-mds/2019.1-unbrake/maintainability" alt="Maintainability" >
    <img src="https://api.codeclimate.com/v1/badges/f8957e6e7e0bdced21c9/maintainability" />
  </a>
  <a href="https://codeclimate.com/github/fga-eps-mds/2019.1-unbrake/test_coverage" alt="Test Coverage" >
    <img src="https://api.codeclimate.com/v1/badges/f8957e6e7e0bdced21c9/test_coverage" />
  </a>
  <a href="https://goreportcard.com/report/github.com/fga-eps-mds/2019.1-unbrake" alt="Go Report Card" >
    <img src="https://goreportcard.com/badge/github.com/fga-eps-mds/2019.1-unbrake" />
  </a>
  <a href="https://bestpractices.coreinfrastructure.org/projects/2874" alt="CII Best Practices" >
    <img src="https://bestpractices.coreinfrastructure.org/projects/2874/badge" />
  </a>
</p>

<p align="center">
  <a href="https://github.com/fga-eps-mds/2019.1-unbrake/releases" alt="GitHub release" >
    <img src="https://img.shields.io/github/release-pre/fga-eps-mds/2019.1-unbrake.svg?label=pre-release" />
  </a>
  <a href="https://github.com/fga-eps-mds/2019.1-unbrake/releases" alt="GitHub release" >
    <img src="https://img.shields.io/github/release/fga-eps-mds/2019.1-unbrake.svg" />
  </a>
  <a href="https://godoc.org/github.com/fga-eps-mds/2019.1-unbrake/unbrake-local">
    <img src="https://godoc.org/github.com/fga-eps-mds/2019.1-unbrake/unbrake-local?status.svg" alt="GoDoc">
  </a>
  <a href="https://pullreminders.com?ref=badge" alt="pullreminders" >
    <img src="https://pullreminders.com/badge.svg" />
  </a>
</p>

## Utilizando a aplicação

Execute o binário
(checar [releases](https://github.com/fga-eps-mds/2019.1-unbrake/releases))
e acesse a interface da aplicação em https://unbrake.ml ou algum servidor local.

Se o binário estiver em execução, será adicionado um ícone na área de
notificações do seu sistema operacional, pelo qual é possível
interagir com a aplicação.

* **A aplicação não deve ser executada como root (administrador)!**

Problemas com a execução? Consulte o [troubleshooting](#troubleshooting)

### Interagindo com o módulo local

A aplicação irá iniciar e ficará esperando pela seleção de porta por parte
do usuário. No Windows serão listadas todas as portas seriais e no linux
apenas as que baterem com o seguinte padrão `/dev/ttyACM*` (é o padrão de nome
dado pelo Linux ao arduíno leonardo).

Se desejar utilizar uma porta não listada, você pode fazer isso via
[configuração](#configuração-do-módulo-local)

### Configuração do módulo local

As configurações podem ser feitas via arquivo de configuração e/ou variáveis
de ambiente.

O arquivo de configuração deve ser criado com o nome `config.json` em
`~/UnBrake/logs` no Linux e em `%APPDATA%/UnBrake/logs` no Windows.

Exemplo de arquivo de configuração:
``` json
{
    "serialPort": "/dev/ttyACM0",
    "mqttHost": "unbrake.ml",
    "mqttPort": "8080",
    "mqttKey": "minhachavecompermissãodeescrita",
    "mqttChannelPrefix": "unbrake/galpao"
}

```

* **serialPort**: nome/caminho da porta serial em que a placa está conectada.
Ex: `/dev/ttyACM0`, `COM1`.
* **mqttHost**: host do MQTT broker que será utilizado na comunicação
* **mqttPort**: porta na qual o MQTT broker está escutando
* **mqttKey**: chave do MQTT broker (emitter-io utilizado)
(pedir ao responsável pelo host)

Todos esses parâmetros também podem ser configurados através de variáveis
de ambiente apenas fazendo a alteração do nome do parâmetro de camelcase
para snake case e em caixa alta. Ex: `serialPort` se torna `SERIAL_PORT`.

As variáveis de ambiente tem precedência sobre o arquivo de configuração.
Caso a variável de ambiente não seja setada e nem haja arquivo de configuração,
serão usadas valores default onde possível.

### Logs

Todo o funcionamento da aplicação é registrado em arquivos de log.
No Linux eles são atualmente gravados em `~/UnBrake/logs`,
já no Windows em `%APPDATA%/UnBrake/logs`

### Troubleshooting

#### Problemas com a parte local

Antes de analisar as seguintes opções cheque o log para ter mais informações.

<details>
  <summary> Não tenho permissão nem de executar o binário </summary>
  <br>

  **Solução (Linux):** Provavelmente o binário está sem permissão de execução.
  Comando:
  ``` sh
  chmod +x unbrake
  ```
</details>

<details>
  <summary> Arquivo de log não aparece no lugar especificado </summary>
  <br>

  **Solução (Linux):** Executar sem sudo
</details>

<details>
  <summary> Log informa que tentou abrir arquivo que não foi encontrado </summary>
  <br>

  **Solução (Linux):**
  Você especificou o arquivo certo que referencia a placa? Ex: `/dev/ttyACM0`
</details>

<details>
  <summary> Log informa que não tenho permissões para abrir um arquivo </summary>
  <br>

  **Solução (Linux):**

  * Verifique a qual grupo o arquivo que representa sua placa pertence

  ``` sh
  $ ls -l /dev/ttyACM0
  crw-rw---- 1 root dialout 188, 0 5 apr 23.01 ttyACM0 # Saída
  ```
  Nesse exemplo o arquivo pertence ao grupo `dialout`
  _(No meu ambiente é `uucp` ao invés `dialout`)_

  * Adicione seu usuário ao grupo encontrado

  ``` sh
  # Trocar 'dialout' pelo grupo encontrado no comando anterior!
  sudo usermod -a $USER -G dialout
  ```

  * **Faça logout e login novamente no seu usuário para as alterações funionarem!!!**
  _(reiniciar também funciona)_

  _**OBS:** Esses passos não precisam ser executados sempre, apenas uma vez_

  Mais detalhes podem ser encontrados [aqui](https://www.arduino.cc/en/Guide/Linux)
</details>

<details>
  <summary> Minha placa não é reconhecida pelo meu Sistema Operacional </summary>
  <br>

  **Solução:** Consulte [aqui](https://www.arduino.cc/en/Guide/HomePage)
</details>

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
pode ser encontrada [aqui](https://github.com/codeclimate/codeclimate#commands),
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
