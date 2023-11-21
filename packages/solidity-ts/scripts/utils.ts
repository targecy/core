import * as fs from 'fs';
import * as path from 'path';

// Function to save a string to a file
export const saveStringToFile = (str: string, fileName: string): void => {
  const filePath = path.join(__dirname, fileName);
  fs.writeFileSync(filePath, str, 'utf8');
  console.log(`Saved string to ${filePath}`);
};

export const getStringFromFile = (fileName: string): string => {
  const filePath = path.join(__dirname, fileName);
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, 'utf8');
    return data;
  } else {
    console.log(`File ${filePath} does not exist.`);
    return '';
  }
};
