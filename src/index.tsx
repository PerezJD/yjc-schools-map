/* @refresh reload */
import { render } from "solid-js/web";

import App from "./App";
import LocalCache from "./cache/LocalCache";
import GoogleSheetsQuery from "./googleSheetQuery/GoogleSheetsQuery";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const DOCUMENT_ID = import.meta.env.VITE_DOCUMENT_ID;
const SHEET_NAME = import.meta.env.VITE_SHEET_NAME;

const localCache = new LocalCache('yjc');
const googleSheetQuery = new GoogleSheetsQuery(DOCUMENT_ID, SHEET_NAME);

const loadMap = () => {
  const interval = setInterval(() => {
    const root = document.getElementById('yjc-map');
    if (root !== null) {
      clearInterval(interval);
      document.removeEventListener("DOMContentLoaded", loadMap);

      render(() => <App
        cache={localCache}
        googleSheetQuery={googleSheetQuery}
        googleMapsApiKey={GOOGLE_MAPS_API_KEY}
      />, root);
    }
  }, 500);
};

document.addEventListener("DOMContentLoaded", loadMap);
