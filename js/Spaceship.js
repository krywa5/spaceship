import { Missile } from './Missile.js';

export class Spaceship {
    missiles = [];
    #moveSpeed = 5;
    #leftArrow = false;
    #rightArrow = false;

    constructor(element, container) {
        this.element = element;
        this.container = container;
    }

    init() {
        this.#setPosition();
        this.#eventListeners();
        this.#gameLoop();
    }

    #setPosition() {
        this.element.style.bottom = '0px';
        this.element.style.left = `${window.innerWidth / 2 - this.#getPosition()}px`;
    }

    #eventListeners() {
        window.addEventListener('keydown', ({ keyCode }) => {
            switch (keyCode) {
                case 37:  // left arrow
                    this.#leftArrow = true;
                    break;
                case 39:  // rigth arrow
                    this.#rightArrow = true;
                    break;
            }
        });

        window.addEventListener('keyup', ({ keyCode }) => {
            switch (keyCode) {
                case 32:
                    this.#shoot();
                    break;
                case 37:  // left arrow
                    this.#leftArrow = false;
                    break;
                case 39:  // rigth arrow
                    this.#rightArrow = false;
                    break;
            }
        });
    }

    #getPosition() {
        return this.element.offsetLeft + this.element.offsetWidth / 2;
    }

    #gameLoop = () => { // prevent key insert waiting
        this.#whatKey();
        requestAnimationFrame(this.#gameLoop);
    }

    #whatKey() {
        if (this.#leftArrow && this.#getPosition() > 0) {
            this.element.style.left = `${parseInt(this.element.style.left, 10) - this.#moveSpeed}px`
        }
        if (this.#rightArrow && this.#getPosition() < window.innerWidth) {
            this.element.style.left = `${parseInt(this.element.style.left, 10) + this.#moveSpeed}px`
        }
    }

    #shoot() {
        const missile = new Missile(
            this.#getPosition(),
            this.element.offsetTop,
            this.container
        );

        missile.init();
        this.missiles.push(missile);
    }
}