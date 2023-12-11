import { readFileSync } from 'node:fs';
import { exit } from 'node:process';

type Node = {
    [id: string] : string;
}

type NodeMap = {
    [id: string] : Node
}

let instructions: string[] = [];
let nodeMap: NodeMap = {};

try {
    const data = readFileSync('./input.txt', 'utf-8');
    const plays = data.split(/\r?\n/).map((line, idx) => {
        // console.log(line);
        if (idx == 0) { // LR instructions
            instructions = line.split('');
        }
        if (idx > 1) { // node network
            const matches = [...line.matchAll(/[A-Z]+/g)].map(match => match[0]);
            nodeMap[matches[0]] = {L: matches[1], R: matches[2]};
        }
    });
} catch (err) {
    if (err instanceof Error) {
        console.error(err.message);
    } else {
        console.error('Unkonwn error');
    }
    exit(1);
}

// console.log(instructions);
// console.log(nodeMap);

let steps = 0;
let currentNodeId = "AAA"
let currentInstructionId = 0;

while (currentNodeId != 'ZZZ') {
    currentNodeId = nodeMap[currentNodeId][instructions[currentInstructionId]];
    currentInstructionId = (currentInstructionId + 1) % instructions.length;
    steps++;
}

console.log("Steps:", steps);
