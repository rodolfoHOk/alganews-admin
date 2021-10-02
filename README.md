# AlgaNews Admin (Administrativo)

> Este é um dos 3 projetos interligados do curso Especialista React JS da AlgaWorks

> O projeto geral segue o briefing:
> https://www.notion.so/Documentos-8dca4ded101d42478b6bc2f2c7a0fb46

> O projeto do Admin segue o briefing:
> https://www.notion.so/Briefing-Admin-b6bb1e0105e24907a8ca4a5b277e6a1a

<img src="https://raw.githubusercontent.com/rodolfoHOk/portfolio-img/main/images/alganews-admin-1.png" alt="AlgaNews Admin Img1" width="450"/>

## Tecnologias utilizadas:

- Typescript: Programação do cliente
- React JS: Programação de interface
- Biblioteca de UI: Ant Design
- REST: Comunicação com a API/Database
- OAuth2: Controle de autenticação e login (Authorization Code + PKCE)

### Bibliotecas utilizadas:

- @ant-design/charts: Biblioteca de gráficos do Ant Design para React
- @craco/craco: Create React App Configuration Override é uma camada de configuração para o create-react-app, necessário para usar o LESS, base de estilização do Ant Design
- @reduxjs/toolkit: Ferramentas oficiais, opinativas, para o desenvolvimento eficiente com Redux
- antd: Biblioteca de UI de classe corporativa para React
- antd-img-crop: Cortador de imagem para o componente Upload do Ant Design
- antd-mask-input: Máscara para o componente Input do Ant Design
- axios: HTTP client
- craco-less: Less plugin para o craco
- date-fns: Utilitário para manipulação de datas
- jwt-decode: Decodificação de tokens JWTs
- lodash.debounce: O método debounce da Biblioteca Lodash, para executar uma função somente depois de algum tempo sem o usuário digitar algo, evita multiplas requisições ao servidor.
- pkce-challenge: Gera e verifica um par de desafio PKCE
- qs: Biblioteca de parse e stringify para QueryString
- react-redux: Redux para React
- redux: Contêiner de estado para aplicativos JavaScript
- rodolfohiok-sdk: SDK criado durante o curso para reutilização nos outro projetos;
  contendo as tipagens do typescript, os serviços para comunicação com a API,
  e as classes de erros utilizadas no projeto
- source-map-explorer: Ferramenta para analise de javascript, usamos para melhorar a performance do site, diminuindo os tamanhos dos chunks.js.

### Ant Design Less variables

https://github.com/ant-design/ant-design/blob/master/components/style/themes/default.less

### Ant Design Customize Theme (react)

https://ant.design/docs/react/customize-theme

## Outras imagens

<img src="https://raw.githubusercontent.com/rodolfoHOk/portfolio-img/main/images/alganews-admin-2.png" alt="AlgaNews Admin Img2" width="450"/>
<img src="https://raw.githubusercontent.com/rodolfoHOk/portfolio-img/main/images/alganews-admin-3.png" alt="AlgaNews Admin Img3" width="450"/>
<img src="https://raw.githubusercontent.com/rodolfoHOk/portfolio-img/main/images/alganews-admin-4.png" alt="AlgaNews Admin Img4" width="450"/>
<img src="https://raw.githubusercontent.com/rodolfoHOk/portfolio-img/main/images/alganews-admin-5.png" alt="AlgaNews Admin Img5" width="450"/>
<img src="https://raw.githubusercontent.com/rodolfoHOk/portfolio-img/main/images/alganews-admin-6.png" alt="AlgaNews Admin Img6" width="450"/>
<img src="https://raw.githubusercontent.com/rodolfoHOk/portfolio-img/main/images/alganews-admin-7.png" alt="AlgaNews Admin Img7" width="450"/>
<img src="https://raw.githubusercontent.com/rodolfoHOk/portfolio-img/main/images/alganews-admin-8.png" alt="AlgaNews Admin Img8" width="450"/>
<img src="https://raw.githubusercontent.com/rodolfoHOk/portfolio-img/main/images/alganews-admin-9.png" alt="AlgaNews Admin Img9" width="450"/>
<img src="https://raw.githubusercontent.com/rodolfoHOk/portfolio-img/main/images/alganews-admin-10.png" alt="AlgaNews Admin Img10" width="450"/>
<img src="https://raw.githubusercontent.com/rodolfoHOk/portfolio-img/main/images/alganews-admin-11.png" alt="AlgaNews Admin Img11" width="450"/>
<img src="https://raw.githubusercontent.com/rodolfoHOk/portfolio-img/main/images/alganews-admin-12.png" alt="AlgaNews Admin Img12" width="450"/>

## Credits:

### Tax Image, Confusing Image

Credits: https://storyset.com/

## Back-End Local

Para executar o back-end localmente utilizamos containers do docker.

Localização:
/repositorio/Programacao/cursos/algaworks/ERJS-EspecialistaReactJS/alganews-infra/

Comando de execução:
docker-compose up -d

## Deployed URL

https://alganews-admin-rudolf-hiok.netlify.app
