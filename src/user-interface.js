import {Player} from "./game-data";

let firstPLayerContainer = document.querySelector(".first-player")
let secondPlayerContainer = document.querySelector(".second-player")
let informationContainer = document.querySelector(".information")

let boardToElement = new Map()



function createGameBoard(player){
    let gameBoard = player.gameBoard
    for (const boardElement of gameBoard.board) {
        let div = document.createElement("div");
        div.classList.add("board-element")
        firstPLayerContainer.appendChild(div)
        boardToElement.set(boardElement,div)
    }

    for (let i = 0; i < gameBoard.ships.length; i++) {
        let ship = gameBoard.ships[i]
        for (const coordinate of ship.coordinates) {
            let mapCoordinate = gameBoard.getCoordinateFromCoordinateObj(coordinate)
            let mainDiv = boardToElement.get(mapCoordinate)
            let div = document.createElement("div")
            div.classList.add("ship")
            div.addEventListener("mouseenter", (e)=>{ shipHoverEventListener(e.target,ship,gameBoard,"enter")})
            div.addEventListener("mouseout", (e)=>{ shipHoverEventListener(e.target,ship,gameBoard,"out")})
            mainDiv.appendChild(div)
        }
    }
}

function shipHoverEventListener(target,ship,gameBoard){
    for (const coordinate of ship.coordinates) {
        let getDiv = boardToElement.get(gameBoard.getCoordinateFromCoordinateObj(coordinate))
        getDiv.firstElementChild.classList.toggle("hover")
        getDiv.style.cursor = "pointer"
    }
}


function hitEventListener(target){

}


let player = new Player("Human")
createGameBoard(player)