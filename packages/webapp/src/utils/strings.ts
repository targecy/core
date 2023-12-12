// Makes string shorter by removing the middle part and replacing it with ...
export const shortString = (str: string, length: number) => {
  if (str.length <= length) return str;
  return `${str.substring(0, length / 2)}...${str.substring(str.length - length / 2, str.length)}`;
};
