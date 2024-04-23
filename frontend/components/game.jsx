import { Web_pilot } from "../../web_pilot/web_pilot.jsx";
import { progBomb } from "./bomb.jsx";
import { move, drawPlayer } from "./move.jsx"
import { Player, TileMap } from "./class.jsx";
import deadAngel from "../static/sounds/deadAngel.ogg"
import gameOver from "../static/sounds/10 Game Over.ogg"
import { whoAmI } from "./waitForPlayers"

const url = "https://drive.google.com/drive/u/0/folders/1MN3N9JVBdpcHj7dPlnEbvff88hHnqZ0F"




// keyup eventlistener
// export function StopMove(moveInterval) {
//console.log("stop moving")
//   clearInterval(moveInt)
//direction = ""
//moving = false

//}


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
var self




/** @jsx Web_pilot.createElement */
export function Game(props) {



    props.socket.addEventListener("message", function (e) {
        var msg = JSON.parse(e.data);
        switch (msg.type) {
            case "playerMove":
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

                while (board.length) {
                    row = board.splice(0, 15);
                    map.push(row)
                    row = []
                }
                console.log("reconstructed layout", map)
                tileMap.map = map
                break
            case 'gameLoad':
                console.log("game load recieved")
                let n = localStorage.getItem("numPlayers")
                let p = localStorage.getItem("position")
                GameLoad(n, p)
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
        let lPosition = [[1, 1], [1, 13], [13, 1], [13, 13]]
        // if (numPlayers> 4) {
        //     numPlayers = 4
        // }
        // if (position> 3) {
        //     position = 3
        // }
        for (let i = 0; i < numPlayers; i++) {
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
            if (loadedPlayers.length == numPlayers && boardDrawn) {
                initFinish()
            }

        }


        function initFinish() {
            console.log("init finish")
            console.log("original tilemap", tileMap.map)
            window.requestAnimationFrame(() => { gameLoop() })
            clearInterval(initId)

        }

        initId = setInterval(initGame, 1000)

    }

    /////------------MOVEMENT THROTTLE -----------------------------------

    /// throttle movement so characters dont move too fast
    function moveThrottle(func, normalWaitMS, fastWaitMS) {
        let isWait = false;

        return function (...args) {

            const waitMS = players[self.index].speed > 0 ? fastWaitMS : normalWaitMS;
            console.log("do i have a speed powerup and what is my waitMS?", self.speed, waitMS)
            if (!isWait) {
                func.call(this, ...args);
                isWait = true;

                setTimeout(() => {
                    isWait = false;
                }, waitMS);
            }
        };
    }

    /// send move to ws 
    function SendMove(direction, socket) {
        console.log("sending player move to server", direction, self.index)
        socket.send(JSON.stringify({
            type: "playerMove",
            player: self.index,
            direction: direction
        }));
    }

    const throttledMove = moveThrottle(SendMove, 600, 100);

    window.addEventListener('keydown', (event) => {
        switch (event.key) {
            case 'ArrowUp':
            case 'ArrowDown':
            case 'ArrowLeft':
            case 'ArrowRight':
            case ' ':
                console.log("event target", event)
                if (event.target.id!== "message"){
                    throttledMove(event.key, props.socket);
                }
                
                break;
            default:
                break;
        }
    });




    //////------------------GAMELOOP -----------------------------------------------------
    ///animation loop 
    function gameLoop(time) {
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
            move(plI, direction, time)
            //set index of the currently moving player to null as they have finished moving
            plI = null
            //set direction back to an empty string
            direction = ""

        }

        window.requestAnimationFrame(gameLoop)
    }





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




    function undrawExplosion(b) {
        let o = [20, -20, 0, 0]
        let p = [0, 0, 10, -10]

        let check = [b.col + b.count, b.col - b.count, b.row + b.count, b.row - b.count]
        let bcheck = [b.col + b.count - 1, b.col - b.count - 1, b.row + b.count - 1, b.row - b.count - 1]
        for (let i = 0; i < 4; i++) {
            console.log("remove tile\ncount", b.count, " row, col:", b.row, b.col)
            if (check[i] < 14 && check[i] > 0) {
                console.log("position within tilemap")
                let spot
                let pSpot
                let row
                let col
                if (i < 2) {
                    row = b.row
                    col = check[i]
                    spot = tileMap.map[b.row][check[i]]
                    pSpot = bcheck[i] > 0 ? tileMap.map[b.row][bcheck[i]] : []
                    console.log("spot", spot, "pSpot", pSpot)
                } else {
                    row = check[i]
                    col = b.col
                    spot = tileMap.map[check[i]][b.col]
                    pSpot = bcheck[i] > 0 ? tileMap.map[bcheck[i]][b.col] : []
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
                    let deadPlayers = []

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
                                    console.log("speed before: ++++++++++++=", players[n - 3].speed)
                                    players[n - 3].speed = 0;
                                    players[n - 3].bombs = 0
                                    players[n - 3].flames = 0
                                    console.log("speed after: -------------=", players[n - 3].speed)
                                    drawPlayer(n - 3)

                                } else {
                                     //array of dead players
                                   deadPlayers.push(n-3)
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

                                        props.socket.send(JSON.stringify({
                                            type: "removePlayer"
                                        }))
                                    }

                                }

                            }
                            if (n > 7) {
                                console.log("found!!!! drawing power up")
                                let pX
                                if (n === 8) { pX = b.bombs } else if (n === 9) { pX = b.flames } else if (n === 10) { pX = b.speed }
                                ctx.drawImage(
                                    b.powerUp,
                                    pX,
                                    0,
                                    125,
                                    125,
                                    col * 20,
                                    row * 10,
                                    20,
                                    10
                                )
                            }
                        }
                    )
                     ///if there are dead players
                     if (deadPlayers.length > 0) {
                        //loop through dead players index in players array
                        deadPlayers.forEach((n) => {
                            //remove player from the tileMap
                            let p = players[n]
                            let ind = tileMap.map[p.cRow][p.cCol].indexOf(n)
                            tileMap.map[p.cRow][p.cCol].splice(ind, 1)
                        })
                     }
                }
                if (b.count === 0) {
                    i = 4
                    spot.splice(0, 1)
                }

            }

        }
        b.count--

    }


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

    return (
        <div id="di">
            <span><canvas id='game'></canvas></span>
            <span style={{ width: 355 + 'px', height: 80 + 'px', fontSize: 1.5 + 'em' }} >
                <div id="instruct">
                    <h3>'space bar' to drop bomb</h3>
                    <h3><strong>⇦ ⇨ ⇧ ⇩</strong> move left right up down</h3>
                    {/* <h3><strong>⇧ ⇩</strong> move up down</h3> */}
                </div></span>

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