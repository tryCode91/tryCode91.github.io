
export function CreateMenuItems(boxes)
  {

    var parent=$("#menu-items");
    var parentMax=boxes;
    var children="";
    
    // Clear out old data
    parent.html("");

    for ( let i = 0; i < parentMax; i++ )  
    {
      children+="<div class='col'>";
      children+="<div class='Box' id='action-" + i + "'></div>";
      children+="</div>";
    }

    $(children).appendTo(parent);
  
  }
