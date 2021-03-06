RenJS.effects = {
    SHAKE: function(){
        game.camera.shake(0.01, 200);
        RenJS.resolve();
    },
    SOUND: function(sfx){
        RenJS.audioManager.playSFX(sfx);
        RenJS.resolve();
    },
    ROLLINGCREDITS: function(params){
        var bg = game.add.graphics(0, 0);
        RenJS.audioManager.play("rollingCredits","bgm",true,"FADE");
        bg.beginFill(0x000000, 1);
        bg.drawRect(0, 0, globalConfig.w, globalConfig.h);
        bg.endFill();
        bg.alpha = 0;
        var style = _.clone(_.extend(config.defaultTextStyle,RenJS.gui.elements.hud.choice.text));
        style.font = "25pt "+RenJS.gui.elements.assets.fonts[0];
        console.log(style);
        var credits = game.add.text(game.world.centerX,globalConfig.h+30,params.text[0],style);
        credits.anchor.set(0.5);
        var separation = 35;
        for (var i = 1; i < params.text.length; i++) {
            if (params.text[i]){
                var nextLine = game.add.text(0,i*separation,params.text[i],style);
                nextLine.anchor.set(0.5);
                credits.addChild(nextLine);
            }
        };
        var tweenChain = [
            {sprite:bg,tweenables:{alpha:1},time:config.fadetime},
            {sprite:credits,tweenables:{y:-(separation*params.text.length+30)},time:700*params.text.length},

        ];
        if (!params.endGame){
            tweenChain.push({sprite:bg,tweenables:{alpha:0},time:config.fadetime,callback:function(){
                bg.destroy();
                credits.destroy();
                RenJS.resolve();
            }});
        } else {
            tweenChain[1].callback = RenJS.resolve;
        }
        RenJS.tweenManager.unskippable = true;
        RenJS.tweenManager.chain(tweenChain);
    },
    SHOWTITLE: function(param){
        var bg = game.add.sprite(game.world.centerX,game.world.centerY - 50,"title");
        bg.anchor.set(0.5);
        var style = _.clone(_.extend(config.defaultTextStyle,RenJS.gui.elements.hud.choice.text));
        style.font = "50pt "+RenJS.gui.elements.assets.fonts[0];

        // var title = game.add.text(0,20, param.title, style);
        // style.font = "25pt "+RenJS.gui.elements.assets.fonts[0];
        var title = game.add.bitmapText(0, 40, 'font', param.title, 25);
        title.anchor.set(0.5);

        // this.hud.text = game.add.bitmapText(messageBox.textPosition.x,messageBox.textPosition.y, 'font', "", 8);
        // var subtitle = game.add.text(0,40, param.subtitle, style);
        var subtitle = game.add.bitmapText(0, 80, 'font', param.subtitle, 15);
        subtitle.anchor.set(0.5);
        title.anchor.set(0.5);
        bg.addChild(title);
        bg.addChild(subtitle);
        bg.alpha = 0;


        RenJS.tweenManager.chain([
            {sprite:bg,tweenables:{alpha:1}},
            {sprite:bg,tweenables:{alpha:0},callback:function(){
                bg.destroy();
                RenJS.resolve();
            }, delay: RenJS.control.fadetime*2}
        ],config.fadetime*2);

        RenJS.gui.hud.messageBox.destroy();
        RenJS.gui.initHUD("real");
        RenJS.gui.hud.messageBox.x += 0;
        RenJS.gui.hud.messageBox.y = 279;
        RenJS.gui.hud.text.x = 20;
        RenJS.gui.showHUD();

    },
    FLASHIMAGE: function(image){
        var image = game.add.sprite(game.world.centerX,game.world.centerY,image);
        image.anchor.set(0.5);
        setTimeout(function() {
            var tween = game.add.tween(image);
            tween.to({ alpha: 0 }, RenJS.control.fadetime/2, Phaser.Easing.Linear.None);
            tween.onComplete.add(function(){
                image.destroy();
            }, this);
            tween.start();
        }, RenJS.control.fadetime/3);
    },
    EXPLOSION: function(){
        var explosion = game.add.sprite(game.world.centerX,game.world.centerY, 'explosion');
        explosion.anchor.set(0.5);
        anim = explosion.animations.add('explode');
        anim.onComplete.add(function(){
            RenJS.resolve();
        }, this);
        anim.play(10, false,true);
        RenJS.audioManager.playSFX("explosionSound");
    },
    THUNDER: function(){
        game.camera.shake(0.01, 200);
        RenJS.effects.FLASHIMAGE("thunder");
        RenJS.audioManager.playSFX("thunderSFX");
        setTimeout(function() {RenJS.resolve();}, RenJS.control.fadetime);
    },
    ATTACK: function() {
        game.camera.shake(0.01, 200);
        RenJS.effects.FLASHIMAGE("attack");
        setTimeout(function() {RenJS.resolve();}, RenJS.control.fadetime);

    },
    MULTIATTACK: function() {
        RenJS.audioManager.playSFX("magical");
        game.camera.shake(0.01, 600);
        RenJS.effects.FLASHIMAGE("multiattack");
        setTimeout(function() {RenJS.resolve();}, RenJS.control.fadetime);
    },
    CHAINATTACK: function() {
        game.camera.shake(0.01, 200);
        RenJS.effects.FLASHIMAGE("chainattack1");
        setTimeout(function() {
            game.camera.shake(0.01, 200);
            RenJS.effects.FLASHIMAGE("chainattack2");
            setTimeout(function() {
                game.camera.shake(0.01, 200);
                RenJS.effects.FLASHIMAGE("chainattack3");
                RenJS.resolve();
            }, RenJS.control.fadetime/2);
        }, RenJS.control.fadetime/2);
    }
}
