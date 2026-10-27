# ConvertX — versão profissional

Conversor de moedas e criptomoedas com interface dark premium, cotações em destaque e relógios dos principais centros financeiros.

## APIs funcionais

- **Frankfurter API** — moedas tradicionais e pares exibidos na área de cotações.
- **CoinGecko API** — criptoativos.
- O projeto continua sendo um frontend estático, compatível com GitHub Pages.

## Alterações desta versão

### Design
- Nova identidade visual em tons **navy, azul, ciano e roxo**.
- Interface dark com aparência de painel financeiro.
- Efeitos de brilho, profundidade, transparência e grid discreto.
- Animações de hover e feedback nos botões.
- Botão de troca com rotação.
- Botão principal com efeito de brilho.
- Indicadores de conexão com animação.
- Elemento visual animado no hero.
- Cards de mercado com estados de carregamento.
- Melhor responsividade.

### Novas áreas
- **Cotações importantes:** BRL/USD, BRL/EUR, BRL/GBP, BRL/JPY, EUR/USD e USD/JPY.
- **Horários importantes:** São Paulo, Nova York, Londres, Frankfurt, Dubai, Tóquio, Hong Kong e Sydney.
- Relógios atualizados em tempo real pelo navegador usando `Intl.DateTimeFormat` e fusos IANA.
- Data atual exibida no painel mundial.

### JavaScript
- Funções de API separadas e reaproveitáveis.
- Validação das respostas.
- Tratamento de erros.
- Estado de carregamento do conversor.
- Cotações carregadas em paralelo com `Promise.all`.
- Relógios atualizados a cada segundo sem consultar API.
- Código organizado para facilitar futuras expansões.

## Estrutura

```text
convertx/
├── index.html
├── style.css
├── app.js
└── README.md
```

## GitHub Pages

1. Crie um repositório público.
2. Envie os quatro arquivos para a raiz.
3. Acesse **Settings → Pages**.
4. Em **Build and deployment**, escolha **Deploy from a branch**.
5. Selecione `main` e `/ (root)`.
6. Salve e aguarde a publicação.

## Observação

As cotações dependem das APIs externas, que podem sofrer indisponibilidade, CORS ou limites de requisição. O GitHub Pages hospeda o frontend; ele não fornece um backend para as APIs.

## Versão mobile

Esta versão foi preparada para usar o **mesmo link do site no computador e no celular**. Não existe uma segunda página mobile: o layout se adapta automaticamente ao tamanho da tela usando CSS responsivo.

### Melhorias para celulares

- Layout mobile-first nos principais pontos de quebra.
- Controles maiores e mais fáceis de tocar.
- Campos de entrada compatíveis com teclado numérico.
- Correção de overflow horizontal.
- Ajustes para telas pequenas de 390 px ou menos.
- Suporte melhor para navegadores iOS.
- Redução de efeitos que poderiam causar problemas visuais.
- Consultas com timeout de 8 segundos.
- Cancelamento lógico de resultados antigos para evitar que uma resposta atrasada sobrescreva uma conversão mais recente.
- Debounce de 220 ms no campo de valor para evitar excesso de chamadas enquanto o usuário digita.
- Relógios continuam funcionando localmente, sem chamadas de API a cada segundo.

### Mesmo link

Como o projeto continua usando `index.html` como entrada e não possui uma versão separada para celular, o GitHub Pages entrega o mesmo endereço em qualquer dispositivo.

Exemplo:

`https://SEU-USUARIO.github.io/convertx/`

No computador: interface desktop.

No celular: interface mobile.

No tablet: layout intermediário.

O endereço permanece exatamente o mesmo.
