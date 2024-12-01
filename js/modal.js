import { GetNonString } from './helpers.js';
import { DisplayHighscore } from './score.js';

$(function() {

    // Show modal when name has no value saved in localStorage
    let name=localStorage.getItem("name");
    let lines=GetNonString("lines");
    
    // Hide everything for mobile phones! 
    if (isMobile()) 
    {
        // Hide all elements
        $("body > *").hide();
        
        // Show the specific div
        $("#mobile").show();
    } 
    else
    {
        // For Desktop and bigger screen resolution
        if ( name == null )
        {
            AskName();
        }
        else if ( name.length == 0 )
        {
            AskName();
        }
        else
        {
            // Set initial highscore
            DisplayHighscore(lines);
        }

        // If user requested to change name
        $("#change-name-btn").on("click", function()
        {
            AskName();

        });
    
    }

    function isMobile() {
        return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    
    function AskName()
    {
            
        // Variable to store the user's name
        let userName = "";

        // Show the modal when the page loads
        $("#fullsizeModal").css("display", "flex");

        // Close the modal when the close button is clicked
        $("#closeModal").click(function() 
        {
            $("#fullsizeModal").hide();
        });

        // Save the name input value and close the modal
        $("#submitName").click(function() 
        {    
            userName = $("#nameInput").val();
            
            if (userName.length >= 20)
            {
                alert("Name can max be 20 characters long")
                $("#nameInput").val("");
            }
            else if (userName)
            {
                $("#fullsizeModal").hide();

                // Store name in localstorage
                localStorage.setItem("name", userName);

                // Set initial highscore
                DisplayHighscore(lines);

                $("#name").html(userName);

            }
            else
            {
                alert("Please enter your name.");
            }
        });
    }
});