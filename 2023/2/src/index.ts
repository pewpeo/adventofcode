import { readFileSync } from 'node:fs';
import { exit } from 'node:process';


const playRegex = /(\d+)\s(\w+)/g;
const gameIdRegex = /Game\s(\d+)/;

type Play = {
    red: number;
    green: number;
    blue: number;
};

type Game = {
    id: number;
    playList: Play[];
}

const playMax: Play = {
    "red": 12,
    "green": 13,
    "blue": 14
}

try {
    const data = readFileSync('./input.txt', 'utf-8');
    const gameList = data.split(/\r?\n/).map(line => {
        const gameSplit = line.split(':');
        const gameIdStr = gameSplit[0];
        const playListStr = gameSplit[1].split(';');

        const match = gameIdStr.match(gameIdRegex);
        const gameId = Number(match?.at(1)) ?? NaN;
        if (isNaN(gameId)) {
            throw Error(`Cannot parse game id from: ${gameIdStr}`)
        }

        let game: Game = { id: gameId, playList: new Array<Play>() };

        game.playList = playListStr.map(playStr => {
            const play: Play = { red: 0, green: 0, blue: 0 };
            const matchesIt = playStr.matchAll(playRegex);
            [...matchesIt].map(match => {
                if (match[2] === 'red') {
                    play['red'] = Number(match[1]);
                }
                if (match[2] === 'green') {
                    play['green'] = Number(match[1]);
                }
                if (match[2] === 'blue') {
                    play['blue'] = Number(match[1]);
                }
            });
            return play;
        });
        return game;
    });

    const possibleGameIds = gameList.map(game => {
        for (const play of game.playList) {
            if (play.red > playMax.red || play.green > playMax.green || play.blue > playMax.blue) {
                return 0;
            }
        }
        return game.id;
    });

    console.log(`sum of possible game ids: ${possibleGameIds.reduce((sum, current) => sum + current, 0)}`);

} catch (err) {
    if (err instanceof Error) {
        console.error(err.message);
    } else {
        console.error('Unkonwn error');
    }
    exit(1);
}
