import { readFileSync } from 'node:fs';
import { exit } from 'node:process';

let calibrationValueList: number[] = []
const digitRegex = /(\d)/g;

try {

    const data = readFileSync('./input.txt', 'utf-8');
    data.split(/\r?\n/).forEach(line => {
        const matchesIt = line.matchAll(digitRegex);
        const matchedGroupValues = [...matchesIt].map(match => match[1]);
        const firstDigit = matchedGroupValues[0];
        const lastDigit = matchedGroupValues.at(-1) ?? '';

        if (firstDigit === '' || lastDigit === '') {
            throw Error(`Could not match digit in string: ${line}`);
        }

        calibrationValueList.push(Number(firstDigit + lastDigit));
    });

} catch (err) {
    if (err instanceof Error) {
        console.error(err.message);
    } else {
        console.error("Unkonwn error");
    }
    exit(1);
}

console.log(`sum of calibration values: ${calibrationValueList.reduce((sum, current) => sum + current, 0)}`);
