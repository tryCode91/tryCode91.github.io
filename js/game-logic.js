
import { GetNonString, StoreNonString, UpdateLines} from "./helpers.js";

export function HighlightGuess(correctGuesses, guess, i)
{

    // Checking if the guess was in one of the random boxes
    if ( guess.includes(i) )
    {

        // If the guess was correct Highlight the selected box with teal
        $("#action-" + i).css("background-color", "#008080");
        
        // Disable click event on correct guess as they still guessing boxes
        $("#action-" + i).removeClass("enable-click");
        $("#action-" + i).addClass("disable-click");
        
        // Find the index of the value using $.inArray()
        let index = $.inArray(i, guess);

        // Remove the selected index from guess
        if (index > -1) { // only splice array when item is found
            guess.splice(index, 1); // 2nd parameter means remove one item only
        }

        // +1 correct guess
        correctGuesses++;

    }
    else
    {
        // If the guess was wrong Highlight the selected box with red OR the box have already been selected once before!
        $("#action-" + i).css("background-color", "#FF0000");
    }

    return correctGuesses;

}

export function CompletedLine()
{
    let boxes=GetNonString("boxes");
    let tick=GetNonString("tick");
    let line=GetNonString("line");
    let maxLines=GetNonString("maxLines");

    // This function checks if the number of boxes equal to number of animations/ticks.
    // If they do equal to each other then reset level and tick to 1 and increment the current line by 1
    if (boxes == tick)
    {
        // I would need to check if the last line which is maxLines has been reached
        if( line != maxLines )
        {
            StopGameLoop();

            StoreNonString("playerWon", true);

            // Reset ticks and level
            StoreNonString("tick", 1);
            StoreNonString("level", 1);
            
            // increment current line
            StoreNonString("line", (GetNonString("line") + 1));
            
            UpdateLines();
        }
        else
        {
            alert("Last line reached! Congrats");
        }
    }
}

