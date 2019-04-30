### Descrição do problema

A implementação do protocolo **MQTT** é muito complexa e irá demandar muito esforço.

___

### Impacto

Não conseguirmos mostrar o gráfico em tempo real na primeira *release*.

___
### Possíveis soluções

#### Realizar a implementação do MQTT

Ignorar a *release* e implementar mesmo assim para que não tenhamos custo em refatoração.

#### Realizar o Mock do gráfico (Felipe)

Mostrarmos apenas um gráfico com informações quaisquer sem integraçaõ alguma.

#### Implementar via socket (João)

Realizar a implementação porém de um jeito mais simples utilizando apenas *websocket*.

___
### Conclusão

Optamos pela implementação via *socket* pois atendia tanto ao nosso planejamento da entrega na *release 1* quanto não traria muito custo em manutenção.
