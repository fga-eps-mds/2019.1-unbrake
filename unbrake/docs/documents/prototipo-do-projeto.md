# Protótipo

## Sumário

[1. Protótipo](#1-Protótipo)
[2. Telas](#2-Telas)


### 1. Protótipo

O protótipo abaixo se trata do sistema que é utilizado atualmente para realizar os testes no simulador de frenagem que se encontra no galpão da UnB. Este sistema foi criado a partir da montagem de blocos do programa LabView. Este protótipo é funcional e realiza com sucesso os testes solicitados pelo usuário, havendo integração entre a parte do usuário e o sistema de simulação de frenagem.

### 2. Telas

#### 2.1 Index

Esta é a tela inicial da aplicação. Nela o usuário tem acesso as várias funcionalidades através do Menu que se encontra no lado direito da tela, além de poder iniciar, parar e pausar um ciclo de testes.

![index](prototypeImages/index.png)

#### 2.2 Calibração do sistema

Se trata de um conjunto de 7 abas no qual o usuário realiza a calibração do sistema de frenagem, colocando informações sobre as caracteristicas das peças que estão sendo utilizadas no simulador. Esta tela também também apresenta gráficos e algumas imagens para facilitar na calibração das peças.

![calibration_general](prototypeImages/calibration_general)
![calibration_temperature](prototypeImages/calibration_temperature)
![calibration_force](prototypeImages/calibration_force)
![calibration_velocity](prototypeImages/calibration_velocity)
![calibration_vibration](prototypeImages/calibration_vibration)
![calibration_command](prototypeImages/calibration_command)
![calibration_relations](prototypeImages/calibration_relations)

#### 2.3 Configurações

Se trata de um conjunto de 3 abas no qual o usuário insere as informações necessárias para o teste. É também nesta etapa onde o usuário insere as informções referente ao usuário que está realizando o teste, informações que devem constar no relatório, realiza o upload de aquivo que contém as definições padrões de configuração e calibração e também onde é escolhido o local de que será armazenado o relatório obtido.

![configuration_general](prototypeImages/configuration_general)
![configuration_report](prototypeImages/configuration_report)
![configuration_accont](prototypeImages/configuration_accont)

#### 2.4 Ensaio

Nesta tela podemos visualizar os dados obtidos após a realização do teste, podendo ver estas informações disponibilizada entre 2 grupos principais: Aquisições/Comandos e Dados do ensaio. Na parte inferior da tela também possui informações gráficas do sistema, separadas em 8 abas, sendo 1 aba referente as configurações utiliadas para o ensaio e as demais para gráficos dos resultados obtidos, sendo cada aba representando uma destas informações: temperatura 1, temperatura 2, força 1, força 2, rotação, velocidade e distância.

![test_configuration](prototypeImages/test_configuration)
![test_temperature1](prototypeImages/test_temperature1)
