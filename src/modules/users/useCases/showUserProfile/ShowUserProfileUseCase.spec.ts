import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let inMemoryUserRepository: InMemoryUsersRepository
let showUserProfileUseCase: ShowUserProfileUseCase

describe("Show User Profile", () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUserRepository);
  })

  it("Should be able to show user profile", async () => {
    const user: ICreateUserDTO = {
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123"
    }

    const { id: user_id } = await inMemoryUserRepository.create(user)
    const profile = await showUserProfileUseCase.execute(String(user_id))

    expect(profile.id).toEqual(user_id)
  })
})
