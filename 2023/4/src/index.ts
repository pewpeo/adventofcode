import { readFileSync } from 'node:fs';
import { exit } from 'node:process';

class Game {
    public winning: number[];
    public myNumbers: number[];
    public score: number = 0;

    constructor(winning: number[], myNumbers: number[]) {
        this.winning = winning;
        this.myNumbers = myNumbers;
    }

    public play() {
        this.score = 0;
        this.myNumbers.forEach(number => {
            if (this.winning.includes(number)) {
                this.score = this.score > 0 ? this.score * 2 : 1
            }
        });
    }
}

try {
    const data = readFileSync('./input.txt', 'utf-8');
    const gameList = data.split(/\r?\n/).map(line => {
        const splitNumbers = line.split(':')[1].split('|');

        const winning = [...splitNumbers[0].matchAll(/\d+/g)].map(match => Number(match[0]));
        const myNumbers = [...splitNumbers[1].matchAll(/\d+/g)].map(match => Number(match[0]));

        return new Game(winning, myNumbers);
    });

    const sumScore = gameList.reduce((sum, game) => {
        game.play();
        return sum + game.score;
    }, 0);

    console.log(`Sum of score: ${sumScore}`);

} catch (err) {
    if (err instanceof Error) {
        console.error(err.message);
    } else {
        console.error('Unkonwn error');
    }
    exit(1);
}
