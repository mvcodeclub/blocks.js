blocks.block = function () {

  this.callbacks = [];
  this.run = null;

  blocks.block.prototype.run_block = function(block_to_run)
  {
    block_to_run();
  }

  blocks.block.prototype.check_condition = function(condition)
  {
    if (condition instanceof Function)
      return condition();

    if (condition instanceof Boolean)
      return condition;

    return false;

  }
}

blocks.while_block = function (condition, block) {

  var self = this;
  this.block = block;
  blocks.while_block.prototype = blocks.block;

  this.run = function ()
  {
    if (check_condition(condition))
    {
      run_block(self.block);
    }

  }
}

blocks.if_else_block = function(condition, if_block, else_block)
{
  var self = this;
  this.if_block = if_block;
  this.else_block = else_block;
  this.condition = condition;
  blocks.if_else_block.prototype = blocks.block;

  this.run = function ()
  {
    if (check_condition(condition))
    {
      run_block(self.if_block);
    }
    else
    {
      run_block(self.else_block);
    }

  }
}
