import classes from './classes.js';
import htmlElements from './htmlElements.js';
import { Spaceship } from './Spaceship.js';
import { Enemy } from './Enemy.js';


class Game {

    enemyRenderTime = 1000; // [ms] delay between creating new enemy
    enemySpeedRatio = 10; // lower value => faster enemies speed

    enemies = [];
    #score = null;
    #lives = null;

    #ship = new Spaceship(htmlElements.spaceship, htmlElements.container);

    #checkPositionInterval = null;
    #createEnemyInterval = null;

    init() {
        this.#ship.init();
        this.#newGame();
        htmlElements.button.addEventListener('click', () => {
            this.#newGame();
        })
    }

    #newGame() {
        htmlElements.modal.classList.add(classes.hide);
        this.#createEnemyInterval = setInterval(() => this.#randomNewEnemy(), this.enemyRenderTime)
        this.#checkPositionInterval = setInterval(() => this.#checkPosition(), 1);
        this.#lives = 3;
        this.#score = 0;
        this.#updateLivesText();
        this.#updateScoreText();
        this.#ship.element.style.left = '0px';
        this.#ship.setPosition();
    }

    #endGame() {
        htmlElements.modal.classList.remove(classes.hide);
        htmlElements.scoreInfo.textContent = `You loose! Your score is ${this.#score}`;
        this.enemies.forEach(enemy => enemy.explode());
        this.enemies.length = 0;
        clearInterval(this.#createEnemyInterval);
        clearInterval(this.#checkPositionInterval);
    }

    #createNewEnemy(enemyType = 'enemy') {
        const enemy = new Enemy(htmlElements.container, this.enemySpeedRatio, enemyType);
        enemy.init();
        this.enemies.push(enemy);
    }

    #randomNewEnemy() {
        const randomNumber = Math.floor(Math.random() * 5) + 1;
        randomNumber % 5 ? this.#createNewEnemy('enemy') : this.#createNewEnemy('enemy--big');
    }

    #updateScore() {
        this.#score++;
        if (!(this.#score % 5)) { // enemies in time acceleration
            this.enemySpeedRatio--;
        }
        this.#updateScoreText();
    }

    #updateLives() {
        this.#lives--;
        this.#updateLivesText();
        htmlElements.container.classList.add(classes.hit);
        setTimeout(() => htmlElements.container.classList.remove(classes.hit), 100);
        if (!this.#lives) {
            this.#endGame();
        }
    }

    #updateScoreText() {
        htmlElements.score.textContent = this.#score;
    }

    #updateLivesText() {
        htmlElements.lives.textContent = this.#lives;
    }



    #checkPosition() {
        this.enemies.forEach((enemy, enemyIndex, enemiesArray) => {
            const enemyPosition = {
                top: enemy.element.offsetTop,
                right: enemy.element.offsetLeft + enemy.element.offsetWidth,
                bottom: enemy.element.offsetTop + enemy.element.offsetHeight,
                left: enemy.element.offsetLeft,
            }

            if (enemyPosition.top > window.innerHeight) {
                enemy.explode();
                enemiesArray.splice(enemyIndex, 1);
                this.#updateLives();
            }
            this.#ship.missiles.forEach((missile, missileIndex, missilesArray) => {
                const missilePosition = {
                    top: missile.element.offsetTop,
                    right: missile.element.offsetLeft + missile.element.offsetWidth,
                    bottom: missile.element.offsetTop + missile.element.offsetHeight,
                    left: missile.element.offsetLeft,
                }

                if (missilePosition.bottom >= enemyPosition.top &&
                    missilePosition.top <= enemyPosition.bottom &&
                    missilePosition.right >= enemyPosition.left &&
                    missilePosition.left <= enemyPosition.right) { // enemy starship is hit
                    enemy.hit();
                    if (!enemy.lives) {
                        enemiesArray.splice(enemyIndex, 1);
                    }
                    missile.remove();
                    missilesArray.splice(missileIndex, 1);
                    this.#updateScore();
                }

                if (missilePosition.bottom < 0) {
                    missile.remove();
                    missilesArray.splice(missileIndex, 1);
                }
            })
        })


    }
}


window.onload = function () {
    const game = new Game();

    game.init();
}