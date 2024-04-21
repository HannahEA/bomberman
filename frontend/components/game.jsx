import { Web_pilot } from "../../web_pilot/web_pilot.jsx"; 
import { progBomb, unBomb } from "./bomb.jsx";
import { Player,TileMap, Bomb } from "./class.jsx";

const url = "https://drive.google.com/drive/u/0/folders/1MN3N9JVBdpcHj7dPlnEbvff88hHnqZ0F"


// constants
const tileSize = 32
export const tileMap = new TileMap(tileSize)
 //variables
export let ctx 
export let players = [] 
let bombs = []
let plI = null
let direction = ""
////self - which player are you? websocket need to log what position you are in the 4 players 
////make it a global variable
export  var self 

//--------------CREATE THE GAME BOARD------------------------------

export function GameLoad(numPlayers, position) {
        let initId
        const canvas = document.getElementById("game")
        const canvasContext = canvas.getContext("2d")
        ctx = canvasContext
        
        //initialise players
        let lPosition = [[1,1], [1,13], [13,1], [13,13]]
        // if (numPlayers> 4) {
        //     numPlayers = 4
        // }
        // if (position> 3) {
        //     position = 3
        // }
        for (let i = 0; i<numPlayers; i++) {
            const player = new Player(i, lPosition[i][0], lPosition[i][1])
            players.push(player)
            console.log("creatomg player ", i, " my position ", position)
            if (i == position) {
                self = new Player(i, lPosition[i][0], lPosition[i][1])
                console.log("what player am i?", self)
            }
        }
        let boardDrawn = false
        //initialise game     
        function initGame() {
            console.log("init loop")
            //draw empty game map
            //// after images have loaded
            if (tileMap.imageLoaded) {
                console.log("drawing game board")
                boardDrawn = true
              tileMap.draw(canvas, ctx)
            }
            // draw players
            // after image has loaded
            
            players.forEach((p) => {
                if (p.imageLoaded) {
                    console.log("initialsing player ")
                    p.initPlayer(ctx)
                }
            })
            let loadedPlayers = players.filter((p) => p.imageLoaded)
            console.log(loadedPlayers.length, numPlayers, boardDrawn)
            if (loadedPlayers.length == numPlayers && boardDrawn ) {
                initFinish()
            }
            
        } 
       

        function initFinish() {
            console.log("init finish")
            console.log("original tilemap",  tileMap.map)
            window.requestAnimationFrame(gameLoop)
            clearInterval(initId)
            
        }
    
        initId = setInterval(initGame, 1000)
        
    }

/////------------MOVEMENT THROTTLE -----------------------------------

/// throttle movement so characters dont move too fast
    function moveThrottle (func, waitMS = 200) {
        let isWait = false;
        
        return function(...args) {
           //console.log("what is args? ", ...args, args)
            if (!isWait) {
                func.call(this, ...args);
                isWait = true;
    
                setTimeout(() => {
                   isWait = false;
                }, waitMS);
            }
        }
    }
    
    
    const throttledMove = moveThrottle(SendMove)
   
    /// send move to ws 
    function SendMove(direction, socket)  {
        console.log("sending player move to server", direction, self.index)
        socket.send(JSON.stringify({
            type:"playerMove",
            player: self.index,
            direction: direction
        }));
    }

    /// keydown event listener
    export function StartMove(socket, e) {
        
        if (document.getElementById("game").style.display === "block") {

        if (e.key == "ArrowRight" || e.key == "ArrowLeft" || e.key == "ArrowUp"|| e.key == "ArrowDown" || e.key == " ") {
           // only called if at least 200ms since last call
            throttledMove(e.key, socket)
        } 
        
        } 
    }

    // keyup eventlistener
   // export function StopMove(moveInterval) {
        //console.log("stop moving")
      //   clearInterval(moveInt)
      //direction = ""
        //moving = false
        
    //}

    
//////------------------GAMELOOP -----------------------------------------------------
    ///animation loop 
    function gameLoop(time) {
        if (bombs.length>0) {
            bombs.forEach( (b) => {
                if (b.status === "unexploded") {
                   progBomb(b, time) 
                } else {
                    unBomb(b,time)
                } 
            } )
            bombs = bombs.filter((b)=> b.status != "complete")
        }
        
        if (plI != null) {
            
            let p = players[plI]
            let pArr = tileMap.map[p.cRow][p.cCol]
            let i = pArr.indexOf(plI+3)
            console.log("game loop variables: player \nindex:", plI, "\ntilemap Array:", pArr, "\nplayer index in array:", i)
            function draw() {
                console.log("drawing function: what is the value of pArr", pArr)
                drawGrass()
                pArr.forEach((n) => {  
                    console.log("drawing tile:", n)
                if (2<n && n<7) {
                    console.log("drawing player")
                    drawPlayer(n-3)
                } else if (n == 7) {
                    drawBomb()
                }
                })
            }
            if (direction == " ") {
                // create bomb at player position 
                let b = new Bomb(p.cCol, p.cRow, p.cX, p.cY, time, plI)
                bombs.push(b)
                console.log("new bomb creates:", bombs)
                drawGrass()
                drawBomb()
                drawPlayer(plI)
                tileMap.map[p.cRow][p.cCol].splice(i, 0, 7)
                //window.requestAnimationFrame(() => {startBomb(b)})
                //cX position can not be greater than the x position of the last grass tile
            } else if (direction == "ArrowRight" && !tileMap.map[p.cRow][p.cCol+1].includes(1) &&  !tileMap.map[p.cRow][p.cCol+1].includes(2)) { 
                //p.cX<255 
               

                // remove player from old position - redraw the previous tile at the old position of the player
                tileMap.map[p.cRow][p.cCol].splice(i, 1) 
                console.log("moving right", direction, "array after splice:", tileMap.map[p.cRow][p.cCol])
                draw()

                //cX++
                //update player position in canvas and col/row
                players[plI].cX += 20
                players[plI].cCol++
                console.log("is p changing players\np.cCol:", p.cCol,"\nplayers[plI].cCol:", players[plI].cCol)
                //draw player in new position
                drawPlayer(plI)

                //update current position in the tilemap
                tileMap.map[p.cRow][p.cCol].push(p.index+3)

            } else if (direction == "ArrowLeft" && !tileMap.map[p.cRow][ p.cCol-1].includes(1) &&  !tileMap.map[p.cRow][p.cCol-1].includes(2) ) {
                    
                    tileMap.map[p.cRow][p.cCol].splice(i, 1)
                    console.log("i can move left", direction, "array after splice:", tileMap.map[p.cRow][p.cCol])
                    draw()
                    //cX-- p.cX>25
                    p.cX -=20
                    p.cCol--
                    console.log("is p changing players\np.cCol:", p.cCol,"\nplayers[plI].cCol:", players[plI].cCol)
                    drawPlayer(plI)
                    //update current position in the tilemap
                    tileMap.map[p.cRow][p.cCol].push(p.index+3)
                    
                } else if (direction == "ArrowUp" && !tileMap.map[p.cRow-1][p.cCol].includes(1) &&  !tileMap.map[p.cRow-1][p.cCol].includes(2) ) {
                    
                    
                    tileMap.map[p.cRow][p.cCol].splice(i, 1)
                    
                    draw()
                    console.log("i can move up", direction, "array after splice:", tileMap.map[p.cRow][p.cCol])
                    //cY-- p.cY>15
                    p.cY -= 10
                    p.cRow--
                    console.log("is p changing players\np.cCol:", p.cCol,"\nplayers[plI].cCol:", players[plI].cCol)
                    drawPlayer(plI)
                    //update current position in the tilemap
                    tileMap.map[p.cRow][p.cCol].push(p.index+3)
                    
                } else if (direction == "ArrowDown" && !tileMap.map[p.cRow+1][p.cCol].includes(1)&&  !tileMap.map[p.cRow+1][p.cCol].includes(2)) {
                   
                    tileMap.map[p.cRow][p.cCol].splice(i, 1) 
                    console.log("i can move down", direction, "array after splice:", tileMap.map[p.cRow][p.cCol])
                    draw()
                    //cY++ p.cY<125
                    p.cY += 10
                    p.cRow++
                    console.log("is p changing players\np.cCol:", p.cCol,"\nplayers[plI].cCol:", players[plI].cCol)
                    drawPlayer(plI)
                    //update current position in the tilemap
                    tileMap.map[p.cRow][p.cCol].push(p.index+3)
                }
    
              plI = null 
              direction = ""
            
        }
           
        window.requestAnimationFrame(gameLoop)
    }
    

    function drawGrass() {
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
    function drawBomb() {
        ctx.drawImage(
            players[plI].bomb,
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
    




/** @jsx Web_pilot.createElement */
export function Game(props) {
    props.socket.addEventListener("message", function(e) {
        var msg = JSON.parse(e.data);
        switch (msg.type) {
            case "playerMove" :
                plI = msg.player
                direction = msg.direction
                console.log("player move recieved by client: ", plI, direction)
                break
            case "board":
                let board = JSON.parse(msg.map)
                //let map = JSON.parse(msg.map)s
                console.log("game board recieved", msg, board)
                let map = []
                let row = []
            
                while(board.length) {
                    row = board.splice(0, 15);
                    map.push(row)
                    row = []
                }
                console.log("reconstructed layout", map)
                tileMap.map = map
            break
        }

    })
    return (
    <div id="di">
        <canvas id='game'></canvas>
        </div>
    )
}
/*let check = [b.col+b.count, b.col-b.count, b.row+b.count, b.row-b.count]
for (let i=4; i--; i>0) {
    if (check[i]<14 && check[i]>0){
        let spot 
        if (i<2){
            spot = tileMap[b.row][check[i]]
        } else {
            spot = tileMap[check[i]][b.col]
        }
        if (!spot.includes(1)) {*/
// let check = [tileMap.map[b.row][b.col+1].includes(1), tileMap.map[b.row][b.col-1].includes(1), tileMap.map[b.row+1][b.col].includes(1), tileMap.map[b.row-1][b.col].includes(1) ]