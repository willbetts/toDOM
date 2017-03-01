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

  text(string){
    this.htmlElements.forEach((element) => {
      element.textContent = string;
    });
    return;
  }

  eq(index){
    return new DomNodeCollection([this.htmlElements[index]]);
  }
}

module.exports = DOMNodeCollection;
