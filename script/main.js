function resizeGame() {
    var height = $(window).height();
    var width = $(window).width();
    game.width = width;
    game.height = height;
}

$( document ).ready(function() {
    $(window).resize(function() { window.resizeGame(); } );
});
var score = 0;
var game = new Phaser.Game(1200,600);
game.state.add("main",menu);
game.state.add("mainState",mainState)
game.state.add("gameOver",gameOver);
game.state.start("main");