# 2019.1 UnBrake

[![Build Status](https://travis-ci.com/fga-eps-mds/2019.1-unbrake.svg?branch=master)](https://travis-ci.com/fga-eps-mds/2019.1-unbrake)
[![Maintainability](https://api.codeclimate.com/v1/badges/f8957e6e7e0bdced21c9/maintainability)](https://codeclimate.com/github/fga-eps-mds/2019.1-unbrake/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/f8957e6e7e0bdced21c9/test_coverage)](https://codeclimate.com/github/fga-eps-mds/2019.1-unbrake/test_coverage)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![pullreminders](https://pullreminders.com/badge.svg)](https://pullreminders.com?ref=badge)

## Subindo a aplicação
_*Todos os comandos incluem o comando de build para envitar erros de iniciante mas não é necessário em todas as execuções_

A aplicação pode ser executada localmente com o seguinte comando na raiz do repositório:

``` bash
$ sudo docker-compose up --build
```

ou os serviços podem ser executados individualmente:
``` bash
# Serviços disponíveis atualmente: frontend e api
$ sudo docker-compose up --build frontend
```

## Executando checagens de código
_*Todos os comandos incluem o comando de build para envitar erros de iniciante mas não é necessário em todas as execuções_

Desde que o serviço do frontend já tenha sido construído (build executado pelo menos uma vez) no ambiente do usuário, algumas checagens serão executadas através de _git hooks_.

Como comportamento _pre-commit_, são executados os seguintes scripts: `fix`, `check_lint` e `check_format`, sem ser necessário nenhuma configuração ou execução manual de comandos por parte do usuário, tanto no frontend quanto na API.

Como _pre-push_, o comportamento difere um pouco entre o frontend e a API, no frontend são executados os testes e na API, além dos testes, a checagem padrão do django (script `check`). Da mesma forma que antes do commit, são executados sem ser necessário comandos por parte do usuário.

Caso alguma das checagens falhe, antes do commit ou antes do push, o procedimento é abortado. Como isso é feito através de _git hooks_, é possível evitar as checagens utilizando-se a flag `--no-verify` nos comandos do git, **embora isso seja altamente desencorajado**.

### Frontend
#### Scripts disponíveis

* **check_all:** Executa todos os outros scripts de checagem em sequência
* **check_lint**: Checa por erros apontados pelo linter `eslint`
* **check_format**: Checa por erros de formatação apontados pelo `prettier`
* **check_tests**: Checa se todos os testes estão passando sem warnings ou mensagens de console utilizando o `jest`
* **fix**: Corrige automaticamente erros de formatação possíveis de serem consertados pelo `eslint` e pelo `prettier`

#### Execução de um script

Uma das possíveis formas de se executar os scripts no frontend é executando o seguinte comando:
``` bash
# 'npm' é o entrypoint
$ sudo docker-compose up --build --rm frontend run [nome_do_script]
```

### API
#### Scripts disponíveis

* **check_all:** Todos os outros scripts de checagem são executados em sequência
* **check:** Executa checagem padrão do django por erros em geral
* **check_lint**: Checa por erros apontados pelo linter `pylint`
* **check_format**: Checa por erros de formatação apontados pelo `flake8` ou falta de execução do `autopep8`
* **check_tests**: Checa se todos os testes estão passando, utilizando o `pytest`
* **fix**: Corrige automaticamente erros de formatação possíveis de serem consertados pelo `autopep8`

#### Execução de um script

Uma das possíveis formas de se executar os scripts da API é executando o seguinte comando:
``` bash
# 'manage.py' é o entrypoint
$ sudo docker-compose up --build --rm api [nome_do_script]
```
