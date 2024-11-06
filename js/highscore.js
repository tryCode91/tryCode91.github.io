export function SetHighscore(currentLine, level, lines)
{
    // Set name
    let html="";
    let name = localStorage.getItem("name");
    $("#name").html(name);
    
    // Set lines and level
    html="<tr>";
    html+="<td> Level </td>";

    console.log(currentLine);
    currentLine = currentLine - 1;
    // Add each level to table
    for (let i = 0; i < lines.length; i++ )
    {  
        // When the current line have been found, add +1 to level 
        if ( i === currentLine)
        {
            html+="<td>" + (lines[i] + 1) + "</td>";
            console.log("What is being added " + (lines[i] + 1));
            console.log("To what index " + i);
            console.log("To what value " + lines[i]);
        }
        else
        {   // Just display the numbers
            html+="<td>" + lines[i] + "</td>";
        }
    }
 
    html+="</tr>";


    // Clear the old values and append new data
    $(".highscore").html("");
    $(".highscore").append(html);

    // Save new highscore to localStorage
    localStorage.setItem("lines", lines);
    localStorage.setItem("level", level);
}

