const movingEl = document.getElementById('moving');
const containerEl = document.getElementById('container');
const timeEl = document.getElementById('time');
const scoreEl = document.getElementById('score');

let foodImage = "./bacteria.png";
let seconds = 0;
let score = 0;

let locked = false;
let rotateDegree = 0;

function increaseTime(){
    seconds++;
    let minutes = Math.floor(seconds / 60);
    let secondsRemaining = seconds % 60;
    let m = minutes < 10 ? `0${minutes}` : minutes;
    let s = secondsRemaining < 10 ? `0${secondsRemaining}` : secondsRemaining;
    timeEl.innerText = `Zaman : ${m}:${s}`;
}


setInterval(()=>{
    increaseTime();
}, 1000);

function createFood(){
    const foods = document.querySelectorAll('.food');
    if(foods.length > 3){
        return;
    }
    let foodEl = document.createElement('div');
    foodEl.classList.add('food');
    foodEl.innerHTML = `
    <img src="${foodImage}" alt="bacteria" />
    `;
    const {x, y} = getRandomLocation();
    foodEl.style.top = `${y}px`;
    foodEl.style.left = `${x}px`;
    containerEl.appendChild(foodEl);
}

createFood();
createFood();
createFood();




document.addEventListener('keydown', (e) => {
    if(locked){
        return;
    }
    let left = movingEl.offsetLeft;
    let top = movingEl.offsetTop;
    if(e.code === "ArrowRight"){
        rotateDegree = 90;
        if(left <= containerEl.offsetWidth - 20 - movingEl.offsetWidth){
            movingEl.style.left = `${left + 20}px`;
            movingEl.style.transform = `rotateZ(${rotateDegree}deg) scale(1)`;
        }
        eat();
    }
    else if(e.code === "ArrowDown"){
        rotateDegree = 180;
        if(top <= containerEl.offsetHeight - 20 - movingEl.offsetHeight){
            movingEl.style.top = `${top + 20}px`;
            movingEl.style.transform = `rotateZ(${rotateDegree}deg) scale(1)`;
        }
        eat();
    }
    else if(e.code === "ArrowUp") {
        if(top >= 20){
            rotateDegree = 0;
            movingEl.style.top = `${top - 20}px`;
             movingEl.style.transform = `rotateZ(${rotateDegree}deg) scale(1)`;
        }
        eat();
    }
    else if(e.code === "ArrowLeft") {
        if(left >= 20){
            rotateDegree = 270;
            movingEl.style.left = `${left - 20}px`;
            movingEl.style.transform = `rotateZ(${rotateDegree}deg) scale(1)`;
        }
        eat();
    }
});

function getRandomLocation() {
    const width = containerEl.offsetWidth;
    const height = containerEl.offsetHeight;
    const x = Math.floor(Math.random() * (width - 150)) + 75;
    const y = Math.floor(Math.random() * (height - 150)) + 75;
    return {x,y};
}

function eat(){
    let foods = document.querySelectorAll('.food');
    foods.forEach(food => {
        let intersect = collide(movingEl, food);

        if(intersect){
            locked = true;
            score++;
            scoreEl.innerText = `Skor : ${score}`;
            food.style.transform = `scale(0)`;
            movingEl.style.transform = `rotateZ(${rotateDegree}deg) scale(1.1)`;
            movingEl.style.opacity = 0.9;
            setTimeout(() => {
                food.remove();
                createFood();
                locked = false;
                movingEl.style.transform = `rotateZ(${rotateDegree}deg) scale(1)`;
                movingEl.style.opacity = 1;
            }, 501);
        }
    });
    
    
    
}

function collide(div1, div2){
    const rect1 = div1.getBoundingClientRect();
    const rect2 = div2.getBoundingClientRect();
    const isInHoriztonalBounds =
    rect1.x < rect2.x + rect2.width && rect1.x + rect1.width > rect2.x;
    const isInVerticalBounds =
    rect1.y < rect2.y + rect2.height && rect1.y + rect1.height > rect2.y;
    const isOverlapping = isInHoriztonalBounds && isInVerticalBounds;
    return isOverlapping;
};
