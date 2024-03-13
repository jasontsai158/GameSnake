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

let touchStartX = 0;
let touchStartY = 0;
let touchMoveActive = false;

document.addEventListener("touchstart", function (event) {
  touchStartX = event.touches[0].clientX;
  touchStartY = event.touches[0].clientY;
  touchMoveActive = true;
});

document.addEventListener("touchmove", function (event) {
  if (!touchMoveActive) return;

  let touchEndX = event.touches[0].clientX;
  let touchEndY = event.touches[0].clientY;

  let deltaX = touchEndX - touchStartX;
  let deltaY = touchEndY - touchStartY;

  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    // 水平移动更多，改变水平方向
    if (deltaX > 0 && d !== "left") {
      d = "right";
    } else if (deltaX < 0 && d !== "right") {
      d = "left";
    }
  } else {
    // 垂直移动更多，改变垂直方向
    if (deltaY > 0 && d !== "up") {
      d = "down";
    } else if (deltaY < 0 && d !== "down") {
      d = "up";
    }
  }
  // 防止滑动过程中页面滚动
  event.preventDefault();
});

document.addEventListener("touchend", function (event) {
  touchMoveActive = false;
});
// 设置一个变量来跟踪触摸是否活跃
let touchActive = false;

// 监听触摸开始事件
document.addEventListener("touchstart", function (event) {
  // 标记触摸活跃
  touchActive = true;
});

// 监听触摸结束事件
document.addEventListener("touchend", function (event) {
  // 标记触摸结束
  touchActive = false;
});

// 监听触摸滚动事件
document.addEventListener("touchmove", function (event) {
  // 如果触摸活跃，则阻止默认滚动行为
  if (touchActive) {
    event.preventDefault();
  }
});
