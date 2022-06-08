import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase"
import { ICreateUserDTO } from "../createUser/ICreateUserDTO"
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase"
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError"

let authenticateUserUseCase: AuthenticateUserUseCase
let inMemoryUserRepository: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase

describe(("User Authentication"), () => {

  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUsersRepository()
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUserRepository)
    createUserUseCase = new CreateUserUseCase(inMemoryUserRepository)
  })

  it("Should be able to authenticate an user", async () => {

    const user = {
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123"
    }

    await createUserUseCase.execute(user)

    const result = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password
    })

    expect(result).toHaveProperty("token")
    expect(result).toHaveProperty("user")

  })

  it("Should not be able to authenticate a non-existing user", async () => {

    expect(async () => {
      await authenticateUserUseCase.execute({
        email: "jane@example.com",
        password: "1234"
      })
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })

  it("Should not be able to authenticate user with incorrect password", async () => {

    expect(async () => {
      const user: ICreateUserDTO = {
        name: "John Doe",
        email: "johndoe@example.com",
        password: "123987"
      }

      await createUserUseCase.execute(user)

      await authenticateUserUseCase.execute({
        email: user.email,
        password: "Incorrectpassword"
      })
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })
})
