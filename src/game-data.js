function isInRange(value,min,max){
    return value >= min && value <= max;
}

function getRandomInt(min,max){
    return Math.floor(Math.random() * (max - min)) + min;
}

export class Ship{
    length
    hitAmount
    isSunk
    coordinates


    constructor(ships) {
        this.coordinates = []
        let isDone = false
            while (!isDone || this.coordinates.length === 0){
                isDone = false
                let length = getRandomInt(1,5)
                let beginningCoordinate = new Coordinate(getRandomInt(0,10),getRandomInt(0,10))
                if(ships.filter(x=>x.coordinates.filter(y=>y.equals(beginningCoordinate))[0]).length >= 1){
                    continue
                }
                let randomNum = Math.random()
                if(randomNum < 0.5 &&  beginningCoordinate.x + length - 1 < 10){
                    this.coordinates.push(beginningCoordinate)
                    for (let i = 1; i < length; i++) {
                        let previousCoordinate = this.coordinates[i-1]


                        if(ships.filter(x=>x.coordinates.filter(y=>y.equals(new Coordinate(previousCoordinate.x+1,previousCoordinate.y)))[0]).length >= 1){
                            this.coordinates = []
                            break
                        }

                        this.coordinates.push(
                            new Coordinate(previousCoordinate.x+1,previousCoordinate.y))
                    }
                    isDone = true
                    this.length = length
                }
                else if(beginningCoordinate.y + length - 1 < 10){
                    this.coordinates.push(beginningCoordinate)
                    for (let i = 1; i < length; i++) {
                        let previousCoordinate = this.coordinates[i-1]



                        if(ships.filter(x=>x.coordinates.filter(y=>y.equals(new Coordinate(previousCoordinate.x,previousCoordinate.y+1)))[0]).length >= 1){
                            this.coordinates = []
                            break
                        }
                        this.coordinates.push(
                            new Coordinate(previousCoordinate.x,previousCoordinate.y+1))

                    }

                    isDone = true
                    this.length = length

                }
            }
        this.isSunk = false
        this.hitAmount = 0
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
        for (let i = 0; i < amountOfShip; i++) {
            let ship = new Ship(this.ships)
            this.ships.push(ship)
        }
        this.length = length
        for (let i = 0; i < length; i++) {
            for (let j = 0; j < length; j++) {
                this.board.push(new Coordinate(j,i))
            }
        }


    }

    receiveAttack(coordinate){
        let mapCoordinate = this.getCoordinateFromCoordinateObj(coordinate)
        if(mapCoordinate.isHit)
            return

        let ship =
            this.ships.filter
            (x=>x.coordinates.filter(y=>y.equals(mapCoordinate))[0])[0]
        if(ship){
            ship.hit()

        }
        this.hits.push({x:coordinate.x,y:coordinate.y})
        mapCoordinate.isHit = true
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

export class Coordinate{
    x
    y
    isHit

    constructor(x,y) {
        this.x = x
        this.y = y
        this.isHit=false
    }


    equals(other){
        return this.x === other.x && this.y === other.y
    }
}
