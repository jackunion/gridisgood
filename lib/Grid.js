var React = require('react');
var GridBlock = require('./GridBlock');
var u = require('./u');

var Grid = React.createClass({
    propTypes: {
        baseWidth: React.PropTypes.number,
        baseHeight: React.PropTypes.number,
        margins: React.PropTypes.arrayOf(React.PropTypes.number),
        handle: React.PropTypes.bool,
        addable: React.PropTypes.bool,
        removable: React.PropTypes.bool,
        resizable: React.PropTypes.bool,
        rowsExpandable: React.PropTypes.bool,
        colsExpandable: React.PropTypes.bool,
        buildFromArray: React.PropTypes.oneOfType([
            React.PropTypes.bool,
            React.PropTypes.arrayOf(React.PropTypes.object)
        ]),
    },

    getDefaultProps: function() {
        return {
            baseWidth: 100,
            baseHeight: 100,
            margins: [10, 10],
            handle: false,
            addable: false,
            removable: true,
            resizable: true,
            rowsExpandable: true,
            colsExpandable: true,
            buildFromArray: false
        }
    },

    getInitialState: function() {
        var layout = [];
        function layoutPush(obj, i) {
            layout.push({
                'key': i,
                'row': obj.row,
                'col': obj.col,
                'rowspan': obj.rowspan,
                'colspan': obj.colspan,
                'children': obj.children,
                'active': false
            });
        };

        if (this.props.buildFromArray) {
            this.props.buildFromArray.forEach(function(b, i) {
                layoutPush(b, i);
            });
        }
        else {
            React.Children.forEach(this.props.children, function(b, i) {
                layoutPush(b.props, i);
            });
        }
        
        return {
            'layout': u.compactLayout(layout),
            'rows': u.getRowsCols(layout, 'row') + (this.props.addable ? 1 : 0),
            'cols': u.getRowsCols(layout, 'col'),
            'action': null,
            'from': {
                'row': null,
                'col': null
            },
            'placeholder': null
        }
    },

    serialize: function() {
        return this.state.layout.map(function(b) {
            var obj = {};
            Object.keys(b).forEach(function(k) {
                if (k !== 'key' && k !== 'active') obj[k] = b[k];
            });
            return obj;
        });
    },
    
    updateState: function(state) {
        this.setState(state);
    },
    
    addBlock: function(e) {
        e.preventDefault();
        e.stopPropagation();
        this.updateState({
            'layout': u.compactLayout(this.state.layout.concat({
                'key': this.state.layout.reduce(function(prev, cur) { return Math.max(prev, cur.key + 1) }, 0),
                'row': this.state.rows - 1,
                'col': 0,
                'colspan': 1,
                'rowspan': 1,
                'children': '',
                'active': false
                
            }))
        });
    },
    
    moveBlock: function(layout, block, row, col) {
        if (
            (this.state.from.row !== row || this.state.from.col !== col)
            && row >= 0 && row < this.state.rows
            && col >= 0 && col + block.colspan <= this.state.cols
        ) {
            block.row = row;
            block.col = col;
            u.resolveCollisions(layout, block, this.state.from.row < row ? 0 : 1);
        }
    },
    
    resizeBlock: function(layout, block, row, col) {        
        block.rowspan = Math.max(1, row - block.row + 1);
        block.colspan = Math.max(1, col - block.col + 1);
        u.resolveCollisions(layout, block);
    },
    
    removeBlock: function(row, col) {
        this.updateState({
            'layout': u.compactLayout(this.state.layout.filter(function(b) {
                return b.row !== row || b.col !== col;
            })),
            'rows': u.getRowsCols(this.state.layout, 'row') + (this.props.addable ? 1 : 0),
            'cols': u.getRowsCols(this.state.layout, 'col')
        });
    },
    
    onMouseUp: function(e) {
        this.updateState({
            'layout': u.compactLayout(this.state.layout),
            'action': null,
            'placeholder': null,
            'rows': u.getRowsCols(this.state.layout, 'row') + (this.props.addable ? 1 : 0),
            'cols': u.getRowsCols(this.state.layout, 'col')
        });
    },

    onMouseMove: function(e) {
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
                        'width': this.state.placeholder.width,
                        'height': this.state.placeholder.height,
                        'top': e.pageY - this.state.placeholder.cursorY,
                        'left': e.pageX - this.state.placeholder.cursorX,
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
                        'width': Math.max(this.props.baseWidth, e.pageX - this.refs.Grid.getDOMNode().offsetLeft - this.state.placeholder.left),
                        'height': Math.max(this.props.baseHeight, e.pageY- this.refs.Grid.getDOMNode().offsetTop - this.state.placeholder.top),
                        'top': this.state.placeholder.top,
                        'left': this.state.placeholder.left,
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
                'rows': u.getRowsCols(layout, 'row') + (
                    (this.props.addable && this.props.rowsExpandable) ? 2 :
                    (this.props.addable || this.props.rowsExpandable) ? 1 : 0),
                'cols': u.getRowsCols(layout, 'col') + (this.props.colsExpandable ? 1 : 0)
            });
        }
    },

    render: function() {
        return (
            <div
                ref={'Grid'}
                className={'Grid'}
                onMouseMove={this.onMouseMove}
                onMouseUp={this.onMouseUp}
                style= {{
                    'width': this.state.cols * (this.props.baseWidth + this.props.margins[1]) + this.props.margins[1],
                    'height': this.state.rows * (this.props.baseHeight + this.props.margins[0]) + this.props.margins[0]
                }}
            >
                {
                    this.state.layout.map(function(b) {
                        return <GridBlock 
                            key={b.key}
                            row={b.row}
                            col={b.col}
                            width={(this.props.margins[1] + this.props.baseWidth) * b.colspan - this.props.margins[1]}
                            height={(this.props.margins[0] + this.props.baseHeight) * b.rowspan - this.props.margins[0]}
                            top={(this.props.baseHeight + this.props.margins[0]) * b.row + this.props.margins[0]}
                            left={(this.props.baseWidth + this.props.margins[1]) * b.col + this.props.margins[1]}
                            handle={this.props.handle}
                            removable={this.props.removable}
                            resizable={this.props.resizable}
                            active={this.state.action && this.state.from.row === b.row && this.state.from.col === b.col}
                            updateState={this.updateState}
                            removeBlock={this.removeBlock}
                        >{b.children}</GridBlock>
                    }.bind(this))
                }
                
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
                    >
                        {
                            this.props.handle ?
                            <div
                                className={'dragHandle'}
                                style={{
                                    'width': this.state.placeholder.width
                                }}
                            ></div> :
                            undefined
                        }
                        <div className={'blockContent'}>
                            {this.state.placeholder.children}
                        </div>
                    </div> :
                    undefined
                }

                {
                    (this.props.addable && !this.state.action) ?
                    <div
                        className={'addBlock'}
                        onMouseDown={this.addBlock}
                        style={{
                            'position': 'absolute',
                            'width': this.props.baseWidth,
                            'height': this.props.baseHeight,
                            'top': (this.props.baseHeight + this.props.margins[0]) * (this.state.rows - 1) + this.props.margins[0],
                            'left': this.props.margins[1]
                        }}
                    ></div> :
                    undefined
                }
            </div>
        );
    }
});

module.exports = Grid;