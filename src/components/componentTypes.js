import SoundGrid from './SoundGrid.jsx';
import HitsGrid from './HitsGrid.jsx';
import RatioBox from './RatioBox.jsx';

const componentTypes = {
  'node': SoundGrid,
  'ratioNode': RatioBox,
  'hitsNode': HitsGrid,
};

export { SoundGrid, HitsGrid, RatioBox, componentTypes};
