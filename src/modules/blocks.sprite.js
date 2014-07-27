blocks.sprite = function(project, default_costume_url, x, y)
{

  // something
    // init stuff
    var self = this;
    this.x = x;
    this.y = y;
    this.project= project;
    this.costumes = [{
      id: 1,
      name: default_costume_url,
      url: default_costume_url
    }];

    this.click_callbacks = [];
    this.touching_callbacks = [];
    this.touching_color_callbacks = [];
    this.key_callbacks = [];
    this.clones = [];


    this.move = function(steps)
    {
      this.move_steps = steps;
    };

    this.point_in_direction = function(angle)
    {
      this.game_sprite.angle = angle;
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

    this.say = function(text)
    {
      self.say_text.setText(text);
    }

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
