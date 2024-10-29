  
    $(function() {

      // Main Function
      $( "#createMenuItems" ).on( "click", function() {

        // Start off by clearing the old menu items list
        clearMenuItems();

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
          let tick=4; // Number of boxes to generate

          let gameOver = false;

          // This should restart or run again, if the user wins

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

        // Attach click event to each created div
        for (let i = 1; i <= menuItems; i++) {
          
          // Register a click event for everybox
          // When a Box is selected, check if the current index is same as value of array=randomBoxes[i]
          $("#action-" + i).on("click", function() {

            // Checking if the guess was in one of the random boxes
            if ( randomBoxes.includes(i) )
            {

              // Highlight the selected box if it exists in array randomBoxes
              $("#action-" + i).css("background-color", "#008080");

              // Count for correct guess
              correctGuesses++;

            }

            // Checking if every guess was correct
            if (numberOfGuesses == 1 && correctGuesses == 4)
            {

              $("#won").html("You Won and You now advance to the next level!");
              $("#won-container").show();
              // Increment random boxes
              tick++;

            } 
            else if ( numberOfGuesses == 1 && correctGuesses < 4 )
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
      
        let rememberUs=[]; // Array to store the random numbers
        
        do
        {
          
          // random 4 numbers between 1 and maxBoxes
          for ( let i = 0; i < tick; i++ )
          {
          
            // Get a random number
            let nextBox=Math.floor(Math.random() * maxBoxes + 1);
            
            //add numbers into the array as long as the Length is smaller than the numbers generated.
            if (!rememberUs.includes(nextBox) && rememberUs.length < tick) {
              rememberUs.push(nextBox);
            }

            // If the array already has 4 elements, break the loop
            if (rememberUs.length >= 4) {
              break;
            }
            
          }

        } while (rememberUs.length < tick);
        
        return rememberUs;

      }
      
      function createMenuItem(max)
      {
        var parent=$("#menu-items");
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

      function clearMenuItems()
      {
        var parent=$("#menu-items");
        parent.html("");
      }

    });