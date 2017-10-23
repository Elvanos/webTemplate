finalReport = (warningMessage,freshUpdated) ->

    if warningMessage.length > 0
        console.log '    '.bgRed
        console.log warningMessage.red
        console.log '    '.bgRed
        console.log ''
    else
        console.log '    '.bgGreen
        console.log 'Start-up check complete. Found no errors. \nHappy coding!'.green
        console.log '    '.bgGreen
        console.log ''


    if freshUpdated.length > 0
        console.log ''
        console.log freshUpdated.blue
        console.log ''


export default finalReport