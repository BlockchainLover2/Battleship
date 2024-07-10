import {GameBoard,Coordinate,Ship} from "../game-data"


test('test gameboard creation',()=>{
    expect(new GameBoard(10).receiveAttack(new Coordinate(1,2))).
    toStrictEqual({x:1,y:2})
})
test('test gameboard creation',()=>{
    expect(new Ship()).
    toStrictEqual({x:1,y:2})
})