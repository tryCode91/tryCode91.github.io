export function SetHighscore(level, lines)
{
    let name = localStorage.getItem("name");
    let html="<tr>";
    html+="<td class='text-primary'>" + name + "</td>";
    html+="<td>" + level + "</td>";
    html+="<td>" + lines + "</td>";
    html+="</tr>";
    
    // Clear the old values for current user
    $(".highscore").html("");
    $(".highscore").append(html);
}    