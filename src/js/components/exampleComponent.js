var exampleComponent = function (location) {

    var Counter = React.createClass({
        getInitialState: function () {
            return {clickCount: 0};
        },
        handleClick: function () {
            this.setState(function (state) {
                return {clickCount: state.clickCount + 1};
            });
        },
        render: function () {
            return (<h2 onClick={this.handleClick}>Click me! Number of clicks: {this.state.clickCount}</h2>);
        }
    });

    ReactDOM.render(
        <Counter />,
        document.getElementById(location)
    );
};

export default exampleComponent;