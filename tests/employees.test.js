const supertest = require("supertest");
const app = require("../app");
const { Employees } = require("../app/api/v1/models");
const moment = require("moment");

const API_VERSION = "api/v1";
const YY = moment().format("YY");
const MM = moment().format("MM");

describe("END POINT /employees", () => {
  describe("GET /get", () => {
    const url = `/${API_VERSION}/employees/get?page=1&limit=10`;

    test("Should return statusCode 200 and the employees", async () => {
      const response = await supertest(app)
        .get(url)
        .set("Accept", "application/json");

      expect(response.statusCode).toBe(200);
      expect(response.type).toBe("application/json");
    });
  });

  describe("GET /detail/:id", () => {
    const url = `/${API_VERSION}/employees/detail`;

    describe("Given params id not found", () => {
      test("Should return statusCode 404", async () => {
        const employeeId = "00000000";

        const response = await supertest(app)
          .get(`${url}/${employeeId}`)
          .set("Accept", "application/json");

        expect(response.statusCode).toBe(404);
        expect(response.type).toBe("application/json");
      });
    });

    describe("Given params id found", () => {
      test("Should return statusCode 200 and detail employee", async () => {
        const employeeId = "22090002";

        const response = await supertest(app)
          .get(`${url}/${employeeId}`)
          .set("Accept", "application/json");

        expect(response.statusCode).toBe(200);
        expect(response.type).toBe("application/json");
      });
    });
  });

  describe("POST /create", () => {
    const url = `/${API_VERSION}/employees/create`;

    describe("Given empty request body", () => {
      test("Should return statusCode 400", async () => {
        const data = {};

        const response = await supertest(app)
          .post(url)
          .send(data)
          .set("Accept", "application/json");

        expect(response.statusCode).toBe(400);
        expect(response.type).toBe("application/json");
      });
    });

    describe("Given email address not valid", () => {
      test("Should return statusCode 400", async () => {
        const data = {
          name: "Gusman Wijaya, S.Kom",
          email: "gusman",
          mobile: "0987123",
          birthDate: "2000-08-02",
          address: JSON.stringify(["Address 1", "Address 2"]),
        };

        const response = await supertest(app)
          .post(url)
          .send(data)
          .set("Accept", "application/json");

        expect(response.statusCode).toBe(400);
        expect(response.type).toBe("application/json");
      });
    });

    describe("Given already exist email address", () => {
      test("Should return statusCode 400", async () => {
        const data = {
          name: "John Doe",
          email: "john.doe@example.com",
          mobile: "0123456789",
          birthDate: "2022-09-12",
          address: JSON.stringify(["Address 1", "Address 2"]),
        };

        const response = await supertest(app)
          .post(url)
          .send(data)
          .set("Accept", "application/json");

        expect(response.statusCode).toBe(400);
        expect(response.type).toBe("application/json");
      });
    });

    describe("Given a valid request body", () => {
      test("Should return statusCode 201", async () => {
        const data = {
          name: "Gusman Wijaya, S.Kom",
          email: "gusman.wijaya@codr.id",
          mobile: "0987123",
          birthDate: "2000-08-02",
          address: JSON.stringify(["Address 1", "Address 2"]),
        };

        const employee = await Employees.findOne({
          where: {
            email: data.email,
          },
        });
        if (employee) {
          await employee.destroy();
        }

        const response = await supertest(app)
          .post(url)
          .send(data)
          .set("Accept", "application/json");

        expect(response.statusCode).toBe(201);
        expect(response.type).toBe("application/json");
      });
    });
  });

  describe("PUT /update/:id", () => {
    const url = `/${API_VERSION}/employees/update`;

    describe("Given params id not found", () => {
      test("Should return statusCode 404", async () => {
        const employeeId = "00000000";
        const data = {
          name: "Gusman Wijaya, S.Kom",
          email: "test@codr.id",
          mobile: "0987123",
          birthDate: "2000-08-02",
          address: JSON.stringify(["Address 1", "Address 2"]),
        };

        const response = await supertest(app)
          .put(`${url}/${employeeId}`)
          .send(data)
          .set("Accept", "application/json");

        expect(response.statusCode).toBe(404);
        expect(response.type).toBe("application/json");
      });
    });

    describe("Given empty request body", () => {
      test("Should return statusCode 400", async () => {
        const employeeId = `${YY}${MM}0001`;
        const data = {};

        const response = await supertest(app)
          .put(`${url}/${employeeId}`)
          .send(data)
          .set("Accept", "application/json");

        expect(response.statusCode).toBe(400);
        expect(response.type).toBe("application/json");
      });
    });

    describe("Given email address not valid", () => {
      test("Should return statusCode 400", async () => {
        const employeeId = `${YY}${MM}0001`;
        const data = {
          name: "Gusman Wijaya, S.Kom",
          email: "gusman",
          mobile: "0987123",
          birthDate: "2000-08-02",
          address: JSON.stringify(["Address 1", "Address 2"]),
        };

        const response = await supertest(app)
          .put(`${url}/${employeeId}`)
          .send(data)
          .set("Accept", "application/json");

        expect(response.statusCode).toBe(400);
        expect(response.type).toBe("application/json");
      });
    });

    describe("Given already exist email address", () => {
      test("Should return statusCode 400", async () => {
        const employeeId = `${YY}${MM}0001`;
        const data = {
          name: "John Doe",
          email: "vira.el.vira@example.com",
          mobile: "0123456789",
          birthDate: "2022-09-12",
          address: JSON.stringify(["Address 1", "Address 2"]),
        };

        const response = await supertest(app)
          .put(`${url}/${employeeId}`)
          .send(data)
          .set("Accept", "application/json");

        expect(response.statusCode).toBe(400);
        expect(response.type).toBe("application/json");
      });
    });

    describe("Given a valid request body", () => {
      test("Should return statusCode 200", async () => {
        const employeeId = `${YY}${MM}0001`;
        const data = {
          name: "Gusman Wijaya, S.Kom",
          email: "gusman.wijaya@codr.id",
          mobile: "0123456789",
          birthDate: "2000-08-02",
          address: JSON.stringify(["Address 1", "Address 2"]),
        };

        const response = await supertest(app)
          .put(`${url}/${employeeId}`)
          .send(data)
          .set("Accept", "application/json");

        expect(response.statusCode).toBe(200);
        expect(response.type).toBe("application/json");
      });
    });
  });

  describe("DELETE /destroy/:id", () => {
    const url = `/${API_VERSION}/employees/destroy`;

    describe("Given params id not found", () => {
      test("Should return statusCode 404", async () => {
        const employeeId = `00000000`;

        const response = await supertest(app)
          .delete(`${url}/${employeeId}`)
          .set("Accept", "application/json");

        expect(response.statusCode).toBe(404);
        expect(response.type).toBe("application/json");
      });
    });

    describe("Given an exist params id", () => {
      test("Should return statusCode 200", async () => {
        const employeeId = `${YY}${MM}0001`;

        const response = await supertest(app)
          .delete(`${url}/${employeeId}`)
          .set("Accept", "application/json");

        expect(response.statusCode).toBe(200);
        expect(response.type).toBe("application/json");
      });
    });
  });
});
