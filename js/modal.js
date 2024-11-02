import { SetHighscore } from './highscore.js';

$(function() {
    
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
        SetHighscore(0, 0);
    }

    // If user requested to change name
    $("#name").on("click", function()
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
                SetHighscore(0, 0);

            }
            else
            {
                alert("Please enter your name.");
            }
        });
    }


});