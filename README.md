# gridisgood

gridisgood is yet another grid system, heavily inspired by [gridster.js](http://gridster.net/).

Unlike [React-Grid-Layout](https://github.com/STRML/react-grid-layout), gridisgood does not provide drag functionality per se, using different approach to make it feel draggable. If at some point it turns out that gridisgood doesn't quite fit your needs, go check [React-Grid-Layout](https://github.com/STRML/react-grid-layout) out.

The best thing about gridisgood is that it has no dependencies (except for React itself.)

Anyway, install, beat the living daylights out of it, fork, pull, open an issue, you name it. And most importantly, don't forget to have fun.

Cheers.


## Installation

npm install gridisgood

## Basic Usage

```javascript
var React = require('react');
var ReactDOM = require('react-dom');
var Grid = require('gridisgood');

var Demo = React.createClass({
    render: function() {
        return (
            <div>
                <Grid
                    baseWidth={100}
                    baseHeight={100}
                    margins={[10, 10]}
                    handle={true}
                    addable={false}
                    removable={true}
                    resizable={true}
                    rowsExpandable={true}
                    colsExpandable={true}
                    // buildFromArray is an optional prop
                    // Use either it or nested divs i.e. this.props.children
                    // buildFromArray={[{'row':0,'col':0,'rowspan':1,'colspan':3,'children':"1"}]}
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

ReactDOM.render(
    <Demo />,
    document.body
);

```

`buildFromArray` is an optional prop which must be an array of objects with at least `row`, `col`, `rowspan` and `colspan` properties defined.
You can use either it or nested divs i.e. `this.props.children`. If both are provided, `buildFromArray` prop is used.

## Serialization

Define React's `ref` attribute on the Grid component. You can then access component's `serialize` method as you would usually do. The method returns an array of objects representing the current layout. Combined with `buildFromArray` prop that array can be used to restore the layout later on.

```javascript
// ...
var Serializable = React.createClass({
    serialize: function() {
        console.log(this.refs.SerializableGrid.serialize());
    },
    
    render: function() {
        return (
            <div>
                <Grid
                    ref='SerializableGrid'
                    baseWidth={100}
                    baseHeight={100}
                    margins={[10, 10]}
                    // ...
                    // ...
                >
                </Grid>
                <button onClick={this.serialize}>Serialize</button>
            </div>

```

## Playground

You can give gridisgood a go here: [jsFiddle](http://jsfiddle.net/jackunion/z1jpmtmL/)

![gridisgood](https://github.com/jackunion/gridisgood/blob/master/demo.png)
