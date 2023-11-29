import {Component} from "solid-js";
import {Select} from "@thisbeyond/solid-select";
import {Value} from "@thisbeyond/solid-select/dist/types/create-select";
import {Borough} from "../models";

import "@thisbeyond/solid-select/style.css";
import "../styles/boroughSelect.css";

const BoroughSelect: Component<{ onChange?: (value: Value) => void; }> = ({ onChange }) => {

  const options = [
    { label: 'Manhattan', name: Borough.MANHATTAN },
    { label: 'Brooklyn', name: Borough.BROOKLYN },
    { label: 'Queens', name: Borough.QUEENS },
    { label: 'The Bronx', name: Borough.BRONX },
    { label: 'Staten Island', name: Borough.SI }
  ];

  return (
    <fieldset class="yjc-borough-select-fieldset">
      <label class="yjc-borough-select-label" for="yjc-borough-select">
        Select Borough:
      </label>
      <Select
        id="yjc-borough-select"
        class="yjc-borough-select-control"
        options={options}
        format={(item) => item.label}
        placeholder="Filter by borough..."
        onChange={onChange}
      />
    </fieldset>
  );
}

export default BoroughSelect;
