import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { OperationType } from "../../entities/Statement"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase"


let getStatementOperationUseCase: GetStatementOperationUseCase
let statementRepositoryInMemory: InMemoryStatementsRepository
let userRepositoryInMemory: InMemoryUsersRepository

describe("Get Statement Operation", () => {
  beforeEach(() => {
    userRepositoryInMemory = new InMemoryUsersRepository()
    statementRepositoryInMemory = new InMemoryStatementsRepository()
    getStatementOperationUseCase = new GetStatementOperationUseCase(userRepositoryInMemory, statementRepositoryInMemory)
  })

  it("Should be able to show a statement operation by user", async () => {
    const user = {
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123"
    }

    const newUser = await userRepositoryInMemory.create(user)

    const userId = String(newUser.id)

    const deposit = {
      type: OperationType.DEPOSIT,
      amount: 100,
      description: "Water",
    }

    const statementDeposit = await statementRepositoryInMemory.create({
      user_id: userId,
      type: deposit.type,
      amount: deposit.amount,
      description: deposit.description,
    })

    const statementDepositId = String(statementDeposit.id)

    const result = await getStatementOperationUseCase.execute({
      user_id: userId,
      statement_id: statementDepositId,
    })

    expect(result).toHaveProperty("id")
    expect(result).toHaveProperty("type")
    expect(result).toHaveProperty("description")
  })
})
