/**
 * Convert bytes to french human readable file size (Mo, Go, Ko, etc.)
 * @param bytes
 * @param si
 */
export const humanFileSize = (bytes: number) => {
  let theBytes = bytes;
  if (Math.abs(theBytes) < 1024) {
    return `${theBytes} B`;
  }
  const units = ["Ko", "Mo", "Go", "To", "Po", "Eo", "Zo", "Yo"];
  let u = -1;
  do {
    theBytes /= 1024;
    u += 1;
  } while (Math.abs(theBytes) >= 1024 && u < units.length - 1);
  return `${theBytes.toFixed(1)} ${units[u]}`;
};
