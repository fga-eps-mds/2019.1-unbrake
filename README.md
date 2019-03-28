## Como contribuir

Todos os arquivos .md precisam estar em site/pages na pasta com a categoria correta. Em caso de adição de imagens ou links estáticos consulte a documentação do Pelican.

### Comandos necessários

#### Compilar o site

```
 docker-compose up --build build_pages
```

#### Testar localmente


```
  docker-compose up --build serve
```

Acesse o site no seu computador em localhost:8000.

* **OBS:** Em caso de problemas com o docker tente utilizar o comando **docker-compose down**.
