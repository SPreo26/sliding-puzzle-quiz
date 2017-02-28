$(document).ready(function(){
    window.shuffleTiles = function(array) {
        var valuesArray = [];
        var tiles = $('.sliding-puzzle').children('.tile');
        tiles.each(function(index,item){
          valuesArray.push($(item).text());
        });
        window.slidingPuzzle.shuffleArray(valuesArray);
        tiles.each(function(index,item){
          $(item).text(valuesArray[index]);
          $(item).css({'left':'0px','top':'0px'});//move each tile back to starting position to make sure the empty square is at the bottom right
        });

    }

    window.slidingPuzzle = {};

    document.body.onclick = function(event){
        elem = window.event? event.srcElement: event.target;
        if(elem.className && elem.className.indexOf('tile') != -1){
            var slideOffset = window.slidingPuzzle.getSlideOffset(elem);
            if (slideOffset){
                window.slidingPuzzle.moveElement(elem,slideOffset);
            }
        }
    }

    window.slidingPuzzle.shuffleArray = function (array) {
        let counter = array.length;
        while (counter > 0) {
            let index = Math.floor(Math.random() * counter);
            counter--;
            [array[counter],array[index]]=[array[index],array[counter]];
        }
        return array;
    }

    window.slidingPuzzle.tileTotalWidth = 67;

    window.slidingPuzzle.getSlideOffset = 
        function(elem){
            var slideOffset = {};
            if (elem){
                var x = elem.offsetLeft;
                var y = elem.offsetTop;
                var rightNeighbor = document.elementFromPoint(x+window.slidingPuzzle.tileTotalWidth, y);
                var bottomNeighbor = document.elementFromPoint(x, y+window.slidingPuzzle.tileTotalWidth);
                var leftNeighbor = document.elementFromPoint(x-window.slidingPuzzle.tileTotalWidth, y);
                var topNeighbor = document.elementFromPoint(x, y-window.slidingPuzzle.tileTotalWidth);
                //getting the diagonal members: there may be false flags in finding the empty square next to elements which positioned at the edge of the puzzle space; diagonal neighbors will help demistify this
                var northEastNeighbor = document.elementFromPoint(x+window.slidingPuzzle.tileTotalWidth, y-window.slidingPuzzle.tileTotalWidth);
                var southEastNeighbor = document.elementFromPoint(x+window.slidingPuzzle.tileTotalWidth, y+window.slidingPuzzle.tileTotalWidth);
                var southWestNeighbor = document.elementFromPoint(x-window.slidingPuzzle.tileTotalWidth, y+window.slidingPuzzle.tileTotalWidth);
                var northWestNeighbor = document.elementFromPoint(x-window.slidingPuzzle.tileTotalWidth, y-window.slidingPuzzle.tileTotalWidth);

                //a right neighbor can only be considered the empty square if either the northeast or southeast neighbor is a tile (otherwise the right neighbor of a tile could potentially land on the right border of the puzzle which will still return 'sliding-puzzle' as the class name; but this will be a false flag, rather than an actual empty square)
                if ( rightNeighbor && rightNeighbor.className == 'sliding-puzzle' && 
                    ((northEastNeighbor && northEastNeighbor.className == 'tile') || (southEastNeighbor && southEastNeighbor.className == 'tile')) )
                {
                    slideOffset.x = window.slidingPuzzle.tileTotalWidth;
                    slideOffset.y = 0;
                }

                else if ( bottomNeighbor && bottomNeighbor.className == 'sliding-puzzle' && 
                    ((southEastNeighbor && southEastNeighbor.className == 'tile') || (southWestNeighbor && southWestNeighbor.className == 'tile')) )
                {
                    slideOffset.x = 0;
                    slideOffset.y = window.slidingPuzzle.tileTotalWidth;
                }

                //a diagonal neighbor check may not be necessary for testing if a left neighbor (or top neighbor) is an empty square; however it is still done to be consistent and to be safe in case the padding+border of the puzzle is ever changed to be >= the width of a tile - then a false flag could still happen in this case
                else if ( leftNeighbor && leftNeighbor.className == 'sliding-puzzle' && 
                    ((southWestNeighbor && southWestNeighbor.className == 'tile') || (northWestNeighbor && northWestNeighbor.className == 'tile')) )
                {
                    slideOffset.x = -window.slidingPuzzle.tileTotalWidth;
                    slideOffset.y = 0;
                }

                else if ( topNeighbor && topNeighbor.className == 'sliding-puzzle' && 
                    ((northWestNeighbor && northWestNeighbor.className == 'tile') || (northEastNeighbor && northEastNeighbor.className == 'tile')) )
                {
                    slideOffset.x = 0;
                    slideOffset.y = -window.slidingPuzzle.tileTotalWidth;
                }
            }
            return slideOffset;
        }

    window.slidingPuzzle.moveElement = 
        function(elem,offset){
            elemXStart = parseInt(elem.style.left || 0)
            elemYStart = parseInt(elem.style.top || 0)
            var slideDelay = 30;//delay for slide animation
            if (offset.x){//if !=0
                var xSign = offset.x/Math.abs(offset.x);
                window.slidingPuzzle.nextFrameX(elem,elemXStart,offset.x,xSign,slideDelay);
            }
            if(offset.y){
                var ySign = offset.y/Math.abs(offset.y);
                window.slidingPuzzle.nextFrameY(elem,elemYStart,offset.y,ySign,slideDelay);
            }
        }

    window.slidingPuzzle.nextFrameX = function(elem,elemXStart,xOffset,sign,slideDelay) {
        for(let i=0;i<10;i++){//slide 10 pixels for each delay count to speed things up
            if( Math.abs(elemXStart - parseInt(elem.style.left || 0) ) < Math.abs(xOffset) )//whether sliding left or right, the distance between the starting x-position and the current x-position can't exceed the desired sliding distance
            {
                elem.style.left = (parseInt(elem.style.left||0)+sign)+'px';
            }
            else {
                return;
            }
        }
        setTimeout(function(){
            window.slidingPuzzle.nextFrameX(elem,elemXStart,xOffset,sign,slideDelay)
        }, slideDelay);
    }

    window.slidingPuzzle.nextFrameY = function(elem,elemYStart,yOffset,sign,slideDelay) {
        for(let i=0;i<10;i++){//slide 10 pixels for each delay count to speed things up
            if( Math.abs(elemYStart - parseInt(elem.style.top || 0) ) < Math.abs(yOffset) )//whether sliding up or down, the distance between the starting y-position and the current y-position can't exceed the desired sliding distance
            {
                elem.style.top = (parseInt(elem.style.top||0)+sign)+'px';
            }
            else {
                return;
            }
        }
        setTimeout(function(){
          window.slidingPuzzle.nextFrameY(elem,elemYStart,yOffset,sign,slideDelay)
        }, slideDelay);
    }

});