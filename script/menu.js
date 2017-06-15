/**
 * Created by p5030 on 2017/6/15.
 */
var menu = {
    preload : function() {

        game.load.image('menu', './assets/menu.png');
    },

    create: function () {
        game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;

        this.add.button(0, 0, 'menu', this.startGame, this);
    },
    startGame: function () {
        this.state.start('mainState');

    }

};



