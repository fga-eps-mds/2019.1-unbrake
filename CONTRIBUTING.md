# Guia de Contribuição para o UnBrake

## Sumário

1. Proposito do projeto
2. Como contribuir
* Como utilizar as issues
* Criando *branches*
* Propondo mudanças ao projeto

## Propósito do projeto

O **UnBrake** é um software que auxilia em simulações de frenagem.

## Como contribuir

Caso você queira contribuir com o projeto a primeira coisa que precisa fazer é
criar uma issue após isso crie uma *branch* onde será realizado suas
contribuições e quando o trabalho estiver concluido realize um pull request
para branch **devel** do projeto. Todas as issues são acompanhadas e gerenciadas
via [Zenhub](https://www.zenhub.com/).

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

```
"<número da issue>-<primeiro nome>-<segundo nome separado por '-' >-<...>"
```

Todas as *brachs* devem seguir as seguintes regras:

* Ser escrita em português
* Estar linkada a uma issues
* Deve ser comitado apenas aquivos e conteúdo relacionado a tarefa

#### Propondo mudanças

Nesse ponto estamos considerando que você já tem uma issue e um branch para sua
tarefa, uma fez que sua tarefa está pronta, testada e validada agora é hora de
realizarmos um *pull request*.

Via github inicie o *pull request* utilizando o template fornecido, após isso as
ferramentas de análise automática entram em ação e avaliam se sua contribuição
está correta em termos de [estilo de código]() e também em testes. Caso nenhuma
ferramenta reclame de nada é só esperar o *review* de algum membro do nosso tiem.
