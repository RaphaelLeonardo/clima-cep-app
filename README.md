# Clima CEP App

Aplicativo Angular que exibe informações meteorológicas a partir de um CEP.

## Sobre o projeto

O Clima CEP App permite ao usuário:
- Consultar informações de endereço através do CEP
- Visualizar as condições meteorológicas atuais do local
- Conferir uma previsão do tempo para os próximos dias

## Tecnologias utilizadas

- Angular 18.2.1
- TypeScript
- HTML/SCSS
- API ViaCEP (busca de endereços por CEP)
- API OpenWeatherMap (informações meteorológicas)

> **Nota**: É necessário ter uma API key do OpenWeatherMap. A chave deve ser configurada no arquivo `src/environments/environment.ts`.

## Como executar

1. Clone o repositório
2. Instale as dependências:
   ```
   npm install
   ```
3. Execute o servidor de desenvolvimento:
   ```
   ng serve
   ```
4. Acesse o aplicativo em: http://localhost:4200/

## Como usar

1. Digite um CEP válido no formato 99999-999
2. Os dados do endereço e as condições meteorológicas serão exibidos automaticamente

## Build para produção

Execute o comando abaixo para gerar os arquivos de produção:
```
ng build
```

Os arquivos serão gerados na pasta `dist/`.

## Testes unitários

Para executar os testes unitários via Karma:
```
ng test
```