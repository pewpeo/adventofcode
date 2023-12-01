import { readFileSync } from 'node:fs';
import { exit } from 'node:process';

let calibrationValueList: number[] = []

try {
    const firstDigitRegex = /^[^\d]*(\d)/; // first digit
    const lastDigitRegex = /(\d)(?!.*\d)/; // last digit

    const data = readFileSync('./input.txt', 'utf-8');
    data.split(/\r?\n/).forEach(line => {
        const matchFirst = line.match(firstDigitRegex);
        const firstDigit = matchFirst ? matchFirst[1] : "";

        const matchLast = line.match(lastDigitRegex);
        const lastDigit = matchLast ? matchLast[1] : "";

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
