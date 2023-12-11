import { readFileSync } from 'node:fs';
import { exit } from 'node:process';

enum HandValue {
    Invalid = 0,
    HighCard = 1,
    OnePair = 2,
    TwoPairs = 3,
    ThreeOfAKind = 4,
    FullHouse = 5,
    FourOfAKind = 6,
    FiveOfAKind = 7,
}

class Play {
    hand: string;
    bid: number;
    value: HandValue;

    // zero index is unused

    // 15 for A = 14 -> 2 -> 1 for J in part 2
    handAsNumbers: number[] = []

    /// count for each value in the hand
    countByValue = new Array<number>(15).fill(0); // 0
    countJokers = 0;

    // idx ^= count by value --> amount, i.e. how often a count was achieved in a play
    // example: 
    // 1. countByPlay[4] === 1:    1x 4 same values --> 4 of a kind
    // 2. countByPlay[2] === 2:    2x 2 same values --> 2 pairs
    // 3. countByPlay[3] === 1 &&
    //    countByPlay[2] === 1:    1x 3 same values and 1x 2 same values --> full house
    countByPlay = new Array<number>(6).fill(0);

    constructor(hand: string, bid: number) {
        this.hand = hand;
        this.bid = bid;
        this.value = HandValue.Invalid;

        this.handAsNumbers = [...this.hand].map(c => this.valueToNumber(c));

        this.eval();
    }

    public valueToNumber(c: string): number {
        // J -> 1 for part 2
        return c === 'A' ? 14 : c === 'T' ? 10 : c === 'J' ? 1 : c === 'Q' ? 12 : c === 'K' ? 13 : Number(c);
    }
    public eval() {
        [...this.handAsNumbers].forEach(value => {
            if (value == 1) // J
                this.countJokers++;
            else
                this.countByValue[value]++;
        });
        // add amount of jokers to maximum counted value
        const maxCountIdx = this.countByValue.reduce((maxIdx, current, idx, arr) => current > arr[maxIdx] ? idx : maxIdx, 0);
        this.countByValue[maxCountIdx] += this.countJokers;

        this.countByValue.forEach(
            count => count && this.countByPlay[count]++
        );
        this.value = this.getHandValue();
    }

    public lessThan(other: Play) {
        if (this.value < other.value) {
            return -1;
        } else if (this.value > other.value) {
            return 1;
        } else { // equal
            for (let i = 0; i < this.handAsNumbers.length; i++) {
                if (this.handAsNumbers[i] < other.handAsNumbers[i]) {
                    return -1;
                } else if (this.handAsNumbers[i] > other.handAsNumbers[i]) {
                    return 1;
                } else {
                    // check next
                }
            }
            return 0;
        }
    }

    public getHandValue() {
        if (this.countByPlay[5] === 1)
            return HandValue.FiveOfAKind;
        else if (this.countByPlay[4] === 1 && this.countByPlay[1] === 1)
            return HandValue.FourOfAKind;
        else if (this.countByPlay[3] === 1 && this.countByPlay[2] === 1)
            return HandValue.FullHouse;
        else if (this.countByPlay[3] === 1 && this.countByPlay[1] === 2)
            return HandValue.ThreeOfAKind;
        else if (this.countByPlay[2] === 2 && this.countByPlay[1] === 1)
            return HandValue.TwoPairs;
        else if (this.countByPlay[2] === 1 && this.countByPlay[1] === 3)
            return HandValue.OnePair;
        else
            return HandValue.HighCard;
    }
}

try {
    const data = readFileSync('./input.txt', 'utf-8');
    const plays = data.split(/\r?\n/).map((line, i) => {
        const splitStr = line.split(' ');
        return new Play(splitStr[0], Number(splitStr[1]));
    });
    
    plays.sort((a, b) => a.lessThan(b));
    // plays.forEach((p, index) => console.log(index + 1, p.hand, HandValue[p.value]));
    
    const scores = plays.map((play, index) =>
        play && play.bid * (index + 1) // rank = sorted index + 1
    ); 
    console.log("Total score:", scores.reduce((sum, current) => sum + current, 0));
    

} catch (err) {
    if (err instanceof Error) {
        console.error(err.message);
    } else {
        console.error('Unkonwn error');
    }
    exit(1);
}
