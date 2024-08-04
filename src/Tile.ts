export class Tile {
  id: number;
  patternId: number;
  color: string;
  isUsed: boolean;
  constructor(patternId: number, color: string, id: number) {
    this.patternId = patternId;
    this.color = color;
    this.id = id;
    this.isUsed = false;
  }
}