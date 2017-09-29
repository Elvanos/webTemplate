var webApp = (function () {
'use strict';

var exampleComponent = function exampleComponent(location) {

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

var exampleModule = function exampleModule() {

  $('#message').html('test');
};

var exampleModule2;

exampleModule2 = {
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

var exampleModule2$1 = exampleModule2;

var exampleModule3 = function exampleModule3() {

  $('#message').html('test');
};

var exportObject = {
    components: {
        exampleComponent: exampleComponent
    },
    modules: {
        exampleModule: exampleModule,
        exampleModule2: exampleModule2$1,
        test: {
            exampleModule3: exampleModule3
        }
    }
};

return exportObject;

}());
