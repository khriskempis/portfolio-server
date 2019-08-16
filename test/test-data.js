const chai = require("chai");
const chaiHttp = require("chai-http");

const { app, runServer, closeServer } = require("../server");
const { TEST_DATABASE_URL } = require("../config");
const { Gig, Month } = require("../data");

const expect = chai.expect;

chai.use(chaiHttp);

describe("api/gigs", () => {
  const month = 1;
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
            .post("/api/gigs/month")
            .send({ month, year });

          expect(response).to.have.status(201);
        } catch (err) {
          if (err instanceof chai.AssertionError) {
            throw err;
          }
        }
      });
    });
  });
});
