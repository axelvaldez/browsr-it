(function (window, document) {
    'use strict';
    // I didn't use addEventListener because IE8 compatibility
    document.getElementById('results').onclick = function (e) {
        if (e.target && e.target.nodeName === 'IMG') {
            var url = e.target.src;
            window.open(url, '_blank');
        }
    };
}(window, window.document));