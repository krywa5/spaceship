import { Spaceship } from './Spaceship.js';
import { Enemy } from './Enemy.js';


class Game {

    enemyRenderTime = 1000; // [ms] delay between creating new enemy
    enemySpeedRatio = 10; // lower value => faster enemies speed

    enemies = [];
    #score = null;
    #lives = null;

    #htmlElements = {
        spaceship: document.querySelector('[data-spaceship]'),
        container: document.querySelector('[data-container]'),
        score: document.querySelector('[data-score]'),
        lives: document.querySelector('[data-lives]'),
        modal: document.querySelector('[data-modal]'),
        scoreInfo: document.querySelector('[data-score-info]'),
        button: document.querySelector('[data-button]'),
    };

    #ship = new Spaceship(this.#htmlElements.spaceship, this.#htmlElements.container);

    #checkPositionInterval = null;
    #createEnemyInterval = null;

    init() {
        this.#ship.init();
        this.#newGame();
        this.#htmlElements.button.addEventListener('click', () => {
            this.#newGame();
        })
    }

    #newGame() {
        this.#htmlElements.modal.classList.add('hide');
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
        this.#htmlElements.modal.classList.remove('hide');
        this.#htmlElements.scoreInfo.textContent = `You loose! Your score is ${this.#score}`;
        this.enemies.forEach(enemy => enemy.explode());
        this.enemies.length = 0;
        clearInterval(this.#createEnemyInterval);
        clearInterval(this.#checkPositionInterval);
    }

    #createNewEnemy(enemyType = 'enemy') {
        const enemy = new Enemy(this.#htmlElements.container, this.enemySpeedRatio, enemyType);
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
        this.#htmlElements.container.classList.add('hit');
        setTimeout(() => this.#htmlElements.container.classList.remove('hit'), 100);
        if (!this.#lives) {
            this.#endGame();
        }
    }

    #updateScoreText() {
        this.#htmlElements.score.textContent = this.#score;
    }

    #updateLivesText() {
        this.#htmlElements.lives.textContent = this.#lives;
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