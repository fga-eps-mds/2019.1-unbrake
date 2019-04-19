Title: Comunicação do gráfico em tempo real
Date: 2018-04-06 15:59
Category: Design Docs

### Descrição do problema

Como definido nos cenários do projeto o software necessita de atualização em tempo real das informações dos sensores em um gráfico com latência de até 2 segundos. O problema é que a arquitetura de micro serviços faz com que a comunicação entre os serviços seja feita pela rede e portanto está sensivel a dinâmica da internet: alta latência, perda de pacotes, mudanças de rotas, entrega de pacotes de forma não ordenada.


___

### Impacto

Dependendo da arquitetura assumida o software fica dependendo totalmente da entrega da rede podendo assim fazer com que o gráfico não fique flúido para o usuário e impedindo o mesmo de tomar algumas decisões baseadas no feedback (como por exemplo desligar a máquina caso o experimento não esteja indo bem).

___
### Possíveis soluções

#### Utilizar comunicação via socket (João Robson)

Apenas utilizar um socket para comunicar diretamente ao backend

#### Comunicar direto com o backend

Fazer com que o Front-end comunique com o back-end diretamente sem passar pela API


#### Assinatura via API e comunicação direta (Felipe Borges)

Fazer com que a API envie para o simulador informações sobre a porta e ip e com isso comunicar uma stream de dados diretamente via front-back utilizando a API como um intemediário

#### Utilizar MQTT (Icaro Pires)

Usar o protocolo MQTT

___
### Conclusão

Decidimos mesclar duas soluções, utilizar a API como um intermediário para fazer as assinaturas e estabelecer uma stream de dados diretamente com o backend porém utilizando o protocolo MQTT para transferir essas informações. Perceba que o protocolo MQTT necessita de um broker para realizar a documentação assincrona.
