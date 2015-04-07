# gridisgood

gridisgood is yet another grid system, heavily inspired by [gridster.js](http://gridster.net/).

Unlike [React-Grid-Layout](https://github.com/STRML/react-grid-layout), gridisgood does not provide drag functionality per se, using different approach to make it feel draggable. If at some point it turns out that gridisgood doesn't quite fit your needs, go check [React-Grid-Layout](https://github.com/STRML/react-grid-layout) out.

The best thing about gridisgood? It has no dependencies (well, that would be the second best thing, right after gridisgood's awesomeness.)

Anyway, install, beat the living daylights out of it, fork, pull, open an issue, you name it. And most importantly, don't forget to have fun.

Cheers.


## Installation

npm install gridisgood

## Usage

```javascript
var React = require('react');
var Grid = require('gridisgood');

var Demo = React.createClass({
    render: function () {
        return (
            <div>
                <Grid
                    baseWidth={50}
                    baseHeight={50}
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

```

## Playground

You can give gridisgood a go here: [jsFiddle](http://jsfiddle.net/jackunion/yxaaqmcg/)

Scroll the js part of the window down until you see the readable code.

![gridisgood](https://github.com/jackunion/gridisgood/blob/master/demo.png)
