const supertest = require("supertest");
const mongoose = require("mongoose");
const Admin = require("../../models/Admin");
const { initialAdmins, loginAdmin, invalidToken } = require("../testHelper");
const app = require("../../app");
const Settings = require("../../models/Settings");
const Authority = require("../../models/Authority");

const api = supertest(app);

let adminData;
let domain = "iiita.ac.in";

beforeEach(async () => {
  await Admin.deleteMany({});
  await Settings.deleteMany({});
  await Authority.deleteMany({});
  adminData = await loginAdmin(initialAdmins[0]);
});

const setDomainUrl = "/admin/setemaildomain";
const addAuthoritiesUrl = "/admin/addauthorities";

describe("the admin setEmailDomain route", () => {
  it("should set email domain when passed with correct info", async () => {
    await api
      .post(setDomainUrl)
      .send({ domain })
      .set("Authorization", adminData.token)
      .expect(200);

    const settings = await Settings.findOne({});
    expect(settings.emailDomain).toBe(domain);
  });

  it("should return 400 when domain not given", async () => {
    let res = await api
      .post(setDomainUrl)
      .set("Authorization", adminData.token)
      .expect(400);

    expect(res.body.error).toBe("The domain field is required");
  });

  it("should return 403 in case of invalid token", async () => {
    let mockJwt = await invalidToken();
    let res = await api
      .post(setDomainUrl)
      .set("Authorization", mockJwt)
      .expect(403);

    expect(res.body.error).toBe("Forbidden");
  });

  it("should return 403 in case of malformed token", async () => {
    let res = await api
      .post(setDomainUrl)
      .set("Authorization", "mockJwt")
      .expect(403);

    expect(res.body.error).toBe("Invalid API Key.");
  });
});

describe("admin add authority route", () => {
  const emailIds = [
    "kala@iiita.ac.in",
    "vkc@iiita.ac.in",
    "venkat@iiita.ac.in",
  ];

  it("should return 201 when data is in order", async () => {
    let res = await api
      .post(addAuthoritiesUrl)
      .send({ emailIds })
      .set("Authorization", adminData.token)
      .expect(201);
    let authorities = await Authority.find({});
    authorities = authorities.map((authority) => authority.email);
    expect(authorities).toEqual(emailIds);
  });

  it("should return 400 if data is missing", async () => {
    let res = await api
      .post(addAuthoritiesUrl)
      .set("Authorization", adminData.token)
      .expect(400);

    expect(res.body.error).toBe("Please enter the required information");
  });

  it("should return 400 when duplicate email is sent", async () => {
    let res = await api
      .post(addAuthoritiesUrl)
      .send({ emailIds: [emailIds[0], emailIds[0]] })
      .set("Authorization", adminData.token)
      .expect(400);

    expect(res.body.error).toBe(
      "Authority validation failed: email: Error, expected `email` to be unique. Value: `kala@iiita.ac.in`"
    );
  });

  it("should return 401 when token not sent", async () => {
    let {
      body: { error },
    } = await api.post(addAuthoritiesUrl).send({ emailIds }).expect(401);

    expect(error).toBe("API Key is missing.");
  });
});

afterAll(() => {
  mongoose.connection.close();
});