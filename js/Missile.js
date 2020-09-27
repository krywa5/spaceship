export class Missile {
    #missileSpeed = 5; // higher value => lower speed

    constructor(x, y, container) {
        this.x = x;
        this.y = y;
        this.container = container;
        this.element = document.createElement('div');
        this.interval = null;
    }

    init() {
        this.element.classList.add('missile');
        this.container.appendChild(this.element);
        this.element.style.left = `${this.x - this.element.offsetWidth / 2 - 2}px`; // - 2 manual missile position fix
        this.element.style.top = `${this.y - this.element.offsetHeight}px`;

        this.interval = setInterval(() => this.element.style.top = `${this.element.offsetTop - 1}px`, this.#missileSpeed);
    }

    remove() {
        clearInterval(this.interval);
        this.element.remove();
    }
}