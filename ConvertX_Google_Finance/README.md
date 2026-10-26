# ConvertX — Google Finance

Esta versão mantém o frontend em HTML/CSS/JavaScript e usa **Google Finance via Google Apps Script** para as moedas tradicionais.

## Por que não existe uma URL simples da "API do Google"?
O Google disponibiliza a função `GOOGLEFINANCE()` no Google Sheets para obter cotações. Ela não é uma API REST pública comum para um site HTML. A solução deste projeto é criar um pequeno endpoint no Google Apps Script que executa `GOOGLEFINANCE()` e devolve o valor ao site.

A documentação oficial do Google confirma o uso de `GOOGLEFINANCE` para cotações de moedas e também informa que cotações podem ter atraso de até 20 minutos.

## Configuração — uma única vez

1. Abra o Google Sheets e crie uma planilha vazia.
2. Vá em **Extensões > Apps Script**.
3. Apague o código existente e cole o conteúdo de `google-apps-script/Code.gs`.
4. Salve.
5. Clique em **Implantar > Nova implantação**.
6. Escolha **Aplicativo da Web**.
7. Em "Executar como", selecione sua conta.
8. Em acesso, permita que qualquer pessoa com o link execute.
9. Clique em Implantar e copie a URL terminada em `/exec`.

## Colocar a URL no site

Abra o `index.html`, depois abra `app.js` e procure:

const GOOGLE_SCRIPT_URL=localStorage.getItem("convertx_google_script_url")||"";

A forma mais simples é abrir o console do navegador (F12 > Console) e executar:

localStorage.setItem("convertx_google_script_url","COLE_AQUI_A_URL_DO_APPS_SCRIPT");

Depois recarregue a página.

## Criptomoedas

Google Finance não deve ser tratado como uma API universal de cripto. Para criptoativos, o projeto mantém CoinGecko como fonte.

## Sem banco de dados

Não há banco de dados. A planilha do Google é usada apenas como intermediária para executar GOOGLEFINANCE; não é necessário armazenar usuários ou transações.
