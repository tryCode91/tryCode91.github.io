import { GetNonString, StoreNonString } from "./helpers.js";

export function CreateMenuItems()
{

  var parent=$("#menu-items");
  var parentMax=GetNonString("boxes");
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

export function PickRandomBoxes(boxes, tick)
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
  
  StoreNonString("randomBoxes", rememberUs);
}

export function HideBackgroundColor()
{
  let randomBoxes=GetNonString("randomBoxes");
  for ( let i = 0; i < randomBoxes.length; i++ )
  {
    // Remove background color for the selected random boxes and change opacity level
    $("#action-" + randomBoxes[i]).animate({backgroundColor: "", opacity: "0.1"}, "slow");
  }
}


// This function holds a promise which finishes when the setTimeout is complete
// The boxes animates background ONE box at the time, as many boxes as there are in the array
// The animation will change background color - for 1 second and revert back to transparent background
export function animateBox()
{
  
  let randomBoxes=GetNonString("randomBoxes");

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

export async function RemoveBackgroundColor()
{
  // Wait for this function to finish animating boxes
  await animateBox();

  // Remove background color from animated boxes after 1 second
  $(".Box").css("background-color", "");
  
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

export function DisplayRetryMessage()
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