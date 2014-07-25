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

