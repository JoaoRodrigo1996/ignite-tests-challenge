import request from 'supertest'
import { Connection } from "typeorm"
import { app } from '../../../../app'
import createConnection from '../../../../database'

let connection: Connection

describe("Create User", () => {
  beforeAll(async () => {
    connection = await createConnection()
    await connection.runMigrations()
  })

  afterAll(async () => {
    await connection.dropDatabase()
    await connection.close()
  })

  it("Should be able to create a new user", async () => {
    const user = await request(app).post("/api/v1/users").send({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123"
    })

    expect(user.status).toBe(201)
  })
})
