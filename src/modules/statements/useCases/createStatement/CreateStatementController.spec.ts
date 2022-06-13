import request from "supertest";
import { Connection } from "typeorm";
import { hash } from "bcryptjs";
import { v4 as uuidV4 } from "uuid";

import createConnection from "../../../../database";
import { app } from "../../../../app";

let connection: Connection

describe("Create Statement", () => {
  beforeAll(async () => {
    connection = await createConnection()
    await connection.runMigrations()

    const id = uuidV4()
    const password = await hash("123", 8)

    await connection.query(`INSERT INTO users(id, name, email, password, created_at, updated_at)
    VALUES('${id}', 'admin', 'admin@email.com', '${password}', 'now()', 'now()')`);
  })

  it("Should be able to add credit", async () => {
    const resultToken = await request(app).post("/api/v1/sessions").send({
      email: "admin@email.com",
      password: "123"
    })

    const { token } = resultToken.body

    const result = await request(app).post("/api/v1/statements/deposit").send({
      amount: 200,
      description: "Credit test"
    }).set({
      Authorization: `Bearer ${token}`
    })

    expect(result.status).toBe(201)
    expect(result.body).toHaveProperty("id")
    expect(result.body.amount).toBe(200)
  })

})
