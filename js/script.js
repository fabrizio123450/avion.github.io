var player = {
    left: 450,
    top: 620
}

var missile = [];

var enemies = [
    { left: 350, top: 200 },
    { left: 450, top: 250 },
    { left: 550, top: 300 },
    { left: 650, top: 350 }
]

function drawEnemies() {
    content = "";
    for (var i = 0; i < enemies.length; i++) {
        content += "<div class='enemy' style='left:" + enemies[i].left + "px;top: " + enemies[i].top + "px;'></div>";
    }
    document.getElementById("enemies").innerHTML = content;
}


function drawPlayer() {
    content = "<div class='player' style='left:" + player.left + "px;top: " + player.top + "px;'></div>";
    document.getElementById("players").innerHTML = content;
}

function drawMissiles() {
    content = "";
    for (var i = 0; i < missile.length; i++) {
        content += "<div class='missile' style='left: " + missile[i].left + "px; top: " + missile[i].top + "px'></div>"
    }
    document.getElementById("missiles").innerHTML = content;
}


function moveEnemies() {
    for (var i = 0; i < enemies.length; i++) {
        /**VUELVEN A EMPEZAR DE ARRIBA AL LLEGAR AL FINAL**/
        if (enemies[i].top < 625) {
            enemies[i].top += 1;
            console.log(enemies[i].top)
        } else {
            enemies[i].top = 0;
        }
    }
}
const score = document.getElementById("score")
let num = 0;
function moveMissiles() {
    for (var i = 0; i < missile.length; i++) {
        missile[i].top -= 6;
        for (var j = 0; j < enemies.length; j++) {
            if (
                /**cuadro del enemigo y misil */
                missile[i].left < enemies[j].left + 70 &&
                missile[i].left + 5 > enemies[j].left &&
                missile[i].top < enemies[j].top + 75 &&
                missile[i].top + 5 > enemies[j].top
            ) {
                enemies.splice(j, 1);
                num++
                score.innerHTML= num;
            }

        }

    }
}
document.onkeydown = function (e) {
    if (e.key === "ArrowLeft" && player.left > 10) { // Izquierda
        player.left -= 10;
    }
    if (e.key === "ArrowRight" && player.left < 840) { // Derecha
        player.left += 10;
    }
    if (e.key === "ArrowDown" && player.top < 625) { // Abajo
        player.top += 10;
    }
    if (e.key === "ArrowUp" && player.top > 500) { // Arriba
        player.top -= 10;
    }
    if (e.key === " ") { // spacebar fire
        missile.push({ left: (player.left + 34), top: (player.top + 8) });
        drawMissiles();
    }


    drawPlayer();
}

function gameLoop() {
    console.log("gameLoop is running!");
    drawPlayer();
    moveEnemies();
    drawEnemies();
    moveMissiles();
    drawMissiles();
    setTimeout(gameLoop, 10);
}
gameLoop();

/**PARA EL PUNTAJE QUE GUARDE */
