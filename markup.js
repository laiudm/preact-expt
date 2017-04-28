// https://github.com/developit/preact-markup

/*

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('preact')) :
  typeof define === 'function' && define.amd ? define(['preact'], factory) :
  (global.preactMarkup = factory(global.preact));
}(this, function (preact) { 'use strict';

  var parserDoc = void 0;

  function parseMarkup(markup, type) {
  	var doc = void 0,
  	    mime = type === 'html' ? 'text/html' : 'application/xml',
  	    parserError = void 0,
  	    wrappedMarkup = void 0,
  	    tag = void 0;

  	if (type === 'html') {
  		tag = 'body';
  		wrappedMarkup = '<!DOCTYPE html>\n<html><body>' + markup + '</body></html>';
  	} else {
  		tag = 'xml';
  		wrappedMarkup = '<?xml version="1.0" encoding="UTF-8"?>\n<xml>' + markup + '</xml>';
  	}

  	try {
  		doc = new DOMParser().parseFromString(wrappedMarkup, mime);
  	} catch (err) {
  		parserError = err;
  	}

  	if (!doc && type === 'html') {
  		doc = parserDoc || (parserDoc = buildParserFrame());
  		doc.open();
  		doc.write(wrappedMarkup);
  		doc.close();
  	}

  	if (!doc) return;

  	var out = doc.getElementsByTagName(tag)[0],
  	    fc = out.firstChild;

  	if (markup && !fc) {
  		out.error = 'Document parse failed.';
  	}

  	if (fc && String(fc.nodeName).toLowerCase() === 'parsererror') {
  		fc.removeChild(fc.firstChild);
  		fc.removeChild(fc.lastChild);
  		out.error = fc.textContent || fc.nodeValue || parserError || 'Unknown error';

  		out.removeChild(fc);
  	}

  	return out;
  }

  function buildParserFrame() {
  	if (document.implementation && document.implementation.createHTMLDocument) {
  		return document.implementation.createHTMLDocument('');
  	}
  	var frame = document.createElement('iframe');
  	frame.style.cssText = 'position:absolute; left:0; top:-999em; width:1px; height:1px; overflow:hidden;';
  	frame.setAttribute('sandbox', 'allow-forms');
  	document.body.appendChild(frame);
  	return frame.contentWindow.document;
  }

  var EMPTY_OBJ$1 = {};

  function toVdom(node, visitor, h, options) {
  	walk.visitor = visitor;
  	walk.h = h;
  	walk.options = options || EMPTY_OBJ$1;
  	return walk(node);
  }

  function walk(n, index, arr) {
  	if (n.nodeType === 3) {
  		var text = 'textContent' in n ? n.textContent : n.nodeValue || '';

  		if (walk.options.trim !== false) {
  			var isFirstOrLast = index === 0 || index === arr.length - 1;

  			if (text.match(/^[\s\n]+$/g) && walk.options.trim !== 'all') {
  				text = ' ';
  			} else {
  				text = text.replace(/(^[\s\n]+|[\s\n]+$)/g, walk.options.trim === 'all' || isFirstOrLast ? '' : ' ');
  			}

  			if ((!text || text === ' ') && arr.length > 1 && isFirstOrLast) return null;
  		}
  		return text;
  	}
  	if (n.nodeType !== 1) return null;
  	var nodeName = String(n.nodeName).toLowerCase();

  	if (nodeName === 'script' && !walk.options.allowScripts) return null;

  	var out = walk.h(nodeName, getProps(n.attributes), walkChildren(n.childNodes));
  	if (walk.visitor) walk.visitor(out);
  	return out;
  }

  function getProps(attrs) {
  	var len = attrs && attrs.length;
  	if (!len) return null;
  	var props = {};
  	for (var i = 0; i < len; i++) {
  		var _attrs$i = attrs[i];
  		var name = _attrs$i.name;
  		var value = _attrs$i.value;

  		if (value === '') value = true;
  		if (name.substring(0, 2) === 'on' && walk.options.allowEvents) {
  			value = new Function(value);
  		}
  		props[name] = value;
  	}
  	return props;
  }

  function walkChildren(children) {
  	var c = children && Array.prototype.map.call(children, walk).filter(exists);
  	return c && c.length ? c : null;
  }

  var exists = function (x) {
  	return x;
  };

  var EMPTY_OBJ = {};

  function markupToVdom(markup, type, reviver, map, options) {
  	var dom = parseMarkup(markup, type);

  	if (dom && dom.error) {
  		throw new Error(dom.error);
  	}

  	var body = dom && dom.body || dom;
  	visitor.map = map || EMPTY_OBJ;
  	var vdom = body && toVdom(body, visitor, reviver, options);
  	visitor.map = null;

  	return vdom && vdom.children || null;
  }

  function toCamelCase(name) {
  	return name.replace(/-(.)/g, function (match, letter) {
  		return letter.toUpperCase();
  	});
  }

  function visitor(node) {
  	var name = node.nodeName.toLowerCase(),
  	    map = visitor.map;
  	if (map && map.hasOwnProperty(name)) {
  		node.nodeName = map[name];
  		node.attributes = Object.keys(node.attributes || {}).reduce(function (attrs, attrName) {
  			attrs[toCamelCase(attrName)] = node.attributes[attrName];
  			return attrs;
  		}, {});
  	} else {
  		node.nodeName = name.replace(/[^a-z0-9-]/i, '');
  	}
  }
  
  /// last of previous code. What follows is boilderplate

  var classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var inherits = function (subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  };

  var objectWithoutProperties = function (obj, keys) {
    var target = {};

    for (var i in obj) {
      if (keys.indexOf(i) >= 0) continue;
      if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
      target[i] = obj[i];
    }

    return target;
  };

  var possibleConstructorReturn = function (self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  };
  
  
  /// start of "real" code

  var customReviver = void 0;

  var Markup = function (_Component) {
  	inherits(Markup, _Component);

  	function Markup() {
  		classCallCheck(this, Markup);
  		return possibleConstructorReturn(this, _Component.apply(this, arguments));
  	}

  	Markup.setReviver = function setReviver(h) {
  		customReviver = h;
  	};

  	Markup.prototype.shouldComponentUpdate = function shouldComponentUpdate(_ref) {
  		var wrap = _ref.wrap;
  		var type = _ref.type;
  		var markup = _ref.markup;

  		var p = this.props;
  		return wrap !== p.wrap || type !== p.type || markup !== p.markup;
  	};

  	Markup.prototype.setComponents = function setComponents(components) {
  		this.map = {};
  		if (components) {
  			for (var i in components) {
  				if (components.hasOwnProperty(i)) {
  					var name = i.replace(/([A-Z]+)([A-Z][a-z0-9])|([a-z0-9]+)([A-Z])/g, '$1$3-$2$4').toLowerCase();
  					this.map[name] = components[i];
  				}
  			}
  		}
  	};

  	Markup.prototype.render = function render(_ref2) {
  		var _ref2$wrap = _ref2.wrap;
  		var wrap = _ref2$wrap === undefined ? true : _ref2$wrap;
  		var type = _ref2.type;
  		var markup = _ref2.markup;
  		var components = _ref2.components;
  		var reviver = _ref2.reviver;
  		var onError = _ref2.onError;
  		var allowScripts = _ref2['allow-scripts'];
  		var allowEvents = _ref2['allow-events'];
  		var trim = _ref2.trim;
  		var props = objectWithoutProperties(_ref2, ['wrap', 'type', 'markup', 'components', 'reviver', 'onError', 'allow-scripts', 'allow-events', 'trim']);

  		var h = reviver || this.reviver || this.constructor.prototype.reviver || customReviver || preact.h,
  		    vdom = void 0;

  		this.setComponents(components);

  		var options = {
  			allowScripts: allowScripts,
  			allowEvents: allowEvents,
  			trim: trim
  		};

  		try {
  			vdom = markupToVdom(markup, type, h, this.map, options);
  		} catch (error) {
  			if (onError) {
  				onError({ error: error });
  			} else if (typeof console !== 'undefined' && console.error) {
  				console.error('preact-markup: ' + error);
  			}
  		}

  		if (wrap === false) return vdom && vdom[0] || null;

  		var c = props.hasOwnProperty('className') ? 'className' : 'class',
  		    cl = props[c];
  		if (!cl) props[c] = 'markup';else if (cl.splice) cl.splice(0, 0, 'markup');else if (typeof cl === 'string') props[c] += ' markup';else if (typeof cl === 'object') cl.markup = true;

  		return h('div', props, vdom || null);
  	};

  	return Markup;
  }(preact.Component);

  return Markup;

}));
//// # sourceMappingURL=preact-markup.js.map

*/


// https://github.com/developit/preact-markup/blob/master/src/parse-markup.js

let parserDoc;

/** Parse markup into a DOM using the given mimetype.
 *	@param {String} markup
 */
function parseMarkup(markup, type) {
	let doc,
		mime = type==='html' ? 'text/html' : 'application/xml',
		parserError, wrappedMarkup, tag;

	// wrap with an element so we can find it after parsing, and to support multiple root nodes
	if (type==='html') {
		tag = 'body';
		wrappedMarkup = '<!DOCTYPE html>\n<html><body>'+markup+'</body></html>';
	}
	else {
		tag = 'xml';
		wrappedMarkup = '<?xml version="1.0" encoding="UTF-8"?>\n<xml>'+markup+'</xml>';
	}

	// if available (browser support varies), using DOMPaser in HTML mode is much faster, safer and cleaner than injecting HTML into an iframe.
	try {
		doc = new DOMParser().parseFromString(wrappedMarkup, mime);
	} catch (err) {
		parserError = err;
	}

	// fall back to using an iframe to parse HTML (not applicable for XML, since DOMParser() for XML works in IE9+):
	if (!doc && type==='html') {
		doc = parserDoc || (parserDoc = buildParserFrame());
		doc.open();
		doc.write(wrappedMarkup);
		doc.close();
	}

	if (!doc) return;

	// retrieve our wrapper node
	let out = doc.getElementsByTagName(tag)[0],
		fc = out.firstChild;

	if (markup && !fc) {
		out.error = 'Document parse failed.';
	}

	// pluck out parser errors
	if (fc && String(fc.nodeName).toLowerCase()==='parsererror') {
		// remove post/preamble to get just the error message as text
		fc.removeChild(fc.firstChild);
		fc.removeChild(fc.lastChild);
		out.error = (fc.textContent || fc.nodeValue || parserError || 'Unknown error');
		// remove the error from the DOM leaving things nice and tidy
		out.removeChild(fc);
	}

	return out;
}

/** A shared frame is used for the fallback HTML parser, built on-demand. */
function buildParserFrame() {
	if (document.implementation && document.implementation.createHTMLDocument) {
		return document.implementation.createHTMLDocument('');
	}
	let frame = document.createElement('iframe');
	frame.style.cssText = 'position:absolute; left:0; top:-999em; width:1px; height:1px; overflow:hidden;';
	frame.setAttribute('sandbox', 'allow-forms');
	document.body.appendChild(frame);
	return frame.contentWindow.document;
}








// https://github.com/developit/preact-markup/blob/master/src/to-vdom.js

const EMPTY_OBJ = {};

// deeply convert an XML DOM to VDOM
function toVdom(node, visitor, h, options) {
	walk.visitor = visitor;
	walk.h = h;
	walk.options = options || EMPTY_OBJ;
	return walk(node);
}

function walk(n, index, arr) {
	if (n.nodeType===3) {
		let text = 'textContent' in n ? n.textContent : n.nodeValue || '';

		if (walk.options.trim!==false) {
			let isFirstOrLast = index===0 || index===arr.length-1;

			// trim strings but don't entirely collapse whitespace
			if (text.match(/^[\s\n]+$/g) && walk.options.trim!=='all') {
				text = ' ';
			}
			else {
				text = text.replace(/(^[\s\n]+|[\s\n]+$)/g, walk.options.trim==='all' || isFirstOrLast ? '' : ' ');
			}
			// skip leading/trailing whitespace
			// if (!text || text===' ' && arr.length>1 && (index===0 || index===arr.length-1)) return null;
			if ((!text || text===' ') && arr.length>1 && isFirstOrLast) return null;
			// if (!text && arr.length>1 && (index===0 || index===arr.length-1)) return null;
			// if (!text || text===' ') return null;
		}
		return text;
	}
	if (n.nodeType!==1) return null;
	let nodeName = String(n.nodeName).toLowerCase();

	// Do not allow script tags unless explicitly specified
	if (nodeName==='script' && !walk.options.allowScripts) return null;

	let out = walk.h(
		nodeName,
		getProps(n.attributes),
		walkChildren(n.childNodes)
	);
	if (walk.visitor) walk.visitor(out);
	return out;
}

function getProps(attrs) {
	let len = attrs && attrs.length;
	if (!len) return null;
	let props = {};
	for (let i=0; i<len; i++) {
		let { name, value } = attrs[i];
		if (value==='') value = true;
		if (name.substring(0,2)==='on' && walk.options.allowEvents){
			value  = new Function(value); // eslint-disable-line no-new-func
		}
		props[name] = value;
	}
	return props;
}

function walkChildren(children) {
	let c = children && Array.prototype.map.call(children, walk).filter(exists);
	return c && c.length ? c : null;
}

let exists = x => x;







// https://github.com/developit/preact-markup/blob/master/src/markup-to-vdom.js
// already defined earlier const EMPTY_OBJ = {};

/** Convert markup into a virtual DOM.
*	@param {String} markup		HTML or XML markup (indicate via `type`)
*	@param {String} [type=xml]	A type to use when parsing `markup`. Either `xml` or `html`.
*	@param {Function} reviver	The JSX/hyperscript reviver (`h` function) to use. For example, Preact's `h` or `ReactDOM.createElement`.
*	@param {Object} [map]		Optional map of custom element names to Components or variant element names.
 */
function markupToVdom(markup, type, reviver, map, options) {
	let dom = parseMarkup(markup, type);

	if (dom && dom.error) {
		throw new Error(dom.error);
	}

	let body = dom && dom.body || dom;
	visitor.map = map || EMPTY_OBJ;
	let vdom = body && toVdom(body, visitor, reviver, options);
	visitor.map = null;


	return vdom && vdom.children || null;
}

function toCamelCase(name) {
	return name.replace(/-(.)/g, (match, letter) =>letter.toUpperCase());
}

function visitor(node) {
	let name = node.nodeName.toLowerCase(),
		map = visitor.map;
	if (map && map.hasOwnProperty(name)){
		node.nodeName = map[name];
		node.attributes = Object.keys(node.attributes || {}).reduce((attrs,attrName)=>{
			attrs[toCamelCase(attrName)] = node.attributes[attrName];
			return attrs;
		},{});
	} else {
		node.nodeName =  name.replace(/[^a-z0-9-]/i,'');
	}

}




// https://github.com/developit/preact-markup/blob/master/src/index.js

// import { h as defaultReviver, Component } from 'preact'; // just replace defaultReviver with preact.h

let customReviver = 0;

class Markup extends preact.Component {
	static setReviver(h) {
		customReviver = h;
	}

	shouldComponentUpdate({ wrap, type, markup }) {
		let p = this.props;
		return wrap!==p.wrap || type!==p.type || markup!==p.markup;
	}

	setComponents(components) {
		this.map = {};
		if (components) {
			for (let i in components) {
				if (components.hasOwnProperty(i)) {
					let name = i.replace(/([A-Z]+)([A-Z][a-z0-9])|([a-z0-9]+)([A-Z])/g, '$1$3-$2$4').toLowerCase();
					this.map[name] = components[i];
				}
			}
		}
	}

	render(/*{ wrap=true, type, markup, components, reviver, onError, 'allow-scripts':allowScripts, 'allow-events':allowEvents, trim, ...props }*/ _props) {
		let wrap = _props.wrap === undefined ? true : _props.wrap;
		let type = _props.type;
		let markup = _props.markup;
		let components = _props.components;
		let reviver = _props.reviver;
		let onError = _props.onError;
		let allowScripts = _props["allow-scripts"];
		let allowEvents = _props["allow-events"];
		let trim = _props.trim;
		let props = _objectWithoutProperties(_props, ['wrap', 'type', 'markup', 'components', 'reviver', 'onError', 'allow-scripts', 'allow-events', 'trim']);
		
		let h = reviver || this.reviver || this.constructor.prototype.reviver || customReviver || /*defaultReviver*/ preact.h,
			vdom;

		this.setComponents(components);

		let options = {
			allowScripts,
			allowEvents,
			trim
		};

		try {
			vdom = markupToVdom(markup, type, h, this.map, options);
		} catch (error) {
			if (onError) {
				onError({ error });
			}
			else if (typeof console!=='undefined' && console.error) {
				console.error('preact-markup: ' + this.state.error);
			}
		}

		if (wrap===false) return vdom && vdom[0] || null;

		let c = props.hasOwnProperty('className') ? 'className' : 'class',
			cl = props[c];
		if (!cl) props[c] = 'markup';
		else if (cl.splice) cl.splice(0, 0, 'markup');
		else if (typeof cl==='string') props[c] += ' markup';
		else if (typeof cl==='object') cl.markup = true;

		return h('div', props, vdom || null);
	}
}
