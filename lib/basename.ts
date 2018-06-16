export function basename(path: string | null | undefined): string {
  if (!path) {
    return '';
  }
  const filename = filenameFrom(path);
  return nameWithoutExtensionFrom(filename);
}

function filenameFrom(path: string) {
  const subPaths = path.replace('\\', '/').split('/');
  return subPaths[subPaths.length - 1];
}

function nameWithoutExtensionFrom(filename: string) {
  const lastDotIndex = filename.lastIndexOf('.');
  if (lastDotIndex === 0 || lastDotIndex === -1) {
    return filename;
  }
  return filename.substring(0, lastDotIndex);
}
