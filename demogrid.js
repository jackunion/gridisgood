var React = require('react');
var Grid = require('gridisgood');

var Demo = React.createClass({
    render: function () {
        return (
            <div>
                <Grid
                    baseWidth={100}
                    baseHeight={100}
                    handle={true}
                    addable={false}
                    removable={true}
                    resizable={true}
                    rowsExpandable={true}
                    colsExpandable={true}
                    margins={[10, 10]}
                >
                    <div colspan={3} rowspan={1} row={0} col={0}>1</div>
                    <div colspan={1} rowspan={1} row={0} col={3}>2</div>
                    <div colspan={1} rowspan={1} row={0} col={4}>3</div>
                    <div colspan={1} rowspan={2} row={0} col={5}>4</div>
                    
                    <div colspan={1} rowspan={1} row={1} col={0}>5</div>
                    <div colspan={1} rowspan={1} row={1} col={1}>6</div>
                    <div colspan={1} rowspan={1} row={1} col={2}>7</div>
                    <div colspan={2} rowspan={1} row={1} col={3}>8</div>
                </Grid>
            </div>
        );
    }
});

React.render(
    <Demo />,
    document.body
);
