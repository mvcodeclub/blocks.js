blocks.project = function(parent)
{
  var self = this;
  this.parent = parent;
  var game = {};

  var sprite_list = [];

  this._sounds = [];

  this.sounds = {
    add: function(name, url)
    {
      var sound = new blocks.sound(self, name, url);
      self._sounds.push(sound);
      return sound;
    }
    };



  var collision_callback = function(obj1, obj2)
  {

  }

  var process_callback = function(obj1, obj2)
  {

  }

  _stage = new blocks.stage(this);

  this.stage = _stage;

  this.sprites = {
    add: function(costume_url, x, y)
    {
      var sprite = new blocks.sprite(this, costume_url, x, y);
      sprite_list.push(sprite);
      return sprite;
    }
  
  };


  this.preload = function()
  {

    self._sounds.forEach(function(sound)
      {
        game.load.audio(sound.name, [sound.url]);
      });

    sprite_list.forEach(function(sprite)
        {
          sprite.costumes.forEach(function(costume)
            {
              game.load.image(costume.name, costume.url);
            });

        });

    _stage._backdrops.forEach(function(backdrop)
        {
          game.load.image(backdrop.name, backdrop.url);

        });
  };

  this.create = function()
  {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    self._sounds.forEach(function(sound)
      {
        sound.game_sound = game.add.audio(sound.name);
      });

    _stage._backdrops.forEach(function(backdrop)
        {
          game.add.sprite(0,0,backdrop.name);
        });

    sprite_list.forEach(function(sprite)
        {
          var game_sprite = game.add.sprite(sprite.x,sprite.y,sprite.costumes[0].name);
          game_sprite.anchor.setTo(0.5,0.5);
          game_sprite.inputEnabled = true;
          game_sprite.input.start();
          game.physics.enable(game_sprite, Phaser.Physics.ARCADE);
          game_sprite.body.immovable = true;
          game_sprite.block_sprite = sprite;
          sprite.game_sprite = game_sprite;
          sprite.key_callbacks.forEach(function (cb)
            {
              cb.game_key = game.input.keyboard.addKey(cb.keycode);
              cb.game_key.onDown.add(function(key)
                {
                  cb.callback(sprite,key);
                }, this);

            });
        });

    game.input.onDown.add(logColor, this);

  };

  function logColor()
  {
    var x = game.input.mousePointer.x;
    var y = game.input.mousePointer.y;
    var context = game.canvas.getContext("2d");
    var pointerData  = context.getImageData(x,y,1,1);
    console.log((pointerData.data[0] + "," + pointerData.data[1] + "," + pointerData.data[2] + "," + pointerData.data[3]))

  }

  this.update = function()
  {

    sprite_list.forEach(function(sprite)
        {
          if (sprite.game_sprite.input.checkPointerDown(game.input.activePointer))
          {
            sprite.click_callbacks.forEach(function(cb)
              {
                cb(sprite);
              });
          }

          sprite.touching_callbacks.forEach(function (cb)
            {
              game.physics.arcade.overlap(sprite.game_sprite, cb.sprite.game_sprite, cb.cb);
            });

          sprite.touching_color_callbacks.forEach(function (cb)
            {
              // just check row to the left, right top and bottom
              // if our color is in any of the rows
              // kind of a hack, but oh well
              var context = game.canvas.getContext("2d");
              var boundaryWidth = 1 
              var imageData = context.getImageData(sprite.game_sprite.body.x - boundaryWidth, sprite.game_sprite.body.y - boundaryWidth, sprite.game_sprite.width + boundaryWidth * 2, sprite.game_sprite.height + boundaryWidth * 2);
              var touching = cb.color.inImageDataBoundary(imageData, sprite.game_sprite.width, sprite.game_sprite.height, boundaryWidth, 10);
              if (touching != blocks.color.TOUCH_NONE)
                cb.cb(sprite, touching);

            });
        });

    
  };

    this.start = function()
    {
      game = new Phaser.Game(800, 600, Phaser.CANVAS, '', { preload: this.preload, create: this.create, update: this.update });
    };

  this.green_flag = {
    callbacks: [],
    clicked: function(callback)
    {
      this.callbacks.push(callback);
    },
    click: function()
    {
      this.callbacks.forEach(function (cb)
          {
            cb();
          });
    }

  };
}
