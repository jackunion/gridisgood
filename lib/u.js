var u = {

    copyLayout: function(layout) {
        return layout.map(function (block) { return Object.assign({}, block) });
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
