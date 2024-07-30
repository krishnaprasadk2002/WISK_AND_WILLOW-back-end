import Users from "../frameworks/models/user.model";
import IUsers from "../entities/user.entity";
import { hashPassword } from "../frameworks/utils/hashedPassword";
import mongoose from "mongoose";


export class UserRepository {
    constructor() {

    }

    async createUser(name: string, email: string, password: string, mobile: number): Promise<IUsers> {
        const hashingPassword = await hashPassword(password)
        const user = new Users({ name, email, password: hashingPassword, mobile })
        return await user.save()
    }

    async findUserEmail(email: string): Promise<IUsers | null> {
        return await Users.findOne({ email })
    }

    async updateUserStatus(userId: mongoose.Types.ObjectId, is_Verified: boolean) {
        const result = await Users.findByIdAndUpdate(userId, { is_Verified }, { new: true });
        return result;
    }

}