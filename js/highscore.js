import { maxLines } from './functions.js';

export function DisplayHighscore(lines)
{
    
    // Set lines and level
    let html="";
    html="<tr>";
    html+="<td> Level </td>";
    
     // Set name can only happen inside of a relatively active function.
    let name = localStorage.getItem("name");
    $("#name").html(name);

   // Add the current score to highscore
    for (let i = 0; i < lines.length; i++)
    {
        html+="<td>" + lines[i] + "</td>";
    }

    html+="</tr>";

    // Clear the old values and append new data
    $(".highscore").html("");
    $(".highscore").append(html);

}

export function SetNameAndSaveToStorage(lines, level)
{
    // Save new highscore to localStorage
    localStorage.setItem("lines", JSON.stringify(lines));
    localStorage.setItem("level", level);
}

export function ResetScore()
{   
    new Array(maxLines).fill(0);
}