#!/usr/bin/env python3

from re import finditer

FILENAME = 'input.txt'

def main():
    map = []
    with open('input.txt') as file:
        for line in file:
            map.append([]);
            for c in line.strip():
                map[-1].append(c);

    part_numbers = []
    with open(FILENAME) as file:
        i = 0
        for line in file:
            for match in finditer("\d+", line):
                part_number = int(match.group())

                startIdx = match.span()[0]
                endIdx = match.span()[1] - 1
                for j in range(startIdx, endIdx + 1):
                    if i-1 > 0 and j-1 > 0 and map[i-1][j-1] != ".":
                        part_numbers.append(part_number)
                        break;
                    if i-1 > 0 and map[i-1][j] != ".":
                        part_numbers.append(part_number)
                        break;
                    if i-1 > 0 and j+1 < len(map[i]) and map[i-1][j+1] != ".":
                        part_numbers.append(part_number)
                        break;
                    if i+1 < len(map) and j-1 > 0 and map[i+1][j-1] != ".":
                        part_numbers.append(part_number)
                        break;
                    if i+1 < len(map) and map[i+1][j] != ".":
                        part_numbers.append(part_number)
                        break;
                    if i+1 < len(map) and j+1 < len(map[i]) and map[i+1][j+1] != ".":
                        part_numbers.append(part_number)
                        break;
                    
                    if j == startIdx:
                        if j-1 > 0 and map[i][j-1] != ".":
                            part_numbers.append(part_number)
                            break;

                    if j == endIdx:
                        if j+1 < len(map[i]) and map[i][j+1] != ".":

                            part_numbers.append(part_number)
                            break;

            i += 1

    print("sum part_numbers:", sum(part_numbers))


if __name__ == '__main__':
    main()
