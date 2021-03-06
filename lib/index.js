// Methods
import attach from './methods/attach';
import debouncedScroll from './methods/debounced-scroll';
import destroy from './methods/destroy';
import off from './methods/off';
import on from './methods/on';

// Helpers
import observeDOM from './helpers/observe-dom';
import inViewport from './helpers/in-viewport';

/**
 * Detects wether DOM nodes enter or leave the viewport
 *
 * @constructor
 * @param {object} options The configuration object
 */
function OnScreen(options = { tolerance: 0, debounce: 100, container: window }) {
    this.options = {};
    this.trackedElements = {};

    Object.defineProperties(this.options, {
        container: {
            configurable: false,
            enumerable: false,
            get() {
                let container;

                if (typeof options.container === 'string') {
                    container = document.querySelector(options.container);
                } else if (options.container instanceof HTMLElement) {
                    container = options.container;
                }

                return container || window;
            },
            set(value) {
                options.container = value;
            }
        },
        debounce: {
            get() {
                return parseInt(options.debounce, 10) || 100;
            },
            set(value) {
                options.debounce = value;
            }
        },
        tolerance: {
            get() {
                if (typeof options.tolerance === 'number') {
                    const tolerance = parseInt(options.tolerance, 10) || 0;
                    return {
                        top: tolerance,
                        right: tolerance,
                        bottom: tolerance,
                        left: tolerance
                    };
                }

                return {
                    top: parseInt(options.tolerance.top, 10) || 0,
                    right: parseInt(options.tolerance.right, 10) || 0,
                    bottom: parseInt(options.tolerance.bottom, 10) || 0,
                    left: parseInt(options.tolerance.left, 10) || 0
                };
            },
            set(value) {
                if (typeof value === 'number') {
                    options.tolerance = {
                        top: value,
                        right: value,
                        bottom: value,
                        left: value
                    };
                } else {
                    options.tolerance = {
                        top: value.top || 0,
                        right: value.right || 0,
                        bottom: value.bottom || 0,
                        left: value.left || 0
                    };
                }
            }
        }
    });

    Object.defineProperty(this, '_scroll', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: this._debouncedScroll.call(this)
    });

    observeDOM(document.querySelector('body'), () => {
        Object.keys(this.trackedElements).forEach((element) => {
            this.on('enter', element);
            this.on('leave', element);
        });
    });

    this.attach();
}

Object.defineProperties(OnScreen.prototype, {
    _debouncedScroll: {
        configurable: false,
        writable: false,
        enumerable: false,
        value: debouncedScroll
    },
    attach: {
        configurable: false,
        writable: false,
        enumerable: false,
        value: attach
    },
    destroy: {
        configurable: false,
        writable: false,
        enumerable: false,
        value: destroy
    },
    off: {
        configurable: false,
        writable: false,
        enumerable: false,
        value: off
    },
    on: {
        configurable: false,
        writable: false,
        enumerable: false,
        value: on
    }
});

OnScreen.check = inViewport;

export default OnScreen;
