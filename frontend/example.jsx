import { Web_pilot } from "./Webpilot/web_pilot.jsx";

/** @jsx Web_pilot.createElement */
export function Example() {
    let map = {
        columns: 5,
          rows: 5,
          size: 25,
          tiles: [
              1, 3, 3, 3, 1,
              1, 1, 1, 1, 1,
              1, 1, 1, 1, 1,
              1, 3, 1, 1, 1,
              1, 3, 1, 2, 1,
              1, 3, 1, 2, 2,
          ],
          getTile: (col, row) => this.tiles[row * map.columns + col]
      }
    function move(e) {
        if (e.key == "ArrowRight") {

        }
    }
    class TileMap {
        constructor(tileSize) {
         this.tileSize = tileSize
         this.grass = this.#image("./img/grass.webp")
         this.wall = this.#image("./img/wall.jpeg")
         this.brick = this.#image("./img/brick.webp")
         this.player = this.#image("./img/wall.jpeg")
         this.bomb = this.#image("./img/bomb.webp")
         this.explosion = this.#image("./img/explosion.webp")
        }
    
        #image(fileName) {
            const img = new Iamge()
            img.src= `images/${fileName}`
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
        draw(canvas, ctx) {
            this.#clearCanvas(canvas, ctx)
        }
        #clearCanvas(canvas, ctx) {
            ctx.fillStyle = "black"
            ctx.fillRect(0, 0, canvas.width, canvas.height)
        }
     }
    
    //game loop
    function gameLoad(e) {
        const canvas = document.getElementById("game")
        console.log("canvas", canvas)
        const ctx = canvas.getContext("2d")
        const tileSize = 32
        const tileMap = new TileMap(tileSize)
     
        function gameLoop() {
            tileMap.draw(canvas, ctx)
        }
     
        requestAnimationFrame(gameLoop, 1000/60)
    }
    
    
    return (
        <div onLoad={(e) => {gameLoad(e)}}>
            <h1>Bomberman</h1>
            <canvas id='game' onLoad={(e) => {gameLoad(e)}}></canvas>
        </div>
        
    )
}