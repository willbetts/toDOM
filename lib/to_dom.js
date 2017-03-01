/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

const DOMNodeCollection = __webpack_require__(1);

const functions = [];

document.addEventListener("DOMContentLoaded", () => {
  functions.forEach((func) => func() );
});

function $l (arg) {
  if (typeof arg === "string") {
    const nodeList = document.querySelectorAll(arg);
    const queryResults = Array.apply(null, nodeList);
    return new DOMNodeCollection(queryResults);
  } else if (arg instanceof HTMLElement) {
    return new DOMNodeCollection ([arg]);
  } else if (typeof arg === "function"){
    if (document.readyState === 'complete'){
      arg();
    } else {
      functions.push(arg);
    }
  }
}

$l.extend = function (obj1, ...objects) {
  objects.forEach((object) => {
    Object.keys(object).forEach((key) => {
      obj1[key] = object[key];
    });
  });

  return obj1;
};

const defaults = {
  method: "GET",
  success: (data) => { console.log(data); },
  error: (error) => { console.log(error); },
  url: document.URL,
  contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
  dataType: 'json'
};

$l.ajax = function (options) {
  options = $l.extend(defaults, options);

  const xhr = new XMLHttpRequest();
  xhr.open(options.type, options.url);
  xhr.onload = options.success;
  xhr.onerror = options.error;

  xhr.send(options);
};

window.$l = $l;




/***/ }),
/* 1 */
/***/ (function(module, exports) {

class DOMNodeCollection {
  constructor (array) {
    this.htmlElements = array;

    return this;
  }

  html (innerHTML) {
    if (innerHTML === undefined){
      return this.htmlElements[0].innerHTML;
    } else {
      this.htmlElements.forEach(el => {
        el.innerHTML = innerHTML;
      });
      return this.htmlElements;
    }
  }

  empty(){
    return this.html("");
  }

  append (item) {
    if (item instanceof DOMNodeCollection) {
      // each element in item --> outerHTML and append to innerHTML each element in this (this === DOMNodeCollection)
      item.htmlElements.forEach ((el1) => {
        const outerHTML = el1.outerHTML;
        this.htmlElements.forEach((el2) => {
          el2.innerHTML += outerHTML;
        });
      });
    } else if (item instanceof HTMLElement) {
      this.htmlElements.forEach((el) => {
        el.innerHTML += item.outerHTML;
      });
    } else if (typeof item === "string") {
      this.htmlElements.forEach((el) => {
        el.innerHTML += item;
      });
    }
  }

  attr (attributeName, value) {
    if (!value) {
      return this.htmlElements[0].getAttribute(attributeName);
    } else {
      this.htmlElements.forEach((el) => {
        el.setAttribute(attributeName, value);
      });
    }
  }

  addClass(className){
    const currentClass = this.attr("class");
    this.attr ("class", currentClass +" " + className);
  }

  removeClass(className){
    const currentClasses = this.attr("class").split(" ");
    const index = currentClasses.indexOf(className);
    currentClasses.splice(index, 1);
    this.attr("class", currentClasses);
  }

  children() {
    let children = [];
    this.htmlElements.forEach((el) => {
      children.push(el.children);
    });

    return new DOMNodeCollection(children);
  }

  parent() {
    let parents = [];
    this.htmlElements.forEach((el) => {
      parents.push(el.parentNode);
    });

    return new DOMNodeCollection(parents);
  }

  find(selector){
    let result = [];
    this.htmlElements.forEach( (el) => {
      result.push(el.querySelectorAll(selector));
    });
    return new DOMNodeCollection(result);
  }

  remove(){
    this.htmlElements.forEach((el) => {
      el.remove();
    });
  }

  on(type, callback){
    this.htmlElements.forEach((el) => {
      el.addEventListener(type, callback);
      if (el.callbacks) {
        el.callbacks.push(callback);
      } else {
        el.callbacks = [callback];
      }
    });
  }

  off(type) {
    this.htmlElements.forEach((el) => {
      if (el.callbacks) {
        el.callbacks.forEach( (callback) => {
          el.removeEventListener(type, callback);
        });
      }
    });
  }
}

module.exports = DOMNodeCollection;


/***/ })
/******/ ]);
