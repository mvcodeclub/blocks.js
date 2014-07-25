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

