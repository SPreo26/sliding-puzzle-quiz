$(document).ready(function(){
    window.slidingPuzzle = {};

    document.body.onclick = function(event){
        elem = window.event? event.srcElement: event.target;
        if(elem.className && elem.className.indexOf('tile') != -1){
            var offset = window.slidingPuzzle.getSlideOffset(elem);
            if (offset){
                window.slidingPuzzle.moveElement(elem,offset);
            }
        }
    }

    window.slidingPuzzle.tileTotalWidth = 67;

    window.slidingPuzzle.getSlideOffset = 
        function(elem){
            var slideOffset;
            if (elem){
                var x = elem.offsetLeft;
                var y = elem.offsetRight;
                var rightNeighbor = document.elementFromPoint(x+window.slidingPuzzle.tileTotalWidth, y);
                var bottomNeighbor = document.elementFromPoint(x, y+window.slidingPuzzle.tileTotalWidth);
                var leftNeighbor = document.elementFromPoint(x-window.slidingPuzzle.tileTotalWidth, y);
                var topNeighbor = document.elementFromPoint(x, y-window.slidingPuzzle.tileTotalWidth);
                //getting the diagonal members: there may be false flags in finding the empty square next to elements which positioned at the edge of the puzzle space; diagonal neighbors will help demistify this
                var northEastNeighbor = document.elementFromPoint(x+window.slidingPuzzle.tileTotalWidth, y-window.slidingPuzzle.tileTotalWidth);
                var southEastNeighbor = document.elementFromPoint(x+window.slidingPuzzle.tileTotalWidth, y+window.slidingPuzzle.tileTotalWidth);
                var southWestNeighbor = document.elementFromPoint(x-window.slidingPuzzle.tileTotalWidth, y+window.slidingPuzzle.tileTotalWidth);
                var northWestNeighbor = document.elementFromPoint(x-window.slidingPuzzle.tileTotalWidth, y-window.slidingPuzzle.tileTotalWidth);

                if (rightNeighbor.className == 'sliding-puzzle' && 
                    (northEastNeighbor.className == 'tile' || southEastNeighbor.parentElement.className == 'tile')
                    //a right neighbor can only be considered the empty square if either the northeast or southeast neighbor is a tile (otherwise the right neighbor of a tile could potentially land on the right border of the puzzle which will still return 'sliding-puzzle' as the class name; but this will be a false flag, rather than an actual empty square)
                ){
                    slideOffset.x = window.slidingPuzzle.tileTotalWidth;
                    slideOffset.y = 0;
                }

                else if (bottomNeighbor.className == 'slidingPuzzle' && 
                    (southEastNeighbor.className == 'tile' || southWestNeighbor.parentElement.className == 'tile')
                ){
                    slideOffset.x = 0;
                    slideOffset.y = window.slidingPuzzle.tileTotalWidth;
                }

                else if (leftNeighbor.className == 'slidingPuzzle' && 
                    (southWestNeighbor.className == 'tile' || northWestNeighbor.parentElement.className == 'tile')
                    //a diagonal neighbor check may not be necessary for testing if a left neighbor (or top neighbor) is an empty square; however it is still done to be consistent and to be safe in case the padding+border of the puzzle is ever changed to be >= the width of a tile - then a false flag could still happen in this case
                ){
                    slideOffset.x = -window.slidingPuzzle.tileTotalWidth;
                    slideOffset.y = 0;
                }

                else if (topNeighbor.className == 'slidingPuzzle' && 
                    (northWestNeighbor.className == 'tile' || northEastNeighbor.parentElement.className == 'tile')
                ){
                    slideOffset.x = 0;
                    slideOffset.y = -window.slidingPuzzle.tileTotalWidth;
                }
            }
            console.log(slideOffset);
            return slideOffset;
        }

    window.slidingPuzzle.moveElement = 
        function(elem,offset){
            elem.style.left = offset.x+'px';
            elem.style.top = offset.y+'px';
        }

});