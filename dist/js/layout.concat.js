var bigEvil = function(){
    var lalala = 'boo';
    console.log(lalala);
}
var layout = (function () {
'use strict';

var jqModule = function jqModule() {

  $('#message').html('test');
};

var jqModule2;

jqModule2 = {
  addTest: (function(_this) {
    return function() {
      $('#message').html('teeeeest');
    };
  })(undefined),
  addTest2: (function(_this) {
    return function() {
      $('#message').html('teeeeest');
    };
  })(undefined)
};

var jqModule2$1 = jqModule2;

var componentCounter = function componentCounter(location) {

    var Counter = React.createClass({
        displayName: "Counter",

        getInitialState: function getInitialState() {
            return { clickCount: 0 };
        },
        handleClick: function handleClick() {
            this.setState(function (state) {
                return { clickCount: state.clickCount + 1 };
            });
        },
        render: function render() {
            return React.createElement(
                "h2",
                { onClick: this.handleClick },
                "Click me! Number of clicks: ",
                this.state.clickCount
            );
        }
    });

    ReactDOM.render(React.createElement(Counter, null), document.getElementById(location));
};

var webApp = {
    modules: {
        jqModule: jqModule,
        jqModule2: jqModule2$1
    },
    components: {
        componentCounter: componentCounter
    }
};

return webApp;

}());
