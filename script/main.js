/**
 * Created by p5030 on 2017/5/27.
 */
var mainState = {
    preload: function(){
        game.load.image("chopper","./assets/square.png")
        game.load.image('pipe', './assets/pipe.png');
    },
    create: function () {
        game.stage.backgroundColor = "#71c5cf"
        game.physics.startSystem(Phaser.Physics.ARCADE)
        this.chopper = game.add.sprite(100,100,"chopper")

        game.physics.arcade.enable(this.chopper)
        this.chopper.body.gravity.y =100
        var wKey = game.input.keyboard.addKey(Phaser.Keyboard.W)
        var aKey = game.input.keyboard.addKey(Phaser.Keyboard.A)
        var dKey = game.input.keyboard.addKey(Phaser.Keyboard.D)
        var sKey = game.input.keyboard.addKey(Phaser.Keyboard.S)
        wKey.onDown.add(this.jump,this)
        aKey.onDown.add(this.goLeft,this)
        dKey.onDown.add(this.goRight,this)
        sKey.onDown.add(this.goDown,this)
        this.pipes = game.add.group();
        this.timer = game.time.events.loop(1500, this.addRowOfPipes, this);
        this.score = 0
        this.labelScore = game.add.text(20, 20, "0",
            { font: "30px Arial", fill: "#ffffff" });
        this.health = 100

        this.labelHealth = game.add.text(20, 200, "100",
            { font: "30px Arial", fill: "#ffffff" });
        this.chopper.anchor.setTo(-0.2, 0.5);
    },
    update:function () {
        if(this.chopper.y < 0|| this.chopper.y>600||this.chopper.x<0||this.chopper.x>1200){
            this.restartGame()
        }
        if(this.chopper.angle<20){
            this.chopper.angle+=1
        }

        game.physics.arcade.overlap(this.chopper, this.pipes, this.bumping, null, this); //判斷有沒有碰到 障礙物,如果碰到就近進這個bumping

    },

    bumping: function(){
        if(this.health>0){
            this.health -=0.5;
            this.labelHealth.text = this.health;


        }
        else {
            this.chopper.alive = false
            game.time.events.remove(this.timer);

            // Go through all the pipes, and stop their movement
            this.pipes.forEach(function(p){
                p.body.velocity.x = 0;
            }, this);
            //this.restartGame()
        }
    },
    jump: function(){
        this.chopper.body.velocity.y = -150 //往上跳的速度

        var animation =game.add.tween(this.chopper) //增加動畫
        // Change the angle of the bird to -20° in 100 milliseconds
        animation.to({angle: -20}, 200);//向上旋轉２０度，然後動作時間２００分秒

// And start the animation
        animation.start();
    },
    goLeft: function(){
        this.chopper.position.x -= 30;
    },
    goRight:function () {
        this.chopper.position.x += 30;
    },
    goDown:function(){
        this.chopper.position.y +=30;
    },
    restartGame: function(){
        game.state.start("main");
    },
    addPipe:function(x,y){
        var pipe = game.add.sprite(x,y,"pipe")
        this.pipes.add(pipe)
        game.physics.arcade.enable(pipe);

        // Add velocity to the pipe to make it move left
        pipe.body.velocity.x = -200;

        // Automatically kill the pipe when it's no longer visible
        pipe.checkWorldBounds = true;
        pipe.outOfBoundsKill = true;
    },
    addRowOfPipes: function() {
        var hole = Math.floor(Math.random() * 10);//隨機找洞
        for (var i = 0; i < 10; i++){
            if (Math.abs(i - hole)>3){
                this.addPipe(1200, i * 60 + 10);
            }
        }
        this.score += 1;
        this.labelScore.text = this.score;
        this.labelHealth.text = this.health;
    },

}
var game = new Phaser.Game(1200,600)
game.state.add("main",mainState)
game.state.start("main")
