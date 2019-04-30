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

## Deploy Contínuo

### Quando acontece?

Após merges na devel ou na master.

### Contexto

Ao se fazer uma alteração no código, é desejável que ela esteja o quanto antes em ambiente de produção para que possa ser validada por todo mundo e
logo que validada, em ambiente de produção para que falhas sejam encontradas e corrigidas o quanto antes.

### Proposta

A ideia é que em cada pull request aceito na devel e a build passe, logo após a build terminar o ambiente de homologação seja atualizado (análogo a master e ambiente de produção),
mas com isso surgiram alguns desafios, alguns relacionados ao ambiente e outros de segurança.

Foi decidido que inicialmente seria feito o deploy apenas em um host remoto, sem processamento distribuído. Isso se deve a que primeiro temos que validar se os containers de produção estão se comportando
corretamente, ajustar configurações de servidor e de banco e validar vários outros pontos que são mais fáceis de serem validados apenas em um computador.

Também inicialmente ainda SSL implementado em nenhum dos ambientes, o que é uma falha que deve ser corrigida o quanto antes, dado que nosso software possui autenticação de usuário. Mas assim como no ponto
anterior, a ideia é que a parte básica esteja estável o mais rápido possível e a partir dessa baseline iremos tornar o ambiente mais robusto.


### Implementação

Foram reservados "droplets" na nuvem DigitalOcean separadas, uma para o ambiente de proudução e outra para o ambiente de homologação. Também foram reservador domínios DNS gratuitos, um para cada ambiente,
são eles: unbrake-hom.ml e unbrake.ml.

As droplets contratadas são bem básicas, possuem poucos recursos como apenas 1GB de RAM para testes iniciais e não são capazes de construir a imagem do docker do frontend, por exemplo. Então foi resolvido
que as imagens seriam construídas em outro ambiente e depois só baixadas e executadas na droplet, o que funcionou bem.

As imagens são construídas no ambiente do Travis e enviadas para o Dockerhub, o registry que escolhemos, a cada que é necessário. Foram escritos scripts que, unidos ao docker-compose, conseguem a partir
dessas imagens, pedir para a droplet atualiar seu deploy, via SSH. Para isso foi gerada uma chave do exclusiva para o Travis fazer o deploy nas droplets, isso facilita sua revogação em caso de vazamento
e perceber que foi ela que vazou.

#### Deploy contínuo de homologação

Numa build em que será realizado um deploy homologação (foi aceito um PR na devel) a build, atualmente, irá executar os seguintes passos:

##### Checagens e testes de desenvolvimento

Irá rodar as ferramentas de checagem e da mesma forma como acontece no ambiente local do desenvolvedor, executar os testes e coletar a cobertura.

##### Construir ambiente de homologação

Irá construir as imagens (do Docker) de homologação

##### Deploy das imagens de homologação

Envia as imagens construídas de homologação para o Dockerhub com tag específica.

##### Deploy para o ambiente de homologação

Irá pedir para o droplet de homologação apagar as imagens desatualizadas e subir os serviços novamente baseado nas imagens atualizadas.

#### Deploy contínuo de produção

Numa build em que será realizado um deploy produção (foi aceito um PR na master) a build, atualmente, irá executar os seguintes passos:

##### Checagens e testes de desenvolvimento

Mesma coisa da build da homologação.

##### Deploy para o ambiente de produção

Aqui não é necessário construir imagens como na build de homologação, porque a master só recebe alterações da devel. Então inevitavelmente o ambiente 
de produção será atualizado baseado na imagem mais recente de homologação (último build que aconteceu na devel).

Então, aqui serão baixadas as imagens de homologação mais recentes de cada um dos módulos, elas receberão uma nova tab, de produção, e serão enviadas
ao Dockerhub como imagens de produção. Por fim, a droplet se apagará as imagens antigas de produção e subirá o serviço utilizando as novas imagens.

### Conclusão

Até o momento essa estratégia funcionou bem, apesar de que muitos aspectos de produção ainda não são tratados, como conexão encriptada, balanceamento
de carga, helthy checking, etc.

Mas apesar disso, os ambientes de produção e homologação estão funcionando e com deploy contínuo (!).

### Ferramentas utilizadas

| Ferramenta       | Módulo        | Objetivo |
|:---------------: |:------------- | :------------- |
| [Travis CI](https://travis-ci.com/) | Frontend/API | Ferramenta de CI utilizada pelo time, grátis para projetos open source |
| [Dockerhub](https://www.docker.com/products/docker-hub) | Frontend/API | Registry de imagens do docker |
| [DigitalOcean](https://www.digitalocean.com/) | Frontend/API | Plataforma de computação em nuvem |
