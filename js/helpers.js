// Update playerWon with a function because the global variable does not want to be updated ...
export function UpdateBoolean(valueToUpdate, boolean)
{
    return valueToUpdate=boolean
}

export function UpdateNumber(valueToUpdate, number)
{
    return valueToUpdate=number   
}

export function UpdateLines(index, level, lines)
{   
    let array=lines;
    array[index] = level;
    return array;
}

export function UpdateBoxes(number)
{
    return number*8;
}

