/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var React = __webpack_require__(1);
	var GridBlock = __webpack_require__(2);
	var u = __webpack_require__(3);

	var Grid = React.createClass({displayName: "Grid",
	    propTypes: {
	        baseWidth: React.PropTypes.number,
	        baseHeight: React.PropTypes.number,
	        handle: React.PropTypes.bool,
	        addable: React.PropTypes.bool,
	        removable: React.PropTypes.bool,
	        resizable: React.PropTypes.bool,
	        rowsExpandable: React.PropTypes.bool,
	        colsExpandable: React.PropTypes.bool,
	        margins: React.PropTypes.arrayOf(React.PropTypes.number)
	    },

	    getDefaultProps: function () {
	        return {
	            baseWidth: 100,
	            baseHeight: 100,
	            handle: false,
	            addable: false,
	            removable: true,
	            resizable: true,
	            rowsExpandable: true,
	            colsExpandable: true,
	            margins: [10, 10]
	        }
	    },

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
	    
	    updateState: function (state) {
	        this.setState(state);
	    },
	    
	    addBlock: function (e) {
	        e.preventDefault();
	        e.stopPropagation();
	        this.updateState({
	            'layout': u.compactLayout(this.state.layout.concat({
	                'key': this.state.layout.reduce(function (prev, cur) { return Math.max(prev, cur.key + 1) }, 0),
	                'row': this.state.rows - 1,
	                'col': 0,
	                'colspan': 1,
	                'rowspan': 1,
	                'children': '',
	                'active': false
	                
	            }))
	        });
	    },
	    
	    moveBlock: function (layout, block, row, col) {
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
	            'rows': u.getRowsCols(this.state.layout, 'row') + (this.props.addable ? 1 : 0),
	            'cols': u.getRowsCols(this.state.layout, 'col')
	        });
	    },
	    
	    onMouseUp: function (e) {
	        this.updateState({
	            'layout': u.compactLayout(this.state.layout),
	            'action': null,
	            'placeholder': null,
	            'rows': u.getRowsCols(this.state.layout, 'row') + (this.props.addable ? 1 : 0),
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

	    render: function () {
	        return (
	            React.createElement("div", {
	                ref: 'Grid', 
	                className: 'Grid', 
	                onMouseMove: this.onMouseMove, 
	                onMouseUp: this.onMouseUp, 
	                style: {
	                    'width': this.state.cols * (this.props.baseWidth + this.props.margins[1]) + this.props.margins[1],
	                    'height': this.state.rows * (this.props.baseHeight + this.props.margins[0]) + this.props.margins[0]
	                }
	            }, 
	                
	                    this.state.layout.map(function (b) {
	                        return React.createElement(GridBlock, {
	                            key: b.key, 
	                            row: b.row, 
	                            col: b.col, 
	                            width: (this.props.margins[1] + this.props.baseWidth) * b.colspan - this.props.margins[1], 
	                            height: (this.props.margins[0] + this.props.baseHeight) * b.rowspan - this.props.margins[0], 
	                            top: (this.props.baseHeight + this.props.margins[0]) * b.row + this.props.margins[0], 
	                            left: (this.props.baseWidth + this.props.margins[1]) * b.col + this.props.margins[1], 
	                            handle: this.props.handle, 
	                            removable: this.props.removable, 
	                            resizable: this.props.resizable, 
	                            active: this.state.action && this.state.from.row === b.row && this.state.from.col === b.col, 
	                            updateState: this.updateState, 
	                            removeBlock: this.removeBlock
	                        }, b.children)
	                    }.bind(this)), 
	                
	                
	                
	                    this.state.placeholder ?
	                    React.createElement("div", {
	                        className: 'placeholder', 
	                        style: {
	                            'position': 'absolute',
	                            'top': this.state.placeholder.top,
	                            'left': this.state.placeholder.left,
	                            'width': this.state.placeholder.width,
	                            'height': this.state.placeholder.height
	                        }
	                    }, 
	                        
	                            this.props.handle ?
	                            React.createElement("div", {
	                                className: 'dragHandle', 
	                                style: {
	                                    'width': this.state.placeholder.width
	                                }
	                            }) :
	                            undefined, 
	                        
	                        React.createElement("div", {className: 'blockContent'}, 
	                            this.state.placeholder.children
	                        )
	                    ) :
	                    undefined, 
	                

	                
	                    (this.props.addable && !this.state.action) ?
	                    React.createElement("div", {
	                        className: 'addBlock', 
	                        onMouseDown: this.addBlock, 
	                        style: {
	                            'position': 'absolute',
	                            'width': this.props.baseWidth,
	                            'height': this.props.baseHeight,
	                            'top': (this.props.baseHeight + this.props.margins[0]) * (this.state.rows - 1) + this.props.margins[0],
	                            'left': this.props.margins[1]
	                        }
	                    }) :
	                    undefined
	                
	            )
	        );
	    }
	});

	module.exports = Grid;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = React;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var React = __webpack_require__(1);

	var GridBlock = React.createClass({displayName: "GridBlock",
	    propTypes: {
	        row: React.PropTypes.number,
	        col: React.PropTypes.number,
	        width: React.PropTypes.number,
	        height: React.PropTypes.number,
	        top: React.PropTypes.number,
	        left: React.PropTypes.number,
	        handle: React.PropTypes.bool,
	        removable: React.PropTypes.bool,
	        resizable: React.PropTypes.bool,
	        active: React.PropTypes.bool,
	        updateState: React.PropTypes.func,
	        removeBlock: React.PropTypes.func
	    },

	    _buildIcon: function (iconType) {
	        return (
	            React.createElement("span", {
	                ref: iconType + 'Block', 
	                className: iconType + 'Block', 
	                hidden: true, 
	                onMouseDown: this[iconType + 'Block']}
	            )
	        )
	    },

	    updateParentState: function (e, action) {
	        this.props.updateState({
	            'action': action,
	            'from': {
	                'row': this.props.row,
	                'col': this.props.col
	            },
	            'placeholder': {
	                'children': this.props.children,
	                'width': this.props.width,
	                'height': this.props.height,
	                'top': this.props.top,
	                'left': this.props.left,
	                'cursorX': e.pageX - this.props.left,
	                'cursorY': e.pageY - this.props.top
	            }
	        });
	    },
	    
	    removeBlock: function (e) {
	        e.preventDefault();
	        e.stopPropagation();
	        this.props.removeBlock(this.props.row, this.props.col);
	    },
	    
	    resizeBlock: function (e) {
	        e.preventDefault();
	        e.stopPropagation();
	        this.updateParentState(e, 'resizing');
	    },
	    
	    onMouseDown: function (e) {
	        this.updateParentState(e, 'dragging');
	    },
	    
	    onMouseOver: function (e) {
	        if (this.props.removable) this.refs.removeBlock.getDOMNode().hidden = false;
	        if (this.props.resizable) this.refs.resizeBlock.getDOMNode().hidden = false;
	    },
	    
	    onMouseLeave: function (e) {
	        if (this.props.removable && !this.props.active) this.refs.removeBlock.getDOMNode().hidden = true;
	        if (this.props.resizable && !this.props.active) this.refs.resizeBlock.getDOMNode().hidden = true;
	    },

	    render: function () {
	        return (
	            React.createElement("div", {
	                ref: 'block', 
	                className: this.props.active ? 'block active' : 'block', 
	                onMouseDown: this.props.handle ? undefined : this.onMouseDown, 
	                onMouseOver: this.onMouseOver, 
	                onMouseLeave: this.onMouseLeave, 
	                style: {
	                    'position': 'absolute',
	                    'width': this.props.width,
	                    'height': this.props.height,
	                    'top': this.props.top,
	                    'left': this.props.left
	                }
	            }, 
	                
	                    this.props.handle ?
	                    React.createElement("div", {
	                        className: 'dragHandle', 
	                        onMouseDown: this.onMouseDown, 
	                        style: {
	                            'width': this.props.width
	                        }
	                    }) :
	                    undefined, 
	                

	                
	                    this.props.removable ?
	                    this._buildIcon('remove') :
	                    undefined, 
	                
	                
	                React.createElement("div", {className: 'blockContent'}, 
	                    this.props.children
	                ), 
	                
	                
	                    this.props.resizable ?
	                    this._buildIcon('resize') :
	                    undefined
	                
	            )

	        );
	    }
	});

	module.exports = GridBlock;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var u = {

	    copyLayout: function(layout) {
	        return layout.map(function (block, i) {
	            var b = {};
	            Object.keys(block).forEach(function (key) {
	                b[key] = block[key];
	            });
	            return b;
	        });
	    },

	    getRowsCols: function (layout, arg) {
	        return layout.reduce(function (prev, cur) {
	            return Math.max(prev, cur[arg] + cur[arg + 'span']);
	        }, 1);
	    },

	    exclude: function (layout, block) {
	        return layout.filter(function (b) {
	            return b !== block;
	        });
	    },

	    getBlock: function (layout, row, col) {
	        return layout.filter(function (b) {
	            return b.row === row && b.col === col;
	        })[0];
	    },

	    getCollisions: function (layout, block) {
	        return layout.filter(function (b) {
	            return b !== block && !(
	                b.row + b.rowspan <= block.row ||
	                b.row >= block.row + block.rowspan ||
	                b.col + b.colspan <= block.col ||
	                b.col >= block.col + block.colspan
	            );
	        });
	    },

	    doesBlockCollide: function (layout, block) {
	        return u.getCollisions(layout, block).length > 0;
	    },

	    compactLayout: function (layout) {
	        var rows = u.getRowsCols(layout, 'row');
	        var cols = u.getRowsCols(layout, 'col');
	        for (var i = 0; i < rows; ++i) {
	            for (var j = 0; j < cols; ++j) {
	                var b = u.getBlock(layout, i, j);
	                
	                if (b !== undefined) {
	                    for (var r = b.row - 1; r >= 0; --r) {
	                        b.row = r;
	                        if (u.doesBlockCollide(layout, b)) {
	                            b.row += 1;
	                            break;
	                        }
	                    }
	                }
	            }
	        }
	        
	        return layout;
	    },

	    resolveCollisions: function (layout, block, depth) {
	        if (u.doesBlockCollide(layout, block)) {
	            var collidingBlocks = u.getCollisions(layout, block);
	            var minRow = Math.min.apply(null, collidingBlocks.map(function(b) {
	                return b.row;
	            }));
	            var blocks = collidingBlocks.filter(function(b) {
	                return b.row === minRow || b.row === block.row;
	            });
	            
	            blocks.forEach(function (b) {
	                if (depth === 0 && !u.doesBlockCollide(
	                    u.exclude(layout, block),
	                    {
	                        'row': Math.max(b.row - Math.max(b.rowspan, block.rowspan), 0),
	                        'col': b.col,
	                        'rowspan': b.rowspan,
	                        'colspan': b.colspan
	                    }
	                )) b.row = Math.max(b.row - Math.max(b.rowspan, block.rowspan), 0);

	                else {
	                    for(var i = 0, j = block.row + block.rowspan - b.row; i < j; ++i) {
	                        b.row += 1;
	                        u.resolveCollisions(u.exclude(layout, block), b, depth + 1);
	                    }
	                }
	            })
	        }
	    }

	}

	module.exports = u;

/***/ }
/******/ ]);