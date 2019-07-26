const monthElement = document.getElementsByClassName("month");

const BASE_URL = "";

const ajax = {};

ajax.x = function() {
  if (typeof XMLHttpRequest !== "undefined") {
    return new XMLHttpRequest();
  }
  let versions = [
    "MSXML2.XmlHttp.6.0",
    "MSXML2.XmlHttp.5.0",
    "MSXML2.XmlHttp.4.0",
    "MSXML2.XmlHttp.3.0",
    "MSXML2.XmlHttp.2.0",
    "Microsoft.XmlHttp"
  ];

  let xhr;
  for (let i = 0; i < versions.length; i++) {
    try {
      xhr = new ActiveXObject(versions[i]);
      break;
    } catch (e) {}
  }
  return xhr;
};

ajax.send = function(url, method, data, async) {
  if (async === undefined) {
    async = true;
  }
  let x = ajax.x();

  x.open(method, url, async);
  x.onreadystatechange = function() {
    if (x.readyState == 4) {
      handleResponse(x.response);
    }
  };
  if (method == "POST") {
    x.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  }
  x.send(data);
};

ajax.get = function(url, data, async) {
  let query = [];
  for (let key in data) {
    query.push(encodeURIComponent(key) + "=" + encodeURIComponent(data[key]));
  }
  ajax.send(
    url + (query.length ? "?" + query.join("&") : ""),
    "GET",
    null,
    async
  );
};

ajax.post = function(url, data, async) {
  let query = [];
  for (let key in data) {
    query.push(encodeURIComponent(key) + "=" + encodeURIComponent(data[key]));
  }
  ajax.send(url, "POST", query.join("&"), async);
};

ajax.get(BASE_URL + "api/gigs", true);

function handleResponse(response) {
  let jsonResponse = JSON.parse(response);
  console.log(jsonResponse[0]);
}
