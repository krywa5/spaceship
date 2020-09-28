import classes from './classes.js';

export class Enemy {

    constructor(container, enemySpeedRatio, enemyType) {
        this.container = container;
        this.element = document.createElement('div');
        this.enemyType = enemyType;
        this.interval = null;
        this.enemySpeedRatio = enemyType === 'enemy' ? enemySpeedRatio : enemySpeedRatio * 2;
        this.lives = enemyType === 'enemy' ? 1 : 3;
    }


    init() {
        this.#setEnemy();
        this.#updatePosition();
    }

    #setEnemy() {
        this.element.classList.add(classes.enemy);
        if (this.enemyType === 'enemy--big') {
            this.element.classList.add(classes.enemyBig);
        }
        this.container.appendChild(this.element);
        this.element.style.top = '0px';
        this.element.style.left = `${this.#randomPosition()}px`;
    }

    #randomPosition() {
        return Math.floor(Math.random() * window.innerWidth - this.element.offsetWidth);
    }

    #updatePosition() {
        this.interval = setInterval(() => this.#setNewPosition(), this.enemySpeedRatio);
    }

    #setNewPosition() {
        this.element.style.top = `${this.element.offsetTop + 1}px`;
    }

    hit() {
        this.lives--;
        if (!this.lives) {
            this.explode();
        }
    }

    explode() {
        this.element.className = '';
        this.element.classList.add(classes.explosion);
        if (this.enemyType === 'enemy--big') {
            this.element.classList.add(classes.explosionBig);
        }
        clearInterval(this.interval);
        const animationTime = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--explosion-animation-time'), 10);
        setTimeout(() => this.element.remove(), animationTime);
    }
}