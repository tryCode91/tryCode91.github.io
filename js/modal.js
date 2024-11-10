import { DisplayHighscore } from './highscore.js';
import { maxLines } from './functions.js';

$(function() {
    let lines;
    // Check first that there is no record already
    // If localStorage does not contain data about lines
    if ( JSON.parse(localStorage.getItem("lines")) == null )
    {
        // Fill empty array with 0
        lines=new Array(maxLines).fill(0);
    }    
    else
    {
        // If lines is NNot null then get the current record
        lines=JSON.parse(localStorage.getItem("lines"));
    }
    
    
    // Show modal when name has no value saved in localStorage
    let name =  localStorage.getItem("name");
    
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
        $("#change-name").on("click", function()
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