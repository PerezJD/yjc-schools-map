import {Component, ParentProps} from "solid-js";
import "../styles/ratioBox.css";

export type Ratio = [number, number];

export interface RatioBoxProps extends ParentProps {
  ratio?: Ratio;
  component?: string;
}

const RatioWrapper: Component<RatioBoxProps> = ({ ratio = [16,9], ...props }) =>  {

  const padding = () => {
    const [w, h] = ratio;
    return `${(h / w) * 100}%`;
  };

  return <div class="aspect-ratio-box" style={{ 'padding-top': `${padding()}` }} {...props} />;

};

export default RatioWrapper;
