const request = require("supertest");

const app = require("../src/app");

const database = require ("../database");

afterAll (() => database.end());

describe("GET /api/movies", () => {
  it("should return all movies", async () => {
    const response = await request(app).get("/api/movies");

    expect(response.headers["content-type"]).toMatch(/json/);

    expect(response.status).toEqual(200);
  });
});

describe("GET /api/movies/:id", () => {
  it("should return one movie", async () => {
    const response = await request(app).get("/api/movies/1");

    expect(response.headers["content-type"]).toMatch(/json/);

    expect(response.status).toEqual(200);
  });

  it("should return no movie", async () => {
    const response = await request(app).get("/api/movies/0");

    expect(response.status).toEqual(404);
  });
});


describe ("POST /api/movies", () => {
  it ("should return created movie", async () => {
     const newMovie = {
      title: "Star wars",
      director: "George Lucas",
      year: "1977",
      color: "1",
      duration: 120,
     };

     const response = await request (app).post ("/api/movies").send (newMovie); //Enviando uma solicitação POST para a rota /api/movies com os dados do novo filme

     expect (response.status).toEqual (201); // Verificando o código de status da resposta, esperando que seja 201 (Created)
     expect (response.body).toHaveProperty ("id"); // Verificando se a resposta contém a propriedade "id"
     expect (typeof response.body.id).toBe ("number"); // Verificando se o tipo de dado da propriedade "id" é um número
     expect (response.headers ["content-type"]).toMatch (/json/);

     const [result] = await database.query (
      "SELECT * FROM movies WHERE id = ?",
      response.body.id
     ); // essa funçao esta realizando uma consulta ao banco de dados para recuperar as informaçoes do filme recem-criado

     const [movieInDatabase] = result; //O resultado da consulta SQL é um array de linhas. Como geralmente espera-se que haja apenas uma linha correspondente ao filme recém-criado (devido ao uso do ID único), é feita a desestruturação para obter a primeira (e única) linha.

     expect (movieInDatabase).toHaveProperty ("id"); //essa linha verifica se o filme recuperado do banco de dados tem propriedade "id" (garante que o filme foi devidamente armazenado na BDD)
     expect (movieInDatabase).toHaveProperty ("title"); //essa linha verifica se o filme recuperado do banco de dados tem propriedade "title" (garante que o filme foi devidamente armazenado na BDD)
     expect (movieInDatabase.title).toStrictEqual (newMovie.title); //compara o titulo do filme da BDD com o titulo na requisiçao POST (Garante que o título do filme no banco de dados corresponda ao título que foi enviado na requisição de criação.)
     expect (movieInDatabase).toHaveProperty ("director");
     expect (movieInDatabase.director).toStrictEqual (newMovie.director);
     expect (movieInDatabase).toHaveProperty ("year");
     expect (movieInDatabase.year).toStrictEqual (newMovie.year);
     expect (movieInDatabase).toHaveProperty ("color");
     expect (movieInDatabase.color).toStrictEqual (newMovie.color);
     expect (movieInDatabase).toHaveProperty ("duration");
     expect (movieInDatabase.duration).toStrictEqual (newMovie.duration);
  });

  it ("should return an error", async () => { // Teste para verificar se a API retorna um erro ao postar um filme com propriedades ausentes
    const movieWithMissingProps = { title: "Harry Potter" }; // Filme com propriedades ausentes

    const response = await request (app)
    .post ("/api/movies")
    .send (movieWithMissingProps);// Requisição para criar um filme com propriedades ausentes

    expect (response.status).toEqual (500); // Expectativa de que a resposta tenha o status 500 (erro interno do servidor)
    
  })
});


describe ("PUT /api/movies/:id", () => {
  it ("should edit movie", async () => {
    const newMovie = {
      title: "Avatar",
      director: "James Cameron",
      year: "2009",
      color: "1",
      duration: 162,
    };
    const [result] = await database.query (
      "INSERT INTO movies (title, director, year, color, duration)  VALUES (?, ?, ?, ?, ?)",
      [newMovie.title, newMovie.director, newMovie.year, newMovie.color, newMovie.duration]
    );

    const id = result.insertId;

    const updatedMovie = {
      title: "Wild is life",
      director: "Alan Smithee",
      year: "2023",
      color: "0",
      duration: 120,
    };

    const response = await request (app)
    .put (`/api/movies/${id}`)
    .send (updatedMovie);

    expect (response.status).toEqual (204);

    const [movies] = await database.query ("SELECT * FROM movies WHERE id=?", id);

    const [movieInDatabase] = movies;

    expect(movieInDatabase).toHaveProperty("id");

    expect(movieInDatabase).toHaveProperty("title");
    expect(movieInDatabase.title).toStrictEqual(updatedMovie.title);

    expect(movieInDatabase).toHaveProperty("director");
    expect(movieInDatabase.director).toStrictEqual(updatedMovie.director);

    expect(movieInDatabase).toHaveProperty("year");
    expect(movieInDatabase.year).toStrictEqual(updatedMovie.year);

    expect(movieInDatabase).toHaveProperty("color");
    expect(movieInDatabase.color).toStrictEqual(updatedMovie.color);

    expect(movieInDatabase).toHaveProperty("duration");
    expect(movieInDatabase.duration).toStrictEqual(updatedMovie.duration);
  });

  it ("should return an error", async () => {
    const movieWithMissingProps = { title: "Harry Potter" };

    const response = await request (app)
    .put (`/api/movies/1`)
    .send (movieWithMissingProps);

    expect (response.status).toEqual (500);
  });

  it ("should return no movie", async () => {
    const newMovie = {
      title: "Avatar",
      director: "James Cameron",
      year: "2009",
      color: "1",
      duration: 162,
    };

    const response = await request (app).put ("/api/movies/0").send (newMovie);

    expect (response.status).toEqual (404);
  });
});
