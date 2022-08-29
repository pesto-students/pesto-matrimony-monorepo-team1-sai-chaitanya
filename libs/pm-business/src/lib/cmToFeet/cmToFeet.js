export const cmToInFeet = (cm) => {
  const inches = Math.round(cm / 2.54);
  return `${Math.floor(inches / 12)}' ${inches % 12}"`;
};
