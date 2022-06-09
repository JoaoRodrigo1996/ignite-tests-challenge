import { hash } from 'bcryptjs'
import request from 'supertest'
import { Connection } from 'typeorm'
import { v4 as uuidV4 } from 'uuid'

import { app } from '../../../../app'
import createConnection from '../../../../database'

let connection: Connection

describe("Authenticate User", () => {
  beforeAll(async () => {
    connection = await createConnection()
    await connection.runMigrations()

    const id = uuidV4()
    const password = await hash("123", 8)

    await connection.query(
      `INSERT INTO users(id, name, email, password, created_at, updated_at)
      values('${id}', 'admin', 'admin@email.com', '${password}', 'now()', 'now()')`
    );
  })

  afterAll(async () => {
    await connection.dropDatabase()
    await connection.close()
  })

  it("Should be able to authenticate user", async () => {
    const result = await request(app).post("/api/v1/sessions").send({
      email: "johndoe@example.com",
      password: "123"
    })

    expect(result.status).toBe(200)
    expect(result.body).toHaveProperty("token")
  })

  it("Should not be able to authenticate with password incorrect", async () => {
    const result = await request(app).post("/api/v1/sessions").send({
      email: "johndoe@example.com",
      password: "wrong-password"
    })

    expect(result.status).toBe(400)
  })

  it("Should not be able to authenticate with email incorrect", async () => {
    const result = await request(app).post("/api/v1/sessions").send({
      email: "incorrectemail@example.com",
      password: "123"
    })

    expect(result.status).toBe(401)
  })
})
