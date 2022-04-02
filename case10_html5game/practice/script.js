(function () {
  "use strict";

  const get = (target) => document.querySelector(target);
  const getAll = (target) => document.querySelectorAll(target);

  const $canvas = get(".canvas");
  const ctx = $canvas.getContext("2d");

  const $score = get(".score");
  const $highscore = get(".highscore");
  const $play = get(".play");

  const colorSet = {
    board: "rgb(20, 105, 38)",
    snakeHead: "rgba(229, 65, 120, 0.929)",
    snakeBody: "rgba(153, 206, 244, 0.498)",
    food: "rgb(66, 187, 103)",
  };

  let start = 0;
  let setup = {
    highScore: localStorage.getItem("score") || 0,
    gameEnd: true,
    direction: 2,
    snake: [
      { x: 10, y: 10, direction: 2 },
      { x: 10, y: 20, direction: 2 },
      { x: 10, y: 30, direction: 2 },
    ],

    food: { x: 0, y: 0 },
    score: 0,
  };

  const init = () => {
    document.addEventListener("keydown", (e) => {
      // 화살표 키가 아니면 수행하지 않도록
      if (!/Arrow/gi.test(e.key)) {
        return;
      }
      e.preventDefault();
      const direction = getDirection(e.key);
      if (!isDirectionCorrect(direction)) {
        return;
      }
      setup.direction = direction;
    });

    $play.onclick = () => {
      if (setup.gameEnd) {
        setup = {
          highScore: localStorage.getItem("score") || 0,
          gameEnd: false,
          direction: 2,
          snake: [
            { x: 10, y: 10, direction: 2 },
            { x: 10, y: 20, direction: 2 },
            { x: 10, y: 30, direction: 2 },
          ],
          food: { x: 0, y: 0 },
          score: 0,
        };
        $score.textContent = `점수: ${setup.score}점`;
        $highscore.textContent = `최고점수: ${setup.highScore}점`;

        randomFood();
        window.requestAnimationFrame(play);
      }
    };
  };

  const buildBoard = () => {
    ctx.fillStyle = colorSet.board;
    ctx.fillRect(0, 0, 300, 300);
  };

  const buildSnake = (ctx, x, y, head = false) => {
    ctx.fillStyle = head ? colorSet.snakeHead : colorSet.snakeBody;
    ctx.fillRect(x, y, 10, 10);
  };

  const buildFood = (ctx, x, y) => {
    ctx.beginPath();
    ctx.fillStyle = colorSet.food;
    ctx.arc(x + 5, y + 5, 5, 0, 2 * Math.PI);
    ctx.fill();
  };

  const setSnake = () => {
    // for (let i = 0; i < setup.snake.length; ++i) {
    //   buildSnake(ctx, setup.snake[i].x, setup.snake[i].y, i === 0);
    // }
    for (let i = setup.snake.length - 1; i >= 0; --i) {
      buildSnake(ctx, setup.snake[i].x, setup.snake[i].y, i === 0);
    }
  };

  const setDirection = (number, value) => {
    while (value < 0) {
      value += number;
    }

    return value % number;
  };

  const setBody = () => {
    const snake = setup.snake;
    const tail = snake[snake.length - 1];
    const direction = snake.direction;
    let x = tail.x;
    let y = tail.y;

    switch (direction) {
      // down
      case 1:
        y = setDirection(300, y - 10);
        break;
      // up
      case -1:
        y = setDirection(300, y + 10);
        break;
      // left
      case -2:
        x = setDirection(300, x + 10);
        break;
      // right
      case 2:
        x = setDirection(300, x - 10);
        break;
    }
    setup.snake.push({ x, y, direction });
  };

  const getFood = () => {
    const snakeX = setup.snake[0].x;
    const snakeY = setup.snake[0].y;
    const foodX = setup.food.x;
    const foodY = setup.food.y;

    if (snakeX === foodX && snakeY === foodY) {
      setup.score++;
      $score.textContent = `점수 : ${setup.score}점`;
      setBody(); // 지렁이 성장
      randomFood();
    }
  };

  const randomFood = () => {
    let x = Math.floor(Math.random() * 25) * 10;
    let y = Math.floor(Math.random() * 25) * 10;
    while (setup.snake.some((part) => part.x === x && part.y === y)) {
      x = Math.floor(Math.random() * 25) * 10;
      y = Math.floor(Math.random() * 25) * 10;
    }
    setup.food = { x, y };
  };

  const moveSnake = () => {
    let x = setup.snake[0].x;
    let y = setup.snake[0].y;

    switch (setup.direction) {
      // down
      case 1:
        y = setDirection(300, y + 10);
        break;
      // up
      case -1:
        y = setDirection(300, y - 10);
        break;
      // left
      case -2:
        x = setDirection(300, x - 10);
        break;
      // right
      case 2:
        x = setDirection(300, x + 10);
        break;
    }

    const snake = [{ x, y, direction: setup.direction }];
    const snakeLength = setup.snake.length;

    // 대가리 위치만 새로 만들고
    // 원래 지렁이의 snake[0], snake[1]만 그린다
    // 어차피 setSnake할 때 snake[0]을 head로 인식해서 색을 칠해줌
    for (let index = 0; index < snakeLength - 1; index++) {
      snake.push({ ...setup.snake[index] });
    }
    setup.snake = snake;
  };

  const getDirection = (key) => {
    let direction = 0;
    switch (key) {
      case "ArrowDown":
        direction = 1;
        break;
      case "ArrowUp":
        direction = -1;
        break;
      case "ArrowLeft":
        direction = -2;
        break;
      case "ArrowRight":
        direction = 2;
        break;
    }
    return direction;
  };

  const isDirectionCorrect = (direction) => {
    return (
      setup.direction === setup.snake[0].direction &&
      setup.direction !== -direction
    );
  };

  const isGameOver = () => {
    const snake = setup.snake;
    const head = snake[0];
    // return snake.some(
    //   (el) => head !== el && el.x === head.x && el.y === head.y
    // );
    return snake.some(
      (el, index) => index !== 0 && el.x === head.x && el.y === head.y
    );
  };

  const setHighScore = () => {
    const localScore = setup.highScore * 1 || 0;
    const finalScore = $score.textContent.match(/\d+/)[0] * 1;
    if (localScore < finalScore) {
      alert(`최고기록: ${finalScore}점`);
      localStorage.setItem("score", finalScore);
    }
  };

  const play = (timestamp) => {
    ++start;
    if (setup.gameEnd) {
      return;
    }

    if (timestamp - start > 1000 / 10) {
      if (isGameOver()) {
        setup.gameEnd = true;
        setHighScore();
        alert("Game Over");
        return;
      }
      moveSnake();
      buildBoard();
      buildFood(ctx, setup.food.x, setup.food.y);
      setSnake();
      getFood();
      start = timestamp;
    }

    window.requestAnimationFrame(play);
  };

  init();
})();
