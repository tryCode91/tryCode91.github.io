$(function() {

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
            alert("Name saved: " + userName);
            $("#fullsizeModal").hide();

            // Store name in localstorage
            localStorage.setItem("name", userName);
        }
        else
        {
            alert("Please enter your name.");
        }
    });

    function CheckUser()
    {
        let name = localStorage.getItem("name");
        if(name)
        {
            console.log("name is set already " + name);
        }
        
        return false;
    }

});