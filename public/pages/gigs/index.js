const BASE_URL = "http://localhost:8080/api";
const YEAR = 2018;

// Gig Table Data

$.ajax({
  method: "GET",
  url: BASE_URL + "/gigs/month",
  data: { year: YEAR }
}).done(data => {
  if (data.monthData.length == 0) {
    handleError("#gig-section", "Sorry, no new gigs this year!");
  } else {
    handleGigResponse(data);
  }
});

function handleError(node, errStr) {
  const gigSection = $(node);
  const errorHTML = `
    <div class="error-message">
      <h1>${errStr}</h1>
    </div>
  `;
  gigSection.html(errorHTML);
}

// function that's called when data is returned
function handleGigResponse(response) {
  const gigSection = $("#gig-section");
  let gigTableData = parseGigDataAndGenerateHtml(response.monthData);
  gigSection.html(gigTableData);
}

// builds gig table data
function parseGigDataAndGenerateHtml(data) {
  let gigHtml = `<h3 class="section-header">Gigs</h3>`;
  // sorts month in descending order
  let sortedMonths = data.sort((a, b) => {
    return b.month - a.month;
  });
  for (let month of sortedMonths) {
    gigHtml += generateMonthData(month, month.dates.length);
  }
  return gigHtml;
}

function generateMonthData(data, numData) {
  let htmlString = `
  <div class="month">
    <h4>${data.month_name}</h4>
  <table class="gig-table">`;

  // finds dates and sorts from descending order
  let sortedDates = data.dates.sort((a, b) => {
    let regEx = /\/(\d+)/;
    let Aregex = regEx.exec(a.dates);
    let Bregex = regEx.exec(b.dates);
    return Bregex[1] - Aregex[1];
  });

  for (let i = 0; i < numData; i++) {
    htmlString += generateGigDataHtml(sortedDates[i]);
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

// Submitting Gig Data

function parseDate(date) {
  // use Regx, much easier to parse data
  let dateArr = date.split("-");
  let monthArr = dateArr[1].split("");
  let year = +dateArr[0];
  let month;

  if (monthArr[0] === 0) {
    // type coercion from string to number
    month = +monthArr[1];
  } else {
    month = +dateArr[1];
  }

  return {
    year,
    month
  };
}

function submitGigData(gigData) {
  $.ajax({
    method: "POST",
    url: BASE_URL + "/gigs/",
    data: JSON.stringify(gigData),
    contentType: "application/json"
  })
    .done(res => {
      console.log(res, res.message);
    })
    .catch(err => {
      console.log(err, err.responseText);
    });
}

function handleButton() {
  $(".update").on("click", () => {
    $(".user-form").toggle("active");
  });

  $(".user-form").on("submit", event => {
    event.preventDefault();

    // let dateData = parseDate($(".month-data").val());

    // return submitGigData({
    //   month: dateData.month,
    //   year: dateData.year,
    //   days: $(".days-data").val(),
    //   dates: $(".dates-data").val(),
    //   time: $(".time-data").val(),
    //   name: $(".name-data").val(),
    //   type: $(".type-data").val(),
    //   location: $(".location-data").val(),
    //   url: $(".url-data").val(),
    //   keyword: $(".keyword-data").val()
    // });

    // return submitGigData({
    //   month: 7,
    //   year: 2018,
    //   dates: "7/10 - 7/11",
    //   days: "Wed - Thurs",
    //   time: "8pm",
    //   name: "The Last Five Years",
    //   type: "musical",
    //   location: "After Hours Theater",
    //   url: "link"
    // });
  });
}

handleButton();
