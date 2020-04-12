'use strict'
const KEYS = {
    LEFT: 37,
    RIGHT: 39,
    SPACE: 32,
};

let game = {
    score: 0,
    running: true,
    ctx: null,
    ball: null,
    platform: null,
    blocks: [],
    rows: 5,
    cols: 8,
    width: 1280,
    height: 720,
    sprites: {
        background: null,
        ball: null,
        platform: null,
        block: null,
    },
    sounds: {
        bump: null,
    },
    resultData: [],

    init() {
        //инициализация
        this.ctx = document.getElementById('mycanvas').getContext('2d');
        this.setEvents();
        this.setTextFont();
    },

    setTextFont() {
        this.ctx.font = '20px Arial';
        this.ctx.fillStyle = '#FFF';
    },

    setEvents() {
        window.addEventListener('keydown', e => {
            if (e.keyCode === KEYS.SPACE) {
                this.platform.fire();
                console.log('ball start');
            } else if (e.keyCode === KEYS.LEFT || e.keyCode === KEYS.RIGHT) {
                this.platform.start(e.keyCode);
            }
        });
        window.addEventListener('keyup', e => {
            this.platform.stop();
        });
    },

    preload(callback) {
        let loaded = 0;
        let requred = Object.keys(this.sprites).length;
        requred += Object.keys(this.sounds).length;
        let onResourceLoad = () => {
            ++loaded;
            if (loaded >= requred) {
                callback();
            }
        };
        this.preloadSprites(onResourceLoad);
        this.preloadSounds(onResourceLoad);
    },

    preloadSprites(onResourceLoad) {
        for (let key in this.sprites) {
            this.sprites[key] = new Image();
            this.sprites[key].src = `img/${key}.png`;
            this.sprites[key].addEventListener('load', onResourceLoad);
        };
    },

    preloadSounds(onResourceLoad) {
        for (let key in this.sounds) {
            this.sounds[key] = new Audio(`sounds/${key}.mp3`);
            this.sounds[key].addEventListener('canplaythrough', onResourceLoad, { once: true });
        };
    },

    create() {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                this.blocks.push({
                    active: true,
                    width: 111,
                    height: 39,
                    x: 135 * col + 116,
                    y: 55 * row + 70,
                })
            }
        }
    },

    update() {
        this.collideBlocks();
        this.collidePlatform();
        this.ball.collideWorldBounds();
        this.platform.collideWorldBounds();
        this.platform.move();
        this.ball.move();
    },

    addScore() {
        ++this.score;
        if (this.score >= this.blocks.length && game.rows <= 7) {
            game.rows++;
            this.create();
        } else if (this.score >= this.blocks.length) {
            this.end()
        }
    },

    collideBlocks() {
        for (let block of this.blocks) {
            if (block.active && this.ball.collide(block)) {
                this.ball.bumpBlock(block);
                this.addScore();
                this.sounds.bump.play();
            }
        }
    },
    collidePlatform() {
        if (this.ball.collide(this.platform)) {
            this.ball.bumpPlatform(this.platform);
            this.sounds.bump.play();
        }
    },

    run() {
        //Запуск
        if (this.running) {
            window.requestAnimationFrame(() => {
                this.update();
                this.render();
                this.run();
            });
        };
    },

    render() {
        //рендер
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.ctx.drawImage(this.sprites.background, 0, 0);
        this.ctx.drawImage(this.sprites.ball, this.ball.frame * this.ball.width, 0, this.ball.width, this.ball.height, this.ball.x, this.ball.y, this.ball.width, this.ball.height);
        this.ctx.drawImage(this.sprites.platform, this.platform.x, this.platform.y);
        this.renderBlocks();
        this.ctx.fillText('Score: ' + this.score, 15, 43);

    },

    renderBlocks() {
        for (let block of this.blocks) {
            if (block.active) {
                this.ctx.drawImage(this.sprites.block, block.x, block.y);
            }

        }
    },

    start: function() {
        this.init();
        this.preload(() => {
            this.create();
            this.run();
        });
    },

    end() {
        openModal();
        this.running = false;
        // alert(message);
        // document.getElementById('menu').style.display = 'block'
        // document.getElementById('mycanvas').style.display = 'none';
    },

    random(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    },
};

game.ball = {
    x: 605,
    y: 610,
    width: 40,
    height: 40,
    dy: 0,
    dx: 0,
    velocity: 5,
    frame: 0,

    start() {
        this.dy = -this.velocity;
        this.dx = game.random(-this.velocity, +this.velocity);
        this.animate();
    },

    animate() {
        setInterval(() => {
            ++this.frame;
            if (this.frame > 3) {
                this.frame = 0;
            }
        }, 100)
    },

    move() {
        if (this.dy) {
            this.y += this.dy;
        }
        if (this.dx) {
            this.x += this.dx;
        }
    },

    collide(element) { // Если все 4 условия выполнены, то столкновение произошло
        let x = this.x + this.dx;
        let y = this.y + this.dy;
        if (x + this.width > element.x &&
            x < element.x + element.width &&
            y + this.height > element.y &&
            y < element.y + element.height) {
            return true;
        }
        return false;
    },

    bumpBlock(block) {
        let x = this.x + this.dx;
        let y = this.y + this.dy;

        let ballLeft = x - this.width;
        let ballRight = x + this.width;
        let ballTop = y - this.height;
        let ballBottom = y + this.height;

        let blockLeft = block.x - 111;
        let blockRight = block.x + 111;
        let blockTop = block.y - 39;
        let blockBottom = block.y + 39;


        if (ballRight > blockLeft && this.y < blockBottom && this.y > blockTop || ballLeft < blockRight && this.y < blockBottom && this.y > blockTop) {
            this.dx *= -1;
        } else {
            this.dy *= -1;
        }
        block.active = false;
    },

    bumpPlatform(platform) {
        if (platform.dx) {
            this.x += platform.dx;
        }
        if (this.dy > 0) {
            this.dy = -this.velocity;
            let touchX = this.x + this.width / 2;
            this.dx = this.velocity * platform.getTouchOffset(touchX);
        }
    },

    collideWorldBounds() {
        let x = this.x + this.dx;
        let y = this.y + this.dy;

        let ballLeft = x;
        let ballRight = ballLeft + this.width;
        let ballTop = y;
        let ballBottom = ballTop + this.height;

        let worldLeft = 0;
        let worldRight = game.width;
        let worldTop = 0;
        let worldBottom = game.height;

        if (ballLeft < worldLeft) {
            this.x = 0;
            this.dx = this.velocity;
            game.sounds.bump.play();
        } else if (ballRight > worldRight) {
            this.x = worldRight - this.width;
            this.dx = -this.velocity;
            game.sounds.bump.play();
        } else if (ballTop < worldTop) {
            this.y = 0;
            this.dy = this.velocity;
            game.sounds.bump.play();
        } else if (ballBottom >= worldBottom) {
            game.end();
        }
    },
};

game.platform = {
    width: 251,
    height: 41,
    velocity: 6,
    dx: 0,
    x: 500,
    y: 650,
    ball: game.ball,

    fire() {
        if (this.ball) {
            this.ball.start();
            this.ball = null;
        }
    },

    start(direction) {
        if (direction === KEYS.LEFT) {
            this.dx = -this.velocity;
        } else if (direction === KEYS.RIGHT) {
            this.dx = this.velocity;
        };
    },

    stop() {
        this.dx = 0;
    },

    move() {
        if (this.dx) {
            this.x += this.dx;
            if (this.ball) {
                this.ball.x += this.dx;
            }
        };
    },

    getTouchOffset(x) {
        let offset = x - this.x;
        let result = 2 * offset / this.width;
        return result - 1;
    },

    collideWorldBounds() {
        let x = this.x + this.dx;
        let platformLeft = x;
        let platformRight = platformLeft + this.width;
        let worldLeft = 0;
        let worldRight = game.width;

        if (platformLeft < worldLeft || platformRight > worldRight) {
            this.dx = 0;
        }
    }
};
let startGame = document.getElementById('start');
startGame.addEventListener('click', () => {
        game.start();
    })
    // window.addEventListener('load', () => {
    //     game.start();
    // });

// Моодальное окно

let modal = document.getElementById('mymodal');
let save = document.getElementById('save');
let openModal = function() {
        modal.style.display = "block";
    }
    //Таблица рекордов
let reloading = function() {
    window.location.reload();
}
save.addEventListener('click', () => {
    saveData();
    document.getElementById('menu').style.display = 'flex';
    document.getElementById('mycanvas').style.display = 'none';
    document.getElementById('mymodal').style.display = 'none';
    setInterval(reloading, 600);
})

let saveData = function() {
    maindb.doc(`results/player_${input.value.toLowerCase()}`).set({
            player: `${input.value.toLowerCase()}`,
            score: `${game.score}`,
        })
        .then(function() {
            console.log('result saved');
        })
        .catch(function() {
            console.log('error cannot save result: ', error);
        });

};

let getResult = function() {
    maindb.collection('results').get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                game.resultData.push(doc.data());
                console.log(`${doc.id} => ${doc.data().player} (${doc.data().score}\)`);

                let playerResults = document.getElementById('player-results'),
                    row = document.createElement('tr'),
                    td1 = document.createElement('td'),
                    td2 = document.createElement('td');
                td1.innerHTML = doc.data().player;
                td2.innerHTML = doc.data().score;
                row.appendChild(td1);
                row.appendChild(td2);
                if (playerResults) {
                    playerResults.appendChild(row);
                } else {
                    document.getElementById('scoreTable').innerHTML += `
                  <table class="table">
                    <thead>
                      <tr>
                        <th>Player name</th>
                        <th>Result</th>
                      </tr>
                    </thead>
                    <tbody id="player-results"></tbody>
                  </table>
                  `;
                    playerResults = document.getElementById('player-results');
                    playerResults.appendChild(row);
                }
            });
        });
};
