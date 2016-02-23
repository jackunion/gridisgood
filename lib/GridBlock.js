var React = require('react');

var GridBlock = React.createClass({
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
        if (this.props.removable) this.refs.removeBlock.hidden = false;
        if (this.props.resizable) this.refs.resizeBlock.hidden = false;
    },
    
    onMouseLeave: function (e) {
        if (this.props.removable && !this.props.active) this.refs.removeBlock.hidden = true;
        if (this.props.resizable && !this.props.active) this.refs.resizeBlock.hidden = true;
    },

    render: function () {
        return (
            <div
                ref={'block'}
                className={this.props.active ? 'block active' : 'block'}
                onMouseDown={this.props.handle ? undefined : this.onMouseDown}
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
                    this.props.handle ?
                    <div
                        className={'dragHandle'}
                        onMouseDown={this.onMouseDown}
                        style={{
                            'width': this.props.width
                        }}
                    ></div> :
                    undefined
                }

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