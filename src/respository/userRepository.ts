import Users from "../frameworks/models/user.model";
import IUsers from "../entities/user.entity";
import { hashPassword } from "../frameworks/utils/hashedPassword";
import mongoose from "mongoose";
import bcrypt from 'bcrypt'


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

    async findById(id: string): Promise<IUsers | null> {
        return await Users.findById(id)
    }

    async updateUserData(userId: string, updateData: Partial<IUsers>): Promise<IUsers | null> {
        return Users.findByIdAndUpdate(userId, updateData, { new: true })
    }

    async updatePassword(userId: string, oldPassword: string, newPassword: string): Promise<IUsers | null> {
        const user = await this.findById(userId)
        if (user && bcrypt.compareSync(oldPassword, user.password)) {
            user.password = bcrypt.hashSync(newPassword, 10)
            return this.updateUserData(userId, { password: user.password })
        }
        return null
    }

    async updateProfilePicture(userId: string, imageUrl: string): Promise<void> {
        await Users.updateOne({ _id: userId }, { imageUrl: imageUrl }, { new: true })
    }

    async checkUser(email: string): Promise<IUsers | null> {
        const user = await Users.findOne({ email: email })
        return user
    }

    async login(data: IUsers, token: string): Promise<string> {
        await Users.updateOne({ email: data.email }, { $push: { tokens: token } });
        return token
    }


    async creteGoogleUser(name: string, email: string, password: string, imageUrl: string, isGoogleAuth: boolean = true, status: boolean = false): Promise<IUsers> {
        const user = new Users({ name, email, password, imageUrl, isGoogleAuth, status })
        return await user.save()
    }

    async savePasswordResetToken(userId: string, token: string): Promise<void> {
        await Users.updateOne(
          { _id: userId },
          { resetPasswordToken: token, resetPasswordExpires: Date.now() + 3600000 },
          {upsert:true}
        );
      }
      
      async updateResetPassword(userId: string, newPassword: string): Promise<void> {
        await Users.updateOne(
          { _id: userId },
          { password: newPassword }
        );
      }
      
      async clearPasswordResetToken(userId: string): Promise<void> {
        await Users.updateOne(
          { _id: userId },
          { resetPasswordToken: null, resetPasswordExpires: null }
        );
      }
      
}