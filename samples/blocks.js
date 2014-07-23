// this is the blocks.js file
// (c) 2014 Command Z Labs Inc
//
var blocks = blocks || {


};

blocks.sprite = function(project, default_costume_url, x, y)
{
    this.click_callbacks = [];
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
      this.game_sprite.x += steps;
    };

    this.clicked = function(callback)
    {
      this.click_callbacks.push(callback);
    };

}

blocks.project = function(parent)
{
  this.parent = parent;
  var game = {};

  var sprite_list = [];

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
    sprite_list.forEach(function(sprite)
        {
          sprite.costumes.forEach(function(costume)
            {
              game.load.image(costume.name, costume.url);
            });
        });
  };
  this.create = function()
  {
    sprite_list.forEach(function(sprite)
        {
          var game_sprite = game.add.sprite(sprite.x,sprite.y,sprite.costumes[0].name);
          game_sprite.anchor.setTo(0.5,0.5);
          game_sprite.inputEnabled = true;
          game_sprite.input.start();
          sprite.game_sprite = game_sprite;
        });
  };

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
        });
  };

    this.start = function()
    {
      game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: this.preload, create: this.create, update: this.update });
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

