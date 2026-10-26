/**
 * ConvertX — Google Apps Script
 *
 * Este endpoint usa GOOGLEFINANCE() dentro de uma planilha Google.
 * 1) Crie uma planilha vazia no Google Sheets.
 * 2) Extensões > Apps Script.
 * 3) Cole este código.
 * 4) Publique como aplicativo da Web.
 *
 * A função abaixo cria uma fórmula temporária em uma célula e lê o resultado.
 */
function doGet(e) {
  try {
    const from = String(e.parameter.from || "BRL").toUpperCase();
    const to = String(e.parameter.to || "USD").toUpperCase();

    if (from === to) return json({ok:true, rate:1, source:"GOOGLEFINANCE"});

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sh = ss.getSheets()[0];
    const cell = sh.getRange("Z1");

    // O Google Finance aceita o par no formato CURRENCY:BRLUSD.
    cell.setFormula('=GOOGLEFINANCE("CURRENCY:' + from + to + '")');
    SpreadsheetApp.flush();

    let rate = cell.getValue();
    cell.clearContent();

    if (typeof rate !== "number" || !isFinite(rate) || rate <= 0)
      throw new Error("O Google Finance não retornou uma taxa para este par.");

    return json({ok:true, rate:rate, source:"GOOGLEFINANCE", updated:new Date().toISOString()});
  } catch(err) {
    return json({ok:false, message:err.message});
  }
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}