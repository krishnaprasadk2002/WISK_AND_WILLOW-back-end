import { UserRepository } from "../respository/userRepository";

export class UserUseCase{
    private userRep: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRep = userRepository;
    }

    async signUp(name: string, email: string, password: string, mobile: number) {
        const existingUser = await this.userRep.findUserEmail(email);
        if (existingUser) {
            throw new Error("User already exists");
        }

        const user = await this.userRep.createUser(name, email, password, mobile);
        return user;
    }
}