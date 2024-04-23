import {players, tileMap, bombs, ctx} from "./game"

import {Bomb} from "./class.jsx"


export function move(plI, direction, time) {
     //get player object
     let p = players[plI]
     //get array of players current position in the tilemap
     let pArr = tileMap.map[p.cRow][p.cCol]
     //players index in the array of their current posiion
     let i = pArr.indexOf(plI + 3)
     console.log("game loop variables: player \nindex:", plI, "\ntilemap Array:", pArr, "\nplayer index in array:", i)

     //check the array of players current position and draws all the relevant images
     function draw() {
         drawGrass(plI)
         pArr.forEach((n) => {
             console.log("drawing tile:", n)
             if (2 < n && n < 7) {
                 console.log("drawing player")
                 drawPlayer(n - 3)
             } else if (n == 7) {
                 console.log("drawing bomb")
                 drawBomb(plI)
             }
         })
     }

     //check cdirection the player is moving
     if (direction == " ") {
         // create bomb at player position 
         // for ( let i=0; i<players[plI].bombs; i++) {
         // }
         let b = new Bomb(p.cCol, p.cRow, p.cX, p.cY, time, plI)
         bombs.push(b)
         console.log("new bomb created:", bombs)
         drawGrass(plI)
         drawBomb(plI)
         drawPlayer(plI)
         tileMap.map[p.cRow][p.cCol].splice(0, 0, 7)
         //players[plI].bombs = 0 
         //window.requestAnimationFrame(() => {startBomb(b)})
         //cX position can not be greater than the x position of the last grass tile
     } else if (direction == "ArrowRight" && !tileMap.map[p.cRow][p.cCol + 1].includes(1) && !tileMap.map[p.cRow][p.cCol + 1].includes(2)) {
         //p.cX<255 
         // remove player from old position - redraw the previous tile at the old position of the player
         tileMap.map[p.cRow][p.cCol].splice(i, 1)
         console.log("moving right", direction, "array after splice:", tileMap.map[p.cRow][p.cCol])
         draw()

         //cX++
         //update player position in canvas and col/row
         players[plI].cX += 20
         players[plI].cCol++
         console.log("is p changing players\np.cCol:", p.cCol, "\nplayers[plI].cCol:", players[plI].cCol)
         //draw player in new position
         drawPlayer(plI)

         //update current position in the tilemap
         tileMap.map[p.cRow][p.cCol].push(p.index + 3)

     } else if (direction == "ArrowLeft" && !tileMap.map[p.cRow][p.cCol - 1].includes(1) && !tileMap.map[p.cRow][p.cCol - 1].includes(2)) {

         tileMap.map[p.cRow][p.cCol].splice(i, 1)
         console.log("i can move left", direction, "array after splice:", tileMap.map[p.cRow][p.cCol])
         draw()
         //cX-- p.cX>25
         p.cX -= 20
         p.cCol--
         console.log("is p changing players\np.cCol:", p.cCol, "\nplayers[plI].cCol:", players[plI].cCol)
         drawPlayer(plI)
         //update current position in the tilemap
         tileMap.map[p.cRow][p.cCol].push(p.index + 3)

     } else if (direction == "ArrowUp" && !tileMap.map[p.cRow - 1][p.cCol].includes(1) && !tileMap.map[p.cRow - 1][p.cCol].includes(2)) {


         tileMap.map[p.cRow][p.cCol].splice(i, 1)

         draw()
         console.log("i can move up", direction, "array after splice:", tileMap.map[p.cRow][p.cCol])
         //cY-- p.cY>15
         p.cY -= 10
         p.cRow--
         console.log("is p changing players\np.cCol:", p.cCol, "\nplayers[plI].cCol:", players[plI].cCol)
         drawPlayer(plI)
         //update current position in the tilemap
         tileMap.map[p.cRow][p.cCol].push(p.index + 3)

     } else if (direction == "ArrowDown" && !tileMap.map[p.cRow + 1][p.cCol].includes(1) && !tileMap.map[p.cRow + 1][p.cCol].includes(2)) {

         tileMap.map[p.cRow][p.cCol].splice(i, 1)
         console.log("i can move down", direction, "array after splice:", tileMap.map[p.cRow][p.cCol])
         draw()
         //cY++ p.cY<125
         p.cY += 10
         p.cRow++
         console.log("is p changing players\np.cCol:", p.cCol, "\nplayers[plI].cCol:", players[plI].cCol)
         drawPlayer(plI)
         //update current position in the tilemap
         tileMap.map[p.cRow][p.cCol].push(p.index + 3)
     }

     //give power ups to player if there are any present
     //check if the positin the player has moved into contains a power up
     if (pArr.includes(8)) {
         //add to power up count
         p.bombs++
         console.log("player", plI, "has gained a power up. Bombs no.", p.bombs)
         pArr.splice(0, 1)
     } else if (pArr.includes(9)) {
         p.flames++
         console.log("player", plI, "has gained a power up. Flames no.", p.flames)
         pArr.splice(0, 1)
     } else if (pArr.includes(10)) {
         p.speed++
         
         console.log("player", plI, "has gained a power up. Speed no.", p.speed)
         pArr.splice(0, 1)
     }
   
}


function drawGrass(plI) {
    ctx.drawImage(
        tileMap.grass,
        0,
        0,
        779,
        779,
        players[plI].cX,
        players[plI].cY,
        20,
        10
    )

}
function drawBomb(plI) {
    ctx.drawImage(
        players[plI].bomb,
        0,
        0,
        255,
        197,
        players[plI].cX,
        players[plI].cY,
        20,
        10
    )
}
export function drawPlayer(n) {
    ctx.drawImage(
        players[n].img,
        players[n].playerX,
        players[n].playerY,
        32,
        32,
        players[n].cX,
        players[n].cY,
        20,
        10
    );
}