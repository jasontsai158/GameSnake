const canvas = document.getElementById("mycanvas");
const ctx = canvas.getContext("2d");
const unit = 20;
const row = canvas.width / unit;
const column = canvas.height / unit;
let snake = [];
{
  snake[0] = {
    x: 60,
    y: 0,
  };
  snake[1] = {
    x: 40,
    y: 0,
  };
  snake[2] = {
    x: 20,
    y: 0,
  };
  snake[3] = {
    x: 0,
    y: 0,
  };
}
let d = "right";
let score = 0;
let highenstscore;
loadhighenstscore();
document.getElementById("Scope1").innerHTML = "分數" + score;
document.getElementById("Scope2").innerHTML = "最高分" + highenstscore;

//劃蛇//
function draw() {
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
      clearInterval(myGame);
      alert("Game Over");
    }
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  console.log("清掉了嗎");
  for (let i = 0; i < snake.length; i++) {
    if (i == 0) {
      ctx.fillStyle = "red";
    } else {
      ctx.fillStyle = "gray";
    }
    ctx.strokeStyle = "black";
    ctx.fillRect(snake[i].x, snake[i].y, unit, unit);
    ctx.strokeRect(snake[i].x, snake[i].y, unit, unit);
  }

  //讓蛇動起來//
  let snakeX = snake[0].x;
  let snakeY = snake[0].y;
  myfruit.drawfruit();
  if (d == "right") {
    snakeX += unit;
    if (snakeX > canvas.width) {
      snakeX = 0;
    }
  } else if (d == "left") {
    snakeX -= unit;
    if (snakeX < 0) {
      snakeX = canvas.width - unit;
    }
  } else if (d == "up") {
    snakeY -= unit;
    if (snakeY < 0) {
      snakeY = canvas.height - unit;
    }
  } else if (d == "down") {
    snakeY += unit;
    if (snakeY > canvas.height) {
      snakeY = 0;
    }
  }

  let newhead = { x: snakeX, y: snakeY };
  if (snake[0].x == myfruit.x && snake[0].y == myfruit.y) {
    myfruit.PickAlocation();
    myfruit.drawfruit();
    score++;
    sethighenstscore(score);
    document.getElementById("Scope1").innerHTML = "分數" + score;
    document.getElementById("Scope2").innerHTML = "最高分" + highenstscore;
  } else {
    snake.pop();
  }
  snake.unshift(newhead);
}
let myGame = setInterval(draw, 100);
//控制蛇的方向//
function direction(event) {
  if (event.key === "ArrowDown" && d !== "up") {
    d = "down";
  }
  if (event.key === "ArrowUp" && d !== "down") {
    d = "up";
  }
  if (event.key === "ArrowLeft" && d !== "right") {
    d = "left";
  }
  if (event.key === "ArrowRight" && d !== "left") {
    d = "right";
  }
}
document.addEventListener("keydown", direction);
//劃出水果//
class fruit {
  constructor() {
    this.x = Math.floor(Math.random() * row) * unit;
    this.y = Math.floor(Math.random() * column) * unit;
  }
  drawfruit() {
    ctx.fillStyle = "yellow";
    ctx.fillRect(this.x, this.y, unit, unit);
    ctx.strokeRect(this.x, this.y, unit, unit);
  }

  PickAlocation() {
    let overlap = false;
    let new_x;
    let new_y;

    function checkoverlap(new_x, new_y) {
      for (let i = 0; i < snake.length; i++) {
        if (new_x === snake[i].x && new_y === snake[i].y) {
          overlap = true;
          return;
        } else {
          overlap = false;
        }
      }
    }
    do {
      new_x = Math.floor(Math.random() * row) * unit;
      new_y = Math.floor(Math.random() * column) * unit;
      checkoverlap(new_x, new_y);
    } while (overlap);
    this.x = new_x;
    this.y = new_y;
  }
}

let myfruit = new fruit();

function loadhighenstscore() {
  if (localStorage.getItem("highenstscore") == null) {
    highenstscore = 0;
  } else {
    highenstscore = Number(localStorage.getItem("highenstscore"));
  }
}

function sethighenstscore(score) {
  if (score > highenstscore) {
    localStorage.setItem("highenstscore", score);
    highenstscore = score;
  }
}
// 设置一个函数来处理触摸事件
function handleTouch(event) {
  // 获取触摸点的坐标
  let touchX = event.touches[0].clientX;
  let touchY = event.touches[0].clientY;

  // 获取蛇头的坐标
  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  // 计算触摸点与蛇头的相对位置
  let deltaX = touchX - snakeX;
  let deltaY = touchY - snakeY;

  // 判断触摸点在蛇头的左边还是右边
  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    // 水平距离更大，判断左右方向
    if (deltaX > 0) {
      d = "right";
    } else {
      d = "left";
    }
  } else {
    // 垂直距离更大，判断上下方向
    if (deltaY > 0) {
      d = "down";
    } else {
      d = "up";
    }
  }
}

// 初始化时调用触摸事件处理函数
document.addEventListener("touchstart", handleTouch);
