import mongoose from "mongoose";
import IUsers from "../../entities/user.entity";
import { IContactMessage } from "../../entities/contact.entity";

export interface IUserRepository{
     createUser(name: string, email: string, password: string, mobile: number): Promise<IUsers>
     saveRefreshToken(userId: string, refreshToken: string): Promise<void>
     findOne(refreshToken: string): Promise<IUsers | null> 
     removeRefreshToken(userId: string): Promise<void>
     findUserEmail(email: string): Promise<IUsers | null>
     updateUserStatus(userId: mongoose.Types.ObjectId, is_Verified: boolean):Promise<IUsers | null>
     findById(id: string): Promise<IUsers | null>
     updateUserData(userId: string, updateData: Partial<IUsers>): Promise<IUsers | null>
     updatePassword(userId: string, oldPassword: string, newPassword: string): Promise<IUsers | null> 
     updateProfilePicture(userId: string, imageUrl: string): Promise<void> 
     checkUser(email: string): Promise<IUsers | null>
     login(data: IUsers, token: string): Promise<string>
     creteGoogleUser(name: string, email: string, password: string, imageUrl: string, isGoogleAuth: boolean , status: boolean ): Promise<IUsers> 
     savePasswordResetToken(userId: string, token: string): Promise<void>
     updateResetPassword(userId: string, newPassword: string): Promise<void>
     clearPasswordResetToken(userId: string): Promise<void>
     userDetails(userId:string):Promise<IUsers | null>
     saveContactMessage(message: IContactMessage): Promise<IContactMessage>

}