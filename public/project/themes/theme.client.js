(function () {
    angular
        .module("WebMessenger")
        .config(function ($mdThemingProvider) {
            $mdThemingProvider.theme('registerTheme')
                .primaryPalette('orange', {
                    'default': '400', // by default use shade 400 from the pink palette for primary intentions
                    'hue-1': '100', // use shade 100 for the <code>md-hue-1</code> class
                    'hue-2': '600', // use shade 600 for the <code>md-hue-2</code> class
                    'hue-3': 'A100' // use shade A100 for the <code>md-hue-3</code> class
                })
                // If you specify less than all of the keys, it will inherit from the
                // default shades
                .accentPalette('purple', {
                    'default': '200' // use shade 200 for default, and keep all other shades the same
                });
        })
        .config(function ($mdThemingProvider) {
            $mdThemingProvider.theme('loginTheme')
                .primaryPalette('green')
                .accentPalette('deep-purple')
                .warnPalette('red');
        })
        .config(function ($mdThemingProvider) {
            $mdThemingProvider.theme('darkForm')
                .primaryPalette('deep-purple')
                .warnPalette('red')
                .dark();
        })
        .config(function ($mdThemingProvider) {
            $mdThemingProvider.theme('lightForm')
                .primaryPalette('deep-purple')
                .warnPalette('red');
        })
        .config(function ($mdThemingProvider) {
            $mdThemingProvider.theme('darkChat')
                .primaryPalette('deep-purple')
                .warnPalette('red');
        })
        .config(function ($mdThemingProvider) {
            $mdThemingProvider.theme('buttonTheme')
                .primaryPalette('brown', {
                    'default': '500', // by default use shade 400 from the pink palette for primary intentions
                    'hue-1': '100', // use shade 100 for the <code>md-hue-1</code> class
                    'hue-2': '700', // use shade 600 for the <code>md-hue-2</code> class
                    'hue-3': '800' // use shade A100 for the <code>md-hue-3</code> class
                })
                // If you specify less than all of the keys, it will inherit from the
                // default shades
                .accentPalette('yellow', {
                    'default': 'A200' // use shade 200 for default, and keep all other shades the same
                })
                .warnPalette('blue', {
                    'default': '500',
                    'hue-1': '200',
                    'hue-2': '800'
                });
        })
        .config(function ($mdThemingProvider) {
            $mdThemingProvider.theme('cardTheme')
                .primaryPalette('brown', {
                    'default': '500', // by default use shade 400 from the pink palette for primary intentions
                    'hue-1': '100', // use shade 100 for the <code>md-hue-1</code> class
                    'hue-2': '700', // use shade 600 for the <code>md-hue-2</code> class
                    'hue-3': '800' // use shade A100 for the <code>md-hue-3</code> class
                })
                // If you specify less than all of the keys, it will inherit from the
                // default shades
                .accentPalette('yellow', {
                    'default': 'A200' // use shade 200 for default, and keep all other shades the same
                })
                .warnPalette('blue', {
                    'default': '500',
                    'hue-1': '200',
                    'hue-2': '800'
                });
        })
        .config(function ($mdThemingProvider) {
            $mdThemingProvider.theme('dorTheme')
                .primaryPalette('deep-orange', {
                    'default': '500', // by default use shade 400 from the pink palette for primary intentions
                    'hue-1': '100', // use shade 100 for the <code>md-hue-1</code> class
                    'hue-2': '700', // use shade 600 for the <code>md-hue-2</code> class
                    'hue-3': '800' // use shade A100 for the <code>md-hue-3</code> class
                })
                // If you specify less than all of the keys, it will inherit from the
                // default shades
                .accentPalette('blue', {
                    'default': 'A200' // use shade 200 for default, and keep all other shades the same
                })
                .warnPalette('red', {
                    'default': '500',
                    'hue-1': '200',
                    'hue-2': '800'
                });
        });
})();