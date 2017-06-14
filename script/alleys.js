var alleys = {
    init: function () {
        this.alleys = game.add.group();
        this.bullets = game.add.group();
        this.kamikazes = game.add.group();
    },
    fire: function () {
        for (var i = 0; i < this.alleys.children.length; i++) {
            var x = this.alleys.children[i].position.x - 20;
            var y = this.alleys.children[i].position.y + 200;
            var bullets = game.add.sprite(x, y, "bullet");
            this.bullets.add(bullets);
            game.physics.arcade.enable(bullets);
            bullets.body.velocity.x = -400;
            this.bullets.checkWorldBounds = true;
            this.bullets.outOfBoundsKill = true;
            this.weapon = game.add.weapon(1, "bullet")
        }
    },
    alleyAppear: function () {
        this.alley = game.add.sprite(1200, Math.floor(Math.random() * 600), "alley");
        this.alleys.add(this.alley);
        game.physics.enable(this.alley, Phaser.Physics.ARCADE);
        if (this.flag === false) {
            this.alley.x = 1200;
        }
        else {
            var site = Math.floor(Math.random() * 600);
            this.alley.y = site;
            this.alley.body.velocity.x = -200;
            this.alley.body.acceleration.x = 50;
            this.alley.body.velocity.y = 20;
            this.alley.scale.setTo(0.4, 0.4);
            // this.flag = true;
        }
    }
}