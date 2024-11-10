  
    $(function() {
      
      // Global Variables
      let tick=4; // Number of boxes to generate
      let playerWon = false;
      
      // Main Function
      $( "#createMenuItems" ).on( "click", function() {

        var maxLines = 5;
        var menuItems=$("#menuItems").val();
  
        if (menuItems < 0 || menuItems > maxLines || menuItems == "")
        {
          message="Please select how many lines you would like 1 - " + maxLines;
          $("#message").html(message);
          $("#message-container").show();
        }
        else
        {
          $("#menu-items").show();
          $("#message-container").hide();

          // One line is 8 boxes.
          let boxes=menuItems*8;

          // Everything checks out create the boxes.
          createMenuItem(boxes);

          // Get 'tick start at 4' random boxes
          let randomBoxes = pickRandomBoxes(boxes, tick);
          
          // Clear all set of boxes.
          hideBackgroundColor(randomBoxes, "0.1");
          
          // Wait for the first function to finish then
          removeBackgroundColor(randomBoxes);
          
          // Do what the function name says.
          checkScore(boxes, randomBoxes, tick);

        }
          
      });

      function checkScore(menuItems, randomBoxes, tick)
      { 
        
        let numberOfGuesses=randomBoxes.length; // Number of times user can guess
        let correctGuesses=0;

        // Register a click event for every box
        for (let i = 1; i <= menuItems; i++) {
          
          // When a Box is selected, check if the current index is same as value of randomBoxes[i]
          $("#action-" + i).on("click", function() {

            // Checking if the guess was in one of the random boxes
            if ( randomBoxes.includes(i) )
            {

              // If the guess was correct Highlight the selected box
              $("#action-" + i).css("background-color", "#008080");

              // +1 correct guess
              correctGuesses++;

            }

            // Checking if every guess was correct
            if (numberOfGuesses == 1 && correctGuesses == tick)
            {

              $("#won").html("You Won and You now advance to the next level!");
              $("#won-container").show();
              // Increment random boxes
              tick++;

            } 
            else if ( numberOfGuesses == 1 && correctGuesses < tick )
            {
              
              message="No guesses left... try again";

              // Hide box container
              $("#menu-items").hide();

              // Display message to user
              $("#message").html(message);
              $("#message-container").show();
              
              return; 
            }
            
            // Decrease the guess counter for EVERY click
            numberOfGuesses--;

          });
        }
      }

      async function removeBackgroundColor(randomBoxes)
      {
        // Wait for this function to finish animating boxes
        await animateBox(randomBoxes);

        for ( let i = 0; i < randomBoxes.length; i++ )
        {
          $("#action-" + randomBoxes[i]).css("background-color", "");
        }
      }

      function animateBox(randomBoxes)
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

      function hideBackgroundColor(randomBoxes, opacity)
      {
        for ( let i = 0; i < randomBoxes.length; i++ )
        {
          // Remove background color and change opacity level.
          $("#action-" + randomBoxes[i]).animate({backgroundColor: "", opacity: opacity}, "slow");
        }
        
      }

      function pickRandomBoxes(maxBoxes, tick)
      {
      
        let rememberUs=[]; // Store the random numbers
        
        do
        {
          
          // random 4 numbers between 1 and maxBoxes
          for ( let i = 0; i < tick; i++ )
          {
          
            // Get a random number
            let nextBox=Math.floor(Math.random() * maxBoxes + 1);
            
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
        
        return rememberUs;

      }
      
      function createMenuItem(max)
      {
        
        var parent=$("#menu-items");

        // Clear out old data
        parent.html("");
        var parentMax=max;
        var children="";

        for ( let i = 1; i <= parentMax; i++ )  
        {
          children+="<div class='col'>";
          children+="<div class='Box' id='action-" + i + "'></div>";
          children+="</div>";
        }

        $(children).appendTo(parent);
      
      }

    });