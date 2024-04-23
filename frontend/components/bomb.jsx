import { ctx, tileMap, drawPlayer, players } from "./game"
import { self } from "./game";

export function drawExplosion(b) {

    if (b.start === b.previousTimeStamp) {
        console.log("drawing first tile")
        ctx.drawImage(
            b.explosion,
            b.eX,
            b.eY,
            54,
            51,
            b.cX,
            b.cY,
            20,
            10
        )
    } else {
        console.log("new tile\ncount", b.count, " row, col:", b.row, b.col, b.col + b.count)
        let m = [54, -54, 0, 0]
        let n = [0, 0, 51, -51]
        let o = [20, -20, 0, 0]
        let p = [0, 0, 10, -10]
        //forward check
        let check = [b.col + b.count, b.col - b.count, b.row + b.count, b.row - b.count]
        // backward check 
        let bcheck = [b.col + b.count - 1, b.col - b.count - 1, b.row + b.count - 1, b.row - b.count - 1]


        for (let i = 0; i < 4; i++) {

            if (check[i] < 14 && check[i] > 0) {
                let spot
                let pSpot
                if (i < 2) {
                    spot = tileMap.map[b.row][check[i]]
                    pSpot = bcheck[i] > 0 ? tileMap.map[b.row][bcheck[i]] : []
                    console.log("spot", spot, "prevSpot", pSpot)
                } else {
                    spot = tileMap.map[check[i]][b.col]
                    pSpot = bcheck[i] > 0 ? tileMap.map[bcheck[i]][b.col] : []
                    console.log("spot", spot)
                }
                console.log("can i explode here\ndoes it have a wall?", spot.includes(1), "\ndoes the previous spot have a wall?", pSpot.includes(1))
                if (!spot.includes(1) && pSpot && !pSpot.includes(1)) {
                    console.log("no wall present, drawing explosion")
                    //draw explosion
                    ctx.drawImage(
                        b.explosion,
                        b.eX + (m[i]),
                        b.eY + (n[i]),
                        54,
                        51,
                        b.cX + (o[i] * b.count),
                        b.cY + (p[i] * b.count),
                        20,
                        10
                    )
                    //if brick tile remove brick from tileMap
                    spot.splice(0, 1)
                }
            }
        }


    }

    b.count++
}

export function progBomb(b, timeStamp) {


    const elapsed = timeStamp - b.start;
    const increment = timeStamp - b.previousTimeStamp
    //make sure 3 secs have passed before starting  explosion
    if (elapsed >= 3000 && increment >= 300) {

        // progressively display explosion
        //X++54 Y++50.6  x-379 y-354
        console.log("explosion starting")
        drawExplosion(b)
        b.previousTimeStamp = timeStamp;
    }
    //check to see if explosion is complete > status = exploded
    //flames power up lets explosion reach 1 square further
    let power = players[b.playerI].flames
    console.log("how many flames power ups are being used")
    if ((power === 0 && b.count === 3) || (power > 0 && b.count === 3 + power)) {
        //if( b.count > 2){
        console.log("bomb exploded")
        b.status = "exploded"
        b.count--
        players[b.playerI].flames = 0
    }
}


