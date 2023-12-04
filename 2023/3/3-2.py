#!/usr/bin/env python3

from re import finditer

def intersect(rangeA: tuple, rangeB: tuple):
    return rangeA[0] <= rangeB[1] and rangeA[1] >= rangeB[0]


# line (schematic[i-1], schematic[i], schematic[i+1])
# id (current gear id: i+len(schematic)+j) - key for gears dict
# gears (dict to add to)
def match_adjecent(line, rangeA, id, gears):
    for match in finditer("\d+", line):
        part_number = int(match.group())
        
        # span contains start index end first index after the macht
        if intersect(rangeA, (match.span()[0], match.span()[1] - 1)):
            if not id in gears.keys():
                gears[id] = []
            gears[id].append(part_number)


def main():
    schematic = []
    with open('input.txt') as file:
        for line in file:
            schematic.append(line.strip());

    gears = {}
    for (i, line) in enumerate(schematic):
        for (j, c) in enumerate(line):
            rangeA = (j-1 if j > 0 else j, j+1 if j < len(line)-1 else j) # limit rangeA
            id = i*len(schematic)+j # gear id

            if c == "*":
                if i > 0:
                    match_adjecent(schematic[i-1], rangeA, id, gears)
                if i < len(line)-1:
                    match_adjecent(schematic[i+1], rangeA, id, gears)
                
                match_adjecent(schematic[i], rangeA, id, gears)

    gear_ratios = list(map((lambda v: v[0] * v[1] if len(v) == 2 else 0), gears.values()))
    print("sum part_numbers:", sum(gear_ratios))


if __name__ == '__main__':
    main()
