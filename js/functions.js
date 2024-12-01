// Import the functions
import { 
  ResetScore,
  DisplayHighscore
} from "./score.js";

import { 
  UpdateLines,
  StoreNonString,
  GetNonString,
  StoreString,
  FadeInAndOut,
  UpdateBoxes
} from "./helpers.js";

import { 
  CreateMenuItems, 
  HideBackgroundColor, 
  PickRandomBoxes, 
  RemoveBackgroundColor,
  DisplayRetryMessage
} from "./animation.js";

import { 
  CompletedLine,
  HighlightGuess
} from "./game-logic.js";

let maxLines=5; StoreNonString("maxLines", maxLines);// Number of maximum lines, total boxes = maxLines * 8
export { maxLines };

$(function() {
  
  // Globals
  let playerWon = false; StoreNonString("playerWon", playerWon); // keep track of lose and win
  let tick=1; StoreNonString("tick", tick); // Start value for number of random boxes to guess
  let lines=new Array(0,0,0,0,0); StoreNonString("lines", lines); // Inital record on each level
  let running=false; StoreNonString("running", running); // is the game in progress?
  let animationFrameId=0; StoreNonString("animationFrameId", animationFrameId); // Track the request ID to cancel it if needed
  let randomBoxes = new Array(); StoreNonString("randomBoxes", randomBoxes); // randoms 4 numbers (boxes)
  let level=0; StoreNonString("level", level); // track the current level
  let boxes=0; StoreNonString("boxes", boxes); // One line is 8 boxes
  let message=""; StoreString("message", message);
  let line=0; StoreNonString("line", line); // player selected line to start with
  let currentHighscore=0; StoreNonString("currentHighscore", currentHighscore);
  let lastHighscore=0; StoreNonString("lastHighscore", lastHighscore);

  $("#menuItems").attr("placeholder", "1 to " + maxLines);
  
  // Main Function
  $( "#createMenuItems" ).on( "click", function() {

    // Input
    StoreNonString("line", $("#menuItems").val());
    
    // Update boxes
    UpdateBoxes();
    
    // Update array keeping score
    UpdateLines();
    
    if(ValidateInput())
    {
      // Decrease the value of line by 1, array starts from 0
      
      // Show container
      $("#menu-items").show();
      $("#message-container").hide();

      // Update running
      StoreNonString("running", true);

      // Start the game
      StartGameLoop();

    }
      
  });

  function GameLoop() {

    if (!GetNonString("running")) return;
    
    line=GetNonString("line");
    tick=GetNonString("tick");
    boxes=GetNonString("boxes");
    
    randomBoxes=GetNonString("randomBoxes");
    console.log("Randoms " + randomBoxes);

    // Condition to check if boxes are equal to number of tick
    CompletedLine();
    
    // 1. Create the boxes.
    CreateMenuItems(boxes);

    // 2. Random 4 Numbers and assign them to the boxes
    PickRandomBoxes(boxes, tick);
    
    // 3. Clear all set of boxes.
    HideBackgroundColor();

    // 4. Wait for the first function to finish then remove background color. Function also runs the animation 
    RemoveBackgroundColor();

    // Check win condition
    CheckScore(randomBoxes, boxes, tick);

    // Check based on playerWon and running
    WinOrLose();

  }

  function StartGameLoop()
  {
      if(!GetNonString("running"))
      {
          StoreNonString("running", true);
      }
      GameLoop();
  }
  
  function StopGameLoop()
  {
      $("#retry-container").hide();
      StoreNonString("running", false);
      let animationFrameId=GetNonString("animationFrameId");
      cancelAnimationFrame(animationFrameId); // Cancel the current animation frame
  }

  function WinOrLose()
  {

    let playerWon=GetNonString("playerWon");
    let running=GetNonString("running");

    // If player lose
    if(!playerWon && running)
    {
        // User choose to RESTART
        $("#retry").on("click", function() {
            // Reset tick 
            StoreNonString("tick", 1);
            StoreNonString("level", 0);
            
            // Stop Game Loop cleanly
            StopGameLoop();
                
            // Run game loop
            StartGameLoop();
        });
    }

    // User won, update tick value +1 and run game loop
    if(playerWon)
    {
        FadeInAndOut();
        // Reset playerWon
        StoreNonString("playerWon", false);
    }
  }
  
  function NextLevel()
  {
    // Player won! Runs one time per round
    StoreNonString("playerWon", true);

    // Get tick, Tick is the number of boxes that will change background color
    let tick=GetNonString("tick");
    let incrementTick=tick+1;
    StoreNonString("tick", incrementTick);

    // Increment level and store it
    let level=GetNonString("level");
    let incrementLevel=level+1;
    StoreNonString("level", incrementLevel)
    
    // Update Score
    UpdateLines();

    // Show display level
    $(".level").html(level+1);

    // Add the current highscore
    DisplayHighscore();
    
    // Get current animation frame
    let animationFrameId = GetNonString("animationFrameId");

    // Request the next frame and store the ID
    animationFrameId = requestAnimationFrame(GameLoop);
    StoreNonString("animationFrameId", animationFrameId);
    
  } 

  function CheckWinConditions(numberOfGuesses, correctGuesses, tick)
  {

    // Checking if every guess was correct
    if (numberOfGuesses == 1 && correctGuesses == tick)
    {
        NextLevel(); 
    } 
    else if ( numberOfGuesses == 1 && correctGuesses < tick )
    {
        // Make boxes temporarily untouchable so that we dont increment the tick
        $(".Box").addClass("inactive-button"); 

        DisplayRetryMessage()
       
        StoreNonString("running", false);
    }
  }

  function CheckScore()
  { 
    let randomBoxes=GetNonString("randomBoxes");
    let boxes=GetNonString("boxes");
    let tick=GetNonString("tick");
    let numberOfGuesses=randomBoxes.length; // Number of times user can guess
    let correctGuesses=0;
    let guess=randomBoxes; // Assign a temporary array to the numbers

    // Register a click event for every box
    for (let i = 0; i < boxes; i++) {

        // When a Box is selected, check if the current index is same as any value of randomBoxes[i]
        $("#action-" + i).on("click", function() {

            // Register the selected boxes and correct guesses and change background 
            correctGuesses=HighlightGuess(correctGuesses, guess, i);

            // Checks when all the guesses have been made and if all the guesses was correct
            CheckWinConditions(numberOfGuesses, correctGuesses, tick)
            
            // Decrease the guess counter for EVERY guess
            numberOfGuesses--;

        });
    }
  }

  // Validate user input
  function ValidateInput()
  {
    
    let line=GetNonString("line");
    let maxLines=GetNonString("maxLines");
    
    if( line <= 0 )
    {
      message="Select a number that is larger than 0!"; 
    }
    else if ( line > maxLines )
    {
      message="Select a number that is smaller than or equal to " + maxLines + "!";
    }
    else 
    {
      return true;
    }
    
    $("#message").html(message);
    $("#message-container").show();
    return false;

  }

  // Add click event to reset score btn
  $("#reset-score").on("click", function(){
    ResetScore();
  });
  
});