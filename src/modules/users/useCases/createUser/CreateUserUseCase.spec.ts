import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserError } from "./CreateUserError"
import { CreateUserUseCase } from "./CreateUserUseCase"

let createUserUseCase: CreateUserUseCase
let createUserRepositoryInMemory: InMemoryUsersRepository

describe("Create User", () => {
  beforeEach(() => {
    createUserRepositoryInMemory = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(createUserRepositoryInMemory)
  })

  it("Should be able to create a new user", async () => {
    const user = {
      name: "John Doe",
      email: "john@example.com",
      password: "123"
    }

    await createUserUseCase.execute({
      name: user.name,
      email: user.email,
      password: user.password
    })

    expect(user).toHaveProperty("name")
    expect(user).toHaveProperty("email")
    expect(user).toHaveProperty("password")
  })

  it("Should not be able to create a user with same email", async () => {
    expect(async () => {
      const user = {
        name: "John Doe",
        email: "john@example.com",
        password: "123"
      }

      await createUserUseCase.execute({
        name: user.name,
        email: user.email,
        password: user.password
      })

      await createUserUseCase.execute({
        name: user.name,
        email: user.email,
        password: user.password
      })
    }).rejects.toBeInstanceOf(CreateUserError)
  })
})
