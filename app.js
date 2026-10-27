const currencies={BRL:"Real brasileiro",USD:"Dólar americano",EUR:"Euro",GBP:"Libra esterlina",JPY:"Iene japonês",CAD:"Dólar canadense",AUD:"Dólar australiano",CHF:"Franco suíço",CNY:"Yuan chinês",ARS:"Peso argentino",MXN:"Peso mexicano",CLP:"Peso chileno",PEN:"Sol peruano",AED:"Dirham dos Emirados",ZAR:"Rand sul-africano",KRW:"Won sul-coreano",INR:"Rupia indiana",TRY:"Lira turca",PLN:"Zloty polonês",SEK:"Coroa sueca",NOK:"Coroa norueguesa",DKK:"Coroa dinamarquesa",NZD:"Dólar neozelandês",BTC:"Bitcoin",ETH:"Ethereum",USDT:"Tether",BNB:"BNB",SOL:"Solana",XRP:"XRP",ADA:"Cardano",DOGE:"Dogecoin"};
const crypto={BTC:"bitcoin",ETH:"ethereum",USDT:"tether",BNB:"binancecoin",SOL:"solana",XRP:"ripple",ADA:"cardano",DOGE:"dogecoin"};
const flags={BRL:"🇧🇷",USD:"🇺🇸",EUR:"🇪🇺",GBP:"🇬🇧",JPY:"🇯🇵",CAD:"🇨🇦",AUD:"🇦🇺",CHF:"🇨🇭",CNY:"🇨🇳",ARS:"🇦🇷",MXN:"🇲🇽",CLP:"🇨🇱",PEN:"🇵🇪",AED:"🇦🇪",ZAR:"🇿🇦",KRW:"🇰🇷",INR:"🇮🇳",TRY:"🇹🇷",PLN:"🇵🇱",SEK:"🇸🇪",NOK:"🇳🇴",DKK:"🇩🇰",NZD:"🇳🇿"};
const $=s=>document.querySelector(s),from=$("#from"),to=$("#to"),amount=$("#amount"),result=$("#result"),error=$("#error"),convertButton=$("#convert");

function populateCurrencies(){
  const f=document.createDocumentFragment();
  for(const [code,name] of Object.entries(currencies)) for(const select of [from,to]){
    const o=document.createElement("option");o.value=code;o.textContent=`${flags[code]||"🪙"} ${code} — ${name}`;select.appendChild(o);
  }
  from.value="BRL";to.value="USD";
}
function fmt(n,c){return new Intl.NumberFormat("pt-BR",{maximumFractionDigits:crypto[c]?8:2}).format(n)}
function icons(){$("#fromIcon").textContent=flags[from.value]||"🪙";$("#toIcon").textContent=flags[to.value]||"🪙"}
async function safeFetch(url,timeout=8000){
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),timeout);
  try{
    const response=await fetch(url,{signal:controller.signal,cache:"no-store"});
    return response;
  }catch(e){
    if(e.name==="AbortError") throw Error("A consulta demorou demais. Tente novamente.");
    throw e;
  }finally{clearTimeout(timer)}
}
async function fx(a,b){
  if(a===b)return 1;
  const r=await safeFetch(`https://api.frankfurter.dev/v2/rate/${a}/${b}`);
  if(!r.ok)throw Error("Fonte de câmbio indisponível.");
  const d=await r.json();
  if(!Number.isFinite(d.rate))throw Error("Cotação inválida recebida.");
  return Number(d.rate);
}
async function cg(a,b){
  const ids=[crypto[a],crypto[b]].filter(Boolean).join(",");
  const r=await safeFetch(`https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(ids)}&vs_currencies=usd`);
  if(!r.ok)throw Error("Fonte de cripto indisponível.");
  const d=await r.json(),ua=crypto[a]?d[crypto[a]]?.usd:1,ub=crypto[b]?d[crypto[b]]?.usd:1;
  if(ua==null||ub==null)throw Error("Cripto não encontrada.");
  if(a==="USD"||b==="USD")return ua/ub;
  if(crypto[a])return ua*(crypto[b]?1/ub:await fx("USD",b));
  return ua/(ub*await fx("USD",a));
}
let conversionRequest=0;
async function convert(){
  const requestId=++conversionRequest;
  icons();error.textContent="";
  const v=Number(amount.value),a=from.value,b=to.value;
  if(!Number.isFinite(v)||v<0){result.value="";$("#quote").textContent="Digite um valor válido";$("#updated").textContent="Aguardando";return}
  convertButton.disabled=true;convertButton.querySelector("span").textContent="Consultando…";$("#updated").textContent="Consultando cotação…";
  try{
    const rate=(crypto[a]||crypto[b])?await cg(a,b):await fx(a,b);
    if(requestId!==conversionRequest)return;
    result.value=fmt(v*rate,b);$("#quote").textContent=`1 ${a} = ${fmt(rate,b)} ${b}`;$("#updated").textContent="Atualizado agora";
    $("#source").textContent=(crypto[a]||crypto[b])?"CoinGecko + Frankfurter":"Frankfurter";
  }catch(e){
    if(requestId!==conversionRequest)return;
    result.value="";$("#quote").textContent="Cotação indisponível";$("#updated").textContent="Tente novamente";error.textContent=e.message||"Não foi possível consultar a cotação.";
  }finally{
    if(requestId===conversionRequest){convertButton.disabled=false;convertButton.querySelector("span").textContent="Converter agora"}
  }
}

const marketPairs=[["BRL","USD","Dólar comercial"],["BRL","EUR","Euro"],["BRL","GBP","Libra esterlina"],["BRL","JPY","Iene japonês"],["EUR","USD","Euro x Dólar"],["USD","JPY","Dólar x Iene"]];
async function loadMarkets(){
  const grid=$("#marketGrid");
  grid.innerHTML=marketPairs.map(([a,b,n])=>`<article class="market-card loading"><span>${a} / ${b}</span><strong>Consultando…</strong><small>${n}</small></article>`).join("");
  const cards=[...grid.children];
  await Promise.all(marketPairs.map(async([a,b,n],i)=>{
    try{
      const rate=await fx(a,b);
      cards[i].classList.remove("loading");
      cards[i].innerHTML=`<span>${a} / ${b}<span class="trend">● ONLINE</span></span><strong>${fmt(rate,b)} ${b}</strong><small>${n} · 1 ${a}</small>`;
    }catch{
      cards[i].classList.remove("loading");
      cards[i].innerHTML=`<span>${a} / ${b}</span><strong>Indisponível</strong><small>${n}</small>`;
    }
  }));
}

const clocks=[
  ["São Paulo","America/Sao_Paulo","Brasil"],["Nova York","America/New_York","EUA"],
  ["Londres","Europe/London","Reino Unido"],["Frankfurt","Europe/Berlin","Alemanha"],
  ["Dubai","Asia/Dubai","Emirados Árabes"],["Tóquio","Asia/Tokyo","Japão"],
  ["Hong Kong","Asia/Hong_Kong","Hong Kong"],["Sydney","Australia/Sydney","Austrália"]
];
function renderClocks(){
  const now=new Date();
  $("#clockDate").textContent=new Intl.DateTimeFormat("pt-BR",{dateStyle:"full"}).format(now);
  $("#clockGrid").innerHTML=clocks.map(([city,tz,country])=>`<article class="clock"><div class="city"><span>${city}</span><i></i></div><time>${new Intl.DateTimeFormat("pt-BR",{timeZone:tz,hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:false}).format(now)}</time><small>${country}</small></article>`).join("");
}
function setupPopular(){
  const popular=[["BRL","USD","R$","$"],["USD","BRL","$","R$"],["EUR","BRL","€","R$"],["BRL","BTC","R$","₿"],["BTC","USD","₿","$"],["ETH","BRL","Ξ","R$"]];
  const f=document.createDocumentFragment();
  popular.forEach(([a,b,x,y])=>{const btn=document.createElement("button");btn.className="card";btn.type="button";btn.innerHTML=`<div class="icons"><b>${x}</b><span>→</span><b>${y}</b></div><strong>${a} → ${b}</strong><small>Clique para converter</small>`;btn.onclick=()=>{from.value=a;to.value=b;convert()};f.appendChild(btn)});
  $("#cards").appendChild(f);
}
let inputTimer;
const scheduleConvert=()=>{clearTimeout(inputTimer);inputTimer=setTimeout(convert,220)};
$("#convert").onclick=convert;
$("#refresh").onclick=()=>{convert();loadMarkets()};
from.onchange=convert;
to.onchange=convert;
amount.oninput=scheduleConvert;
$("#swap").onclick=()=>{[from.value,to.value]=[to.value,from.value];convert()};
populateCurrencies();setupPopular();renderClocks();convert();loadMarkets();setInterval(renderClocks,1000);
