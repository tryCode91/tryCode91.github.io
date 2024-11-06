import { SetHighscore } from './highscore.js';

$(function() {
    
    let lines=new Array(0,0,0,0,0); // Inital record on each level 

    // Show modal when name is has no value saved in localStorage
    let name =  localStorage.getItem("name");

    if ( name == null)
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
        SetHighscore(0, 0, lines);
    }

    // If user requested to change name
    $("#change-name").on("click", function()
    {
        AskName();

    });
    
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
                SetHighscore(0, 0, lines);

            }
            else
            {
                alert("Please enter your name.");
            }
        });
    }


    if (navigator.userAgent.match(/iPhone/i)   || navigator.userAgent.match(/iPad/i)  || navigator.userAgent.match(/Android/i)) {     
        // Code to execute if device is mobile 
        alert("Your on a device which is not supported!");
    } 

});