var gameOver = {
    preload : function() {
		game.load.image('button1', './assets/button1.png');
        game.load.image('gameOver', '/assets/gameover.png');
    },

    create: function () {
        game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
		game.add.tileSprite(0, 0, 1200, 600, 'gameOver');
        this.labelHealth = game.add.text(600, 300, score.toString(),
            { font: "30px Arial", fill: "#0f1b99" });
        this.labelHealth.anchor.set(0.5);
        this.add.button(400, 400, 'button1', this.menuGame, this);
        console.log(score);
    },
	menuGame: function () {
        this.state.start('main');
    }
};
