/**
 * Does a fast shuffle on array, returning the shuffled version
 */
function fyShuffle (array) {
  var m = array.length;
  var t;
  var i;

  while (m) {
    i = Math.floor(Math.random() * m--);
    t = array[m];

    array[m] = array[i];
    array[i] = t;
  }

  return array;
}

/**
 * Converts the class attr to an array, removes 'active', and returns
 * a new className value.
 */
function removeActiveClass (class_string) {
  var classes = class_string.split(' ');
  var index   = classes.indexOf('active');

  if (index > -1) {
    classes.splice(index, 1);
  }

  return classes.join(' ');
}

/**
 * The Carousel class.
 *
 * @param Array items, the JSON array of quotes
 * @param Element element, the DOM element where the carousel will go
 * @param Object options, options to pass for configuration
 */
function Carousel (items, element, options) {
  options = options || {};
  items   = items || [];

  this.el    = element;
  this.items = items;
  this.loop  = options.loop || false;
  this.opts  = options;
  this.tmpl  = _.template(options.template || '<div><%- indx %></div>');

  this.initialize();
}

/**
 * Called internally on instantiation
 */
Carousel.prototype.initialize = function () {
  var first   = null;
  var last    = null;
  var wrapper = createDocumentFragment();

  if (this.opts.random) {
    this.items = fyShuffle(this.items);
  }

  _.forEach(this.items, function (item, index) {
    var frag = document.createDocumentFragment();

    frag.innerHTML = this.tmpl(item);

    item._indx = index;
    item._prev = last;
    item._next = this.items[index + 1];
    item._el   = frag;

    first = first || item;
    last  = item;

    wrapper.appendChild(frag);
  }, this);

  this.el.appendChild(wrapper);

  if (this.loop) {
    first._prev = last;
    last._next  = first;
  }


  this.prev    = null;
  this.current = first;

  this.show(item);
};

/**
 * Called internally, adds the 'active' class
 */
Carousel.prototype.show = function (item) {
  var class_name = removeActiveClass(item._el.className);

  item._el.className = [class_name, 'active'].join(' ');
};

/**
 * Called internally, removes the 'active' class
 */
Carousel.prototype.hide = function (item) {
  var class_name = removeActiveClass(item._el.className);

  item._el.className = class_name;
}

/**
 * This is called to actually initiate a scroll in either direction,
 * number should be positive for a forward "scroll" or negative for a
 * reverse scroll.
 */
Carousel.prototype.scroll = function (dir) {
  var next = null;

  dir  = dir || 1;
  next = dir > 0 ? this.current.next : this.current.prev;

  if (! next) {
    return false;
  }

  this.hide(this.current);
  this.show(next);

  this.current = next;
};
