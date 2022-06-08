import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO"
import { OperationType } from "../../entities/Statement"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementError } from "./CreateStatementError"
import { CreateStatementUseCase } from "./CreateStatementUseCase"


let userRepositoryInMemory: InMemoryUsersRepository
let statementRepositoryInmemory: InMemoryStatementsRepository
let createStatementUseCase: CreateStatementUseCase


describe("Create Statement", () => {

  beforeEach(() => {
    userRepositoryInMemory = new InMemoryUsersRepository()
    statementRepositoryInmemory = new InMemoryStatementsRepository()
    createStatementUseCase = new CreateStatementUseCase(userRepositoryInMemory, statementRepositoryInmemory)
  })

  it("Should be able to create a new statement", async () => {
    const user: ICreateUserDTO = {
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123"
    }

    const newUser = await userRepositoryInMemory.create(user)

    const userId = String(newUser.id)

    const deposit = {
      type: OperationType.DEPOSIT,
      amount: 100,
      description: "Water"
    }

    const statementDeposit = await createStatementUseCase.execute({
      user_id: userId,
      type: deposit.type,
      amount: deposit.amount,
      description: deposit.description
    })

    const withdraw = {
      type: OperationType.WITHDRAW,
      amount: 50,
      description: "Food"
    }

    const statementWithdraw = await createStatementUseCase.execute({
      user_id: userId,
      type: withdraw.type,
      amount: withdraw.amount,
      description: withdraw.description
    })

    expect(statementDeposit).toHaveProperty("id")
    expect(statementWithdraw).toHaveProperty("id")
  })

  it("Should not be able to create a new deposit if user failed", async () => {
    expect(async () => {
      const newDeposit = {
        type: OperationType.DEPOSIT,
        amount: 100,
        description: "Water"
      }

      await createStatementUseCase.execute({
        user_id: "Not found",
        type: newDeposit.type,
        amount: newDeposit.amount,
        description: newDeposit.description
      })
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound)
  })

  it("Shold not be able to create a new withdraw if user failed", async () => {
    expect(async () => {
      const newWithdraw = {
        type: OperationType.DEPOSIT,
        amount: 100,
        description: "Food"
      }

      await createStatementUseCase.execute({
        user_id: "Not found",
        type: newWithdraw.type,
        amount: newWithdraw.amount,
        description: newWithdraw.description
      })
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound)
  })

  it("Should not be able to create a new withdraw if user has insufficient funds", async () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        name: "John Doe",
        email: "johndoe@example.com",
        password: "123"
      }

      const newUser = await userRepositoryInMemory.create(user)

      const withdraw = {
        type: OperationType.WITHDRAW,
        amount: 100,
        description: "Food"
      }

      await createStatementUseCase.execute({
        user_id: String(newUser.id),
        type: withdraw.type,
        amount: withdraw.amount,
        description: withdraw.description
      })
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds)
  })
})
