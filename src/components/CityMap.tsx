import {Component, createEffect, For, onMount, Show} from "solid-js";
import {createStore} from "solid-js/store";
import {Loader} from "@googlemaps/js-api-loader";
import {Borough, BOROUGH_DISPLAY_NAME, BOROUGH_POSITIONS, School, SchoolMarker} from "../models";
import BoroughSelect from "./BoroughSelect";

// Styles
import "@thisbeyond/solid-select/style.css";
import "../styles/grid.css";
import "../styles/schoolMap.css";
import "../styles/schoolList.css";

interface CityMapProps {
  apiKey: string;
  schools: School[];
  additionalOptions?: any;
}

interface CityMapState {
  map: google.maps.Map | null;
  borough: Borough;
  schoolMarkers: SchoolMarker[];
  visibleSchools: SchoolMarker[];
}

const DEFAULT_ZOOM = 11;

const CityMap: Component<CityMapProps> = ({ apiKey, schools = [], additionalOptions }) => {
  console.log('Rendering CityMap');
  const [state, setState] = createStore<CityMapState>({
    map: null,
    borough: Borough.MANHATTAN,
    schoolMarkers: [],
    visibleSchools: []
  });

  const infoWindowContent = (school: School): Element => {
    const mc = document.createElement('div');
    mc.innerHTML = `
      <div>
        <bold>${school.name}</bold>
        <a href="${school.link}" target=”_blank” rel=“noreferrer”><p>${school.publication}</p></a>
        <p>${school.address}</p>
      </div>
    `;

    return mc;
  }

  onMount(async () => {
    const loader = new Loader({
      version: "weekly",
      apiKey,
      ...additionalOptions
    });

    const { Map, InfoWindow } = await loader.importLibrary("maps");
    const { AdvancedMarkerElement } = await loader.importLibrary("marker");

    const map = new Map(document.getElementById('yjc-borough-map') as HTMLElement, {
      mapId: 'yjc-schools-map',
      center: BOROUGH_POSITIONS[Borough.MANHATTAN],
      zoom: DEFAULT_ZOOM
    });

    const schoolMarkers = schools.reduce((acc: SchoolMarker[], school) => {
      const { position } = school;
      if (!position.lat || !position.lng) return acc;

      try {
        const marker = new AdvancedMarkerElement({
          map: null,
          position: school.position,
          title: school.name
        });

        const infoWindow = new InfoWindow({
          content: infoWindowContent(school),
        });

        marker.addListener("click", () => {
          infoWindow.open({
            map,
            anchor: marker
          });
        });

        acc.push({ ...school, marker });
      } catch(error) {
        console.error('Unable to mark school', school);
      }

      return acc;
    }, []).filter((s) => !!s );

    setState((prev) => ({
      ...prev,
      map,
      schoolMarkers
    }));
  });

  createEffect(() => {
    const map = state.map;
    if (!map) return;

    const realBorough = state.borough === Borough.STATEN_ISLAND ? Borough.SI : state.borough;

    map.setCenter(BOROUGH_POSITIONS[realBorough]);
    map.setZoom(DEFAULT_ZOOM);

    const visibleSchools = state.schoolMarkers.reduce((visibleSchools: SchoolMarker[], schoolMarker) => {
      if(schoolMarker.borough === realBorough) {
        schoolMarker.marker.setMap(map);
        visibleSchools.push(schoolMarker);
      } else {
        schoolMarker.marker.setMap(null);
      }

      return visibleSchools;
    }, []);

    setState('visibleSchools', visibleSchools);
  });

  return (
    <div id="yjc-borough-map-container">
      <div id="yjc-borough-map" style={{ width: "100%" }}/>
      <div class="yjc-school-list-container grid-container">
        <h3 class="transitionFadeIn yjc-school-list-borough-title">
          <span
            class="sqsrte-text-highlight"
            data-text-attribute-id="ded9e9df-aeaf-4991-998d-59b8d30569a3">
            {BOROUGH_DISPLAY_NAME[state.borough]}
          </span>
        </h3>
        <BoroughSelect onChange={(value) => setState('borough', value.name)} />
      </div>
      <Show when={state.schoolMarkers.length}>
        <ul class="yjc-school-list grid-container">
          <For each={state.visibleSchools}>{
            (schoolMarker) => (
              <li class="yjc-school-list-item">
                <div class="sqs-html-content">
                  <a href={schoolMarker.link} target="_blank">
                    <p class="sqsrte-large transitionFadeIn">
                      <strong>{schoolMarker.publication}</strong>
                    </p>
                    <p class="transitionFadeIn">
                      {schoolMarker.name}
                    </p>
                    <p class="transitionFadeIn">
                      {schoolMarker.address}
                    </p>
                  </a>
                </div>
              </li>
            )
          }</For>
        </ul>
      </Show>
    </div>
  );
};

export default CityMap;
