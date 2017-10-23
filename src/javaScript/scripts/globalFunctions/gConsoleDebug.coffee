gConsoleDebug = (debugSwitch) ->

    if debugSwitch is true
        [
            'log'
            'warn'
        ].forEach (method) ->
            old = console[method]

            console[method] = ->
                stack = (new Error).stack.split(/\n/)
                if stack[0].indexOf('Error') == 0
                    stack = stack.slice(1)
                args = [].slice.apply(arguments).concat([ stack[1].trim() ])
                old.apply console, args

            return

export default gConsoleDebug