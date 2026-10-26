# ConvertX

Conversor de moedas e criptomoedas feito com HTML, CSS e JavaScript.

## Publicar no GitHub Pages

1. Crie um repositório público no GitHub, por exemplo `convertx`.
2. Abra **Add file → Upload files**.
3. Extraia este ZIP.
4. Envie diretamente estes três arquivos para a raiz do repositório:
   - `index.html`
   - `style.css`
   - `app.js`
5. Clique em **Commit changes**.
6. Vá em **Settings → Pages**.
7. Em **Build and deployment**, selecione **Deploy from a branch**.
8. Escolha `main` e `/ (root)`.
9. Clique em **Save**.
10. Aguarde o GitHub publicar o site.

O endereço normalmente será `https://SEU-USUARIO.github.io/convertx/`.

## Importante

Esta versão foi preparada para GitHub Pages: não usa PHP e não contém `.bat`.

As moedas tradicionais usam Frankfurter e as criptomoedas usam CoinGecko. O projeto não precisa de banco de dados.

Para usar Google Finance especificamente, seria necessário um intermediário como Google Apps Script, pois `GOOGLEFINANCE()` é uma função do Google Sheets e não uma API REST pública comum.

## Se o site aparecer sem cotação

O GitHub Pages pode hospedar o frontend, mas a API externa precisa aceitar requisições do navegador. Se alguma API bloquear a requisição por CORS ou limite, será necessário colocar um pequeno backend/proxy.
