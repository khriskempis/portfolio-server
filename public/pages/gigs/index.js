const BASE_URL = "http://localhost:8080/api";

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

// download data from server on load
ajax.get(BASE_URL + "/gigs", true);

// find section to append Html
const gigSection = document.getElementById("gig-section");

// function that's called when data is returned
function handleResponse(response) {
  let gigData = JSON.parse(response);
  let gigTableData = parseGigDataAndGenerateHtml(gigData);
  gigSection.innerHTML = gigTableData;
}

function parseGigDataAndGenerateHtml(data) {
  return generateMonthData(data, 5);
}

function generateMonthData(data, numData) {
  let htmlString = `<div class="month">
  <h4>${data.month}</h4>
  <table class="gig-table">`;

  for (let i = 0; i < numData; i++) {
    htmlString += generateGigDataHtml(data);
  }
  return (htmlString += "</table></div>");
}

function generateGigDataHtml(data) {
  const { days, dates, time, name, type, location_name, location_url } = data;

  let htmlString = `<tr>
    <td class="date">${dates}</td>
    <td class="name" rowsapn="2">${name}</td>
    <td class="type">${type}</td>
    <td class="day-time">${days} ${time}</td>
    <td class="location">
      <a href="${location_url}">${location_name}</a>
    </td>`;
  console.log(htmlString);
  return (htmlString += "</tr>");
}

{
  /* <div class="month">
  <h4>July</h4>
  <table class="gig-table">
    <tr>
      <td class="date">7/6 - 7/7</td>
      <td class="name" rowsapn="2">
        The Last Five Years
      </td>
      <td class="type">musical</td>
      <td class="day-time">Fri Sat &#126; 8pm</td>
      <td class="location">
        <a href="https://www.thelastfiveyearsla.com/">After Hours Theater</a>
      </td>
    </tr>
    <tr>
      <td class="date">7/11 - 7/13</td>
      <td class="name" rowsapn="2">
        The Last Five Years
      </td>
      <td class="type">musical</td>
      <td class="day-time">Thurs Fri Sat &#126; 8pm</td>
      <td class="location">
        <a href="https://www.thelastfiveyearsla.com/">After Hours Theater</a>
      </td>
    </tr>
    <tr>
      <td class="date">7/20</td>
      <td class="name" rowsapn="2">
        Vince Reyes Quartet
      </td>
      <td class="type">jazz</td>
      <td class="day-time">Sat &#126; 9pm</td>
      <td class="location">
        <a href="https://colombosrestaurant.com/">Colombos</a>
      </td>
    </tr>
  </table>
</div>; */
}
