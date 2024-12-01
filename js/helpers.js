// Update playerWon with a function because the global variable does not want to be updated ...
export function UpdateBoolean(valueToUpdate, boolean)
{
    valueToUpdate=boolean;
    return valueToUpdate;
}

export function UpdateNumber(valueToUpdate, number)
{
    valueToUpdate=number;
    return valueToUpdate;   
}

export function UpdateLines()
{   
    // Updates the current array holding records
    // ---------------
    // Lines 1 2 3 4 5 (Index)
    // Level 0 0 0 0 0 
    // ---------------

    // Get current level
    let level=GetNonString("level");
    
    // Get lines array
    let lines=GetNonString("lines");
    
    // Get index which is current line
    let line=GetNonString("line");
    if ( line > 0 )
    {
        lines[line-1]=level;
    }
    else
    {
        lines[line]=level;
    }
    
    StoreNonString("lines", lines);

}
// THIS FUNCTION CONTROLS NUMBER OF BOXES ON SCREEN
export function UpdateBoxes()
{  
    let line=GetNonString("line");

    // Add Line*10 = boxes 
    StoreNonString("boxes", (line*12));

} 

// STORE
export function GetNonString(name)
{
    return JSON.parse(localStorage.getItem(name));
}

export function StoreNonString(name, value)
{
    localStorage.setItem(name, JSON.stringify(value));
}

export function GetString(name)
{
    localStorage.getItem(name);
}

export function StoreString(name)
{
    localStorage.getItem(name);
}

// Async function to perform fade-in, wait, and then fade-out
export async function FadeInAndOut() {

    $("#won").html("You Won and now advance to the next level!");
    const element = "#won-container";
    await fadeIn(element, 1000); // Wait for fade-in to complete (1 second)
    await sleep(2000);           // Wait for 2 seconds
    await fadeOut(element, 1000); // Wait for fade-out to complete (1 second)

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