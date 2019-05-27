# UnBrake

[![Build Status](https://travis-ci.com/fga-eps-mds/2019.1-unbrake.svg?branch=master)](https://travis-ci.com/fga-eps-mds/2019.1-unbrake)
[![Maintainability](https://api.codeclimate.com/v1/badges/f8957e6e7e0bdced21c9/maintainability)](https://codeclimate.com/github/fga-eps-mds/2019.1-unbrake/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/f8957e6e7e0bdced21c9/test_coverage)](https://codeclimate.com/github/fga-eps-mds/2019.1-unbrake/test_coverage)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![pullreminders](https://pullreminders.com/badge.svg)](https://pullreminders.com?ref=badge)

## Utilizando a aplicação

Execute o binário (checar [releases](https://github.com/fga-eps-mds/2019.1-unbrake/releases)) e acesse
a interface da aplicação em https://unbrake.ml ou algum servidor local.

Se o binário estiver em execução, será adicionado um ícone na área de notificações do seu sistema operacional, pelo qual
é possível interagir com a aplicação.

* **A aplicação não deve ser executada como root (administrador)!**

Problemas com a execução? Consulte o [troubleshooting](#troubleshooting)

### Variáveis de ambiente

Atualmente as seguintes variáveis de ambiente são relevantes para a aplicação:

* **SIMULATOR_PORT**: nome/caminho da porta serial em que a placa está conectada. Ex: `/dev/ttyACM0`, `COM1`.

### Logs

Todo o funcionamento da aplicação é registrado em arquivos de log. No Linux eles são atualmente gravados em `~/UnBrake/logs`,
já no Windows em `%APPDATA%/UnBrake/logs`

### Troubleshooting

#### Problemas com a parte local

Antes de analisar as seguintes opções cheque o log para ter mais informações.

<details>
  <summary> Não tenho permissão nem de executar o binário </summary>
  <br>

  **Solução (Linux):** Provavelmente o binário está sem permissão de execução. Comando:
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

  **Solução (Linux):** Você especificou o arquivo certo que referencia a placa? Ex: `/dev/ttyACM0`
</details>

<details>
  <summary> Minha placa não é reconhecida pelo meu Sistema Operacional </summary>
  <br>

  **Solução:** Consulte [aqui](https://www.arduino.cc/en/Guide/HomePage)
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
  Nesse exemplo o arquivo pertence ao grupo `dialout` _(No meu ambiente é `uucp` ao invés `dialout`)_

  * Adicione seu usuário ao grupo encontrado

  ``` sh
  # Trocar 'dialout' pelo grupo encontrado no comando anterior!
  sudo usermod -a $USER -G dialout
  ```

  * **Faça logout e login novamente no seu usuário para as alterações funionarem!!!** _(reiniciar também funciona)_

  _**OBS:** Esses passos não precisam ser executados sempre, apenas uma vez_

  Mais detalhes podem ser encontrados [aqui](https://www.arduino.cc/en/Guide/Linux)
</details>

## Desenvolvimento
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
* **check_tests_coverage**: Executa o que o check_tests faz, mas também
  gera arquivos de coverage para análise
* **check_tests_coverage_html**:  Executa o que o check_tests faz, mas gera
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
* **check_tests:coverage**: Executa o que o check_tests faz, mas também gera
  arquivos de coverage para análise
* **check_tests:coverage:html**:  Executa o que o check_tests faz, mas gera o
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
