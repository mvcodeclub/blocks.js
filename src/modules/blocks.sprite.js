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
