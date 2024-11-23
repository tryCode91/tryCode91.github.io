import { maxLines } from './functions.js';

export function DisplayHighscore(lines)
{
    
    // Set lines and level
    let html="";
    html="<tr>";
    html+="<td> Level </td>";
    
     // Set name can only happen inside of an active function.
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


export function ResetScore(lines, level, line, tick)
{
    // Set current name and save lines + level to localstorage
    SetNameAndSaveToStorage(lines, level);
    
    let arr=new Array(maxLines).fill(0);

    // Display score
    DisplayHighscore(arr);
    
    // Hide Boxes
    $("#menu-items").hide();
    $("#won-container").hide();
    $("#message-container").hide();

    return {tick: 1, level: 1, lines: arr, line: 0};
}