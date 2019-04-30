# Pipeline UnBrake, da alteração no código ao deploy

Essa página tem o objetivo de esclarecer o funcionamento de todo o fluxo de desenvolvimento e CI/CD da UnBrake.

## Checagem Local

### Quando acontece?

Sempre ao se tentar criar um commit ou dar um push para repositório do projeto.

### Contexto

Em muitas pipelines de desenvolvimento a preocupação começa a partir do momento que o commit do desenvolvedor está no remoto, online, para a avaliação dos colegas.
Mas no desenvolvimento dessa pipeline eu resolvi fazer um pouco diferente.

O nosso time de desenvolvimento é composto em sua maioria por desenvolvedores inexperientes e que que ainda não tem um bom conhecimento sobre boas práticas de
programação no sentido do que as comunidades adotam. Para piorar a situação ainda estão tendo que trabalhar com linguagens e frameworks que não conhecem.

### Proposta

Tendo isso em vista, resolvemos fazer a tentativa de impor as boas regras da comunidade já desde o desenvolvimento local, através de ferramentas de análise estática.
Elas foram integradas de forma em que ao invés do desenvolvedor ser alertado apenas por meio de uma build de CI que quebrou, ele fosse alertado já localmente, automaticamente,
sem a necessidade de execução manual de scripts ou configuração de ambiente.

### Implementação

Essa solução foi implementada através de git hooks, ferramentas associadas e algum bash script. O resultado foi um mecanismo em que os git hooks são instalados localmente, automaticamente
da primeira vez em que o desenvolvedor sobe o ambiente de desenvolvimento do frontend (porque foi o primeiro a ser implementado).

Uma vez instalados os git hooks, toda vez em que o desenvolvedor der um `git commit`, serão executadas várias checagens, correspondentes a linguagem, apenas nos arquivos alterados. Caso a checagem falhe, é solicitado que o desenvolvedor corriga os problemas
e tente novamente. Outro git hook utilizado é o `pre-push`, no momento do commit, apenas linters e formatadores são executados e no push apenas os testes.

Tudo foi implementado dockerizado e não requer nenhuma configuração adicional por parte do desenvolvedor.

### Conclusão

Naturalmente essa abordagem também traz desvantagens, a frustração inicial dos desenvolvedores e o baixo redimento inicial.

Porém, estamos apostando que é que com isso teremos, relativamente cedo, na equipe de desenvolvimento uma maturidade maior com relação as boas práticas da comunidade e
também de evitar o famoso fluxo de desenvolvimento de desenvolver a funcionalidade e só depois enviar vários commits de correção para que a build passe no momento do PR, ou seja, as boas práticas não são incorporadas.

### Ferramentas utilizadas

| Ferramenta       | Módulo        | Objetivo |
|:---------------: |:------------- | :------------- |
| [Eslint](https://eslint.org/) | Frontend | Famoso linter e que também checa estilo do código |
| [Prettier](https://prettier.io/) | Frontend | Estilizador de código para unificação da folha de estilo |
| [Husky](https://github.com/typicode/husky)| Frontend | Gerar git hooks a partir de scripts simples no package.json |
| [Lint staged](https://github.com/okonet/lint-staged)| Frontend | Útil para aplicar uma ação apenas nos arquivos que estão sendo comitados |
| [Jest](https://jestjs.io/)| Frontend | Testes e coleta de cobertura |
| [Pylint](https://www.pylint.org/)| API | Linter e checagens em geral |
| [Flake8](https://flake8.pycqa.org/en/latest/)| API | Folha de estilo e algumas checagens extras |
| [Autopep8](https://pypi.org/project/autopep8/)| API | Auto correção de estilo |
| [Pytest](https://docs.pytest.org/en/latest/)| API | Framework de testes |
| [Coverage](https://coverage.readthedocs.io/en/v4.5.x/)| API | Coleta de cobertura de testes |
| [Docker](https://www.docker.com/)| Frontend/API | Todas as ferramentas rodam em containers |

### Local de implementação

Os script estão implementados dentro da pasta `script` dentro da pasta de cada módulo e os hooks nas pasta `hooks` também dentro de cada módulo.
Além disso, vários arquivos de configuração tiveram que ser adequados as necessidades do projeto: .eslintrc.json, .prettierrc, package.json, Dockerfile, docker-compose.yml, .flake8, .pylintrc, .coveragerc e pytest.ini

## Integração contínua

### Quando acontece?

A cada push ao repositório, é avaliado o último commit do push. Também acontece ao se criar um Pull Request e após seu aceite, na branch de destino (base).

### Contexto

Mesmo com as checagens locais fortes, ainda são necessárias as checagens numa Integração Contínua. As checagens locais estão fortes mas ainda há casos em que
um desenvolvedor ignore a verificação (os próprios git hooks dão recurso a isso) por motivo de pressa ou para compatilhar o código para pedir ajuda, por exemplo.
Também há o caso do docker do usuário estar quebrado ou algo do tipo.

### Proposta

Como ferramenta de CI escolhemos o Travis porque que já é uma ferramenta popular na disciplina, além de outros fatores que estão mapeados em issues.

### Implementação

Na fase de checagem local foram criados scripts pra checar cada aspecto, além de alguns que agregavam outros. Com esses scripts prontos, na parte da integração
contínua pode-se só integrá-los. Assim a mesma checagem que foi feita local também é feita na CI, porém agora em todos arquivos, e não só nos que foram 
alterados no último commit.

Além das checagens locais, no ambiente de CI também são avaliadas algumas checkagens a mais, dessa vez checagens que não são completamentamente mandatórias,
e o Scrum Master tem liberdade para escolher se é razoavel pra o time manter aqueles erros ou não.

Essas checagens são realizadas pelo CodeClimate, que avalia o código e retorna várias métricas ao analizar coisas não analizadas antes, como complexidade
cognitivia, complexidade assintótíca e duplicação de código. Com isso é possível se ter uma noção do nível de manutenabilidade do código, um insumo
importante para decisões de projeto.

### Conclusão

Então ao executar algumas checagens redundantes e outras inéditas, a Integração Contínua se torna uma importante ferramenta tanto para apontar correções
que tem que ser feitas imediatamente no código como coletar métricas e gerar registros que vão servir de insumos para decisões de projeto posteriormente.


### Ferramentas utilizadas

| Ferramenta       | Módulo        | Objetivo |
|:---------------: |:------------- | :------------- |
| [Travis CI](https://travis-ci.com/) | Frontend/API | Ferramenta de CI utilizada pelo time, grátis para projetos open source |
| [Pull reminders](https://pullreminders.com/) | Frontend/API | Estilizador de código para unificação da folha de estilo |
| [CodeClimate](https://codeclimate.com/)| Frontend/API | Gerar git hooks a partir de scripts simples no package.json |
| [Sonary Python (codeclimate)](https://github.com/codeclimate/sonar-python)| Frontend | Detecta erros em geral em código python |
| [Markdownlint (codeclimate)](https://docs.codeclimate.com/docs/markdownlint)| Frontend | Linter para markdown, avalia aplicação de boas práticas em geral |
| [Nodesecurity (codeclimate)](https://docs.codeclimate.com/docs/nodesecurity)| Frontend | Checa por erros de segurança nas dependências do node |
| [Radon (codeclimate)](https://docs.codeclimate.com/docs/radon)| API | Avalia complexidade de código |
| [Fixme (codeclimate)](https://docs.codeclimate.com/docs/fixme)| Frontend/API | Procura por coisas tipo FIXME no código |
| [Git Legal (codeclimate)](https://docs.codeclimate.com/docs/git-legal)| Frontend/API | Alerta sobre possíveis erros de licença incompatíveis entre o projeto e as dependências|
| [Duplication (codeclimate)](https://github.com/codeclimate/codeclimate-duplication)| Frontend/API | Detecta erros de duplicação no código|

O (codeclimate) indica que a ferramenta foi integrada como plugin de checagem do codeclimate.

### Local de implementação

Não houve implementação de scripts, apenas calibração de arquivos de configuração. Principais arquivos relacionados: .travis.yml, .codeclimate.yml

## Revisão de Código

### Quando acontece?

Antes de se aceitar um Pull Request

### Contexto

Esse é o único passo em que tem haver a intervenção de outro membro do time. A ideia é que nessa etapa, que acontece após muitas checagens de ferramenta.
Seja possível identificar problemas que apenas outro desenvolvedor identificaria, como nomes sem sentido, lógica errada, uso de bibliotecas desnecessárias, etc.

### Proposta

Essa etapa é obrigatória ao aceite do PR, é exigido que pelo menos uma outra pessoa do time avalie seu PR, regra que também vale para os gestores. Não há merge
sem alguém dizer que o código está ok.

### Implementação

Essa regra foi implementada simplismente editando-se as configurações de branch do repositório no Github.

### Conclusão

Essa etapa tem se mostrado de grande valor a equipe, e quase todas as vezes em que aplicada corretamente econtram-se alguns erros que não se não fossem
corrigidos no momento se tornariam grandes problemas posteriormente.


### Ferramentas utilizadas

| Ferramenta       | Módulo        | Objetivo |
|:---------------: |:------------- | :------------- |
| [Github](https://github.com/) | Frontend/API | Ferramenta de versionamento de código (dentre outros) |
