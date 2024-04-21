import { ctx, tileMap, drawPlayer, players } from "./game"
import { self } from "./game";
import deadAngel from "../static/sounds/deadAngel.ogg"
import gameOver from "../static/sounds/10 Game Over.ogg"
import {whoAmI} from "./waitForPlayers"


//=======> Start Heart and Explosion variables and functions <=======
var isPlaying = true;
var tries = 0;
var lostHeart;
var explosion;
var audio4 = new Audio(deadAngel);
var audio5 = new Audio(gameOver);

//sets off explosion once after loss of one life, and plays 'deadAngel'
function puff(t) {
    audio4.currentTime = 0;
    audio4.play();
    explosion = document.getElementById(`explosion${t}`);
    explosion.style.opacity = "1";
    setTimeout(() => {
        explosion.style.opacity = "0"
    }, 500);
}

function gameEnd() {

    if (isPlaying) {
        audio5.currentTime = 0;
        audio5.play();
    } else {
        audio5.pause()
    }
}

//=======> End Heart and Explosion variables and functions <=======

function drawExplosion(b) {

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
        let check = [b.col+b.count, b.col-b.count, b.row+b.count, b.row-b.count]
        // backward check 
        let bcheck = [b.col+b.count-1, b.col-b.count-1, b.row+b.count-1, b.row-b.count-1]
        

        for (let i = 0; i < 4; i++) {

            if (check[i]<14 && check[i]>0){
            let spot 
            let pSpot
            if (i<2){
                spot = tileMap.map[b.row][check[i]]
                pSpot = bcheck[i]>0? tileMap.map[b.row][bcheck[i]] : []
                console.log("spot", spot, "prevSpot", pSpot)
            } else {
                spot = tileMap.map[check[i]][b.col]
                pSpot = bcheck[i]>0? tileMap.map[bcheck[i]][b.col] : []
                console.log("spot", spot)
            }
            console.log("can i explode here\ndoes it have a wall?", spot.includes(1),"\ndoes the previous spot have a wall?", pSpot.includes(1))
            if (!spot.includes(1) && pSpot && !pSpot.includes(1)) {
                console.log("no wall present, drawing explosion")
                //draw explosion
                 ctx.drawImage(
                b.explosion,
                b.eX+(m[i]),
                b.eY+(n[i]),
                54,
                51,
                b.cX+(o[i]*b.count),
                b.cY+(p[i]*b.count),
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


function undrawExplosion(b) {
    let o = [20, -20, 0, 0]
    let p = [0, 0, 10, -10]
  
    let check = [b.col+b.count, b.col-b.count, b.row+b.count, b.row-b.count]
    let bcheck = [b.col+b.count-1, b.col-b.count-1, b.row+b.count-1, b.row-b.count-1]
for (let i=0; i<4; i++) {
    console.log("remove tile\ncount", b.count, " row, col:", b.row, b.col)
    if (check[i]<14 && check[i]>0){
        console.log("position within tilemap")
        let spot 
        let pSpot
        let row 
        let col
        if (i<2){
           row = b.row 
           col = check[i]
            spot = tileMap.map[b.row][check[i]]
            pSpot = bcheck[i]>0? tileMap.map[b.row][bcheck[i]] : []
            console.log("spot", spot, "pSpot", pSpot)
        } else {
            row = check[i]
            col = b.col
            spot = tileMap.map[check[i]][b.col]
            pSpot = bcheck[i]>0? tileMap.map[bcheck[i]][b.col] : []
            console.log("spot", spot, "pSpot", pSpot)
        }
        console.log("can I unexplode?\n is there a wall here?", spot.includes(1), "\ndoes the previous spot have a wall?", pSpot.includes(1), "\nis this the central sqare?", b.count)
        if ((!spot.includes(1) && !pSpot.includes(1)) || b.count === 0) {
            console.log("no wall present, drawing explosion")
                ctx.drawImage(
                    tileMap.grass,
                    0,
                    0,
                    779,
                    779,
                    b.cX + (o[i] * b.count),
                    b.cY + (p[i] * b.count),
                    20,
                    10
                )

                spot.forEach(
                    (n) => {
                        console.log("what is n, while unexploding?", n)
                        if (n > 2 && n < 7) {
                            //tries++
                            console.log("Exploded player index is:", n - 3)
                            console.log("tries at start, 2 x player's index, and player's lives", tries, self.index, players[n - 3].index, players[n - 3].lives)
                            //check players number of lives
                            if (players[n - 3].lives > 1) {
                                if (players[n - 3].index === self.index) {
                                    //derive which heart to remove
                                    console.log("type of players.index", typeof (players[n - 3].index))

                                    //Bomberman looses one life
                                    players[n - 3].lives--
                                    //determine number of tries
                                    tries = 3 - players[n - 3].lives
                                    //remove heart that has the same number as the number of tries
                                    lostHeart = document.getElementById(`heart${tries}`)
                                    //heart exploding and disappearing
                                    lostHeart.style.opacity = "0"
                                    puff(tries);

                                }

                                drawPlayer(n - 3)

                            } else {
                                //if 1: take away life and show game over
                                if (players[n - 3].index === self.index) {
                                    tries = 3;
                                    lostHeart = document.getElementById(`heart${tries}`)
                                    lostHeart.style.opacity = "0"
                                    puff(tries);
                                    //display end of game message
                                    document.querySelector("#whoAmI").innerHTML = '<p> GAME OVER<br>'
                                        + `Better luck next time ${whoAmI}</p>`;
                                        gameEnd()
                                }

                            }

                        }
                        if (n>7){
                            console.log("found!!!! drawing power up")
                            let pX
                            if (n===8){pX = b.bombs} else if(n===9) {pX = b.flames} else if (n===10){pX = b.speed}
                            ctx.drawImage(
                                b.powerUp,
                                pX,
                                0,
                                125,
                                125,
                                col*20,
                                row*10,
                                20,
                                10
                            )
                        } 
                    }
                )
            }
            if (b.count === 0) {
                i = 4
                spot.splice(0, 1)
            }

        }
       
    }
    b.count--

}

export function progBomb(b, timeStamp) {


    const elapsed = timeStamp - b.start;
    const increment = timeStamp - b.previousTimeStamp
    //make sure 3 secs have passed before starting  explosion
      if (elapsed >= 3000 && increment>=300  ) {
        
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
        if ((power === 0 && b.count===3) || (power > 0  && b.count=== 3 + power) ) {
        //if( b.count > 2){
            console.log("bomb exploded")
            b.status = "exploded"
            b.count--
            players[b.playerI].flames = 0
        }
    
}
export function unBomb(b, timeStamp) {
    const increment = timeStamp - b.previousTimeStamp
    //make sure 3 secs have passed before starting  explosion
    if (increment >= 400) {
        // progressively display explosion
        //X++54 Y++50.6  x-379 y-354
        console.log("de-explosion starting")
        undrawExplosion(b)
        b.previousTimeStamp = timeStamp;
    }
    //check to see if de-explosion is complete > status = complete 
    if (b.count < 0) {
        console.log("explosion complete")
        b.status = "complete"
    }

}