import {Component, createSignal, onMount, Show} from "solid-js";
import LocalCache from "./cache/LocalCache";
import GoogleSheetsQuery from "./googleSheetQuery/GoogleSheetsQuery";
import {School} from "./models";
import CityMap from "./components/CityMap";

interface AppProps {
  cache: LocalCache;
  googleSheetQuery: GoogleSheetsQuery;
  googleMapsApiKey: string;
  googleMapsApiSig?: string;
}

const SCHOOLS_CACHE_KEY = 'schools';

const App: Component<AppProps> = ({ cache, googleSheetQuery, googleMapsApiKey }: AppProps) => {
  console.log('Rendering App');
  const [schools, setSchools] = createSignal<School[]>([]);

  onMount(async () => {
    const cachedSchools = cache.get(SCHOOLS_CACHE_KEY);
    if (cachedSchools) {
      setSchools(JSON.parse(cachedSchools));
    }

    const rows = await googleSheetQuery.querySheet("Select A,B,C,D,F,G Where G <> ''");

    const schools: School[] = rows.reduce((schools: School[], row: any) => {
      const name = row.c[0]?.v;
      const publication = row.c[1]?.v;
      const link = row.c[2]?.v;
      const address = row.c[3]?.v;
      const borough = row.c[4]?.v;
      const coordinate = row.c[5]?.v;

      if (name != 'School') {
        const coordinates = coordinate.split(', ');
        schools.push({
          name,
          publication,
          link,
          address,
          borough,
          position: {
            lat: Number(coordinates[0]),
            lng: Number(coordinates[1])
          }
        })
      }

      return schools;
    }, []);

    if (schools.length) {
      cache.set(SCHOOLS_CACHE_KEY, schools, { minutes: 5 });
    }

    setSchools(schools);
  });

  return (
    <Show when={schools().length}>
      <CityMap apiKey={googleMapsApiKey} schools={schools()}/>
    </Show>
  );
};

export default App;
