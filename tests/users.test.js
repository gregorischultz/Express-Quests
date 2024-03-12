const request = require("supertest");

const crypto = require ("node:crypto");

const app = require("../src/app");

const database = require ("../database");

afterAll (() => database.end());

describe("GET /api/users", () => {
  it("should return all users", async () => {
    const response = await request(app).get("/api/users");

    expect(response.headers["content-type"]).toMatch(/json/);

    expect(response.status).toEqual(200);
  });
});

describe("GET /api/users/:id", () => {
  it("should return one user", async () => {
    const response = await request(app).get("/api/users/1");

    expect(response.headers["content-type"]).toMatch(/json/);

    expect(response.status).toEqual(200);
  });

  it("should return no user", async () => {
    const response = await request(app).get("/api/users/0");

    expect(response.status).toEqual(404);
  });
});


describe ("POST /api/users", () => {
  it ("should return created user", async () => {
    const newUser = {
      firstname: "Marie",
      lastname: "Martin",
      email: `${crypto.randomUUID()}@wild.co`,
      city: "Paris",
      language: "French",
    };

    const response = await request (app).post ("/api/users").send (newUser);

    expect (response.headers ["content-type"]).toMatch (/json/);
    expect (response.status).toEqual (201);

    // Adicione mais expectativas conforme necessário para verificar os dados do usuário criado?
  });
  // Adicione mais testes conforme necessário, por exemplo, para verificar entradas inválidas?
});


// describe ("POST /api/users", () => {
//   it ("should return an error for duplicate email", async () => {
//     const duplicateUser = {
//       firstname: "John",
//       lastname: "Doe",
//       email: "john.doe@example.com", // e-mail que já existe.
//       city: "New York",
//       language: "English",
//     };

//     const response = await request(app).post ("/api/users").send (duplicateUser);

//     expect (response.status).toEqual (400);
//     expect (response.body).toHaveProperty ("error");
//   })
// })
