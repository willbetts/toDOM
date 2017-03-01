const DOMNodeCollection = require('./dom_node_collection.js');


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


$l.ajax = (optionsObj) => {
  const request = {
    method: "GET",
    url: "",
    data: {},
    success: () => {},
    error: () => {},
    contentType: 'application/x-www-form-urlencoded; charset=UTF-8'
  };

  optionsObj = $l.extend(request, optionsObj);
  const xhr = new XMLHttpRequest();

  xhr.open(optionsObj.method, optionsObj.url, true);

  xhr.onload = (e) => {
    if(xhr.status === 200){
      optionsObj.success(xhr.response);
    } else {
      optionsObj.error(xhr.response);
    }
  };

  xhr.send(JSON.stringify(optionsObj.data));
};

window.$l = $l;
