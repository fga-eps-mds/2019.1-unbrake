## Épicos

| Épico|            Título            | Descrição |
| :---:|:----------------------------:|:---------:|
| EP01 | Autenticação                 | Módulo responsável por gerenciar usuários do sistema |
| EP02 | Módulo de configuração       | Módulo responsável por definir varáveis da máquina de estados do ensaio |
| EP03 | Módulo de calibração         | Módulo responsável por definir fatores de conversão dos valores analógicos recebidos dos sensores do sistema de frenagem |
| EP04 | Módulo de ensaio             | Módulo responsável por enviar comandos para o sistema embarcado através de uma calibração e uma configuração realizadas anteriormente |
| EP05 | Módulo de análise estatística| Módulo responsável por fazer análises estatísticas baseado nos ensaios realizados |

## Histórias de usuário

| Épico | História de Usuário |   Eu como   | gostaria de | para | Priorização |
|:-----:| :-----------------: |:-----------:|:-----------:|:----:|:-----------:|
|  EP01 |        US01         |   Usuário/Administrador   | acessar o módulo configuração | construir uma nova configuração de um ensaio | Must |
|  EP01 |        US02         |   Usuário/Administrador   | acessar o módulo calibração | construir uma nova calibração de um ensaio | Must |
|  EP01 |        US03         |   Usuário/Administrador   | acessar o módulo ensaio | realizar um ensaio baseado em uma configuração e uma calibração | Must |
|  EP01 |        US04         |   Administrador   | acessar o UnBrake | definir uma nova configuração e calibração padrões do sistema | Must |
|  EP01 |        US05         |   Administrador   | acessar o módulo autenticação | gerenciar usuários do UnBrake | Should |
|  EP02 |        US06         |   Usuário/Administrador   | selecionar configurações pré cadastradas | preencher o formulário de configuração | Should |
|  EP02 |        US07         |   Usuário/Administrador   | salvar parâmetros preenchidos | usá-los posteriormente em um ensaio | Must |
|  EP03 |        US08         |   Usuário/Administrador   | definir os fatores de conversão de temperatura | calibrar os sensores de temperatura | Must |
|  EP03 |        US09         |   Usuário/Administrador   | visualizar os valores de temperatura em tempo real | validar que os fatores de conversão definidos estão coerentes | Should |
|  EP03 |        US10         |   Usuário/Administrador   | definir os fatores de conversão de velocidade | calibrar os sensores de velocidade | Must |
|  EP03 |        US11         |   Usuário/Administrador   | visualizar os valores de velocidade em tempo real | validar que os fatores de conversão definidos estão coerentes | Should |
|  EP03 |        US12         |   Usuário/Administrador   | definir os fatores de conversão de força | calibrar os sensores de força | Must |
|  EP03 |        US13         |   Usuário/Administrador   | visualizar os valores de força em tempo real | validar que os fatores de conversão definidos estão coerentes | Should |
|  EP03 |        US14         |   Usuário/Administrador   | definir os fatores de conversão de vibração | calibrar os sensores de vibração | Must |
|  EP03 |        US15         |   Usuário/Administrador   | visualizar os valores de vibração em tempo real | validar que os fatores de conversão definidos estão coerentes | Should |
|  EP03 |        US16         |   Usuário/Administrador   | definir as relações de pneu e correia do motor | calibrar a velocidade máxima que o sistema pode atingir | Must |
|  EP03 |        US17         |   Usuário/Administrador   | definir a porta no qual será feita a comunicação com o hardware | testar a conexão com o sistema embarcado | Must |
|  EP04 |        US18         |   Usuário/Administrador   | iniciar um novo ensaio | realizar um experimento no sistema de frenagem | Must |
|  EP04 |        US19         |   Usuário/Administrador   | fornecer uma configuração e uma calibração dos sensores | iniciar um novo ensaio no sistema de frenagem | Must |
|  EP04 |        US20         |   Usuário/Administrador   | visualizar os valores de temperatura durante um ensaio | validar se os sistema se comporta conforme o previsto no experimento | Should |
|  EP04 |        US21         |   Usuário/Administrador   | visualizar os valores de força durante um ensaio | validar se os sistema se comporta conforme o previsto no experimento | Should |
|  EP04 |        US22         |   Usuário/Administrador   | visualizar os valores de rotação do motor durante um ensaio | validar se os sistema se comporta conforme o previsto no experimento | Should |
|  EP04 |        US23         |   Usuário/Administrador   | visualizar os valores de velocidade da roda durante um ensaio | validar se os sistema se comporta conforme o previsto no experimento | Should |
|  EP04 |        US24         |   Usuário/Administrador   | visualizar os valores de distância percorrida durante um ensaio | validar se os sistema se comporta conforme o previsto no experimento | Should |
|  EP04 |        US25         |   Usuário/Administrador   | visualizar o status de um ensaio baseado no número de snubs | ter noção de quanto tempo resta para o ensaio terminar | Should |
|  EP04 |        US26         |   Usuário/Administrador   | visualizar quanto tempo resta para terminar o ensaio | saber exatamente quando o ensaio terminará | Could |
|  EP05 |        US27         |   Usuário   | visualizar os dados dos ensaior que já realizei | comparar com possíveis outros ensaios que ainda vou realizar | Should |
|  EP05 |        US28         |   Administrador   | visualizar os dados de todos os ensaios já realizados | controlar o uso do sistema de frenagem pela equipe | Should |
|  EP05 |        US29         |   Usuário/Administrador   | comparar dois ou mais ensaios realizados | analisar os dados gerados por dois ou mais ensaios semelhantes | Should |
|  EP05 |        US30         |   Usuário/Administrador   | simular os valores dos sensores do sistema baseado em uma configuração e uma calibração fornecida | antecipar o comportamento do sistema de frenagem | Could |