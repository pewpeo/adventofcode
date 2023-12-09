import { readFileSync } from 'node:fs';
import { exit } from 'node:process';

const matchNumbers = (line: string) => {
    return [...line.matchAll(/\d+/g)].map(match => Number(match[0]));
}

type Race = {
    time: number;
    recordDistance: number;
}

let races: Race[] = []; // part 1
let race: Race = { time: 0, recordDistance: 0 }; // part 2

try {
    // part 1
    let times: number[] = [];
    let distances: number[] = [];

    // part 2
    let time = 0;
    let distance = 0;

    const data = readFileSync('./input.txt', 'utf-8');
    data.split(/\r?\n/).forEach(line => {
        if (line.startsWith("Time")) {
            times = matchNumbers(line); // part 1
            time = Number(times.map(String).join('')); // part 2

        } else if (line.startsWith("Distance")) {
            distances = matchNumbers(line); // part 1
            distance = Number(distances.map(String).join('')); // part 2
        }
    });

    // part 1
    for (let i = 0; i < times.length; i++) {
        races.push({ time: times[i], recordDistance: distances[i] });
    }

    // part 2
    race = { time: time, recordDistance: distance }

} catch (err) {
    if (err instanceof Error) {
        console.error(err.message);
    } else {
        console.error('Unkonwn error');
    }
    exit(1);
}

console.log('races:', races);

const getWinningScenarios = (race: Race) => {
    let winningScenarios = 0;
    for (let t = 1; t < race.time; t++) { // exclude zero time and zero restTime
        const speed = t; // press button for t ms -> speed in mm/ms
        const restTime = race.time - t; // action driving time
        const distance = speed * restTime;
        if (distance > race.recordDistance) {
            winningScenarios += 1;
        }
    }
    return winningScenarios;
}

// part 1
let winningScenariosPerRace = races.map(race => getWinningScenarios(race));
const result = winningScenariosPerRace.reduce((result, current) => result * current, 1);

console.log("winningScenariosPerRace", winningScenariosPerRace);
console.log("result:", result);

// part 2
console.log("result2:", getWinningScenarios(race));
