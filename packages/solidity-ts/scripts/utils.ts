import * as fs from 'fs';
import * as path from 'path';

// Function to save a string to a file
export const saveStringToFile = (str: string, fileName: string, override: boolean): void => {
  const dirFromFileName = path.dirname(fileName);
  const dirPath = path.join(__dirname, dirFromFileName);
  const filePath = path.join(__dirname, fileName);

  // Create the directory if it doesn't exist
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  // Override or append to the file
  if (override) {
    fs.writeFileSync(filePath, JSON.stringify(JSON.parse(str), null, 2), 'utf8');
  } else {
    const newJson = { ...JSON.parse(str), ...JSON.parse(getStringFromFile(fileName)) };
    fs.writeFileSync(filePath, JSON.stringify(newJson, null, 2), 'utf8');
  }
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
