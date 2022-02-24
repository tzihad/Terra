w = {}

w.do = function(arg) {
    for (var i = 0; i < arguments.length; i++) {
        if (typeof(arr[i]) == "function") {
            arguments[i]()
        } else {
            console.log('non function called')
        }
    }
}

w.next = function(func) {
    if (typeof(func) == "function") {
        func()
    }
}
w.next.prototype.next = function(func) {
    return new w.next()
}
w.distance = function(a, b, c, d) {
    return Math.sqrt((a - c) * (a - c) + (b - d) * (b - d))
}