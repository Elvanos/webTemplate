var bigEvil = function() {
        console.log("boo")
    },
    webApp = function() {
        "use strict";
        return {
            components: {
                exampleComponent: function(e) {
                    var t = React.createClass({
                        displayName: "Counter",
                        getInitialState: function() {
                            return {
                                clickCount: 0
                            }
                        },
                        handleClick: function() {
                            this.setState(function(e) {
                                return {
                                    clickCount: e.clickCount + 1
                                }
                            })
                        },
                        render: function() {
                            return React.createElement("h2", {
                                onClick: this.handleClick
                            }, "Click me! Number of clicks: ", this.state.clickCount)
                        }
                    });
                    ReactDOM.render(React.createElement(t, null), document.getElementById(e))
                },
                exampleTypescriptFile: function() {
                    var e = new(function() {
                            function e(e) {
                                this.greeting = e
                            }
                            return e.prototype.greet = function() {
                                return "Hello, " + this.greeting
                            }, e
                        }())("world"),
                        t = document.createElement("button");
                    t.textContent = "Say Hello", t.onclick = function() {
                        alert(e.greet())
                    }, document.body.appendChild(t)
                },
                tes55: {
                    exampleModule3: function() {
                        $("#message").html("test")
                    },
                    test: {
                        exampleModule3: function() {
                            $("#message").html("test")
                        }
                    },
                    test2: {
                        exampleModule2: {
                            addTest: function() {
                                $("#message").html("teeeeest")
                            },
                            addTest2: function() {
                                $("#message").html("teeeeest")
                            }
                        },
                        exampleModule3: function() {
                            $("#message").html("test")
                        }
                    }
                },
                tes56: {
                    exampleModule3: function() {
                        $("#message").html("test")
                    },
                    test: {
                        exampleModule3: function() {
                            $("#message").html("test")
                        }
                    },
                    test2: {
                        exampleModule3: function() {
                            $("#message").html("test")
                        }
                    }
                }
            },
            modules: {
                exampleModule: function() {
                    $("#message").html("test")
                },
                exampleModule2: {
                    addTest: function() {
                        $("#message").html("teeeeest")
                    },
                    addTest2: function() {
                        $("#message").html("teeeeest")
                    }
                },
                test: {
                    exampleModule3: function() {
                        $("#message").html("test")
                    }
                }
            }
        }
    }();