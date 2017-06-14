/**
 * Created by p5030 on 2017/5/27.
 */
var mainState = {
    preload: function(){
        game.load.image("chopper","./assets/square.png");
        game.load.image("armorPack","./assets/armorPack.png");
        game.load.image('pipe', './assets/pipe.png');
        game.load.image("alley","./assets/alley.png");
        game.load.image("boss","./assets/Boss.png");
        game.load.image("kamikaze","./assets/Kamikaze.png");
        game.load.image('bullet', './assets/bullet.png');
        game.load.image('alleyBullet', './assets/alleyBullet.gif');
        game.load.audio("shooting","./sound/shooting.wav");
        game.load.audio("dropping","./sound/dropping.wav");
        game.load.audio("armorPackSound","./sound/armorPack.mp3");
        game.load.audio("killSound","./sound/killSound.mp3");
        game.load.audio("getArmorPack","./sound/getArmorPack.mp3");
        game.load.audio("dragonRoar","./sound/dragonRoar.wav");
    },
    create: function () {
        game.stage.backgroundColor = "#71c5cf";
        game.physics.startSystem(Phaser.Physics.ARCADE);
        this.chopper = game.add.sprite(100,100,"chopper");
        game.physics.arcade.enable(this.chopper);
        this.chopper.body.gravity.y =100;
        this.weapon = game.add.weapon(40, 'bullet');
        this.bullets = game.add.group();
        this.armorPackSound = game.add.audio("armorPackSound");
        this.getArmorPackSound = game.add.audio("getArmorPack");
        this.killSound = game.add.audio("killSound");
        this.armorPacks = game.add.group();
        this.AlleysBullets = game.add.group();
        //  The speed at which the bullet is fired
        this.shooting = game.add.audio("shooting");
        this.dropping = game.add.audio("dropping");
        this.dragonRoar = game.add.audio("dragonRoar");
        this.weapon.bulletSpeed = 400;
        this.counter = 0;
        //  Speed-up the rate of fire, allowing them to shoot 1 bullet every 50ms
        this.weapon.fireRate = 50;
        this.weapon.trackSprite(this.chopper, 3, 4, true);
        var flag = false;
        var wKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
        var aKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
        var dKey = game.input.keyboard.addKey(Phaser.Keyboard.D);
        var sKey = game.input.keyboard.addKey(Phaser.Keyboard.S);
        var fKey = game.input.keyboard.addKey(Phaser.Keyboard.F);
        fKey.onDown.add(this.fire,this);
        wKey.onDown.add(this.jump,this);
        aKey.onDown.add(this.goLeft,this);
        dKey.onDown.add(this.goRight,this);
        sKey.onDown.add(this.goDown,this);
        this.pipes = game.add.group();
        this.alleys = game.add.group();
        this.kamikazes = game.add.group();
        this.timer = game.time.events.loop(1500, this.addRowOfPipes, this);
        this.timer2 = game.time.events.loop(3000, this.alleyAppear, this);
        this.timer3 = game.time.events.loop(1000, this.kamikazeAppear, this);
        this.timer3 = game.time.events.add(5000,this.BossAppear,this);
        this.timer3 = game.time.events.loop(10000,this.armorPackAppear,this);
       this.timer4 =game.time.events.loop(6000,this.alleyFire,this);

        this.score = 0;
        this.labelScore = game.add.text(20, 20, "0",
            { font: "30px Arial", fill: "#ffffff" });
        this.health = 100;

        this.labelHealth = game.add.text(20, 200, "100",
            { font: "30px Arial", fill: "#ffffff" });
        this.chopper.anchor.setTo(-0.2, 0.5);
    },
    fire:function(){
        x = this.chopper.position.x + 100;
        y = this.chopper.position.y ;
        //this.bullet = game.add.sprite(x,y,"bullet");
        this.addFire();
       // this.timer5 = game.time.events.loop(1,this.addFire,this)
        this.shooting.play();

        //this.addFire();
    },
    addFire:function(){

       var x = this.chopper.position.x + 100;
       var y = this.chopper.position.y ;
        var bullets = game.add.sprite(x,y,"bullet");
        this.bullets.add(bullets);
        game.physics.arcade.enable(bullets);
        bullets.body.velocity.x = +400;
        bullets.scale.setTo(0.5,0.5);
        this.bullets.checkWorldBounds = true;
        this.bullets.outOfBoundsKill = true;
        this.counter++;
    },
    checkForBullets:function () {
      for(var i=0;i<this.bullets.children.length;i++){

          if(this.bullets.children[i].x > 1200) {
              this.bullets.remove( this.bullets.children[i],false)
              //console.log("88");
              //this.bullets.children[i].kill();
          }
      }
    },
    alleyFire:function () {
        //console.log(this.alleys.children.length)
        for(var i=0;i<this.alleys.children.length;i++){
            var x = this.alleys.children[i].position.x-50;
            var y =  this.alleys.children[i].position.y + 200;
            var bullets = game.add.sprite(x,y,"alleyBullet");
            bullets.scale.setTo(0.2,0.2);
            this.AlleysBullets.add(bullets);
            game.physics.arcade.enable(bullets);
            bullets.body.velocity.x = -400;
            this.bullets.checkWorldBounds = true;
            this.bullets.outOfBoundsKill = true;
            this.dragonRoar.play();
        }
    },
    update:function () {
        if(this.chopper.y < 0|| this.chopper.y>600||this.chopper.x<0||this.chopper.x>1200){
            this.restartGame()
        }
        if(this.chopper.angle<20){
            this.chopper.angle+=1
        }
        this.checkForBullets();
        this.getArmorPack();
        game.physics.arcade.collide(this.weapon, this.alleys, function(bullet, enemy){bullet.kill(); enemy.kill();});
        game.physics.arcade.collide(this.weapon, this.kamikazes, function(bullet, enemy){bullet.kill(); enemy.kill();});
        game.physics.arcade.overlap(this.chopper, this.pipes, this.bumping, null, this); //判斷有沒有碰到 障礙物,如果碰到就近進這個bumping
        game.physics.arcade.overlap(this.chopper, this.alleys, this.bumping, null, this); //判斷有沒有碰到 障礙物,如果碰到就近進這個bumping
        game.physics.arcade.overlap(this.chopper, this.kamikazes, this.kamikazeBump, null, this); //判斷有沒有碰到 障礙物,如果碰到就近進這個bumping
        game.physics.arcade.overlap(this.chopper, this.AlleysBullets, this.hitByBullets, null, this);
       // console.log(this.bullets.children);
        this.hitTheAlleys(this.kamikazes.children);
        this.hitTheAlleys(this.alleys.children)
        //this.labelHealth = this.health;
       // this.alleyFire();
    },
    kamikazeAppear: function(){
        this.kamikaze = game.add.sprite(1200, Math.floor(Math.random()* 600),"kamikaze");
        this.kamikaze.scale.setTo(0.1,0.1);
        this.kamikazes.add(this.kamikaze);
        game.physics.enable(this.kamikaze , Phaser.Physics.ARCADE);
        if(this.flag === false){
            this.kamikaze .x = 1200;

        }
        else{
            var site = Math.floor(Math.random()* 600);
            this.kamikaze .y= site;
            this.kamikaze .body.velocity.x = -500;
           // this.kamikaze .body.acceleration.x = 50;
            this.kamikaze .body.velocity.y = 20;
            // this.flag = true;
        }
    },

    hitTheAlleys: function(enemys){

        for(var i=0;i<enemys.length;i++){
            for(var j=0;j<this.bullets.children.length;j++){
                game.physics.arcade.overlap(enemys[i],this.bullets.children[j],function(){
                    this.killSound.play();
                    enemys[i].body.velocity.x = -100;
                    enemys[i].body.velocity.y = 200;
                    this.bullets.children[j].kill();
                    this.bullets.remove( this.bullets.children[j],false);
                    this.score += 1;
                    this.labelScore.text = this.score;
                }, null, this); //判斷有沒有碰到 障礙物,如果碰到就近進這個bumping

            }
        }
    },
    kamikazeBump: function () {
        if(parseInt(this.health)>0){
            this.health -=3;
            this.labelHealth.text = parseInt(this.health);


        }
        else {
            this.chopper.alive = false;

            game.time.events.remove(this.timer);
            game.time.events.remove(this.timer2);
            game.time.events.remove(this.timer3);
           // game.input.keyboard.disable = true;
           // game.time.events.remove(this.timer);
            // Go through all the pipes, and stop their movement
            game.input.keyboard.removeKey(Phaser.Keyboard.W)
            this.pipes.forEach(function(p){
                p.body.velocity.x = 0;
            }, this);
            //game.keyboard.stop();
            //this.restartGame()
        }
    },
    hitByBullets:function () {
        if(parseInt(this.health)>0){
            this.health -=1;
            this.labelHealth.text = parseInt(this.health);


        }
        else {
            game.input.keyboard.removeKey(Phaser.Keyboard.W)
            this.chopper.alive = false;
            game.time.events.remove(this.timer);
            game.time.events.remove(this.timer2);
            game.time.events.remove(this.timer3);
            // Go through all the pipes, and stop their movement
            this.pipes.forEach(function(p){
                p.body.velocity.x = 0;
            }, this);
            this.dropping.play();
            //game.keyboard.stop();
            //this.restartGame()
        }
    }
    ,
    bumping: function(){
        if(parseInt(this.health)>0){
            this.health -=0.1;
            this.labelHealth.text = parseInt(this.health);
        }
        else {
            this.chopper.alive = false;
            game.time.events.remove(this.timer);
            game.time.events.remove(this.timer2);
            game.time.events.remove(this.timer3);
            // Go through all the pipes, and stop their movement
            game.input.keyboard.removeKey(Phaser.Keyboard.W)
            this.pipes.forEach(function(p){
                p.body.velocity.x = 0;
            }, this);
            this.dropping.play();
            //game.keyboard.stop();
            //this.restartGame()
        }
    },
    jump: function(){
        this.chopper.body.velocity.y = -150; //往上跳的速度

        var animation =game.add.tween(this.chopper); //增加動畫
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
        var pipe = game.add.sprite(x,y,"pipe");
        this.pipes.add(pipe);
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
        this.labelHealth.text = parseInt(this.health);
    },
    BossAppear: function(){
        this.Boss = game.add.sprite(1200, Math.floor(Math.random()* 600),"boss");
        this.alleys.add(this.Boss);
        game.physics.enable(this.Boss, Phaser.Physics.ARCADE);
        if(this.flag === false){
            this.Boss.x = 1200;
        }
        else{
            var site = Math.floor(Math.random()* 600);
            this.Boss.y= site;
            this.Boss.body.velocity.x = -200;
            this.Boss.body.acceleration.x = 50;
            this.Boss.body.velocity.y = 20;
            // this.flag = true;
        }
    },
    alleyAppear: function(){
        this.alley = game.add.sprite(1200, Math.floor(Math.random()* 600),"alley");
        this.alley.health = 100;
        this.alleys.add(this.alley);
        game.physics.enable(this.alley, Phaser.Physics.ARCADE);
        if(this.flag === false){
            this.alley.x = 1200;
          }
        else{
            var site = Math.floor(Math.random()* 600);
            this.alley.y= site;
            this.alley.body.velocity.x = -200;
            this.alley.body.acceleration.x = 50;
            this.alley.body.velocity.y = 20;
            this.alley.scale.setTo(0.4,0.4);
           // this.flag = true;
        }
    },
    armorPackAppear: function () {
        this.armorPackSound.play();
        this.armorPack = game.add.sprite(1200, Math.floor(Math.random()* 600),"armorPack");
        this.armorPacks.add(this.armorPack);
        game.physics.enable(this.armorPack , Phaser.Physics.ARCADE);
        if(this.flag === false){
            this.kamikaze .x = 1200;
        }
        else{
            var site = Math.floor(Math.random()* 600);
            this.armorPack .y= site;
            this.armorPack .body.velocity.x = -250;
            // this.kamikaze .body.acceleration.x = 50;
            this.armorPack .body.velocity.y = 20;
            // this.flag = true;
        }
    },
    getArmorPack: function () {

        for(var i=0;i<this.armorPacks.children.length;i++){
            if(this.health>0){
            game.physics.arcade.overlap(this.chopper, this.armorPacks.children[i], function () {
                console.log("Before "+this.health);
                this.health+=20;
                console.log("After "+this.health);
                this.labelHealth.text = parseInt(this.health);
                console.log("Yes");

                this.armorPacks.children[i].kill();
                this.armorPacks.remove( this.armorPacks.children[i],false)
                this.getArmorPackSound.play();
            }, null, this);
            }
        }
    }
};
var game = new Phaser.Game(1200,600);
game.state.add("main",mainState);
game.state.start("main");
