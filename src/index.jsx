import React from 'react';
import './index.css';

export default class Snake extends React.Component {
  constructor(props) {
    super(props);
    const { widthField, heightField, segmentSize, scoreForWin } = this.props;
    this.widthField = widthField;
    this.heightField = heightField;
    this.segmentSize = segmentSize;
    this.state = {
      gameEnd: false,
      timeoutId: 0,
      direction: 'right',
      nextDirection: 'right',
      score: 0,
      timeoutDelay: 300,
      snakeSegmentsPositions: [{ left: 8 * this.segmentSize, top: 2 * this.segmentSize }],
      snakeHeadPosition: {
        left: 8 * this.segmentSize,
        top: 2 * this.segmentSize
      },
      food: {
        left: 10 * this.segmentSize,
        top: 5 * this.segmentSize
      }
    };
  }

  createSegment(left, top, color = '#008743', isFood = false, index) {
    let circle = isFood ? '50%' : 'none'
    return (
      <div key={index} style={{
        left: left,
        top: top,
        backgroundColor: color,
        height: this.segmentSize,
        position: 'absolute',
        width: this.segmentSize,
        borderRadius: circle
      }} />
    )
  }

  createFood() {
    const { top, left } = this.state.food;
    return this.createSegment(left, top, '#005042', true);
  }

  setDirection = (keyCode) => {
    const { direction } = this.state;
    const nextDirection = {
      ArrowRight: 'right',
      ArrowLeft: 'left',
      ArrowDown: 'down',
      ArrowUp: 'up'
    }
    if (direction === 'left' && nextDirection[keyCode] === "right") return;
    if (direction === 'right' && nextDirection[keyCode] === "left") return;
    if (direction === 'up' && nextDirection[keyCode] === "down") return;
    if (direction === 'down' && nextDirection[keyCode] === "up") return;

    if (nextDirection[keyCode]) {
      this.setState({ nextDirection: nextDirection[keyCode] })
    }
  }

  changeFoodPosition() {
    return {
      top: Math.floor(Math.random() * (this.heightField / this.segmentSize)) * this.segmentSize,
      left: Math.floor(Math.random() * (this.widthField / this.segmentSize)) * this.segmentSize
    }
  }

  isEqualPosition(obj1, obj2) {
    return obj1.top === obj2.top && obj1.left === obj2.left;
  }

  isCollision(newHead) {
    const gorizontCollision = newHead.left < 0 || newHead.left > (this.widthField - this.segmentSize);
    const verticalCollision = newHead.top < 0 || newHead.top > (this.heightField - this.segmentSize);

    let selfCollision = false;
    for (const seg of this.state.snakeSegmentsPositions) {
      if (this.isEqualPosition(seg, newHead)) {
        selfCollision = true;
      }
    }
    if (this.props.collisionWithWalls) {
      return gorizontCollision || verticalCollision || selfCollision;
    } else { return selfCollision }
  }

  updateGame() {
    const { food, snakeHeadPosition: { left, top }, direction: dir } = this.state;
    const snakeSegmentsPositions = [...this.state.snakeSegmentsPositions];
    let newScore = this.state.score;
    let newFoodPosition = this.state.food;
    let timeoutDelay = this.state.timeoutDelay;
    let newHead;

    if (dir === 'up') {
      newHead = {
        left: left,
        top: top - this.segmentSize
      }
    }
    if (dir === 'right') {
      newHead = {
        left: left + this.segmentSize,
        top: top
      }
    }
    if (dir === 'down') {
      newHead = {
        left: left,
        top: top + this.segmentSize
      }
    }
    if (dir === 'left') {
      newHead = {
        left: left - this.segmentSize,
        top: top
      }
    }

    snakeSegmentsPositions.unshift(newHead);

    if (this.isEqualPosition(food, newHead)) {
      ++newScore;
      if (this.changepeed) timeoutDelay -= 10;

      do {
        newFoodPosition = this.changeFoodPosition();
      } while (this.isCollision(newFoodPosition))

    } else {
      snakeSegmentsPositions.pop();
    }

    if (!this.props.collisionWithWalls) {
      if (newHead.left > (this.widthField - this.segmentSize)) newHead.left = 0;
      if (newHead.left < 0) newHead.left = this.widthField - this.segmentSize;
      if (newHead.top > (this.heightField - this.segmentSize)) newHead.top = 0;
      if (newHead.top < 0) newHead.top = this.heightField - this.segmentSize;
    }

    if (this.isCollision(newHead) || newScore === this.props.scoreForWin) {
      this.gameOver();
    }

    this.setState({
      score: newScore,
      timeoutDelay: timeoutDelay,
      snakeSegmentsPositions,
      snakeHeadPosition: newHead,
      food: newFoodPosition,
    })
  }

  createSnake(snakeSegments) {
    return snakeSegments.map((seg, index) => {
      if (index === 0) return this.createSegment(seg.left, seg.top, '#5E3D19', false, index)
      if (index % 2 && index !== 0) {
        return this.createSegment(seg.left, seg.top, '#007090', false, index)
      } else { return this.createSegment(seg.left, seg.top, '#6B651E', false, index) }

    })
  }

  gameOver() {
    clearTimeout(this.state.timeoutId);
    this.setState({ gameEnd: true })
  }

  gameLoop = () => {
    this.setState({ timeoutId: setTimeout(this.gameLoop, this.state.timeoutDelay) })
    this.setState({ direction: this.state.nextDirection })
    this.updateGame();
    this.createFood();
  }

  startGame = () => {
    if (this.state.timeoutId === 0) this.gameLoop();
  }

  pauseGame = () => {
    clearTimeout(this.state.timeoutId);
    this.setState({ timeoutId: 0 })
  }

  resetGame = () => {
    clearTimeout(this.state.timeoutId);
    this.setState({
      gameEnd: false,
      timeoutId: 0,
      direction: 'right',
      nextDirection: 'right',
      score: 0,
      timeoutDelay: 300,
      snakeSegmentsPositions: [{ left: 8 * this.segmentSize, top: 2 * this.segmentSize }],
      snakeHeadPosition: {
        left: 8 * this.segmentSize,
        top: 2 * this.segmentSize
      },
      food: {
        left: 10 * this.segmentSize,
        top: 5 * this.segmentSize
      }
    })

  }

  handler() {
    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space') { this.pauseGame() }
      if (e.code === 'Enter') { this.startGame() }
      if (e.code === 'Backspace') { this.resetGame() }
      this.setDirection(e.code)
    })
  }

  componentDidMount() {
    this.handler();
  }

  componentWillUnmount() {
    clearInterval(this.intervalId)
  }

  render() {
    const { snakeSegmentsPositions, gameEnd, score } = this.state;

    const snake = this.createSnake(snakeSegmentsPositions)
    const viewSnake = !gameEnd ? snake : null;
    const viewFood = !gameEnd ? this.createFood() : null;

    const bgColorGameOver = (score === this.props.scoreForWin) ? 'win' : 'lose';
    const end = gameEnd ? <div className={`game-over-field ${bgColorGameOver}`}></div> : null;

    return (
      <>
        <div className='game-field' style={{ width: this.widthField, height: this.heightField }}>
          <div className='game-score'>Score: {score}</div>
          {viewSnake}
          {viewFood}
          {end}
        </div>
        <div className='key-control'>
          <p>&#8678; &#8679; &#8681; &#8680;</p>
          <p>Enter &#8210; start</p>
          <p>Space &#8210; pause</p>
          <p>Backspace &#8210; reset</p>
        </div>
      </>
    )
  }
}

Snake.defaultProps = {
  collisionWithWalls: true,
  changepeed: true,
  widthField: 300,
  heightField: 300,
  segmentSize: 20,
  scoreForWin: 20
}
