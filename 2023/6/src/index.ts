import { readFileSync } from 'node:fs';
import { exit } from 'node:process';

const matchNumbers = (line: string) => {
    return [...line.matchAll(/\d+/g)].map(match => Number(match[0]));
}

type Race = {
    time: number;
    recordDistance: number;
}

let races: Race[] = [];

try {
    let times: number[] = [];
    let distances: number[] = [];

    const data = readFileSync('./input.txt', 'utf-8');
    data.split(/\r?\n/).forEach(line => {
        if (line.startsWith("Time")) {
            times = matchNumbers(line);
        } else if (line.startsWith("Distance")) {
            distances = matchNumbers(line);
        }
    });

    for (let i = 0; i < times.length; i++) {
        races.push({time: times[i], recordDistance: distances[i]});
    }
} catch (err) {
    if (err instanceof Error) {
        console.error(err.message);
    } else {
        console.error('Unkonwn error');
    }
    exit(1);
}

console.log('races:', races);

let winningScenariosPerRace = races.map(race => {
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
});

const result = winningScenariosPerRace.reduce((result, current) => result * current, 1);

console.log("winningScenariosPerRace", winningScenariosPerRace);
console.log("result:", result);
