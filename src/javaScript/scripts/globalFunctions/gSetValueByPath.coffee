gSetValueByPath = (obj, path, value) ->
    # @param [object] obj - input object you need to add values to
    # @param [array] path - an array of "object levels" that lead to the final value AKA where it needs to be added
    # @param [anything] value - the value that should be added, can be anything except for undefined

    parts = path
    o = obj
    if parts.length > 1
        i = 0
        while i < parts.length - 1
            if !o[parts[i]]
                o[parts[i]] = {}
            o = o[parts[i]]
            i++
    o[parts[parts.length - 1]] = value
    return


export default gSetValueByPath