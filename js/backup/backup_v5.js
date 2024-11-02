$(function() {
  
  // Global Variables
  let playerWon = false; // keep track of lose and win
  let tick=4; // Start value for number of random boxes to guess
  let maxLines = 5; // Number of lines of, boxes = maxLines * 8
  let running=false;
  let animationFrameId; // Track the request ID to cancel it if needed
  let globalMenuItems=0;
  let boxes=8; // One line is 8 boxes
  let message="";
  let randomBoxes = [];

  $("#menuItems").attr("placeholder", "1 to " + maxLines);
  
  // Main Function
  $( "#createMenuItems" ).on( "click", function() {

    var menuItems=$("#menuItems").val();

    UpdateMenuItems(menuItems);

    if(ValidateInput(maxLines))
    {

      // Show container
      // Might put this into a function
      $("#menu-items").show();
      $("#message-container").hide();

      UpdateRunning(true);

      // Start the game
      StartGameLoop();

    }
      
  });
  
  // Validate user input
  function ValidateInput()
  {

    if( globalMenuItems <= 0 )
    {
      message="Select a number that is larger than 0!"; 
    }
    else if ( globalMenuItems > maxLines )
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
    
    UpdateBoxes();

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
    
    console.log("After CheckScore");
    return;
    
    // If user lost
    if(!playerWon && running)
    {
      
      // User choose to RESTART
      $("#retry").on("click", function() {

        // Reset tick 
        UpdateTick(4);

        // Stop Game Loop cleanly
        StopGameLoop();

        // Run game loop
        StartGameLoop();
        
        console.log("User request to restart the game, resetting tick=" + tick);

      });

    }

    // User won, update tick value +1 and run game loop
    if(playerWon)
    {

      $("#won-container").hide();          
      
      tick++;
      UpdateTick(tick);

      // Request the next frame and store the ID
      animationFrameId = requestAnimationFrame(GameLoop);

      console.log("Player won Continue to next level, increasing tick=" + tick);

    }

  }

  function StartGameLoop()
  {
  
    if(!running) UpdateRunning(true);
    
    GameLoop();

    console.log("Game Loop Started.");
  
  }

  function StopGameLoop()
  {
    $("#retry-container").hide();

    UpdateRunning(false);
    
    cancelAnimationFrame(animationFrameId); // Cancel the current animation frame
  
    console.log("Game loop stopped.");
  
  }
  
  function CheckScore()
  { 
    
    let numberOfGuesses=randomBoxes.length; // Number of times user can guess
    let correctGuesses=0;
    
    // Register a click event for every box
    for (let i = 1; i <= globalMenuItems; i++) {

      console.log("Register a click event for every box ");
      // When a Box is selected, check if the current index is same as value of randomBoxes[i]
      $("#action-" + i).on("click", function() {

        // Register the selected boxes and correct guesses and change background 
        correctGuesses=HighlightGuess(correctGuesses, i);

        // Check if all the guesses was correct
        CheckWinConditions(numberOfGuesses, correctGuesses)
        
        // Decrease the guess counter for EVERY guess
        numberOfGuesses--;

      });
    }
  }
  
  function HighlightGuess(correctGuesses, i)
  {

      // Checking if the guess was in one of the random boxes
      if ( randomBoxes.includes(i) )
      {

        // If the guess was correct Highlight the selected box with teal
        $("#action-" + i).css("background-color", "#008080");
        
        // +1 correct guess
        correctGuesses++;

      }
      else
      {
        // If the guess was wrong Highlight the selected box with red
        $("#action-" + i).css("background-color", "#FF0000");
      }

    return correctGuesses;

  }
  
  function CheckWinConditions(numberOfGuesses, correctGuesses)
  {

    // Checking if every guess was correct
    if (numberOfGuesses == 1 && correctGuesses == tick)
    {

      $("#won").html("You Won and now advance to the next level!");
      $("#won-container").show();

      // Player won!
      UpdatePlayerWon(true)
      
    } 
    else if ( numberOfGuesses == 1 && correctGuesses < tick )
    {
      // Make boxes temporarily untouchable so that we dont increment the tick
      FreezeBoxes();
  
      // Display message to user
      let html="<div class='row'>";
      html+="<div class='col-4'>";
      html+="<div class='text-secondary font-weight-bold'>No Guesses Left &nbsp;</div>";
      html+="<div class='btn btn-primary retry-area mt-2'>";
      html+="<div class='text-light font-weight-bold'>Retry</div>";
      html+="</div>";
      html+="</div>";
      html+="</div>";
      
      // I want the pointer to be a cursor!
      $("#retry").html(html);
      $("#retry-container").show();

      UpdateRunning(false);

    }

  }

  async function RemoveBackgroundColor()
  {
    // Wait for this function to finish animating boxes
    await animateBox();

    // Remove background color from animated boxes after 1 second
    for ( let i = 0; i < randomBoxes.length; i++ )
    {
      $("#action-" + randomBoxes[i]).css("background-color", "");
    }
  }

  // This function holds a promise which finishes when the setTimeout is complete
  // The iteration animates ONE box at the time, as many boxes as there are in the array
  // The animation will change background color - for 1 second and revert back to no background
  function animateBox()
  {
    return new Promise((resolve) => {

      // Boxes will change background color for a brief period
      for ( let i = 0; i < randomBoxes.length; i++ )
      {
        
        // Animates one box at the time to change background color
        setTimeout(() => {

          // Adds background color
          $("#action-" + randomBoxes[i]).fadeIn("slow", function(){
            
            // Add Custom Css
            $(this)
            .css({
                "background-color": "blue",
                "opacity": "1"
            });
            
            // If we're on the last box, resolve the Promise
            if (i === randomBoxes.length - 1) {
                
                // Add Delay by 1 second so that the user can see the last box
                setTimeout(() => {

                  resolve(); // All animations are now complete, continue to the next function
              
                }, 1000);

            }

          });
          
        }, i * 1000); // Increment by i for each iteration.

      }

    });

  }

  function HideBackgroundColor()
  {
    for ( let i = 0; i < randomBoxes.length; i++ )
    {
      // Remove background color and change opacity level.
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
      
        // Get a random number
        let nextBox=Math.floor(Math.random() * boxes + 1);
        
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
    // Hide result from last round
    $("#won-container").hide();

    var parent=$("#menu-items");
    var parentMax=boxes;
    var children="";
    
    // Clear out old data
    parent.html("");
  
    for ( let i = 1; i <= parentMax; i++ )  
    {
      children+="<div class='col'>";
      children+="<div class='Box' id='action-" + i + "'></div>";
      children+="</div>";
    }

    $(children).appendTo(parent);
  
  }

  function UpdateMenuItems(menuItems)
  {
      globalMenuItems = menuItems;
  }

  // Update playerWon with a function because the global variable does not want to be updated ...
  function UpdatePlayerWon(trueOrFalse)
  {
      playerWon=trueOrFalse
  }

  function UpdateTick(trueOrFalse)
  {
      tick=trueOrFalse
  }

  function UpdateRunning(trueOrFalse)
  {
      running=trueOrFalse;
  }
  
  function UpdateBoxes()
  {
    boxes=globalMenuItems*8;
  }

  function FreezeBoxes()
  {
    // Temporarily make boxes untouchable
    $(".Box").addClass("inactive-button");  
  }

});