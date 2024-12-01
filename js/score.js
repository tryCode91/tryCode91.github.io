import { maxLines } from './functions.js';
import { GetNonString, StoreNonString, GetString } from './helpers.js';

export function DisplayHighscore()
{

    let lines=GetNonString("lines");
    let name=localStorage.getItem("name");

    // Set name can only happen inside of an active function.
    $("#name").html(name);

    // Set lines and level
    let html="";
    html="<tr>";
    html+="<td> Level </td>";        
    
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

export function ResetScore()
{

    let arr=new Array(maxLines).fill(0);
    
    StoreNonString("lines", arr);
    StoreNonString("tick", 1);
    StoreNonString("level", 1);
    StoreNonString("line", 0);

    // Display score
    DisplayHighscore(arr);
    
    // Hide Boxes
    $("#menu-items").hide();
    $("#won-container").hide();
    $("#message-container").hide();

}
// unfinished function ment to check if the current highscore will be overwritten
function CheckHighscore()
{
    let currentHighscore=GetNonString("currentHighscore");
    let lastHighscore=GetNonString("lastHighscore");
    
    // If last highscore is larger than or equal to the currentHighscore then print the new highscore, else leave score as is
    if ( currentHighscore > lastHighscore)
    {
        StoreNonString("currentHighscore", currentHighscore);
    }
    else if( lastHighscore > currentHighscore )
    {
        StoreNonString("currentHighscore", lastHighscore);
    }

}