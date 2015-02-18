var React = require('react');
var Grid = require('./lib/Grid');

var Test = React.createClass({
    render: function () {
        return (
            <div>
                <Grid
                    baseWidth={100}
                    baseHeight={100}
                    margins={[10, 10]}
                    handle={true}
                    addable={true}
                    removable={true}
                    resizable={true}
                >
                    <div colspan={1} rowspan={1} row={0} col={0}>1</div>
                    <div colspan={1} rowspan={1} row={0} col={1}>2</div>
                    <div colspan={1} rowspan={1} row={0} col={2}>3</div>
                    <div colspan={1} rowspan={1} row={0} col={3}>4</div>
                    <div colspan={1} rowspan={1} row={0} col={4}>5</div>
                    <div colspan={1} rowspan={2} row={0} col={5}>6</div>
                    
                    <div colspan={1} rowspan={1} row={1} col={0}>7</div>
                    <div colspan={1} rowspan={1} row={1} col={1}>8</div>
                    <div colspan={1} rowspan={1} row={1} col={2}>9</div>
                    <div colspan={2} rowspan={1} row={1} col={3}>10</div>
                    
                    <div colspan={1} rowspan={1} row={2} col={0}>11</div>
                    <div colspan={1} rowspan={1} row={2} col={1}>12</div>
                    <div colspan={2} rowspan={1} row={2} col={2}>13</div>
                    <div colspan={1} rowspan={1} row={2} col={4}>14</div>
                    <div colspan={1} rowspan={1} row={2} col={5}>15</div>
                    
                    <div colspan={3} rowspan={1} row={3} col={0}>16</div>
                    <div colspan={1} rowspan={1} row={3} col={3}>17</div>
                    <div colspan={1} rowspan={1} row={3} col={4}>18</div>
                    <div colspan={1} rowspan={1} row={3} col={5}>19</div>
                </Grid>
            </div>
        );
    }
});

React.render(
    <Test />,
    document.body
);
