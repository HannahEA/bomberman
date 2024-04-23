import { Web_pilot } from "../../web_pilot/web_pilot.jsx"; 
import { progBomb } from "./bomb.jsx";
import { Player,TileMap} from "./class.jsx";
import { move, drawPlayer } from "./move.jsx";
import deadAngel from "../static/sounds/deadAngel.ogg"
import { whoAmI } from "./waitForPlayers";

const url = "https://drive.google.com/drive/u/0/folders/1MN3N9JVBdpcHj7dPlnEbvff88hHnqZ0F"


// constants
const tileSize = 32
export const tileMap = new TileMap(tileSize)
 //variables
export let ctx 
export var players = [] 
export let bombs = []
let plI = null
let direction = ""
////self - which player are you? websocket need to log what position you are in the 4 players 
////make it a global variable
export  var self 







/////------------MOVEMENT THROTTLE -----------------------------------

/// throttle movement so characters dont move too fast
    function moveThrottle (func, waitMS) {
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
    
    
    const throttledMove = moveThrottle(SendMove, 200)
    const fastThrottledMove = moveThrottle(SendMove, 50)
   
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
           if (self.speed > 0 ) {
            fastThrottledMove(e.key, socket)
           } else {
            throttledMove(e.key, socket)
           }
            
        } 
        
        } 
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
            case 'gameLoad':
                console.log("game load received")
                let n = localStorage.getItem("numPlayers")
                let p = localStorage.getItem("position")
                GameLoad(n,p)
            break
        }


    })
   
    
    
    //--------------CREATE THE GAME BOARD------------------------------

 function GameLoad(numPlayers, position) {
    let initId
    const canvas = document.getElementById("game")
    const canvasContext = canvas.getContext("2d")
    ctx = canvasContext
    
    //initialise players
    let lPosition = [[1,1], [1,13], [13,1], [13,13]]

    for (let i = 0; i<numPlayers; i++) {
        const player = new Player(i, lPosition[i][0], lPosition[i][1])
        players.push(player)
        tileMap.map[player.cCol][player.cRow].push(i+3)
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
 //////------------------GAMELOOP -----------------------------------------------------
    ///animation loop 
    function gameLoop(time) {
        //check if there are any bombs in the process of exploding
        
            if (bombs.length>0) {
                bombs.forEach( (b) => {
                    //console.log("what is the bombs status", b.status)
                    if (b.status === "unexploded") {
                        //console.log("unexploded bomb found")
                       progBomb(b, time) 
                    } else if (b.status === "bomb exploded") {
                        //console.log("exploded bomb found")
                        unBomb(b,time)
                    } else if (b.status === "complete") {
                        //console.log("completed bomb found")
                        tileMap.map[b.row][b.col].splice(0, 1)
                    }
                } )
            
                bombs = bombs.filter((b)=> b.status === "bomb exploded" || b.status === "unexploded")
                //console.log("bombs after", bombs)
        
            }
        
        //if plI (index of a currently moving player) is not null 
        if (plI != null) {
            // move player
            move(plI, direction, time)
             //set index of the currently moving player to null as they have finished moving
            plI = null 
            //set direction back to an empty string
            direction = ""
        }
        //request new animation frame
        window.requestAnimationFrame(gameLoop)
    }

    ////-------------------UNDRAW BOMB ----------------------------
    function unBomb(b, timeStamp) {
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

    
//=======> Start Heart and Explosion variables and functions <=======
//var isPlaying = false;
var tries = 0;
var lostHeart;
var explosion;
var audio4 = new Audio(deadAngel);

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
                                    //Bomberman looses one life
                                    players[n - 3].lives--
                                    if (players[n - 3].index === self.index) {
                                        //derive which heart to remove
                                        console.log("type of players.index", typeof (players[n - 3].index))
    
                                        //determine number of tries
                                        tries = 3 - players[n - 3].lives
                                        //remove heart that has the same number as the number of tries
                                        lostHeart = document.getElementById(`heart${tries}`)
                                        //heart exploding and disappearing
                                        lostHeart.style.opacity = "0"
                                        puff(tries);
    
                                    }
                                    players[n-3].speed = 0 
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
                                            + `Better luck next time ${whoAmI}</p>`
                                            ;
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
        console.log("de-exploding: what is b.count", b.count)
    }
    

    return (
    <div id="di">
        <canvas id='game'></canvas>
        </div>
    )
}
