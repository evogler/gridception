import { sum } from './util.js';

/*
IN:
{
  label: 'kick',
  sound: ['kick'],
  durations: [1],
  status: ['on', 'off', 'off', 'off'],
}

OUT:
(startTime, endTime) => events
*/

const interpretPart = part => {
  const { duration, status, sound } = part;
  const durationSum = sum(duration);

  return (startTime, endTime) => {
    let cycleNumber = Math.floor(startTime / durationSum);
    let timePos = cycleNumber * durationSum;
    let index = cycleNumber * part.duration.length;

    const events = [];
    while (timePos < startTime) {
      timePos += duration[index % duration.length];
      index += 1;
    }
    while (timePos < endTime) {
      const event = {
        time: timePos,
        status: status[index % status.length],
        sound: sound[index % sound.length],
        listeners: [],
      };
      events.push(event);
      timePos += duration[index % duration.length];
      index += 1;
    }

    return events;
  };
}

export default interpretPart;
