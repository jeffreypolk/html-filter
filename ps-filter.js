(function ($) {

    var _optionsStoreName = 'options-store';

    var _getOptions = function (elem) {
        return elem.data(_optionsStoreName);
    }
    var _setOptions = function (elem, options) {
        elem.data(_optionsStoreName, options);
    }

    var _filter = function() {

        var $this = $(this);
        var options = _getOptions($this);
        var txt = $this.val();
        var item;

        // do the showing/hiding
        $('.' + options.filterClass).each(function () {
            item = $(this);
            if (item.text().toUpperCase().indexOf(txt.toUpperCase()) != -1) {
                item.removeClass('hidden');

                if (options.highlight) {
                    if ($.fn.highlight) {
                        item.highlight(txt);
                        item.find('*').highlight(txt);
                    } else {
                        $.error('The highlight plugin is not present');
                    }
                    
                }
            } else {
                item.addClass('hidden');
            }
        });

        // if these are rows in a table, do we need to restripe the table?
        if (item) {
            if (item.prop('tagName') === 'TR') {
                var table = item.closest('table');
                if (table.hasClass('table-striped')) {
                    //replace bootstrap striping with filter striping
                    table.removeClass('table-striped');
                    table.addClass('ps-filter-striped');
                }
                // should we restripe?
                if (table.hasClass('ps-filter-striped')) {
                    $('.' + options.filterClass + ':not(.hidden)').each(function (index) {
                        $(this).toggleClass('ps-filter-stripe', !(index & 1));
                    });
                }
            }
        }
    }

    var methods = {

        init: function (options) {
            // Establish our default settings
            var opt = $.extend({
                filterClass: 'ps-filter-item', 
                highlight: false
            }, options);

            return this.each(function () {

                // get ref
                var $this = $(this);

                // store the settings on the element
                _setOptions($this, opt);

                // do stuff
                $this.on('keyup', _filter);

            });

        }
    };

    $.fn.psFilter = function (methodOrOptions) {
        
        if (methods[methodOrOptions]) {
            return methods[methodOrOptions].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof methodOrOptions === 'object' || !methodOrOptions) {
            // Default to "init"
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + methodOrOptions + ' does not exist on jQuery.plugin');
        }       
    }

    
}(jQuery));


$(document).ready(function () {
    // auto initialize
    $('.ps-filter').each(function () {
        var $this = $(this);
        $this.psFilter({
            filterClass: $this.data('filterclass'),
            highlight: $this.data('filterhighlight')
        });
    });
});
