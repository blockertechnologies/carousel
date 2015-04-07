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

function removeActiveClass (class_string) {
  var classes = class_string.split(' ');
  var index   = classes.indexOf('active');

  if (index > -1) {
    classes.splice(index, 1);
  }

  return classes;
}

if (! Element.prototype.prependChild) {
  Element.prototype.prependChild = function (child) {
    this.insertBefore(child, this.firstChild);
  };
}

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

Carousel.prototype.show = function (item) {
  this.hide(item);

  item._el.className = [item._el.className, 'active'].join(' ');
};

Carousel.prototype.hide = function (item) {
  var classes = [];

  classes = removeActiveClass(item._el.className);

  item._el.className = classes.join(' ');
}

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
