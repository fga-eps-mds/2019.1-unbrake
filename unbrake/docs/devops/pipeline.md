# Pipeline UnBrake, da alteração no código ao deploy

Essa página tem o objetivo de esclarecer o funcionamento de todo o fluxo de desenvolvimento e CI/CD da UnBrake.

## Local

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

Os script estão implementados dentro da pasta `script` dentro da pasta de cada módulo e os hooks nas pasta `hooks` também dentro de cada módulo. Além disso há alguns detalhes em outros arquivos, como em arquivos do docker
arquivos de configuração das ferramentas, etc.
