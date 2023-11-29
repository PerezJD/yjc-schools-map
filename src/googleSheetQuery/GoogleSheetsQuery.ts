export default class GoogleSheetsQuery {

  static readonly #GOOGLE_VIZ_REGEX = /.*?\ngoogle\.visualization\.Query\.setResponse\((.*?)\);/;
  static readonly #BASE_URL = `https://docs.google.com/spreadsheets/d`;

  readonly #documentId: string;
  readonly #sheetName: string;

  constructor(documentId: string, sheetName: string) {
    this.#documentId = documentId;
    this.#sheetName = sheetName;
  }

  async querySheet(query: string) {
    const url = `${GoogleSheetsQuery.#BASE_URL}/${this.#documentId}/gviz/tq?sheet=${this.#sheetName}&tq=${encodeURIComponent(query)}`;

    try {
      const response = await fetch(url);
      const text = await response.text();
      const match = text.match(GoogleSheetsQuery.#GOOGLE_VIZ_REGEX);

      if (!match) throw new Error(`Unable to parse response from GSheet: ${GoogleSheetsQuery}`);

      const json = JSON.parse(match[1]);
      return json.table.rows;
    } catch (e) {
      console.error('Problem fetching geo data', e);
    }
  }
}
