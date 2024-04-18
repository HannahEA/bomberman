import { ctx, tileMap } from "./game"

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
    )} else {
        console.log("new tile\ncount", b.count, " row, col:", b.row, b.col, b.col+b.count)
        let m =[54, -54, 0, 0]
        let n =[0, 0, 51, -51]
        let o =[20, -20, 0, 0]
        let p = [0, 0, 10, -10]
        
        let check = [b.col+b.count, b.col-b.count, b.row+b.count, b.row-b.count]

        for (let i=0; i<4; i++) {

            console.log("add tile\nouter loop", b.count,"\ninner loop index:", i, "\nrow, col:", b.row, b.col, "\ncheck i:", check[i])

            if (check[i]<14 && check[i]>0){
            let spot 
            let c = check[i]
            if (i<2){
                console.log("type of check i", typeof c, tileMap)
                spot = tileMap.map[b.row][c]
                console.log("spot", spot)
            } else {
                spot = tileMap.map[c][b.col]
                console.log("spot", spot)
            }
            if (!spot.includes(1)) {
                console.log("no wall present, drawing explosion")
                 ctx.drawImage(
                b.explosion,
                b.eX+(m[i]*b.count),
                b.eY+(n[i]*b.count),
                54,
                51,
                b.cX+(o[i]*b.count),
                b.cY+(p[i]*b.count),
                20,
                10
            )
            }
         }
        }
    }
    
    b.count++
}
      

function undrawExplosion(b) {
    let o =[20, -20, 0, 0]
    let p = [0, 0, 10, -10]
  
    let check = [b.col+b.count, b.col-b.count, b.row+b.count, b.row-b.count]

for (let i=0; i<4; i++) {
    console.log("remove tile\ncount", b.count, " row, col:", b.row, b.col)
    if (check[i]<14 && check[i]>0){
        console.log("position within tilemap")
        let spot 
        if (i<2){
           
            spot = tileMap.map[b.row][check[i]]
            console.log("spot", spot)
        } else {
            spot = tileMap.map[check[i]][b.col]
            console.log("spot", spot)
        }
        if (!spot.includes(1)) {
            console.log("no wall present, drawing explosion")
                ctx.drawImage(
                    tileMap.grass,
                    0,
                    0,
                    779,
                    779,
                    b.cX+(o[i]*b.count),
                    b.cY+(p[i]*b.count),
                    20,
                    10
                )
                
                spot.forEach(
                    (n) => {
                        console.log("is there a player present?", n)
                        if (n>2 && n<7) {
                            drawPlayer(n-3)
                        }   
                    }
                )
        }
    }
}
    b.count--

}

export function progBomb(b, timeStamp) {
    
   
    const elapsed = timeStamp - b.start ;
    const increment = timeStamp - b.previousTimeStamp
    //make sure 3 secs have passed before starting  explosion
      if (elapsed >= 3000 && increment>=300  ) {
        
            // progressively display explosion
            //X++54 Y++50.6  x-379 y-354
            console.log("explosion starting")
            drawExplosion(b)
            b.previousTimeStamp = timeStamp;
      }
        //check to see if explosion is complete > status = exploded
        if (b.count>2) {
            console.log("bomb exploded")
            b.status = "exploded"
            b.count--
        } 
    
}
export function unBomb(b, timeStamp) {
    const increment = timeStamp - b.previousTimeStamp
    //make sure 3 secs have passed before starting  explosion
      if (increment>=400  ) {
            // progressively display explosion
            //X++54 Y++50.6  x-379 y-354
            console.log("de-explosion starting")
            undrawExplosion(b)
            b.previousTimeStamp = timeStamp;
      }
        //check to see if de-explosion is complete > status = complete 
        if (b.count<0) {
            console.log("explosion complete")
            b.status = "complete"
        } 

}