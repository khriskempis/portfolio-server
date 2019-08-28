const chai = require("chai");
const chaiHttp = require("chai-http");

const { app, runServer, closeServer } = require("../server");
const { TEST_DATABASE_URL } = require("../config");
const { Gig, Month } = require("../data");

const expect = chai.expect;

chai.use(chaiHttp);

describe("api/gigs", () => {
  const GIGS_URL = "api/gigs/";
  const month = 1;
  const monthName = "January";
  const year = 2019;
  before(() => {
    return runServer(TEST_DATABASE_URL);
  });

  after(() => {
    return closeServer();
  });

  afterEach(() => {
    return Month.deleteOne({ month });
  });

  describe("/month", () => {
    describe("Post", () => {
      it("should create month", async () => {
        try {
          const response = await chai
            .request(app)
            .set("Content-Type", "application/json")
            .post(`${GIGS_URL}/month`)
            .send({ month, year });
          console.log(response);
          expect(response).to.have.status(201);
        } catch (err) {
          if (err instanceof chai.AssertionError) {
            throw err;
          }
        }
      });
    });

    describe("Get", () => {
      // it("should return month", async () => {
      //   try {
      //     const monthData = await Month.create({
      //       year,
      //       month,
      //       month_name: monthName
      //     });

      //     const response = await chai
      //       .request(app)
      //       .set("Content-Type", "application/json")
      //       .get(`${GIGS_URL}/month/${monthData._id}`);
      //     console.log(response.status);
      //   } catch (err) {
      //     if (err instanceof chai.AssertionError) {
      //       throw err;
      //     }
      //   }
      // });
      it("should return month", () => {
        return Month.create({
          year,
          month,
          month_name: monthName
        }).then(monthData => {
          return chai
            .request(app)
            .get(`${GIGS_URL}/month/${monthData._id}`)
            .then(res => {
              expect(res).to.have.status(201);
            });
        });
      });
    });
  });
  // describe("Gig route", () => {
  //   describe("Post", () => {
  //     it("should return gig after posting", () => {
  //       const newGig = {
  //         monthId: "5d43599f13ca51490c4ea11d",
  //         days: "Fri - Sat",
  //         dates: "7/12 - 7/13",
  //         time: "8pm",
  //         name: "The Last Five Years",
  //         type: "musical",
  //         location: "After Hours Theater",
  //         url: "www.afterhours.com"
  //       };

  //       return chai
  //         .request(app)
  //         .post(`${GIGS_URL}`)
  //         .send(newGig)
  //         .then(res => {
  //           console.log(res);
  //           expect(res).to.have.status(201);
  //         });
  //     });
  //   });
  // });
});
