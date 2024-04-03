import { Web_pilot } from "../Webpilot/web_pilot.jsx"; 
import {brick} from "../static/brick.webp"
import {grass} from "../static/grass.webp"
import { wall} from "../static/wall.jpeg"

const url = "https://drive.google.com/drive/u/0/folders/1MN3N9JVBdpcHj7dPlnEbvff88hHnqZ0F"
function image(fileName, tMap) {
    console.log("filename", fileName)
    const img = new Image()
    img.src= `${fileName}`
    img.onerror = (errorMsg) => {
        console.log("img error", errorMsg, fileName)
    }
    
    //if( fileName == "https://cdn-icons-png.freepik.com/512/7352/7352969.png") {
       
        img.onload = ()=> {
            tMap.imageLoaded = true
            console.log("image has loaded", fileName)
     //}
    }
    
    return img
}
class TileMap {
    constructor(tileSize) {
     this.tileSize = tileSize
     this.imageLoaded = false
     this.grass = image("https://as2.ftcdn.net/v2/jpg/04/04/01/49/1000_F_404014988_7N8rNOa9ezLOZx6O6JEscLyNCpLLZhGW.jpg", this)
     this.wall = image("https://camo.githubusercontent.com/61647ead3b3a03496f2a0e6ed8676632e55b50c494f6842bc0b087c4452d73df/68747470733a2f2f643364796661663369757472786f2e636c6f756466726f6e742e6e65742f696d6167652f75706c6f61642f63343864376234636564313034373732386339356434303832353462653665642e6a706567", this)
     this.brick = image("https://pics.craiyon.com/2023-12-30/LIDMoh3_RPyYQSIjxDaPqw.webp", this)
     
    }

   

    // 0 - grass 
    // 1 - wall
    // 2 - brick 
    // 3 - player1
    // 4 - player2
    // 5 - player3
    // 6 - player4
    // 7 - bomb 
    // 8 - explosion
    map = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 1], 
        [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1], 
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
        [1, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ]
    draw(canvas, ctx, di) {
        this.#clearCanvas(canvas, ctx)
        this.#drawMap(ctx, canvas, dispatchEvent)
    }
    #clearCanvas(canvas, ctx) {
        ctx.fillStyle = "black"
        ctx.fillRect(0, 0, canvas.width, canvas.height)
    }
    #drawMap(ctx) {
        if (this.imageLoaded) {
            console.log("for real loaded")
            for (let row = 0; row < this.map.length; row++) {
            for (let column = 0; column < this.map[row].length; column++) {
                const tile = this.map[row][column];
                if (tile === 0 || tile ===3 || tile ===4 || tile ==5 || tile === 6) {
                    //console.log("Drawing grass tile at:", row, column);
                    // let pattern = ctx.createPattern(this.grass, "repeat")
                    // ctx.fillStyle = pattern
                    // ctx.fillRect(column * this.tileSize,
                    //     row * this.tileSize,
                    //     32,
                    //     32)
                    let isBrick= Math.round(Math.random() * 1)
                    if ((2<row && row<12 || 2<column && column<12 ) && isBrick === 0) {
                            
                            ctx.drawImage(
                                this.brick,
                                0,
                                0,
                                850,
                                850,
                                column * 20,
                                row * 10,
                                20,
                                10
                            );
                            //update tilemap.map layout to say this tile form grass(0) to brick(2)
                            this.map[row][column] = 2
                            
                    }else {
                        
                            ctx.drawImage(
                                this.grass,
                                0,
                                0,
                                779,
                                779,
                                column * 20,
                                row * 10,
                                20,
                                10
                            );
                    }
                    
                    
                }
                if (tile === 1 ) {
                //console.log("Drawing wall tile at:", row, column);
                ctx.drawImage(
                    this.wall,
                    0,
                    0,
                    80,
                    80,
                    column * 20,
                    row * 10,
                    20,
                    10
                );

                }
                
                
            }
            
        }
        this.imageLoaded = false
    }
        
    }

 }

//player 

class Player {
    constructor(num, sRow, sCol) {
        this.index = num
        this.img = image("https://tcrf.net/images/8/81/NeoBattleIcon.gif", this)
        this.imageLoaded = false
        //x and y co-ordinates in source image
        this.playerX = 32*num
        this.playerY = 32*num
        //start Y and X in canvas
        this.sY = sRow * 10
        this.sX = sCol * 20
        //current Y and X in canvas
        this.cY = sRow * 10
        this.cX = sCol * 20
        // current row and column in the tilemap
        this.cRow = sRow
        this.cCol = sCol
        //no. of powerups 
        this.bombs = 0
        this.flames = 0
        this.speed = 0
       
    }

    initPlayer(ctx) {
            ctx.drawImage(
                this.img,
                this.playerX,
                this.playerY,
                32,
                32,
                this.sX,
                this.sY,
                20,
                10
            );
    }
}


// constants
const tileSize = 32
const tileMap = new TileMap(tileSize)
 //variables
let ctx 
let players = [] 
////self - which player are you? websocket need to log what position you are in the 4 players 
////make it a global variable
let self 

//game loop
export function GameLoad(numPlayers, position) {
        const canvas = document.getElementById("game")
        const canvasContext = canvas.getContext("2d")
        ctx = canvasContext
        //initialise players
        let lPosition = [[1,1], [1,13], [13,1], [13,13]]
        if (numPlayers> 4) {
            numPlayers = 4
        }
        if (position> 3) {
            position = 3
        }
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

        let initId = setInterval(initGame, 1000)
        
        
    }

    let moveInt
    let moving = false
    let direction = ""
    export function StartMove(e) {
          
          console.log("e.key", e.key)
          if (document.getElementById("game").style.display === "block") {

          if (e.key == "ArrowRight") {
              direction = "right"
              console.log("you pressed arrow right!")
             
          } else if (e.key == "ArrowLeft") {
            direction = "left"
            console.log("you pressed arrow left!")
           
        } else if (e.key == "ArrowUp") {
            direction = "up"
            console.log("you pressed arrow up!")
           
        } else if (e.key == "ArrowDown") {
            direction = "down"
            console.log("you pressed arrow down!")
           
        }
         //send nickname to WS
         props.socket.send(JSON.stringify({
            type:"playerMove",
            player: self.index,
            direction: direction
        }));
        //   if(!moving && direction != "") {
        //       console.log("evnt listener am I moving?", moving, direction)
        //       moving = true 
        //       const moveInterval = setInterval(move, 1000/30, direction)
        //       moveInt = moveInterval
        //       move(direction)
        //   }
          //start moving - set Timeout
          } 
    }
    let count = 0 
      function gameLoop() {
         count++
         //cX position can not be greater than the x position of the last grass tile
         if (count%5 == 0) {
            
           
            if (direction == "right" && tileMap.map[self.cRow][self.cCol+1] != 1 &&  tileMap.map[self.cRow][self.cCol+1] != 2) { 
                //self.cX<255 
                console.log("moving", direction, tileMap.map[self.cRow, self.cCol+1])
                // remove player from old position - redraw the grass tile at the old position of the player
                drawGrass()
                //draw player in new position
                  //cX++
                  self.cX += 20
                  self.cCol++
                    movePlayer()
                } else if (direction == "left" &&tileMap.map[self.cRow][ self.cCol-1] != 1 &&  tileMap.map[self.cRow][self.cCol-1] != 2 ) {
                    console.log("i can move left", tileMap.map[self.cRow, self.cCol-1])
                    drawGrass()
                    //cX-- self.cX>25
                    self.cX -=20
                    self.cCol--
                    movePlayer()
                    
                } else if (direction == "up" && tileMap.map[self.cRow-1][self.cCol] != 1 &&  tileMap.map[self.cRow-1][self.cCol] != 2 ) {
                    console.log("i can move up", tileMap.map[self.cRow-1][self.cCol])
                    drawGrass()
                    //cY-- self.cY>15
                    self.cY -= 10
                    self.cRow--
                    movePlayer()
                    
                } else if (direction == "down" && tileMap.map[self.cRow+1][self.cCol] != 1 &&  tileMap.map[self.cRow+1][self.cCol] != 2) {
                    console.log("i can move down", tileMap.map[self.cRow+1][self.cCol])
                    drawGrass()
                    //cY++ self.cY<125
                    self.cY += 10
                    self.cRow++
                    movePlayer()
                } 
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
            self.cX,
            self.cY,
            20,
            10
        );
        
                 

      }
      function movePlayer() {
        ctx.drawImage(
            self.img,
            self.playerX,
            self.playerY,
            32,
            32,
            self.cX,
            self.cY,
            20,
            10
        );
      }
  
      export function StopMove(moveInterval) {
          console.log("stop moving")
        //   clearInterval(moveInt)
        direction = ""
          moving = false
          
    }
  


/** @jsx Web_pilot.createElement */
export function Game() {
   
    
    return (
    <div id="di">
        <canvas id='game'></canvas>
        </div>
    )
}