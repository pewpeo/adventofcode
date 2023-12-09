import { readFileSync } from 'node:fs';
import { exit } from 'node:process';

class Game {
    public id: number = 0;
    public winning: number[];
    public myNumbers: number[];
    public score: number = 0;

    constructor(id: number, winning: number[], myNumbers: number[]) {
        this.id = id;
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

    public play2() {
        this.score = 0;
        this.myNumbers.forEach(number => {
            if (this.winning.includes(number)) {
                this.score += 1;
            }
        });
    }
}

try {
    const data = readFileSync('./input.txt', 'utf-8');
    const gameList = data.split(/\r?\n/).map(line => {

        const lineSplit = line.split(':');
        const gameId = Number(lineSplit[0].match(/Card\s(\d+)/)?.at(1)) ?? NaN;
        const splitNumbers = lineSplit[1].split('|');

        const winning = [...splitNumbers[0].matchAll(/\d+/g)].map(match => Number(match[0]));
        const myNumbers = [...splitNumbers[1].matchAll(/\d+/g)].map(match => Number(match[0]));

        return new Game(gameId, winning, myNumbers);
    });

    // part 1

    const sumScore = gameList.reduce((sum, game) => {
        game.play();
        return sum + game.score;
    }, 0);

    // part 2

    let gameMultiplier = gameList.map(_ => 1);
    for (const game of gameList) {
        game.play2();
        for (let i = game.id; i < game.id + game.score && i < gameList.length; i++) { // game.id == currentIdx + 1
            gameMultiplier[i] += gameMultiplier[game.id - 1];
        }
    }
    const sumScore2 = gameMultiplier.reduce((sum, current) => sum + current, 0);

    // part 2 - recursive

    let gameCnt = 0;
    const play = (game: Game) => {
        gameCnt++;
        game.play2();
        // console.log(`game: ${game.id}, score: ${game.score}`)

        const wonGames: Game[] = []
        for (let i = game.id; i < game.id + game.score && i < gameList.length; i++) { // game.id == currentIdx + 1
            // console.log(`  id: ${gameList[i].id}`)
            wonGames.push(gameList[i]);
        }
        wonGames.forEach(game => play(game));

    }

    for (const game of gameList) {
        play(game);
    }

    // results

    console.log(`Sum of score: ${sumScore}`);
    console.log(`Sum of score 2: ${sumScore2}`);
    console.log(`Sum of score 2 recursive: ${gameCnt}`);

} catch (err) {
    if (err instanceof Error) {
        console.error(err.message);
    } else {
        console.error('Unkonwn error');
    }
    exit(1);
}
