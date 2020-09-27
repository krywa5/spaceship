import { Spaceship } from './Spaceship.js';
import { Enemy } from './Enemy.js';


class Game {

    enemyRenderTime = 1000; // [ms] delay between creating new enemy
    enemySpeedRatio = 10; // lower value => faster enemies speed

    enemies = [];

    #htmlElements = {
        spaceship: document.querySelector('[data-spaceship]'),
        container: document.querySelector('[data-container]')
    };

    #ship = new Spaceship(this.#htmlElements.spaceship, this.#htmlElements.container);

    #checkPositionInterval = null;
    #createEnemyInterval = null;

    init() {
        this.#ship.init();
        this.#newGame();
    }

    #newGame() {
        this.#createEnemyInterval = setInterval(() => this.#randomNewEnemy(), this.enemyRenderTime)
        this.#checkPositionInterval = setInterval(() => this.#checkPosition(), 1);
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