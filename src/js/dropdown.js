/**
 * MUI CSS/JS dropdown module
 * @module dropdowns
 */

'use strict';


var jqLite = require('./lib/jqLite'),
    util = require('./lib/util'),
    animationHelpers = require('./lib/animationHelpers'),
    attrKey = 'data-mui-toggle',
    attrSelector = '[data-mui-toggle="dropdown"]',
    openClass = 'mui--is-open',
    menuClass = 'mui-dropdown__menu',
    upClass = 'mui-dropdown--up',
    rightClass = 'mui-dropdown--right',
    leftClass = 'mui-dropdown--left',
    bottomClass = 'mui-dropdown__menu--bottom';


/**
 * Initialize toggle element.
 * @param {Element} toggleEl - The toggle element.
 */
function initialize(toggleEl) {
  // check flag
  if (toggleEl._muiDropdown === true) return;
  else toggleEl._muiDropdown = true;

  // use type "button" to prevent form submission by default
  var tagName = toggleEl.tagName;
  if ((tagName === 'INPUT' || tagName === 'BUTTON')
      && !toggleEl.hasAttribute('type')) {
    toggleEl.type = 'button';
  }

  // attach click handler
  jqLite.on(toggleEl, 'click', clickHandler);
}


/**
 * Handle click events on dropdown toggle element.
 * @param {Event} ev - The DOM event
 */
function clickHandler(ev) {
  // only left clicks
  if (ev.button !== 0) return;

  var toggleEl = this;
  
  // exit if toggle button is disabled
  if (toggleEl.getAttribute('disabled') !== null) return;

  // toggle dropdown
  toggleDropdown(toggleEl);
}


/**
 * Toggle the dropdown.
 * @param {Element} toggleEl - The dropdown toggle element.
 */
function toggleDropdown(toggleEl) {
  var wrapperEl = toggleEl.parentNode,
      menuEl = toggleEl.nextElementSibling,
      doc = wrapperEl.ownerDocument;

  // exit if no menu element
  if (!menuEl || !jqLite.hasClass(menuEl, menuClass)) {
    return util.raiseError('Dropdown menu element not found');
  }

  // method to close dropdown
  function closeDropdownFn() {
    jqLite.removeClass(menuEl, openClass);
      
    // remove event handlers
    jqLite.off(doc, 'click', closeDropdownFn);
    jqLite.off(doc, 'keydown', handleKeyDownFn);
  }

  // close dropdown on escape key press
  function handleKeyDownFn(ev) {
    var key = ev.key;
    if (key === 'Escape' || key === 'Esc') closeDropdownFn();
  }

  // method to open dropdown
  function openDropdownFn() {
    // position menu element below toggle button
    var wrapperRect = wrapperEl.getBoundingClientRect(),
        toggleRect = toggleEl.getBoundingClientRect();

    // menu position
    if (jqLite.hasClass(wrapperEl, upClass)) {
      // up
      jqLite.css(menuEl, {
        'bottom': toggleRect.height + toggleRect.top - wrapperRect.top + 'px'
      });
    } else if (jqLite.hasClass(wrapperEl, rightClass)) {
      // right
      jqLite.css(menuEl, {
        'left': toggleRect.width + 'px',
        'top': toggleRect.top - wrapperRect.top + 'px'
      });
    } else if (jqLite.hasClass(wrapperEl, leftClass)) {
      // left
      jqLite.css(menuEl, {
        'right': toggleRect.width + 'px',
        'top': toggleRect.top - wrapperRect.top + 'px'
      });
    } else {
      // down
      jqLite.css(menuEl, {
        'top': toggleRect.top - wrapperRect.top + toggleRect.height + 'px'
      });
    }

    // menu alignment
    if (jqLite.hasClass(menuEl, bottomClass)) {
      jqLite.css(menuEl, {
        'top': 'auto',
        'bottom': toggleRect.top - wrapperRect.top + 'px'
      });
    }
    
    // add open class to wrapper
    jqLite.addClass(menuEl, openClass);

    setTimeout(function() {
      // close dropdown when user clicks outside of menu or hits escape key
      jqLite.on(doc, 'click', closeDropdownFn);
      jqLite.on(doc, 'keydown', handleKeyDownFn);
    }, 0);
  }

  // toggle dropdown
  if (jqLite.hasClass(menuEl, openClass)) closeDropdownFn();
  else openDropdownFn();
}

  
/** Define module API */
module.exports = {
  /** Initialize module listeners */
  initListeners: function() {
    // markup elements available when method is called
    var elList = document.querySelectorAll(attrSelector),
        i = elList.length;
    while (i--) {initialize(elList[i]);}

    // listen for new elements
    animationHelpers.onAnimationStart('mui-dropdown-inserted', function(ev) {
      initialize(ev.target);
    });
  }
};
