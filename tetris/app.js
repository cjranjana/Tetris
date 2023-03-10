document.addEventListener('DOMContentLoaded',()=>{
  const grid=document.querySelector('.grid')
  let squares=Array.from(document.querySelectorAll('.grid div'))
  const scoreDisplay=document.querySelector('#score')
  const startBtn=document.querySelector('#start-button')
  const width=10
  let nextRandom=0
  let timerId
  let score=0
  const colors = [
    'orange',
    'red',
    'purple',
    'yellow',
    'blue'
  ]

  const lShape = [
    [1, width+1, width*2+1, 2],
    [width, width+1, width+2, width*2+2],
    [1, width+1, width*2+1, width*2],
    [width, width*2, width*2+1, width*2+2]
  ]

  const zShape = [
    [0,width,width+1,width*2+1],
    [width+1, width+2,width*2,width*2+1],
    [0,width,width+1,width*2+1],
    [width+1, width+2,width*2,width*2+1]
  ]

  const tShape = [
    [1,width,width+1,width+2],
    [1,width+1,width+2,width*2+1],
    [width,width+1,width+2,width*2+1],
    [1,width,width+1,width*2+1]
  ]

  const oShape = [
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1]
  ]

  const iShape = [
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3],
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3]
  ]

  const theTetrises=[lShape,zShape,tShape,oShape,iShape]
  let currentPosition=4
  let currentRotation=0

  console.log(theTetrises[0][0])


  let random=Math.floor(Math.random()*theTetrises.length)
  let current=theTetrises[random][currentRotation]


  //draw tetris

  function draw(){
    current.forEach(index => {
      squares[currentPosition+index].classList.add('tetris')
      squares[currentPosition+index].style.backgroundColor=colors[random]
    })
  }

  //undraw tetris

  function undraw(){
    current.forEach(index=>{
      squares[currentPosition+index].classList.remove('tetris')
      squares[currentPosition+index].style.backgroundColor=''
    })
  }
 
  
  function control(e) {
    if(e.keyCode === 37) {
      moveLeft()
    } else if (e.keyCode === 38) {
      rotate()
    } else if (e.keyCode === 39) {
      moveRight()
    } else if (e.keyCode === 40) {
      moveDown()
    }
  }
  document.addEventListener('keyup', control)

  //move down

  function moveDown(){
    undraw()
    currentPosition+=width
    draw()
    freeze()
  }

  //freeze

  function freeze(){
    if(current.some(index=>squares[currentPosition+index+width].classList.contains('taken'))){
      current.forEach(index=>squares[currentPosition+index].classList.add('taken'))

      random=nextRandom
      nextRandom=Math.floor(Math.random()*theTetrises.length)
      current=theTetrises[random][currentRotation]
      currentPosition=4
      draw()
      addScore()
      gameOver()
    }
  }

  //moveleft function

  function moveLeft(){
    undraw()
    const atLeftEdge=current.some(index=>(currentPosition+index)%width===0)
    if(!atLeftEdge)currentPosition-=1
    if(current.some(index=>squares[currentPosition+index].classList.contains('taken'))){
      currentPosition+=1
    }
    draw()
  }
  
//move right function

function moveRight(){
  undraw()
  const atRightEdge=current.some(index=>(currentPosition+index)%width===width-1)
  if(!atRightEdge)currentPosition+=1
  if(current.some(index=>squares[currentPosition+index].classList.contains('taken'))){
    currentPosition-=1
  }
  draw()
}

//fixing rotation at edge

function atRight(){
  return current.some(index=>(currentPosition+index+1)%width===0)

}
function atLeft(){
  return current.some(index=>(currentPosition+index)%width===0)

}

function checkRotatedPosition(P){
  P=P||currentPosition
  if((P+1)%width<4){
    if(atRight()){
      currentPosition+=1
      checkRotatedPosition(P)
    }
  }
  else if(P%width>5){
    if(atLeft()){
      currentPosition=1
      checkRotatedPosition(P)
    }
  }
}


//rotate tetris

function rotate(){
  undraw()
  currentRotation++
  if(currentRotation === current.length) { //if the current rotation gets to 4, make it go back to 0
    currentRotation = 0
  }
  current = theTetrises[random][currentRotation]
  checkRotatedPosition()
  draw()
}






startBtn.addEventListener('click', () => {
  if (timerId) {
    clearInterval(timerId)
    timerId = null
  } else {
    draw()
    timerId = setInterval(moveDown, 1000)
    nextRandom = Math.floor(Math.random()*theTetrises.length)
    
  }
})

//addscore

function addScore(){
  for(let i=0;i<199;i+=width){
  const row=[i,i+1,i+2,i+3,i+4,i+5,i+6,i+7,i+8,i+9]
  
  if(row.every(index=>squares[index].classList.contains('taken'))){
    score +=10
    scoreDisplay.innerHTML = score
    row.forEach(index => {
      squares[index].classList.remove('taken')
      squares[index].classList.remove('tetris')
      squares[index].style.backgroundColor = ''
    })
    const squaresRemoved = squares.splice(i, width)
    squares = squaresRemoved.concat(squares)
    squares.forEach(cell => grid.appendChild(cell))

  }

  }
}
function gameOver() {
  if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
    scoreDisplay.innerHTML = 'GAME OVER'
    clearInterval(timerId)
  }
}


})