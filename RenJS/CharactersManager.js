function Character(name,speechColour){

    this.name = name;
    // RenJS.characters[this.name] = this;
    this.looks = {};
    this.currentLook = null;
    this.speechColour = speechColour;
    this.lastScale = 1;

    this.addLook = function(lookName,image){
        console.log((image ? image : lookName));
        var look = RenJS.storyManager.characterSprites.create(config.positions.CENTER.x,config.positions.CENTER.y,(image ? image : lookName));
        look.anchor.set(0.5,0.5);
        look.alpha = 0;
        look.name = lookName;
        this.looks[lookName] = look;
        if (!this.currentLook){
            this.currentLook = this.looks[lookName];
        }

        if (lookName == "blink") {
          look.animations.add('blink');
          // look.animations.play('blink', 2, true);
        }
    }
}

function CharactersManager(){
    this.characters = {};
    this.showing = {};
    this.current = [];

    this.add = function(name,displayName,speechColour,looks){
        this.characters[name] = new Character(displayName,speechColour);
        _.each(looks,function(filename,look){
            this.characters[name].addLook(look,name+"_"+look);
        },this);
    }

    this.show = function(name,transition,props){
        var ch = this.characters[name];
        var oldLook = ch.currentLook;
        ch.currentLook = props.look ? ch.looks[props.look] : ch.looks.normal;
        if (!props.position){
            props.position = (oldLook != null) ? {x:oldLook.x,y:oldLook.y} : config.positions.CENTER;
        }
        if (props.flipped != undefined){
            ch.lastScale = props.flipped ? -1 : 1;
        }
        this.showing[name] = {look: ch.currentLook.name,position:props.position,flipped:(ch.lastScale==-1)};
        console.log(ch.looks[props.look]);
        this.current.push(ch.looks[props.look]);
        transition(oldLook,ch.currentLook,props.position,ch.lastScale,RenJS.storyManager.characterSprites);
    }

    this.hide = function(name,transition){
        var ch = this.characters[name];
        var oldLook = ch.currentLook;
        ch.currentLook = null;
        delete this.showing[name];
        // console.log("hiding ch "+name);
        var index = this.current.indexOf(ch.looks["blink"]);
        if (index > -1) {
          this.current.splice(index, 1);
        }
        transition(oldLook,null);
    }

    this.set = function (showing) {
        this.hideAll();
        this.showing = showing;
        _.each(this.showing,function(ch,name) {
            var character = this.characters[name];
            character.currentLook = character.looks[ch.look];
            character.currentLook.x = ch.position.x;
            character.currentLook.y = ch.position.y;
            character.currentLook.scaleX = ch.flipped ? -1 : 1;
            character.currentLook.alpha = 1;
        },this);
    }

    this.hideAll = function(){
        _.each(this.showing,function(showing,name){
            this.hide(name,RenJS.transitions.CUT);
        },this);
    }

    this.isCharacter = function(actor){
        return _.has(this.characters,actor);
    }

}
