var React = require('react');
var GridBlock = require('./GridBlock');
var u = require('./u');

var Grid = React.createClass({
    getInitialState: function () {
        var layout = [];
        React.Children.forEach(this.props.children, function (b, i) {
            layout.push({
                'key': i,
                'row': b.props.row,
                'col': b.props.col,
                'rowspan': b.props.rowspan,
                'colspan': b.props.colspan,
                'children': b.props.children,
                'active': false
            });
        });
        
        return {
            'layout': layout,
            'rows': u.getRowsCols(layout, 'row'),
            'cols': u.getRowsCols(layout, 'col'),
            'action': null,
            'from': {
                'row': null,
                'col': null
            },
            'placeholder': null
        }
    },
    
    updateState: function (state) {
        this.setState(state);
    },
    
    addBlock: function (e) {
        e.preventDefault();
        e.stopPropagation();
        this.updateState({
            'layout': u.compactLayout(this.state.layout.concat({
                'colspan': 1,
                'rowspan': 1,
                'row': this.state.rows - 1,
                'col': 0,
                'key': this.state.layout.length,
                'children': ''
            }))
        });
    },
    
    moveBlock: function (layout, block, row, col) {
        if (
            (this.state.from.row !== row || this.state.from.col !== col)
            && row >= 0 && row < this.state.rows
            && col >= 0 && col < this.state.cols
        ) {
            block.row = row;
            block.col = col;
            u.resolveCollisions(layout, block, this.state.from.row < row ? 0 : 1);
        }
    },
    
    resizeBlock: function (layout, block, row, col) {        
        block.rowspan = Math.max(1, row - block.row + 1);
        block.colspan = Math.max(1, col - block.col + 1);
        u.resolveCollisions(layout, block);
    },
    
    removeBlock: function (row, col) {
        this.updateState({
            'layout': u.compactLayout(this.state.layout.filter(function (b) {
                return b.row !== row || b.col !== col;
            })),
            'rows': u.getRowsCols(this.state.layout, 'row'),
            'cols': u.getRowsCols(this.state.layout, 'col')
        });
    },
    
    onMouseDown: function (e) {
        this.updateState({
            'rows': this.state.rows + 1,
            'cols': this.state.cols + 1
        });
    },
    
    onMouseUp: function (e) {
        this.updateState({
            'layout': u.compactLayout(this.state.layout),
            'action': null,
            'placeholder': null,
            'rows': u.getRowsCols(this.state.layout, 'row'),
            'cols': u.getRowsCols(this.state.layout, 'col')
        });
    },

    onMouseMove: function (e) {
        if (this.state.action) {
            var layout = u.copyLayout(this.state.layout);
            var block = u.getBlock(layout, this.state.from.row, this.state.from.col);
            var row = null;
            var col = null;
            
            if (this.state.action === 'dragging') {
                row = Math.round(
                    (this.state.placeholder.top - this.props.margins[0]) /
                    (this.props.baseHeight + this.props.margins[0])
                );
                col = Math.round(
                    (this.state.placeholder.left - this.props.margins[1]) /
                    (this.props.baseWidth + this.props.margins[1])
                );
                this.updateState({
                    'placeholder': {
                        'children': this.state.placeholder.children,
                        'top': e.pageY - this.state.placeholder.cursorY,
                        'left': e.pageX - this.state.placeholder.cursorX,
                        'width': this.state.placeholder.width,
                        'height': this.state.placeholder.height,
                        'cursorX': this.state.placeholder.cursorX,
                        'cursorY': this.state.placeholder.cursorY
                    }
                });
                this.moveBlock(layout, block, row, col);
            }
            
            if (this.state.action === 'resizing') {
                row = Math.floor(
                    (this.state.placeholder.height + this.state.placeholder.top - this.props.margins[0]) /
                    (this.props.baseHeight + this.props.margins[0])
                );
                col = Math.floor(
                    (this.state.placeholder.width + this.state.placeholder.left - this.props.margins[1]) /
                    (this.props.baseWidth + this.props.margins[1])
                );
                this.updateState({
                    'placeholder': {
                        'children': this.state.placeholder.children,
                        'top': this.state.placeholder.top,
                        'left': this.state.placeholder.left,
                        'width': Math.max(this.props.baseWidth, e.pageX - this.refs.Grid.getDOMNode().offsetLeft - this.state.placeholder.left),
                        'height': Math.max(this.props.baseHeight, e.pageY- this.refs.Grid.getDOMNode().offsetTop - this.state.placeholder.top),
                        'cursorX': this.state.placeholder.cursorX,
                        'cursorY': this.state.placeholder.cursorY
                    }
                });
                this.resizeBlock(layout, block, row, col)
            }

            this.updateState({
                'layout': u.compactLayout(layout),
                'from': {
                    'row': block.row,
                    'col': block.col
                },
                'rows': u.getRowsCols(layout, 'row') + 1,
                'cols': u.getRowsCols(layout, 'col') + 1
            });
        }
    },

    render: function () {
        var layout = this.state.layout.map(function (b) {
            return <GridBlock 
                key={b.key}
                row={b.row}
                col={b.col}
                removable={this.props.removable}
                resizable={this.props.resizable}
                active={this.state.action && this.state.from.row === b.row && this.state.from.col === b.col}
                top={(this.props.baseHeight + this.props.margins[0]) * b.row + this.props.margins[0]}
                left={(this.props.baseHeight + this.props.margins[1]) * b.col + this.props.margins[1]}
                width={(this.props.margins[1] + this.props.baseWidth) * b.colspan - this.props.margins[1]}
                height={(this.props.margins[0] + this.props.baseHeight) * b.rowspan - this.props.margins[0]}
                updateState={this.updateState}
                removeBlock={this.removeBlock}
                >{b.children}</GridBlock>
        }.bind(this))

        return (
            <div
                ref={'Grid'}
                className={'Grid'}
                onMouseMove={this.onMouseMove}
                onMouseDown={this.onMouseDown}
                onMouseUp={this.onMouseUp}
                style= {{
                        'width': this.state.cols * (this.props.baseWidth + this.props.margins[1]),
                        'height': this.state.rows * (this.props.baseHeight + this.props.margins[0])
                }}
            >
                {layout}
                
                {
                    this.state.placeholder ?
                    <div
                        className={'placeholder'}
                        style={{
                            'position': 'absolute',
                            'top': this.state.placeholder.top,
                            'left': this.state.placeholder.left,
                            'width': this.state.placeholder.width,
                            'height': this.state.placeholder.height
                        }}
                    >{this.state.placeholder.children}</div> :
                    undefined
                }
            </div>
        );
    }
});


/**--------------------------------------------------------------------------------*/

module.exports = Grid;