import { Web_pilot } from "../../web_pilot/web_pilot.jsx";
import { progBomb, unBomb } from "./bomb.jsx";
import { Player, TileMap, Bomb } from "./class.jsx";
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







/** @jsx Web_pilot.createElement */
export function Game(props) {




    //change speed of game
    /*function changeSpeed() {
        if (speed >= 2) {
            speed--;
        } else {
            speed;
        }
    }*/

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
    // constants
    const tileSize = 32
    const tileMap = new TileMap(tileSize)
    //variables
    let ctx
    var players = []
    let bombs = []
    let plI = null
    let direction = ""
    ////self - which player are you? websocket need to log what position you are in the 4 players 
    ////make it a global variable
    var self

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
            console .log("do i have a speed powerup and what is my waitMS?", self.speed, waitMS)
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
    function SendMove(direction, socket)  {
        console.log("sending player move to server", direction, self.index)
        socket.send(JSON.stringify({
            type:"playerMove",
            player: self.index,
            direction: direction
        }));
    }

    const throttledMove = moveThrottle(SendMove, 500, 100);

    window.addEventListener('keydown', (event) => {
        switch (event.key) {
            case 'ArrowUp':
            case 'ArrowDown':
            case 'ArrowLeft':
            case 'ArrowRight':
                case ' ':
                throttledMove(event.key, props.socket);
                break;
            default:
                break;
        }
    });




    //////------------------GAMELOOP -----------------------------------------------------
    ///animation loop 
    function gameLoop(time) {
        if (bombs.length > 0) {
            bombs.forEach((b) => {
                if (b.status === "unexploded") {
                    progBomb(b, time)
                } else {
                    unBomb(b, time)
                }
            })
            bombs.forEach((b) => { b.status === "complete" ? tileMap.map[b.row][b.col].splice(0, 1) : null })
            bombs = bombs.filter((b) => b.status != "complete")

        }
        //if plI (index of a currently moving player) is not null 
        if (plI != null) {
            //get player object
            let p = players[plI]
            //get array of players current position in the tilemap
            let pArr = tileMap.map[p.cRow][p.cCol]
            //players index in the array of their current posiion
            let i = pArr.indexOf(plI + 3)
            console.log("game loop variables: player \nindex:", plI, "\ntilemap Array:", pArr, "\nplayer index in array:", i)

            //check the array of players current position and draws all the relevant images
            function draw() {
                drawGrass()
                pArr.forEach((n) => {
                    console.log("drawing tile:", n)
                    if (2 < n && n < 7) {
                        console.log("drawing player")
                        drawPlayer(n - 3)
                    } else if (n == 7) {
                        console.log("drawing bomb")
                        drawBomb()
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
                drawGrass()
                drawBomb()
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
            //set index of the currently moving player to null as they have finished moving
            plI = null
            //set direction back to an empty string
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
            255,
            197,
            players[plI].cX,
            players[plI].cY,
            20,
            10
        )
    }
    function drawPlayer(n) {
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
                                    console.log("speed before: ++++++++++++=",  players[n-3].speed)
                                    players[n-3].speed = 0;
                                    players[n-3].bombs = 0
                                    players[n-3].flames = 0
                                    console.log("speed after: -------------=",  players[n-3].speed)
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
                }
                if (b.count === 0) {
                    i = 4
                    spot.splice(0, 1)
                }

            }

        }
        b.count--

    }

    function progBomb(b, timeStamp) {


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