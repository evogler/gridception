const drum = {
  kick: 1,
  snare: 2,
  closedHat: 3,
  openHat: 4,
  ride: 5,
}

class Part {
  constructor() {
    this.rhythm = [1];
    this.notes = [[drum.kick, drum.closedHat], drum.closedHat, [drum.snare, drum.closedHat], drum.openHat];
  }
}