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
export class TileMap {
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
                const tile = this.map[row][column][0];
                if (tile === 0 || tile ===3 || tile ===4 || tile ==5 || tile === 6) {
                    // if ((2<row && row<12 || 2<column && column<12 ) && isBrick === 0) {
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
                if (tile === 2) {
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

    addBricks() {
        for (let row = 0; row < this.map.length; row++) {
            for (let column = 0; column < this.map[row].length; column++) {
                const tile = this.map[row][column][0];
                if (tile === 0) {
                    let isBrick= Math.round(Math.random() * 1)
                     if (isBrick === 0) {
                       //update tilemap.map layout to say this tile form grass(0) to brick(2)
                        this.map[row][column][0] = 2   
                    }
                }
            }
        }
    }

 }

//player 

export class Player {
    constructor(num, sRow, sCol) {
        this.index = num
        this.img = image("https://tcrf.net/images/8/81/NeoBattleIcon.gif", this)
        this.bomb = image("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3-wYS4XcMD2-b7P-MHFoP7-VUE19kyWule_L4NDGmTg&s", this)
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

export class Bomb {
    constructor(col, row, x, y, start) {
        this.explosion = image("https://i.imgur.com/9W3XES3.png", this)
        this.imageLoaded = false
        // col and row in tilemap
        this.col = col 
        this.row = row
        //current Y and X in canvas
        this.cY = y
        this.cX = x
        this.start = start
        this.previousTimeStamp = start
        this.status = "unexploded"
        this.count = 0
        //the centre square co-ords
        this.eX = 162
        this.eY = 152
    }
}

