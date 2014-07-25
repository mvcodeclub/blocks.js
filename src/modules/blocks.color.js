blocks.color = function(r,g,b,a)
{
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
    var isBoundary = false;
    for (var i = 0; i < imageData.data.length / 4; i+=4)
    {
      bmpWidth = width + (boundaryWidth * 2);
      var rowNum = Math.floor(i / bmpWidth);
      var colNum = i % bmpWidth;
      
      // if it's in a middle column ...
      if (colNum > boundaryWidth && colNum < width + boundaryWidth)
      {
        // and it's in a middle row ...
        if (rowNum > boundaryWidth && rowNum < height + boundaryWidth)
          // ignore it
          continue;

      }

      var r = imageData.data[i]
      var g = imageData.data[i+1]
      var b = imageData.data[i+2]
      var a = imageData.data[i+3]

      if (this.inRange(this.r,r,colorWidth)  
          && this.inRange(this.g,g,colorWidth)  
          && this.inRange(this.b,b,colorWidth))
        return true;
    }

    return false;


  }
}

