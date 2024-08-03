import * as dotenv from 'dotenv'
import IUsers from '../entities/user.entity';
import userModel from '../frameworks/models/user.model'
dotenv.config()

export class AdminRepository {
    constructor() { }

    getAdminEmail(): string {
        return process.env.ADMIN_EMAIL || '';
    }

    getAdminPassword(): String {
        return process.env.ADMIN_PASSWORD || '';
    }

    getJwtSecret(): string {
        return process.env.JWT_SECRET || 'wiskandwillow';
    }

    async getAllUsers():Promise<IUsers[]>{
        const users = await userModel.find()
        return users
    }

    async updateUserStatus(user:IUsers):Promise<IUsers | null>{
      const updatedUser = await userModel.findByIdAndUpdate(
        user._id,
        {status:user.status},
        {new:true}
      )

      return updatedUser
    }
}

export default new AdminRepository();