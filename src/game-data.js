function isInRange(value,min,max){
    return value >= min && value <= max;
}

function getRandomInt(min,max){
    return Math.floor(Math.random() * (max - min)) + min;
}
function isValidShip(beginningCoordinate,direction,length,gameBoard){
    if(direction === "horizontal"){
        if(beginningCoordinate.x + length - 1 >= 10) return false


        for (let i = 0; i < length; i++) {
            let board =
                gameBoard.getCoordinateFromCoordinateObj(new Coordinate(beginningCoordinate.x+i,beginningCoordinate.y))

            if(board.ship){
                return false
            }
        }
    }
    else{
        if(beginningCoordinate.y + length - 1 >= 10) return false
        for (let i = 0; i < length; i++) {
            let board =
                gameBoard.getCoordinateFromCoordinateObj(new Coordinate(beginningCoordinate.x,beginningCoordinate.y+i))
            if(board.ship){
                return false
            }
        }
    }
    return true
}

export class Ship{
    length
    hitAmount
    isSunk
    coordinates
    direction

    constructor(gameBoard) {
        this.coordinates = []
            while (true){
                let length = getRandomInt(1,5)
                let beginningCoordinate = new Coordinate(getRandomInt(0,10),getRandomInt(0,10))

                let randomNum = Math.random()
                if(randomNum < 0.5 &&  isValidShip(beginningCoordinate,"horizontal",length,gameBoard)){
                    this.#assignShips("horizontal",gameBoard,beginningCoordinate,length)
                    this.direction = "horizontal"
                    break
                }
                else if(isValidShip(beginningCoordinate,"vertical",length,gameBoard)){
                    this.#assignShips("vertical",gameBoard,beginningCoordinate,length)
                    this.direction = "vertical"
                    break
                }
            }
        this.isSunk = false
        this.hitAmount = 0
    }

    set(gameBoard,newBeginningCoordinate,direction){
        this.coordinates.forEach(coordinate=>coordinate.ship = null)
        if(isValidShip(newBeginningCoordinate,direction,this.length,gameBoard)){
            this.coordinates = []
            this.#assignShips(direction,gameBoard,newBeginningCoordinate,this.length)
            return true
        }
        this.coordinates.forEach(coordinate=>coordinate.ship = this)
        return false
    }


    #assignShips(direction,gameBoard,beginningCoordinate,length){
        let newCoordinate = gameBoard.getCoordinateFromCoordinateObj(beginningCoordinate)
        newCoordinate.ship = this
        this.coordinates.push(newCoordinate)

        if(direction === "horizontal"){
            for (let i = 1; i < length; i++) {
                let newCoordinate =
                    gameBoard.getCoordinateFromCoordinateObj(new Coordinate(beginningCoordinate.x+i,beginningCoordinate.y))
                this.coordinates.push(newCoordinate)

                newCoordinate.ship = this
            }
        }
        else{
            for (let i = 1; i < length; i++) {
                let newCoordinate =
                    gameBoard.getCoordinateFromCoordinateObj(new Coordinate(beginningCoordinate.x,beginningCoordinate.y+i))
                this.coordinates.push(newCoordinate)
                newCoordinate.ship = this
            }
        }
        this.length = length

    }

    hit(){
        this.hitAmount++
        if(this.hitAmount === this.length)
            this.isSunk = true
    }

}


export class GameBoard{
    board
    length
    ships
    hits


    constructor(length,amountOfShip) {
        this.board = []
        this.ships = []
        this.hits = []
        this.length = length
        for (let i = 0; i < length; i++) {
            for (let j = 0; j < length; j++) {
                this.board.push(new Coordinate(j,i))
            }
        }

        for (let i = 0; i < amountOfShip; i++) {
            let ship = new Ship(this)
            this.ships.push(ship)
        }
    }

    receiveAttack(coordinate){
        if(coordinate.isHit)
            return null

        let ship = coordinate.ship
        if(ship){
            ship.hit()
        }
        this.hits.push({x:coordinate.x,y:coordinate.y,shipHit:coordinate.ship!==null})
        coordinate.isHit = true
        if(this.ships.every(x=>x.isSunk)){
            return this.hits
        }
        else
            return this.hits[this.hits.length-1]
    }

    getCoordinate(x,y){
        let index =  (y*this.length)+x
        return this.board[index]
    }
    getCoordinateFromCoordinateObj(coordinate){
        if(coordinate !== null && typeof coordinate === "object")
            return this.getCoordinate(coordinate.x,coordinate.y)
        else
            return null
    }


}




export class Player{
    playerType
    gameBoard



    constructor(playerType) {
        this.playerType = playerType
        this.gameBoard = new GameBoard(10,5)
    }


}



export class Bot extends Player{



    makeRandomMove(gameBoard){
        let randomNumX = getRandomInt(0,10)
        let randomNumY = getRandomInt(0,10)

        return gameBoard.getCoordinate(randomNumX,randomNumY)
    }


}

export class Coordinate{
    x
    y
    isHit
    ship

    constructor(x,y) {
        this.x = x
        this.y = y
        this.isHit=false
        this.ship = null
    }


    equals(other){
        return this.x === other.x && this.y === other.y
    }
}
