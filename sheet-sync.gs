/**
 * SamadhanHub → Google Sheet mirror (paste this whole file into
 * Extensions → Apps Script, then Deploy → New deployment → Web app).
 *
 * Deploy settings: Execute as = Me. Who has access = Anyone.
 * Copy the Web App URL into backend/.env as APPS_SCRIPT_URL.
 *
 * Expects POST JSON: { "sheet": "challenges" | "solutions" | "users",
 *                       "row": { "title": "...", ... } }
 * Creates one tab per collection; first write creates header columns
 * from the row keys, later writes append below. Visit the Web App URL
 * with ?ping=1 to check it is alive: {"ok":true}.
 */
function doPost(e) {
  try {
    var data = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    var name = String(data.sheet || 'challenges');
    var row = data.row || {};
    if (name !== 'challenges' && name !== 'solutions' && name !== 'users') name = 'challenges';

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sh = ss.getSheetByName(name);
    if (!sh) {
      sh = ss.insertSheet(name);
      sh.appendRow(Object.keys(row)); // header row on first write
    } else if (sh.getLastRow() === 0) {
      sh.appendRow(Object.keys(row));
    }
    var headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
    var values = headers.map(function (h) {
      var v = row[h];
      return v === undefined || v === null ? '' : String(v);
    });
    sh.appendRow(values);
    return ContentService.createTextOutput(
      JSON.stringify({ ok: true, sheet: name, row: sh.getLastRow() })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ ok: false, error: String(err && err.message || err).slice(0, 200) })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  var ok = true;
  if (e && e.parameter && e.parameter.ping) {
    return ContentService.createTextOutput(JSON.stringify({ ok: ok }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  return ContentService.createTextOutput(
    JSON.stringify({ ok: ok, usage: 'POST {sheet,row} to append. ?ping=1 to check.' })
  ).setMimeType(ContentService.MimeType.JSON);
}
