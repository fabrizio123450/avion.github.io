/**variable que tiene los datos del contenedor
 */
let gameBox = document.getElementById("ocean");
let ancho = gameBox.offsetWidth;
let largo = gameBox.offsetHeight;
//variable axuliar que impide que presione enter en caso de iniciar el juego
let juegoEnCurso = false;
//puntaje
const score = document.getElementById("score")
let num = 0;
/*obtengo las imagenes que representa mi vida*/
let lifeElement = document.getElementById("life");
let lifeImages = lifeElement.getElementsByClassName("life-image");
//nombre del que jugo
let nombre = '';
//estado de jugador
let player = {
    left: 50,
    top: 80,
    life: 3
}
//inicializo los misiles y enemigos
let missile = [];

let enemies = [
    { left: 70, top: 10 },
    { left: 60, top: 10 },
    { left: 50, top: 10 },
    { left: 40, top: 10 }
]

//enemigos
function drawEnemies() {
    let content = "";
    for (let i = 0; i < enemies.length; i++) {
        content += "<div class='enemy' style='left:" + enemies[i].left + "%;top: " + enemies[i].top + "%;'></div>";
    }
    document.getElementById("enemies").innerHTML = content;
}

//jugador
function drawPlayer() {
    let content = "<div class='player' style='left:" + player.left + "%;top: " + player.top + "%;'></div>";
    document.getElementById("players").innerHTML = content;
}
//misiles
function drawMissiles() {
    let content = "";
    for (let i = 0; i < missile.length; i++) {
        content += "<div class='missile' style='left: " + missile[i].left + "%; top: " + missile[i].top + "%'></div>"
    }
    document.getElementById("missiles").innerHTML = content;
}


function moveEnemies() {
    for (let i = 0; i < enemies.length; i++) {
        /**VUELVEN A EMPEZAR DE ARRIBA AL LLEGAR AL FINAL**/
        if (enemies[i].top < 89) {
            if (num >= 7) {
                enemies[i].top += 0.5;
            } else {
                enemies[i].top += 0.1;
            }

            console.log(enemies[i].top)
        } else {
            enemies[i].top = 10;
        }
    }
}

function highScore() {
    num++;
    score.innerHTML = num;
    //nueva ronda de enemigos
    if (num === 4) {
        num++
        score.innerHTML = num;
        enemies.push(
            { left: 89, top: 10 },
            { left: 30, top: 0 }
        )

    } else if (num >= 7) {
        enemies.push(
            { left: Math.floor(Math.random() * (89 - 10 + 1)) + 10, top: 10 },
        )
    }
}

/**function
 * que reduce mi vida tambien
 * PARA QUE EL PUNTAJE SE GUARDE 
 */
function lifePlayer() {
    player.life--;

    if (lifeImages.length > 0) {
        lifeImages[lifeImages.length - 1].remove();
    }
    if (player.life === 0) {
        alert("GAMEOVER");
        nombre = prompt("Cual es tu nombre: ");

        // obtengo datos que existen o sino crea un array vacio
        //y guardo esos datos en el local storage
        const saveJson = localStorage.getItem('datos');
        const saveData = saveJson ? JSON.parse(saveJson) : [];
        saveData.push({ nombre: nombre, puntaje: num });
        localStorage.setItem('datos', JSON.stringify(saveData));
        location.reload();
    }
}
function getScore() {
    let content = "";
    const saveJson = localStorage.getItem('datos');
    //obtengo mis datos
    const saveData = saveJson ? JSON.parse(saveJson) : [];
    //agrego los puntajes al html
    for (let i = 0; i < saveData.length; i++) {
        content += "<div class='puntaje'><p>"+saveData[i].nombre +"      "+saveData[i].puntaje +"</p><div>"
    }
    document.getElementById("scoreContainer").innerHTML = content;
    console.log(saveData);
}
function colisionEnemigo() {
    for (let i = 0; i < enemies.length; i++) {
        let enemyLeft = (parseFloat(enemies[i].left) / 100) * ancho;
        let enemyTop = (parseFloat(enemies[i].top) / 100) * largo;
        let playerLeft = (parseFloat(player.left) / 100) * ancho;
        let playerTop = (parseFloat(player.top) / 100) * largo;
        // verifica la colisión entre el jugador y el enemigo
        //con su ancho y largo
        if (
            playerLeft < enemyLeft + 70 &&
            playerLeft + 70 > enemyLeft &&
            playerTop < enemyTop + 75 &&
            playerTop + 75 > enemyTop
        ) {
            //alert("¡Colisión con enemigo!");
            enemies.splice(i, 1);
            lifePlayer();
            highScore();

        }
    }
}


function moveMissiles() {
    let colisiones = [];
    for (let i = 0; i < missile.length; i++) {
        missile[i].top -= 1;

        for (let j = 0; j < enemies.length; j++) {
            // coordenadas del misil y el enemigo en píxeles
            let missileLeft = (parseFloat(missile[i].left) / 100) * ancho;
            let missileTop = (parseFloat(missile[i].top) / 100) * largo;
            let enemyLeft = (parseFloat(enemies[j].left) / 100) * ancho;
            let enemyTop = (parseFloat(enemies[j].top) / 100) * largo;

            // verifica la colisión
            // con el ancho y largo del enemigo y misil
            if (
                missileLeft < enemyLeft + 70 &&
                missileLeft + 5 > enemyLeft &&
                missileTop < enemyTop + 75 &&
                missileTop + 10 > enemyTop
            ) {
                colisiones.push({ missile: i, enemy: j });
                highScore();
            }
        }
    }

    /**con esto me evito que salte el error que misiles es 0 */
    colisiones.forEach(colision => {
        missile.splice(colision.missile, 1);
        enemies.splice(colision.enemy, 1);

    });

}


function gameLoop() {
    console.log("gameLoop is running!");
    drawPlayer();
    moveEnemies();
    drawEnemies();
    moveMissiles();
    drawMissiles();
    colisionEnemigo();
    setTimeout(gameLoop, 10);
}
//Botones del juego
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft" && player.left > 7) { // Izquierda
        player.left -= 1;
    }
    if (e.key === "ArrowRight" && player.left < 89) { // Derecha
        player.left += 1;
    }
    if (e.key === "ArrowDown" && player.top < 89) { // Abajo
        player.top += 1;
    }
    if (e.key === "ArrowUp" && player.top > 10) { // Arriba
        player.top -= 1;
    }
    if (e.key === " ") { // spacebar fire
        missile.push({ left: (player.left + 2.5), top: (player.top + 2.5) });
        drawMissiles();
    }


    drawPlayer();
    /**no se ejecuta el juego hasta que se presione ENTER */
    if (e.key === "Enter" && !juegoEnCurso) {
        document.getElementById("start").style.display = "none";
        document.getElementById("game").style.display = "block";
        gameLoop();
        juegoEnCurso = true;
    }
})
/**boton para volver atras en la aplicacion */
document.getElementById('back').addEventListener('click',()=>{
    window.location.href = "https://fabrizio123450.github.io/gamesTrunk.github.io/";
})
/**MODAL *************************************/
const openModalBtn = document.getElementById('openModalBtn');
const modal = document.getElementById('myModal');
/**puntajes modal */
const modalScore = document.getElementById('scores')
const modal2 = document.getElementById('myModal2');
const closeModalBtn = document.querySelector('.close');
const closeModalBtn2 = document.querySelector('.close2');
//PUNTAJE EN MODAL
modalScore.addEventListener('click', () => {
    getScore();
    modal2.style.display = 'block';

});

openModalBtn.addEventListener('click', () => {
    modal.style.display = 'block';
});

// Cerrar el modal cuando se hace clic en la "X"
closeModalBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});
//CIEROO MODAL PUNTAJE
closeModalBtn2.addEventListener('click', () => {
    modal2.style.display = 'none';
});
// Cerrar el modal cuando se hace clic fuera del modal
window.addEventListener('click', (event) => {
    if (event.target === modal || event.target === modal2 ) {
        modal.style.display = 'none';
        modal2.style.display = 'none';
    }
});