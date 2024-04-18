 
export function AddBricks() {
    var layout = [
    [[1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1]],
    [[1], [3], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [4], [1]], 
    [[1], [0], [1], [0], [1], [0], [1], [0], [1], [0], [1], [0], [1], [0], [1]], 
    [[1], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [1]],
    [[1], [0], [1], [0], [1], [0], [1], [0], [1], [0], [1], [0], [1], [0], [1]],
    [[1], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [1]],
    [[1], [0], [1], [0], [1], [0], [1], [0], [1], [0], [1], [0], [1], [0], [1]],
    [[1], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [1]],
    [[1], [0], [1], [0], [1], [0], [1], [0], [1], [0], [1], [0], [1], [0], [1]],
    [[1], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [1]],
    [[1], [0], [1], [0], [1], [0], [1], [0], [1], [0], [1], [0], [1], [0], [1]],
    [[1], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [1]],
    [[1], [0], [1], [0], [1], [0], [1], [0], [1], [0], [1], [0], [1], [0], [1]],
    [[1], [5], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [6], [1]],
    [[1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1]],
]
    for (let row = 0; row < layout.length; row++) {
        for (let column = 0; column < layout[row].length; column++) {
            const tile = layout[row][column][0];
            if (tile === 0) {
                let isBrick= Math.round(Math.random() * 1)
                if ((2<row && row<12 || 2<column && column<12 ) && isBrick === 0) {
                    //update tileLayout.Layout layout to say this tile form grass(0) to brick(2)
                    layout[row][column][0] = 2   
                }
            }
        }
    }
    return layout
}


