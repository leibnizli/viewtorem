/**
 * viewtorem plugin based on postcss
 * https://github.com/stormtea123/viewtorem
 */

'use strict';

function toFixed(number, precision) {
    var multiplier = Math.pow(10, precision + 1),
        wholeNumber = Math.floor(number * multiplier);
    return Math.round(wholeNumber / 10) * 10 / multiplier;
}
module.exports = function(options) {
    return function(css) {
        options = options || {};
        var rootValue = options.root_value || 20;
        var unitPrecision = options.unit_precision || 5;
        var propWhiteList = options.prop_white_list || ['width', "height"];
        var replace = (options.replace === false) ? false : true;
        var mediaQuery = options.media_query || false;

        var pxRegex = /(\d*\.?\d+)px/ig;

        var pxReplace = function(m, $1) {
            return toFixed((parseFloat($1) / rootValue), unitPrecision) + 'rem';
        };
        css.eachDecl(function(decl, i) {
            var value = decl.value;
            if (propWhiteList.indexOf(decl.prop) === -1) return;
            if (value.indexOf('px') !== -1) {
                value = value.replace(pxRegex, pxReplace);
                var remExists = decl.parent.some(function(i) {
                    return i.prop == decl.prop && i.value == value
                });
                if (remExists) return;
                if (replace) {
                    decl.value = value;
                } else {
                    decl.parent.insertAfter(i, decl.clone({
                        value: value
                    }));
                }

            }
        });
        if (mediaQuery) {
            css.eachAtRule(function(rule) {
                if (rule.type !== 'atrule' && rule.name !== 'media') return;
                if (rule.params.indexOf('px') !== -1) {
                    rule.params = rule.params.replace(pxRegex, pxReplace);
                }
            });
        }
    };
};