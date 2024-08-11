export function getDistinctRandomNumbers(count: number, min: number, max: number): number[] {
  const numbers = new Set();
  while (numbers.size < count) {
    const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
    numbers.add(randomNum);
  }
  return Array.from(numbers) as number[];
}

export function getSingleRandomNumber(min: number, max: number): number {
  const randomNumbers = getDistinctRandomNumbers(1, min, max);
  return randomNumbers[0];
}

export function getCatNameFromImagePath(imagePath: string): string {
  const splitPath = imagePath.split('/');
  return splitPath[splitPath.length - 1].split('.')[0];
}