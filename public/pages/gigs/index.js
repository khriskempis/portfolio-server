const BASE_URL = "http://localhost:8080/api";
const YEAR = 2018;

$.ajax({
  method: "GET",
  url: BASE_URL + "/gigs/month",
  data: { year: YEAR }
}).done(data => {
  console.log(data);
  if (data.monthData.length == 0) {
    handleError();
  } else {
    handleResponse(data);
  }
});

function handleError() {
  const gigSection = $("#gig-section");
  const errorHTML = `
    <div class="error-message">
      <h1>Sorry, no new gigs this year!</h1>
    </div>
  `;
  gigSection.html(errorHTML);
}

// function that's called when data is returned
function handleResponse(response) {
  const gigSection = $("#gig-section");
  let gigTableData = parseGigDataAndGenerateHtml(response.monthData);
  gigSection.html(gigTableData);
}

// builds gig table data
function parseGigDataAndGenerateHtml(data) {
  let gigHtml = "";
  for (let month of data) {
    gigHtml += generateMonthData(month, month.dates.length);
  }
  return gigHtml;
}

function generateMonthData(data, numData) {
  let htmlString = `
  <div class="month">
    <h4>${data.month_name}</h4>
  <table class="gig-table">`;

  for (let i = 0; i < numData; i++) {
    htmlString += generateGigDataHtml(data.dates[i]);
  }
  return (htmlString += "</table></div>");
}

function generateGigDataHtml(data) {
  const { days, dates, time, name, type, location, url } = data;

  let htmlString = `<tr>
    <td class="date">${dates}</td>
    <td class="name" rowsapn="2">${name}</td>
    <td class="type">${type}</td>
    <td class="day-time">${days} ${time}</td>
    <td class="location">
      <a href="${url}">${location}</a>
    </td>`;
  return (htmlString += "</tr>");
}
