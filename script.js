"use strict"

let board

const Player = (symbol = 'X') => {
  symbol = symbol

  return {symbol}
}

const Computer = (symbol = 'O') => {
  symbol = symbol

  function bestSpot() {
    return Game.minimax(board, computer.symbol).index
  }

  return {symbol, bestSpot}
}

const human = Player()
const computer = Computer()


const Board = (function() {
  const cells = document.querySelectorAll('.cell')

  function clear() {
    board = Array.from(Array(9).keys())
    for (let i = 0; i < cells.length; i++) {
      cells[i].innerText = ''
      cells[i].style.removeProperty('background-color')
      cells[i].addEventListener('click', turnClick, false)
    }
  }

  function turnClick(square) {
    if (typeof board[square.target.id] == 'number') {
      Game.turn(square.target.id, human.symbol)
      if (!Game.checkWin(board, human.symbol) && !Game.checkTie()) Game.turn(computer.bestSpot(), computer.symbol)
    }
  }

  function emptySquares() {
    return board.filter(square => typeof square == 'number')
  }

  return {cells, clear, turnClick, emptySquares}
})()


const Game = (function() {
  const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2]
  ]

  function turn(squareID, player) {
    board[squareID] = player
    document.getElementById(squareID).innerText = player

    let gameWon = checkWin(board, player)
    if (gameWon) gameOver(gameWon)
  } 

  function checkTie() {
    if (Board.emptySquares().length == 0) {
      for (let i = 0; i < Board.cells.length; i++) {
        Board.cells[i].style.backgroundColor = '#f6da8d'
        Board.cells[i].removeEventListener('click', Board.turnClick, false)
      }
      declareWinner('Tie game!')
      return true
    }
    return false
  }

  function checkWin(board, player) {
    let plays = board.reduce((arr, element, index) =>
      (element === player) ? arr.concat(index) : arr, [])

    let gameWon = null
    for (let [index, win] of winningCombos.entries()) {
      if (win.every(elem => plays.indexOf(elem) > -1)) {
        gameWon = {index: index, player: player}
        break
      }
    }
    return gameWon
  }

  function gameOver(gameWon) {
    for (let index of winningCombos[gameWon.index]) {
      document.getElementById(index).style.backgroundColor = gameWon.player == human.symbol ? "#2274a5" : "#d8979c"
    }

    for (let i = 0; i < Board.cells.length; i++) {
      Board.cells[i].removeEventListener('click', Board.turnClick, false)
    }

    declareWinner(gameWon.player == human.symbol ? 'You win!' : 'You lose :(')
  }

  function declareWinner(who) {
    document.querySelector('.endgame').style.display = 'block'
    document.querySelector('.endgame .text').innerText = who
  }

  function minimax(newBoard, player) {
    let availableSpots = Board.emptySquares()

    if (checkWin(newBoard, human.symbol)) {
      return {score: -10}
    } else if (checkWin(newBoard, computer.symbol)) {
      return {score: 10}
    } else if (availableSpots.length === 0) {
      return {score: 0}
    }

    let moves = []
    for (let i = 0; i < availableSpots.length; i++) {
      let move = {}
      move.index = newBoard[availableSpots[i]]
      newBoard[availableSpots[i]] = player
      
      if (player == computer.symbol) {
        let result = minimax(newBoard, human.symbol)
        move.score = result.score
      } else {
        let result = minimax(newBoard, computer.symbol)
        move.score = result.score
      }

      newBoard[availableSpots[i]] = move.index
    
      moves.push(move)
    }

    let bestMove
    if (player === computer.symbol) {
      let bestScore = -10000
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score > bestScore) {
          bestScore = moves[i].score
          bestMove = i
        }
      } 
    } else {
      let bestScore = 10000
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score < bestScore) {
          bestScore = moves[i].score
          bestMove = i
        }
      }
    }

    return moves[bestMove]
  }

  function play() {
    document.querySelector('.endgame').style.display = 'none'
    Board.clear()
  }

  return {turn, checkTie, checkWin, gameOver, minimax, play}
})()

Game.play()