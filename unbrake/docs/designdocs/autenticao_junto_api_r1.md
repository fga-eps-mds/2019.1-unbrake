### Descrição do problema

A nossa arquitetura prevê que o sistema de autenticação esteja em um micro serviço separado da *API*, porém, essa separação trará mais complexidade as entregas e irá aumentar consideravelmente o risco de não entregarmos o que pretendiamos na primeira *release*.

___

### Impacto

Não completar a entrega da *Release 1*.

___
### Possíveis soluções

#### Criar o serviço já separado

Com o serviço separado não teríamos o problema de realizar manutenção nesta parte novamente.

#### Criar o serviço junto com a API para a primeira release

Isso diminuiria a complexidade do código e possivelmente aumentaria as entregas.

___
### Conclusão

Resolvemos deixar o serviço de autenticação como um serviço do *Django* em um primeiro momento e posteriormente iremos separar ambos para cumprir com a proposta arquitetural do projeto.
