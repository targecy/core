export function uint8ArrayToBase64String(uint8Array: Uint8Array) {
  return btoa(String.fromCharCode.apply(null, Array.from(uint8Array)));
}

export function base64StringToUint8Array(base64String: string) {
  const binaryString = atob(base64String);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}
