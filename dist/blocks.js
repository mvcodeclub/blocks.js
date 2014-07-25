/*! blocks - v0.1.0 - 2014-07-25
* Copyright (c) 2014 Douglas Tarr; Licensed  */
// this is the blocks.js file
// (c) 2014 Command Z Labs Inc
//
var blocks = blocks || {


};

blocks.backdrop = function(stage, name, url)
{
  this.stage = stage;
  this.name = name;
  this.url = url;

}


blocks.color = function(r,g,b,a)
{
  blocks.color.TOUCH_TOP = 1;
  blocks.color.TOUCH_BOTTOM = 2;
  blocks.color.TOUCH_LEFT = 3;
  blocks.color.TOUCH_RIGHT = 4;
  
  this.r = r;
  this.g = g;
  this.b = b;
  this.a = a;
  this.equals = function(color)
  {
    return color.r == this.r && color.g == this.g && color.b == this.b && color.a == this.a;
  };
  this.toString = function() {
    return "[" + this.r + "," + this.g + "," + this.b + "," + this.a + "]";
  };

  this.inRange = function(x,y,width)
  {
    if (x - width < y && x + width > y)
      return true;

    return false;
  }

  this.inImageDataBoundary = function(imageData, width, height, boundaryWidth, colorWidth)
  {
    // we are checking if this color is in the border of this bitmap, +/- the colorWidth
    var isBoundary = false;
    var bmpWidth = (width + (boundaryWidth * 2));
    for (var i = 0; i < imageData.data.length; i+=4)
    {
      var rowNum = Math.floor(i / (bmpWidth * 4));
      var colNum = (i % (bmpWidth)) / 4;
      
      // if it's in a middle column ...
      is_middle_column = (colNum > boundaryWidth && colNum < width + boundaryWidth);
      // and it's in a middle row ...
      is_middle_row = (rowNum > boundaryWidth && rowNum < height + boundaryWidth);

      if (is_middle_column && is_middle_row)
        continue;

      // ignore the corners
      if (colNum == 0 && rowNum == 0)
        continue;

      if (colNum == bmpWidth && rowNum == 0)
        continue;

      if (colNum == 0 && rowNum == height + boundaryWidth)
        continue;

      if (colNum == bmpWidth && rowNum == height + boundaryWidth)
        continue;


      var touching = false;
      if (rowNum < boundaryWidth)
        touching = blocks.color.TOUCH_TOP;
      else if (rowNum >= height + boundaryWidth )
        touching = blocks.color.TOUCH_BOTTOM;
      else if (colNum < boundaryWidth)
        touching = blocks.color.TOUCH_LEFT;
      else
        touching = blocks.color.TOUCH_RIGHT;


      var r = imageData.data[i]
      var g = imageData.data[i+1]
      var b = imageData.data[i+2]
      var a = imageData.data[i+3]

      if (this.inRange(this.r,r,colorWidth)  
          && this.inRange(this.g,g,colorWidth)  
          && this.inRange(this.b,b,colorWidth))
      {
        return touching;
      }
    }

    return blocks.color.TOUCH_NONE;
  }
}


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

blocks.sound = function(sprite, name, url)
{
  this.sprite = sprite;
  this.name = name;
  this.url = url;
  this.play = function()
  {
    this.game_sound.play();
  }
}


blocks.sprite = function(project, default_costume_url, x, y)
{
    var self = this;
    this.click_callbacks = [];
    this.touching_callbacks = [];
    this.touching_color_callbacks = [];
    this.key_callbacks = [];
    this.name = default_costume_url;
    this.x = x;
    this.y = y;
    this.costumes = [{
      id: 1,
      name: default_costume_url,
      url: default_costume_url
    }];
    this.move = function(steps)
    {
      this.game_sprite.body.x += steps;
    };

    this.clicked = function(callback)
    {
      this.click_callbacks.push(callback);
    };

    this.when_key_is_pressed = function(keycode, callback)
    {
      this.key_callbacks.push({
        keycode: keycode,
        callback: callback
      });
    }

    this.when_touching = function(sprite1, callback)
    {
      this.touching_callbacks.push({
        sprite: sprite1,
        cb: function(obj1, obj2)
        {
          callback(obj1.block_sprite, obj2.block_sprite);
        }
      });
    };

    this.when_touching_color = function(color, callback)
    {
      this.touching_color_callbacks.push({
        color: color,
        cb: function(obj1, touching)
        {
          callback(obj1, touching);
        }
      });
    };

    this.hide = function()
    {
      this.game_sprite.visible = false;

    }

    this.show = function()
    {
      this.game_sprite.visible = true;

    }

    this.clone = function()
    {
      // todo: clone all the behaviors here?

    }

}

blocks.stage = function(project)
{
  var self = this;
  this.project = project;
  this._backdrops  = [];

  this.backdrops  = {
    add: function(name, url)
    {
      var bg = new blocks.backdrop(self, name, url);
      self._backdrops.push(bg);
    }

  }

}

