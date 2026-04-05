import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Guideline sizes are based on standard ~5" screen mobile device
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

// Scale width proportionally
export const scale = (size: number) => (width / guidelineBaseWidth) * size;

// Scale height proportionally
export const verticalScale = (size: number) => (height / guidelineBaseHeight) * size;

// Scale with a factor to not let it grow too drastically on tablets
export const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

export const SIZES = {
  width,
  height,
};
