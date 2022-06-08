import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { GetBalanceError } from "./GetBalanceError"
import { GetBalanceUseCase } from "./GetBalanceUseCase"
import { OperationType } from '../../entities/Statement'

let getBalanceUseCase: GetBalanceUseCase
let statementRepositoryInMemory: InMemoryStatementsRepository
let usersRepositoryInMemory: InMemoryUsersRepository

describe("Get Balance", () => {
  beforeEach(() => {
    statementRepositoryInMemory = new InMemoryStatementsRepository()
    usersRepositoryInMemory = new InMemoryUsersRepository()
    getBalanceUseCase = new GetBalanceUseCase(statementRepositoryInMemory, usersRepositoryInMemory)
  })

  it("Should be able to show the balance", async () => {
    const user = {
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123"
    }

    const newUser = await usersRepositoryInMemory.create(user)

    const userId = String(newUser.id)

    const deposit = {
      type: OperationType.DEPOSIT,
      amount: 100,
      description: "test"
    }

    await statementRepositoryInMemory.create({
      user_id: userId,
      type: deposit.type,
      amount: deposit.amount,
      description: deposit.description
    })
    const newWithdrawal = {
      type: OperationType.WITHDRAW,
      amount: 600,
      description: "Empréstimo",
    };

    await statementRepositoryInMemory.create({
      user_id: userId,
      type: newWithdrawal.type,
      amount: newWithdrawal.amount,
      description: newWithdrawal.description,
    });

    const responseTest = await getBalanceUseCase.execute({ user_id: userId });

    expect(responseTest.statement.length).toBe(2);

  });

  it("Should not be able to show Balance by wrong user_id", () => {
    expect(async () => {
      await getBalanceUseCase.execute({ user_id: "failed_id" });
    }).rejects.toBeInstanceOf(GetBalanceError);
  });
});
