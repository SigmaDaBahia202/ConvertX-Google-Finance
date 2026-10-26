const currencies={BRL:"Real brasileiro",USD:"Dólar americano",EUR:"Euro",GBP:"Libra esterlina",JPY:"Iene japonês",CAD:"Dólar canadense",AUD:"Dólar australiano",CHF:"Franco suíço",CNY:"Yuan chinês",ARS:"Peso argentino",MXN:"Peso mexicano",CLP:"Peso chileno",PEN:"Sol peruano",AED:"Dirham dos Emirados",ZAR:"Rand sul-africano",KRW:"Won sul-coreano",INR:"Rupia indiana",TRY:"Lira turca",PLN:"Zloty polonês",SEK:"Coroa sueca",NOK:"Coroa norueguesa",DKK:"Coroa dinamarquesa",NZD:"Dólar neozelandês",BTC:"Bitcoin",ETH:"Ethereum",USDT:"Tether",BNB:"BNB",SOL:"Solana",XRP:"XRP",ADA:"Cardano",DOGE:"Dogecoin"};
const crypto={BTC:"bitcoin",ETH:"ethereum",USDT:"tether",BNB:"binancecoin",SOL:"solana",XRP:"ripple",ADA:"cardano",DOGE:"dogecoin"};
const flags={BRL:"🇧🇷",USD:"🇺🇸",EUR:"🇪🇺",GBP:"🇬🇧",JPY:"🇯🇵",CAD:"🇨🇦",AUD:"🇦🇺",CHF:"🇨🇭",CNY:"🇨🇳",ARS:"🇦🇷",MXN:"🇲🇽",CLP:"🇨🇱",PEN:"🇵🇪",AED:"🇦🇪",ZAR:"🇿🇦",KRW:"🇰🇷",INR:"🇮🇳",TRY:"🇹🇷",PLN:"🇵🇱",SEK:"🇸🇪",NOK:"🇳🇴",DKK:"🇩🇰",NZD:"🇳🇿"};
const from=document.querySelector("#from"),to=document.querySelector("#to"),amount=document.querySelector("#amount"),result=document.querySelector("#result"),error=document.querySelector("#error");
function fill(el,chosen){for(const [c,n] of Object.entries(currencies)){let o=document.createElement("option");o.value=c;o.textContent=(flags[c]||"🪙")+" "+c+" — "+n;o.selected=c===chosen;el.appendChild(o)}}
fill(from,"BRL");fill(to,"USD");
function fmt(n,c){return new Intl.NumberFormat("pt-BR",{maximumFractionDigits:crypto[c]?8:2}).format(n)}
function icons(){document.querySelector("#fi").textContent=flags[from.value]||"🪙";document.querySelector("#ti").textContent=flags[to.value]||"🪙"}
async function googleRate(a,b){
 if(a===b)return 1;
 if(crypto[a]||crypto[b]) return null;
 // Apps Script URL is inserted below after deployment.
 const GOOGLE_SCRIPT_URL=localStorage.getItem("convertx_google_script_url")||"";
 if(!GOOGLE_SCRIPT_URL) throw new Error("Configure a URL do Google Apps Script no campo de configuração.");
 const u=GOOGLE_SCRIPT_URL+"?from="+encodeURIComponent(a)+"&to="+encodeURIComponent(b);
 const r=await fetch(u,{cache:"no-store"}); if(!r.ok)throw new Error("Google Apps Script não respondeu");
 const d=await r.json(); if(!d.ok)throw new Error(d.message||"Cotação indisponível"); return Number(d.rate);
}
async function cryptoRate(a,b){
 let ids=[crypto[a],crypto[b]].filter(Boolean).join(",");
 let r=await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`);if(!r.ok)throw Error("CoinGecko não respondeu");
 let d=await r.json(),ua=crypto[a]?d[crypto[a]]?.usd:1,ub=crypto[b]?d[crypto[b]]?.usd:1;if(ua==null||ub==null)throw Error();
 if(a==="USD"||b==="USD")return ua/ub;
 // Para pares cripto/fiat, usamos USD como ponte. A parte fiat também passa pelo Google.
 const fiat=crypto[a]?b:a, x=await googleRate("USD",fiat);
 return crypto[a]?(ua*x/ub):(ua/(ub*x));
}
async function convert(){
 icons();error.textContent="";
 let v=Number(amount.value),a=from.value,b=to.value;
 if(!Number.isFinite(v)||v<0){result.value="";return}
 document.querySelector("#updated").textContent="Consultando Google…";
 try{let rate=(crypto[a]||crypto[b])?await cryptoRate(a,b):await googleRate(a,b);result.value=fmt(v*rate,b);document.querySelector("#quote").textContent=`1 ${a} = ${fmt(rate,b)} ${b}`;document.querySelector("#updated").textContent="Cotação consultada agora"}catch(e){result.value="";document.querySelector("#quote").textContent="Cotação indisponível";document.querySelector("#updated").textContent="Configure o Google Apps Script";error.textContent=e.message}}
document.querySelector("#convert").onclick=convert;document.querySelector("#refresh").onclick=convert;from.onchange=convert;to.onchange=convert;amount.oninput=convert;document.querySelector("#swap").onclick=()=>{let x=from.value;from.value=to.value;to.value=x;convert()};
convert();