$(document).ready(function(){
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

                if (rightNeighbor && rightNeighbor.className == 'sliding-puzzle' && 
                    ((northEastNeighbor && northEastNeighbor.className == 'tile') || (southEastNeighbor && southEastNeighbor.className == 'tile'))
                    //a right neighbor can only be considered the empty square if either the northeast or southeast neighbor is a tile (otherwise the right neighbor of a tile could potentially land on the right border of the puzzle which will still return 'sliding-puzzle' as the class name; but this will be a false flag, rather than an actual empty square)
                ){
                    slideOffset.x = window.slidingPuzzle.tileTotalWidth;
                    slideOffset.y = 0;
                }

                else if (bottomNeighbor && bottomNeighbor.className == 'sliding-puzzle' && 
                    ((southEastNeighbor && southEastNeighbor.className == 'tile') || (southWestNeighbor && southWestNeighbor.className == 'tile'))
                ){
                    slideOffset.x = 0;
                    slideOffset.y = window.slidingPuzzle.tileTotalWidth;
                }

                else if (leftNeighbor && leftNeighbor.className == 'sliding-puzzle' && 
                    ((southWestNeighbor && southWestNeighbor.className == 'tile') || (northWestNeighbor && northWestNeighbor.className == 'tile'))
                    //a diagonal neighbor check may not be necessary for testing if a left neighbor (or top neighbor) is an empty square; however it is still done to be consistent and to be safe in case the padding+border of the puzzle is ever changed to be >= the width of a tile - then a false flag could still happen in this case
                ){
                    slideOffset.x = -window.slidingPuzzle.tileTotalWidth;
                    slideOffset.y = 0;
                }

                else if (topNeighbor && topNeighbor.className == 'sliding-puzzle' && 
                    ((northWestNeighbor && northWestNeighbor.className == 'tile') || (northEastNeighbor && northEastNeighbor.className == 'tile'))
                ){
                    slideOffset.x = 0;
                    slideOffset.y = -window.slidingPuzzle.tileTotalWidth;
                }
            }
            return slideOffset;
        }

    window.slidingPuzzle.moveElement = 
        function(elem,offset){
            elem.style.left = (parseInt(elem.style.left||0)+offset.x)+'px';
            elem.style.top = (parseInt(elem.style.top||0)+offset.y)+'px';
        }

});