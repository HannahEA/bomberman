/*
Pacman grid layout:
    0 - empty
    1 - wall
    2 - pill
    3 - power pill
    4 - ghost lair
    5 - left portal
    6 - right portal
    7 - pacman start
    8 - pill junction
    9 - empty junction
*/
export const LAYOUT = [
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 
    1, 2, 2, 2, 2, 2, 8, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 8, 2, 2, 2, 2, 2, 1, 
    1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1, 
    1, 3, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 3, 1, 
    1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1, 
    1, 8, 2, 2, 2, 2, 8, 2, 2, 8, 2, 2, 2, 2, 2, 2, 2, 2, 8, 2, 2, 8, 2, 2, 2, 2, 8, 1, 
    1, 2, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 2, 1, 
    1, 2, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 2, 1, 
    1, 2, 2, 2, 2, 2, 8, 1, 1, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 1, 1, 8, 2, 2, 2, 2, 2, 1, 
    1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 
    0, 0, 0, 0, 0, 1, 2, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 2, 1, 0, 0, 0, 0, 0, 
    0, 0, 0, 0, 0, 1, 2, 1, 1, 0, 0, 0, 9, 0, 0, 9, 0, 0, 0, 1, 1, 2, 1, 0, 0, 0, 0, 0, 
    0, 0, 0, 0, 0, 1, 2, 1, 1, 0, 4, 4, 4, 4, 4, 4, 4, 4, 0, 1, 1, 2, 1, 0, 0, 0, 0, 0, 
    1, 1, 1, 1, 1, 1, 2, 1, 1, 0, 4, 0, 0, 0, 0, 0, 0, 4, 0, 1, 1, 2, 1, 1, 1, 1, 1, 1, 
    5, 0, 0, 0, 0, 0, 8, 0, 0, 9, 4, 0, 0, 0, 0, 0, 0, 4, 9, 0, 0, 8, 0, 0, 0, 0, 0, 6, 
    1, 1, 1, 1, 1, 1, 2, 1, 1, 0, 4, 0, 0, 0, 0, 0, 0, 4, 0, 1, 1, 2, 1, 1, 1, 1, 1, 1, 
    0, 0, 0, 0, 0, 1, 2, 1, 1, 0, 4, 4, 4, 4, 4, 4, 4, 4, 0, 1, 1, 2, 1, 0, 0, 0, 0, 0, 
    0, 0, 0, 0, 0, 1, 2, 1, 1, 9, 0, 0, 0, 0, 0, 0, 0, 0, 9, 1, 1, 2, 1, 0, 0, 0, 0, 0, 
    0, 0, 0, 0, 0, 1, 2, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 2, 1, 0, 0, 0, 0, 0, 
    1, 1, 1, 1, 1, 1, 2, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 2, 1, 1, 1, 1, 1, 1, 
    1, 2, 2, 2, 2, 2, 8, 2, 2, 8, 2, 2, 2, 1, 1, 2, 2, 2, 8, 2, 2, 8, 2, 2, 2, 2, 2, 1, 
    1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1, 
    1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1, 
    1, 3, 2, 2, 1, 1, 8, 2, 2, 2, 2, 2, 8, 7, 2, 8, 2, 2, 2, 2, 2, 8, 1, 1, 2, 2, 3, 1, 
    1, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 1, 
    1, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 1, 
    1, 2, 2, 8, 2, 2, 2, 1, 1, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 1, 1, 2, 2, 2, 8, 2, 2, 1, 
    1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 
    1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 
    1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 8, 2, 2, 8, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 
]

export const CLASSES = [
    'empty',
    'wall',
    'pill',
    'power-pill',
    'ghost-lair',
    'portal-left',
    'portal-right',
    'pacman',
    'pill-junc',
    'empty-junc',
    'ghost',
    'scared'
]