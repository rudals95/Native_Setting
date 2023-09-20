import {Dimensions} from 'react-native';

const basicDimensions = {
  height: 740,
  width: 360,
};

const width = Dimensions.get('window').width / basicDimensions.width;
const height = Dimensions.get('window').height / basicDimensions.height;

export {basicDimensions, width, height};
