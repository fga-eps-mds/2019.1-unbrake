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
  <a href="https://bestpractices.coreinfrastructure.org/projects/2874" alt="CII Best Practices" >
    <img src="https://bestpractices.coreinfrastructure.org/projects/2874/badge" />
  </a>
  <a href="https://libraries.io/github/fga-eps-mds/2019.1-unbrake" alt="Libraries.io Status" >
    <img src="https://img.shields.io/librariesio/github/fga-eps-mds/2019.1-unbrake.svg" />
  </a>
  <a href="https://goreportcard.com/report/github.com/fga-eps-mds/2019.1-unbrake" alt="Go Report Card" >
    <img src="https://goreportcard.com/badge/github.com/fga-eps-mds/2019.1-unbrake" />
  </a>
  <a href="https://godoc.org/github.com/fga-eps-mds/2019.1-unbrake/unbrake-local">
    <img src="https://godoc.org/github.com/fga-eps-mds/2019.1-unbrake/unbrake-local?status.svg" alt="GoDoc">
  </a>
  <a href="https://www.openhub.net/p/unbrake" alt="Openhub" >
    <img src="https://www.openhub.net/p/unbrake/widgets/project_thin_badge.gif" />
  </a>
</p>

<p align="center">
  <a href="https://github.com/fga-eps-mds/2019.1-unbrake/releases" alt="GitHub release" >
    <img src="https://img.shields.io/github/release-pre/fga-eps-mds/2019.1-unbrake.svg?label=pre-release" />
  </a>
  <a href="https://github.com/fga-eps-mds/2019.1-unbrake/releases" alt="GitHub release" >
    <img src="https://img.shields.io/github/release/fga-eps-mds/2019.1-unbrake.svg" />
  </a>
  <a href="https://pullreminders.com?ref=badge" alt="pullreminders" >
    <img src="https://pullreminders.com/badge.svg" />
  </a>
</p>
<p align="center">
    <img src= "https://i.imgur.com/2JxPd4S.png"/>
</p>
<h1 align="center"> Aix - Bot de Aprendizado integrado a plataforma Jupyter</h1>

<p align="center">
    <a href="https://fga-eps-mds.github.io/2019.1-unbrake/"><strong>Visite nossa página &raquo;</strong></a>
    <br>
    
## Sobre o projeto
Unbrake é um software que controla de forma remota a configuração, calibração e visualização de ensaios de aceleração e frenagem de um simulador de freio, utilizado por alunos e professores do curso de Engenharia Automotiva da UnB - Campus Gama.

O software é dividido em três partes, parte local, backend e frontend. 

A parte local foi realizada utilizando Golang. E é responsável por receber as configurações do ensaio, coletar os dados produzidos pelos sensores do simulador e por fornecê-los em stream para o frontend. 

O backend foi feito utilizando Django, ele recebe os arquivos de configuração, relaciona ele com os ensaios, armazena e realiza a autenticação dos usuários. 

O frontend que foi gerado utilizando React JS, o qual permite que o usuário configure e calibre o ensaio.
    
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

O arquivo de configuração deve ser criado com o nome `config.json` em `~/UnBrake` no Linux e em `%APPDATA%/UnBrake` no Windows.

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
* **mqttChannelPrefix**: todos os canais do MQTT terão esse prefixo.
    Útil para lidar com vários dispositivos em paralelo.

Todos esses parâmetros também podem ser configurados através de variáveis
de ambiente apenas fazendo a alteração do nome do parâmetro de camelcase
para snake case e em caixa alta. Ex: `serialPort` se torna `SERIAL_PORT`.

As variáveis de ambiente tem precedência sobre o arquivo de configuração.
Caso a variável de ambiente não seja setada e nem haja arquivo de configuração,
serão usadas valores default onde possível.

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

## Como contribuir

Contribuições ao nosso projeto são muito bem vindas! Cheque nosso
[guia de contribuição](CONTRIBUTING.md) para mais informações.