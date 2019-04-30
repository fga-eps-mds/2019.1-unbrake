# Ferramentas de Comunicação do Time

Foi decidido pelo time que o principal canal de comunicação seria o Slack para comunicações internas, organização, marcar reuniões, etc.

Nessa decisão o principal concorrente era o Telegram, por ser uma ferramenta que o time está mais acostumado, leve e de fácil acesso. Porém,
optamos pelo Slack principalmente pelo seu aspecto organizacional mais preparado para a finalidade de organizar um time que possui várias
tarefas diferentes e várias subdivisões (pareamentos) diferentes.

Além disso, possui muitos apps de fácil instalação e amplamente utilizados por sua comunidade, boa parte deles sendo relacionados aos objetivos
e ferramentas da disciplina.

No plano gratuito, é possível selecionar até 10 apps que podem ser integrados ao ambiente do time. Como o número de apps é limitado, o time começou
com um conjunto de apps e alguns precisaram ser removidos a medida em que outros mais necessários eram integrados.

## Apps escolhidos

Na tabela a seguir serão listados os apps atualmente utilizados pelo motivo e o motivo:

| App              | Motivo        |
|:---------------: |:------------- |
| [Travis CI](https://unbrake.slack.com/apps/A0F81FP4N-travis-ci?next_id=0)        | Acompanhar as builds de CI/CD da aplicação |
| [Github](https://slack.github.com/)           | Para acompanhar toda a movimentação do que acontece no repositório, atualmente todos commits e eventos em issues e pull requests são notificados |
| [ZenHub](https://unbrake.slack.com/apps/A2GN5QV2M-zenhub)           | Acompanhar a movimentação, adição e deleção de tarefas no KanBan do time |
| [CodeClimate](https://codeclimate.com/)      | Notificar o time sobre problemas a serem corrigidos no código para que ele se torne cada vez mais manutenível |
| [HeyTaco](https://unbrake.slack.com/apps/A0J4UNFLN-heytaco)          | Uma gamificação simples, para incentivar os membros do time a se ajudarem. Cada membro pode dar até 5 tacos simbólicos para quem quiser! Além de ranking e outros extras |
| [DigitalOcean](https://www.digitalocean.com/)     | Alerta caso algum problema aconteça com as máquinas remotas, como sobrecarga de memória, processamento, etc |
| [DockerHub](https://docs.docker.com/docker-hub/slack_integration/)        | Avisar sobre imagens sendo pushadas para a organização UnBrake no dockerhub. Útil para validar se o processo está acontecendo da forma correta |
| [DailyBot](https://unbrake.slack.com/apps/A44PZQW83-dailybot)         | Alguns dias na semana alguns membros não tem aula ou não podem comparecer a daily presencial, então respondem a daily através do bot |
| [Pull reminders](https://unbrake.slack.com/apps/A8MBPB34N-pull-reminders-for-github?next_id=0)  | Relembrar o Scrum Master que PRs estão abertos e precisam ser avaliados, assim como guardar estatísticas sobre aberturas e fechamentos dos PRS, assim como características deles |
| [Incoming-webhook](https://get.slack.help/hc/en-us/articles/115005265063-Incoming-WebHooks-for-Slack) | Extensão genérica para recebimento de notificações de várias aplicações ou até mesmo requisições manuais |
| [PokerBot](https://unbrake.slack.com/apps/A88H5M4RZ-pokerbot?next_id=0)         | Facilita o planning poker por já estar integrado ao Slack. Permite marcar usuários, dispensa outro registro, etc. |

## Histórico de Revisão

| Data | Responsável | Versão | Mudança realizada |
|:----:| ----------- |:------:| ----------------- |
| **30/04/2019** | [@icaropires](https://github.com/icaropires) | 1 | Adiciona versão inicial do documento |
