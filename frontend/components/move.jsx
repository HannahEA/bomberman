import { players, tileMap, bombs, ctx } from "./game.jsx"
import { Bomb } from "./class.jsx";



export function move(plI, direction, time) {

    
    //get player object
    let p = players[plI]
    
    //get array of players current position in the tilemap
    let pArr = tileMap.map[p.cRow][p.cCol]
    //players index in the array of their current posiion
    let i = pArr.indexOf(plI+3)
    console.log("game loop variables: player \nindex:", plI, "\ntilemap Array:", pArr, "\nplayer index in array:", i)
    //check for walls and bricks in each direction
    let left = !tileMap.map[p.cRow][p.cCol-1].includes(1) && !tileMap.map[p.cRow][p.cCol-1].includes(2)
    let right = !tileMap.map[p.cRow][p.cCol+1].includes(1) &&  !tileMap.map[p.cRow][p.cCol+1].includes(2)
    let up  = !tileMap.map[p.cRow-1][p.cCol].includes(1) && !tileMap.map[p.cRow-1][p.cCol].includes(2)
    let down = !tileMap.map[p.cRow+1][p.cCol].includes(1) && !tileMap.map[p.cRow+1][p.cCol].includes(2)
    
  
    function draw() {
        drawGrass(p.cX, p.cY)
        pArr.forEach((n) => {  
            console.log("drawing tile:", n)
        if (2<n && n<7) {
            console.log("drawing player")
            drawPlayer(n-3)
        } else if (n == 7) {
            console.log("drawing bomb")
            drawBomb(p.cX, p.cY, plI)
        }
        })
    }

    //check direction the player is moving
    if (direction == " ") {
        console.log("how many bombs do you have?", )
        //create one bomb 
        //CHANGE
        let b
        b = new Bomb(p.cCol, p.cRow, p.cX, p.cY, time, plI)
        drawGrass( p.cX, p.cY)
        drawBomb(p.cX, p.cY, plI)
        drawPlayer(plI)
        tileMap.map[p.cRow][p.cCol].splice(0, 0, 7) 
        bombs.push(b) 
        console.log("new bomb created:", bombs, tileMap.map[p.cRow][p.cCol])

        //for ( let i=0; i<=players[plI].bombs; i++) {
        //create bomb if player has a bomb power up lined up
        if (p.powerUps.length>0) {
            if (p.powerUps[0] === "bombs") {
                // create bomb next to player position 
                console.log("new bomb",p.cCol+i, p.cRow, p.cX+(20*i), p.cY, time, plI )
                if (right){
                    b = new Bomb(p.cCol+1, p.cRow, p.cX+20, p.cY, time, plI)
                    b.num =2
                    drawGrass( p.cX+20, p.cY)
                    drawBomb(p.cX+20, p.cY, plI)
                    tileMap.map[p.cRow][p.cCol+1].splice(0, 0, 7)
                } else if (left) {
                    b = new Bomb(p.cCol-1, p.cRow, p.cX-20, p.cY, time, plI)
                    b.num =2
                    drawGrass( p.cX-20, p.cY)
                    drawBomb( p.cX-20, p.cY, plI)
                    tileMap.map[p.cRow][p.cCol-i].splice(0, 0, 7)
                } else if (up) {
                    b = new Bomb(p.cCol, p.cRow-1, p.cX, p.cY-10, time, plI)
                    b.num =2
                    drawGrass( p.cX, p.cY-10)
                    drawBomb(p.cX, p.cY-10, plI)
                    tileMap.map[p.cRow-i][p.cCol].splice(0, 0, 7)
                } else if (down) {
                    b = new Bomb(p.cCol, p.cRow+1, p.cX, p.cY+10, time, plI)
                    b.num =2
                    drawGrass( p.cX, p.cY+10)
                    drawBomb(p.cX, p.cY+10, plI)
                    tileMap.map[p.cRow+i][p.cCol].splice(0, 0, 7)
                }
                
                bombs.push(b)
                console.log("new extra bomb created:", bombs)
            }
        }
    
       // players[plI].bombs = 0 
       
        //cX position can not be greater than the x position of the last grass tile
    } else if (direction == "ArrowRight" && right) { 

        // remove player from old position - redraw the previous tile at the old position of the player
        tileMap.map[p.cRow][p.cCol].splice(i, 1) 
        console.log("moving right", direction, "array after splice:", tileMap.map[p.cRow][p.cCol])
        draw()
        //update player position in canvas and col/row
        
            p.cX += 20
            p.cCol++
        
        console.log("is p changing players\np.cCol:", p.cCol,"\nplayers[plI].cCol:", players[plI].cCol)
        //draw player in new position
        drawPlayer(plI)

        //update current position in the tilemap
        tileMap.map[p.cRow][p.cCol].push(p.index+3)

    } else if (direction == "ArrowLeft" && left) {
        tileMap.map[p.cRow][p.cCol].splice(i, 1)
        console.log("i can move left", direction, "array after splice:", tileMap.map[p.cRow][p.cCol])
        draw()
        
            p.cX -=20
            p.cCol--
        
        console.log("is p changing players\np.cCol:", p.cCol,"\nplayers[plI].cCol:", players[plI].cCol)
        drawPlayer(plI)
        //update current position in the tilemap
        tileMap.map[p.cRow][p.cCol].push(p.index+3)
        
    } else if (direction == "ArrowUp" && up) {
        tileMap.map[p.cRow][p.cCol].splice(i, 1)
        draw()
        console.log("i can move up", direction, "array after splice:", tileMap.map[p.cRow][p.cCol])
       
            p.cY -= 10
            p.cRow--
        
        console.log("is p changing players\np.cCol:", p.cCol,"\nplayers[plI].cCol:", players[plI].cCol)
        drawPlayer(plI)
        //update current position in the tilemap
        tileMap.map[p.cRow][p.cCol].push(p.index+3)
        
    } else if (direction == "ArrowDown" && down) {
        tileMap.map[p.cRow][p.cCol].splice(i, 1) 
        console.log("i can move down", direction, "array after splice:", tileMap.map[p.cRow][p.cCol])
        draw()
        
            p.cY += 10
            p.cRow++
        
        console.log("is p changing players\np.cCol:", p.cCol,"\nplayers[plI].cCol:", players[plI].cCol)
        drawPlayer(plI)
        //update current position in the tilemap
        tileMap.map[p.cRow][p.cCol].push(p.index+3)
    }

    //check if player has gained a power up by moving
    checkPowerUps(p, plI)
   
            
}

function checkPowerUps(p, plI) {
    //give power ups to player if there are any present
        //check if the positin the player has moved into contains a power up
        if (tileMap.map[p.cRow][p.cCol].includes(8) ){
            //add to power up count
            //p.bombs++
            //p.powerUps.splice(0,0,"bombs")
            //p.powerUps.splice(0,0,"bombs")
            p.powerUps.push("bombs")
            p.powerUps.push("bombs")
            p.doubleBomb++
            console.log("player", plI, "has gained a power up. Bombs no.", p.powerUps, "doubleBomb?")
            tileMap.map[p.cRow][p.cCol].splice(0,1)
        } else if (tileMap.map[p.cRow][p.cCol].includes(9)) {
            //p.flames++
            //p.powerUps.splice(0,0,"flames")
            p.powerUps.push("flames")
            console.log("player", plI, "has gained a power up. Flames no.", p.powerUps)
            tileMap.map[p.cRow][p.cCol].splice(0,1)
        } else if (tileMap.map[p.cRow][p.cCol].includes(10)) {
            p.speed++
            //p.powerUps.push("speed")
            console.log("player", plI, "has gained a power up. Speed no.", p.powerUps)
            tileMap.map[p.cRow][p.cCol].splice(0,1)
        }
}

function drawGrass(x, y) {
    ctx.drawImage(
        tileMap.grass,
        0,
        0,
        779,
        779,
        x,
        y,
        20,
        10
    )        

  }
  function drawBomb(x, y, plI) {
      ctx.drawImage(
          players[plI].bomb,
          0,
          0,
          255,
          197,
          x,
          y,
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
  