import { Web_pilot } from "../Webpilot/web_pilot.jsx"; 
import {brick} from "../static/brick.webp"
import {grass} from "../static/grass.webp"
import { wall} from "../static/wall.jpeg"

const url = "https://drive.google.com/drive/u/0/folders/1MN3N9JVBdpcHj7dPlnEbvff88hHnqZ0F"
class TileMap {
    constructor(tileSize) {
     this.tileSize = tileSize
     this.grass = this.#image("https://as2.ftcdn.net/v2/jpg/04/04/01/49/1000_F_404014988_7N8rNOa9ezLOZx6O6JEscLyNCpLLZhGW.jpg")
    //  this.wall = this.#image("wall.jpeg")
    //  this.brick = this.#image("brick.webp")
    //  this.player = this.#image("wall.jpeg")
    }

    #image(fileName) {
        console.log("filename", fileName)
        const img = new Image()
        img.src= `${fileName}`
        img.onerror = (errorMsg) => {
            console.log("img error", errorMsg, fileName)
        }
        img.onload = ()=> {console.log("image has loaded 2")}
        return img
    }

    // 0 - grass 
    // 1 - wall
    // 2 - brick 
    // 3 - player
    // 4 - bomb 
    // 5 - explosion
    map = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1], 
        [1, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 1], 
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 1],
        [1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1],
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
        for (let row = 0; row < this.map.length; row++) {
            for (let column = 0; column < this.map[row].length; column++) {
                const tile = this.map[row][column];
                if (tile === 0) {
                    console.log("Drawing grass tile at:", row, column);
                    ctx.drawImage(
                        this.grass,
                        column * this.tileSize,
                        row * this.tileSize,
                        this.tileSize,
                        this.tileSize
                    );
                }
            }
        }
    }
    // #drawMap(ctx, canvas) {
        
    //         for (let row= 0; row< this.map.length; row++) {
    //             for (let column= 0; column<this.map[row].length; column++) {
    //                 const tile = this.map[row][column] 
                  
    //                 let image = null 
    //                 switch(tile) {
    //                     case 0:
    //                         image = this.grass
                            
    //                         break
    //                 }
    //                 if (image != null) {
    //                     console.log("hey")
    //                     image.onload = () => {

    //                         console.log("image has loaded 3")
    //                         ctx.drawImage(
    //                         image, 
    //                         this.tileSize * column,
    //                         this.tileSize * row,
    //                         this.tileSize,
    //                         this.tileSize
    //                     )
    //                     console.log("breaker")
    //                     di.appendChild(image)
    //                     }
    //                     // console.log("drawing image", this.tileSize)
                     
                
    //                 }
                        
                    
    //             }
    //         }
        
       
    // }
 }

//game loop

export function GameLoad() {
        const canvas = document.getElementById("game")
        const ctx = canvas.getContext("2d")
        const di = document.getElementById("di") 
        console.log("canvas", canvas, ctx)
        const tileSize = 32
        const tileMap = new TileMap(tileSize)
     
        function gameLoop() {
            tileMap.draw(canvas, ctx, di)
        }
        gameLoop()
        // requestAnimationFrame(gameLoop, 1000/60)
    }

/** @jsx Web_pilot.createElement */
export function Game() {
   
    function move(e) {
        if (e.key == "ArrowRight") {

        }
    }
    
    return (
    <div id="di">
        <canvas id='game'></canvas>
        </div>
    )
}