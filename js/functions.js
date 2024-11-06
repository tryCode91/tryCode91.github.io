// Import the function from utils.js
import { SetHighscore } from './highscore.js';
import { 
  UpdateLines,
  UpdateBoolean,
  UpdateNumber,
  UpdateBoxes
} from './helpers.js';

$(function() {
  
  // Global Variables
  let playerWon = false; // keep track of lose and win
  let tick=1; // Start value for number of random boxes to guess
  let maxLines=5; // Number of lines of, boxes = maxLines * 8
  let running=false;
  let animationFrameId; // Track the request ID to cancel it if needed
  let lines=new Array(0,0,0,0,0); // Inital record on each level
  let randomBoxes = new Array();
  let level=0;
  let boxes=0; // One line is 8 boxes
  let message="";
  let tempLevel=0;
  let tempTick=0;
  let currentLine=0; // Unneccesary to use two variables to keep track of one value
  let startLine=0; // player selected line to start with

  $("#menuItems").attr("placeholder", "1 to " + maxLines);
  
  // Main Function
  $( "#createMenuItems" ).on( "click", function() {

    // Input
    startLine=$("#menuItems").val();

    // Update array holding values
    lines=UpdateLines(startLine, level, lines);
    
    // Update boxes
    boxes=UpdateBoxes(startLine);

    if(ValidateInput(startLine))
    {
      // Decrease the value of startLine by 1 becasuse the array starts from 0
      
      // Show container
      $("#menu-items").show();
      $("#message-container").hide();

      // Update running
      running = UpdateBoolean(running, true);
      
      // Start the game
      StartGameLoop();

    }
      
  });
  
  // Validate user input
  function ValidateInput(startLine)
  {

    if( startLine <= 0 )
    {
      message="Select a number that is larger than 0!"; 
    }
    else if ( startLine > maxLines )
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

  function GameLoop() {
    
    if (!running) return;
    
    // Condition to check if boxes are equal to number of tick
    CompletedLine();
    
    boxes=UpdateBoxes(startLine);

    // 4 Sequences of animations running in Order, put all the four inside a function
    // 1. Create the boxes.
    CreateMenuItems();
    
    // 2. Random 4 Numbers and assign them to the boxes
    PickRandomBoxes();
    
    // 3. Clear all set of boxes.
    HideBackgroundColor();
   
    // 4. Wait for the first function to finish then remove background color. Function also runs the animation 
    RemoveBackgroundColor();
    
    // Check win condition
    CheckScore();

    // Check based on playerWon and running
    WinOrLose();

  }

  function CompletedLine()
  {
    // Increment level by 1 if the next level is not the last level!
    if (boxes == tick)
    {
      if( level < maxLines )
      {
        StopGameLoop();
        playerWon=UpdateBoolean(playerWon, true);
      
        // Reset ticks
        tempTick=1;
        tick=UpdateNumber(tick, tempTick);
        
        tempLevel=level+1;
        level=UpdateNumber(level, tempLevel);
      
        // increment current line
        startLine++;
        lines=UpdateLines(startLine, level, lines);
      }
      else
      {
        alert("You have reached the last level, bravo!");
      }
    }
  }

  function WinOrLose()
  {
    // If user lost
    if(!playerWon && running)
    {
      
      // User choose to RESTART
      $("#retry").on("click", function() {

        // Reset tick 
        tick=UpdateNumber(tick, 1);
        level=UpdateNumber(level, 1);
        
        // Stop Game Loop cleanly
        StopGameLoop();
          
        // Run game loop
        StartGameLoop();

      });

    }

    // User won, update tick value +1 and run game loop
    if(playerWon)
    {
      fadeInAndOut();
      // Reset playerWon
      UpdateBoolean(playerWon, false);
    }

  }

  // Function to wrap fadeIn in a Promise
  function fadeIn(element, duration) 
  {
    return new Promise((resolve) => 
    {
      $(element).fadeIn(duration, function() 
      {
        resolve(); // Resolve the promise when fadeIn is complete
      });
    });
  }

  // Function to wrap fadeOut in a Promise
  function fadeOut(element, duration) 
  {
    return new Promise((resolve) => 
    {
      $(element).fadeOut(duration, function() 
      {
        resolve(); // Resolve the promise when fadeOut is complete
      });
    });
  }

  // Function to create a delay using a Promise
  function sleep(duration)
  {
    return new Promise((resolve) => setTimeout(resolve, duration));
  }

  // Async function to perform fade-in, wait, and then fade-out
  async function fadeInAndOut() {

    $("#won").html("You Won and now advance to the next level!");
    const element = "#won-container";
    await fadeIn(element, 1000); // Wait for fade-in to complete (1 second)
    await sleep(2000);           // Wait for 2 seconds
    await fadeOut(element, 1000); // Wait for fade-out to complete (1 second)

  }

  function StartGameLoop()
  {
    if(!running)
    {
      running=UpdateBoolean(running, true);
    }

    GameLoop();
    console.log("Game Loop Started.");
  }

  function StopGameLoop()
  {
    $("#retry-container").hide();
    UpdateBoolean(running, false);  
    cancelAnimationFrame(animationFrameId); // Cancel the current animation frame
    console.log("Game loop stopped.");
  }
  
  function CheckScore()
  { 
    
    let numberOfGuesses=randomBoxes.length; // Number of times user can guess
    let correctGuesses=0;
    let guess = randomBoxes; // Assign a temporary array the numbers

    // Register a click event for every box
    for (let i = 0; i < boxes; i++) {

      // When a Box is selected, check if the current index is same as any value of randomBoxes[i]
      $("#action-" + i).on("click", function() {

        // Register the selected boxes and correct guesses and change background 
        correctGuesses=HighlightGuess(correctGuesses, guess, i);

        // Checks when all the guesses have been made and if all the guesses was correct
        CheckWinConditions(numberOfGuesses, correctGuesses)
        
        // Decrease the guess counter for EVERY guess
        numberOfGuesses--;

      });
      
    }
    
  }
  
  function HighlightGuess(correctGuesses, guess, i)
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
  
  function CheckWinConditions(numberOfGuesses, correctGuesses)
  {

    // Checking if every guess was correct
    if (numberOfGuesses == 1 && correctGuesses == tick)
    {
      NextLevel(); 
    } 
    else if ( numberOfGuesses == 1 && correctGuesses < tick )
    {
      // Make boxes temporarily untouchable so that we dont increment the tick
      FreezeBoxes();

      DisplayRetryMessage()
      
      running=UpdateBoolean(running, false);

    }

  }
  
  function DisplayRetryMessage()
  {
    // Display message to user
      let html="<div class='text-secondary font-weight-bold'>No Guesses Left &nbsp;</div>";
      html+="<div class='btn btn-primary retry-area mt-2'>";
      html+="<div class='text-light font-weight-bold'>Try again</div>";
      html+="</div>";
      
      // I want the pointer to be a cursor!
      $("#retry").html(html);
      $("#retry-container").show();

  }

  async function RemoveBackgroundColor()
  {
    // Wait for this function to finish animating boxes
    await animateBox();

    // Remove background color from animated boxes after 1 second
    $(".Box").css("background-color", "");
    
  }

  // This function holds a promise which finishes when the setTimeout is complete
  // The boxes animates background ONE box at the time, as many boxes as there are in the array
  // The animation will change background color - for 1 second and revert back to transparent background
  function animateBox()
  {
    return new Promise((resolve) => {
      
      let animationTime = 0;
      
      // Boxes will change background color for a brief period
      for ( let i = 0; i < randomBoxes.length; i++ )
      {
        
        animationTime = i * 1000;
        
        // Animates one box at the time to change background color
        setTimeout(() => {
        
          // Slow fade in effect with background color
          $("#action-" + randomBoxes[i]).fadeIn("slow", function(){
            
            // Add custom Css
            $(this).css({ "background-color": "blue", "opacity": "1" });
            
            // If we're on the last box, resolve the Promise
            if (i === randomBoxes.length - 1) {
                
                // Add Delay by 1 second so that the user can see the last box
                setTimeout(() => {

                  resolve(); // All animations are now complete, continue to the next function
              
                }, 1000);

            }

          });
          
        }, animationTime); // Increment by i for each iteration.

      }

      // Add 1s delay for the last entry
      animationTime+=1000;

      // Meanwhile the boxes change color disable click event temporarly
      DisablePointerEvent(animationTime);

    });

  }

  function HideBackgroundColor()
  {
    for ( let i = 0; i < randomBoxes.length; i++ )
    {
      // Remove background color for the selected random boxes and change opacity level
      $("#action-" + randomBoxes[i]).animate({backgroundColor: "", opacity: "0.1"}, "slow");
    }
  }

  function PickRandomBoxes()
  {
  
    let rememberUs=[]; // Store the random numbers
    
    do
    {
      
      // random 4 numbers between 1 and maxBoxes 
      for ( let i = 0; i < tick; i++ )
      {
      
        // Get a random number 0-7 IMPORTANT to start from 0 index because to match id for box elements
        let nextBox=Math.floor(Math.random() * boxes);

        // Add numbers into the array as long as the Length of the array is shorter than the amount of numbers generated
        if (!rememberUs.includes(nextBox) && rememberUs.length < tick) {
          rememberUs.push(nextBox);
        }

        // If the array already has 'tick'(4) elements, break the loop
        if (rememberUs.length >= tick) {
          break;
        }
        
      }

    } while (rememberUs.length < tick);
    
    randomBoxes = rememberUs;
    
  }
  
  function CreateMenuItems()
  {

    var parent=$("#menu-items");
    var parentMax=boxes;
    var children="";
    
    // Clear out old data
    parent.html("");

    for ( let i = 0; i < parentMax; i++ )  
    {
      children+="<div class='col'>";
      children+="<div class='Box' id='action-" + i + "'></div>";
      children+="</div>";
    }

    $(children).appendTo(parent);
  
  }

  function FreezeBoxes()
  {
    // Temporarily make boxes untouchable
    $(".Box").addClass("inactive-button");  
  }

  function DisablePointerEvent(animationTime)
  {
    // Disables boxes pointer event temporarily
    $(".Box").addClass("disable-click");
  
    setTimeout(() =>
    {
      $(".Box").removeClass("disable-click");
      $(".Box").addClass("enable-click");
    }, animationTime);
  }

  function NextLevel()
  {

      // Player won! // This will Run only ONCE per round
      playerWon=UpdateBoolean(playerWon, true);
      
      tempTick=tick+1;
      tick=UpdateNumber(tick, tempTick);

      tempLevel=level+1;
      level=UpdateNumber(level, tempLevel);
      $(".level").html(level + 1);

      // Update level
      lines=UpdateLines(startLine, level, lines);
      
      // Add the current highscore
      SetHighscore(startLine, level, lines);
      
      // Request the next frame and store the ID
      animationFrameId = requestAnimationFrame(GameLoop);
  }

});