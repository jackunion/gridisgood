var u = {

    copyLayout: function(layout) {
        return layout.map(function (block) {
            return Object.assign({}, block);
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
        layout.forEach(function(block) {
            u.resolveCollisions(layout, block, 0);
            while (block.row > 0 && !u.doesBlockCollide(u.exclude(layout, block), Object.assign({}, block, {'row': block.row - 1}))) {
                block.row -= 1;
            }
        });
        return layout.sort(function(a, b) {return a.row - b.row});
    },

    resolveCollisions: function (layout, block, depth) {
        var collisions = u.getCollisions(layout, block).sort(function(a, b) { return a.row - b.row });
        collisions.forEach(function(b, i, arr) {
            var prev = arr[i-1] || block;
            b.row = prev.row + prev.rowspan;
        });
    }

}

module.exports = u;
