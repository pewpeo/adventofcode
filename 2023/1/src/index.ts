import { readFileSync } from 'node:fs';
import { exit } from 'node:process';

let calibrationValueList: number[] = []

type DigitName = {
    name: string;
    valueStr: string;
}

const digitNameMapList: DigitName[] = [
    { name: 'one', valueStr: '1' },
    { name: 'two', valueStr: '2' },
    { name: 'three', valueStr: '3' },
    { name: 'four', valueStr: '4' },
    { name: 'five', valueStr: '5' },
    { name: 'six', valueStr: '6' },
    { name: 'seven', valueStr: '7' },
    { name: 'eight', valueStr: '8' },
    { name: 'nine', valueStr: '9' }
];

const orDigitName = digitNameMapList.reduce((sum, current) => sum + '|' + current.name, '');
const digitRegex = new RegExp(`(?=(\\d${orDigitName}))`, 'g');

const getDigitFromName = (name: string) => {
    const digitMapElem = digitNameMapList.find(elem => elem.name == name);
    return digitMapElem?.valueStr ?? '';
}

try {
    const data = readFileSync('./input.txt', 'utf-8');
    data.split(/\r?\n/).forEach(line => {
        const matchesIt = line.matchAll(digitRegex);
        const matchedGroupValues = [...matchesIt].map(match => match[1]);
        let firstDigit = matchedGroupValues[0];
        let lastDigit = matchedGroupValues.at(-1) ?? '';

        if (isNaN(Number(firstDigit))) {
            firstDigit = getDigitFromName(firstDigit);
        }
        
        if (isNaN(Number(lastDigit))) {
            lastDigit = getDigitFromName(lastDigit);
        }

        if (firstDigit === '' || lastDigit === '') {
            throw Error(`Could not match digit in string: ${line}`);
        }

        calibrationValueList.push(Number(firstDigit + lastDigit));
    });

} catch (err) {
    if (err instanceof Error) {
        console.error(err.message);
    } else {
        console.error('Unkonwn error');
    }
    exit(1);
}

console.log(`sum of calibration values: ${calibrationValueList.reduce((sum, current) => sum + current, 0)}`);
