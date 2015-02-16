var React = require('react');

var GridBlock = React.createClass({
    propTypes: {},

    getDefaultProps: function () {},

    _buildIcon: function (iconType) {
        return (
            <span
                ref={iconType + 'Block'}
                className={iconType + 'Block'}
                hidden={true}
                onMouseDown={this[iconType + 'Block']}
            />
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
                'top': this.props.top,
                'left': this.props.left,
                'width': this.props.width,
                'height': this.props.height,
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
            <div
                ref={'block'}
                className={this.props.active ? 'block active' : 'block'}
                onMouseDown={this.onMouseDown}
                onMouseOver={this.onMouseOver}
                onMouseLeave={this.onMouseLeave}
                style={{
                    'position': 'absolute',
                    'width': this.props.width,
                    'height': this.props.height,
                    'top': this.props.top,
                    'left': this.props.left
                }}
            >
                {
                    this.props.removable ?
                    this._buildIcon('remove') :
                    undefined
                }
                
                <div className={'blockContent'}>
                    {this.props.children}
                </div>
                
                {
                    this.props.resizable ?
                    this._buildIcon('resize') :
                    undefined
                }
            </div>

        );
    }
});

module.exports = GridBlock;