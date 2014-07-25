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

