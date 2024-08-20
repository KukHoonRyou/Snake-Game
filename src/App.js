import React, { useState, useEffect } from 'react';

const GRID_SIZE = 20;
const INIT_SNAKE = [[8, 8]];
const INIT_FOOD = [Math.floor(Math.random() * GRID_SIZE), Math.floor(Math.random() * GRID_SIZE)];

const SnakeGame = () => {
  const [snake, setSnake] = useState(INIT_SNAKE);
  const [food, setFood] = useState(INIT_FOOD);
  const [direction, setDirection] = useState([0, 1]); // 초기 방향은 오른쪽
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  // 게임 루프 및 움직임
  useEffect(() => {
    if (gameOver) return;
    
    const handleMove = setInterval(() => {
      moveSnake();
    }, 200); // 200ms마다 뱀을 이동시킴

    return () => clearInterval(handleMove);
  }, [snake]);

  // 키보드 방향키 입력 처리
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowUp':
          setDirection([-1, 0]);
          break;
        case 'ArrowDown':
          setDirection([1, 0]);
          break;
        case 'ArrowLeft':
          setDirection([0, -1]);
          break;
        case 'ArrowRight':
          setDirection([0, 1]);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 뱀을 이동시키는 함수
  const moveSnake = () => {
    const newSnake = [...snake];
    const head = [newSnake[0][0] + direction[0], newSnake[0][1] + direction[1]];

    if (isCollision(head)) {
      setGameOver(true);
      return;
    }

    newSnake.unshift(head);

    // 음식 먹기 처리
    if (head[0] === food[0] && head[1] === food[1]) {
      setScore(score + 1);
      setFood([Math.floor(Math.random() * GRID_SIZE), Math.floor(Math.random() * GRID_SIZE)]);
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  };

  // 충돌 체크 함수
  const isCollision = (head) => {
    // 벽 충돌
    if (head[0] < 0 || head[0] >= GRID_SIZE || head[1] < 0 || head[1] >= GRID_SIZE) {
      return true;
    }
    // 자기 자신과 충돌
    for (let segment of snake) {
      if (head[0] === segment[0] && head[1] === segment[1]) {
        return true;
      }
    }
    return false;
  };

  return (
    <div>
      {gameOver ? (
        <div>
          <h1>Game Over</h1>
          <p>Score: {score}</p>
        </div>
      ) : (
        <div>
          <h1>Snake Game</h1>
          <p>Score: {score}</p>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${GRID_SIZE}, 20px)`, margin: '20px' }}>
            {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
              const x = Math.floor(i / GRID_SIZE);
              const y = i % GRID_SIZE;
              const isSnake = snake.some(seg => seg[0] === x && seg[1] === y);
              const isFood = food[0] === x && food[1] === y;

              return (
                <div
                  key={i}
                  style={{
                    width: '20px',
                    height: '20px',
                    backgroundColor: isSnake ? 'green' : isFood ? 'red' : 'white',
                    border: '1px solid gray',
                  }}
                ></div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default SnakeGame;