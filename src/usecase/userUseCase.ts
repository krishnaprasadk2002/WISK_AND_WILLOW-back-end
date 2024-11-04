import mongoose from "mongoose";
import nodemailer from "nodemailer";
import jwt from 'jsonwebtoken'
import { OtpRepository } from "../respository/otp.repository";
import { UserRepository } from "../respository/userRepository";
import crypto from "crypto";
import IUsers from "../entities/user.entity";
import uploadCloudinary from "../frameworks/configs/cloudinary";
import verifyGoogleIdToken from "../frameworks/utils/googleVerfication";
import bcrypt from "bcrypt"
import { IUserRepository } from "../interfaces/repositories/userRepository";


export class UserUseCase {
  private userRep: IUserRepository;
  private otpRep: OtpRepository;

  constructor(userRepository: UserRepository, otpRepository: OtpRepository) {
    this.userRep = userRepository;
    this.otpRep = otpRepository;
  }

  generateOtp(): string {
    return crypto.randomInt(100000, 999999).toString();
  }

  async findUserByEmail(email: string): Promise<IUsers | null> {
    return await this.userRep.findUserEmail(email);
  }

  async createOtp(userId: string, otp: string): Promise<void> {
    await this.otpRep.createOtp(userId, otp);
  }

  async signUp(name: string, email: string, password: string, mobile: number) {
    const existingUser = await this.userRep.findUserEmail(email);
    if (existingUser) {
      throw new Error("User already exists");
    }

    const user = await this.userRep.createUser(name, email, password, mobile);
    const otp = crypto.randomInt(100000, 999999).toString();
    await this.otpRep.createOtp(String(user._id), otp);

    await this.sendOtpEmail(email, otp);

    return user;
  }

  async verifyOtp(userId: mongoose.Types.ObjectId, otp: string) {
    const otpRecord = await this.otpRep.findOtp(userId, otp);
    if (otpRecord) {
      const updatedUser = await this.userRep.updateUserStatus(userId, true);
      await this.otpRep.deleteOtp(userId);
      return {
        success: true,
        message: "OTP verified successfully",
        user: updatedUser,
      };
    } else {
      throw new Error("Invalid OTP");
    }
  }

  async validateRefreshToken(refreshToken: string): Promise<IUsers | false> {
    const user = await this.userRep.findOne(refreshToken);
    
    if (!user || (user.expiresAt && user.expiresAt.getTime() < Date.now())) {
        return false; 
    }

    return user;
}


  async checkUserToken(userId: string): Promise<void> {
    const user = await this.userRep.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }

    // Use the user's refresh token to validate
    const expired = !(await this.validateRefreshToken(user.refreshToken!));
    if (expired) {
        console.log('Token has expired');
    } else {
        console.log('Token is still valid');
    }
}

async saveRefershToken(userId:string,newToken:string):Promise<void>{
  return this.saveRefershToken(userId,newToken)
}

  sendOtpEmail(email: string, otp: string) {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: "prasadkrishna1189@gmail.com",
      to: email,
      subject: "verify your email in WISK AND WILLOW EVENTS",
      html: `your otp is:${otp}`,
    };
    return transporter.sendMail(mailOptions);
  }

  async userGoogleLogin(data: string): Promise<string> {
    const payload = await verifyGoogleIdToken(data);

    if (!payload) {
      throw new Error("Invalid Google token");
    }

    let user = await this.userRep.checkUser(payload.email as string);

    if (!user) {
      const userData: IUsers = {
        email: payload.email,
        name: payload.name,
        password: payload.sub,
        imageUrl: payload.picture,
        isGoogleAuth: true,
        status: false
      } as unknown as IUsers;

      await this.userRep.creteGoogleUser(userData.name, userData.email, userData.password, userData.imageUrl as string, true, false);
      user = await this.userRep.checkUser(payload.email as string);
    }

    if (user) {
      if (!user.isGoogleAuth) {
        user.isGoogleAuth = true;
      }

      const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET || 'wiskandwillow', { expiresIn: '30d' });
      await this.userRep.login(user, token);
      return token;
    } else {
      throw new Error("User not found after creation");
    }
  }

  logoutExecute(): void {
  }

  async userProfileData(userId: string): Promise<IUsers | null> {
    return this.userRep.findById(userId)
  }

  async updateUserProfile(userId: string, updateData: Partial<IUsers>): Promise<IUsers | null> {
    return this.userRep.updateUserData(userId, updateData);
  }

  async updatePassword(userId: string, oldPassword: string, newPassword: string): Promise<IUsers | null> {
    return this.userRep.updatePassword(userId, oldPassword, newPassword)
  }

  async updateProfileImage(userId: string, base64Image: string): Promise<string> {
    const imageUrl = await uploadCloudinary(base64Image)
    await this.userRep.updateProfilePicture(userId, imageUrl)
    return imageUrl
  }

  async forgetPassword(email: string): Promise<void> {
    const user = await this.userRep.findUserEmail(email);

    if (!user) {
      throw new Error('User not found');
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'wiskandwillow', { expiresIn: '1h' });

    await this.userRep.savePasswordResetToken(user._id as unknown as string, token);

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      to: email,
      from: process.env.EMAIL_USER,
      subject: 'Password Reset',
      html: `<p>You requested a password reset. Click the link below to reset your password:</p>
               <a href="${resetLink}">${resetLink}</a>`,
    };

    await transporter.sendMail(mailOptions);
  }




  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'wiskandwillow');
      console.log("decided", decoded);

      if (!decoded || !decoded.userId) {
        throw new Error('Invalid or expired token');
      }

      const user = await this.userRep.findById(decoded.userId);
      console.log('usejhj', user);

      if (!user || user.resetPasswordToken !== token) {
        throw new Error('Invalid token');
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await this.userRep.updateResetPassword(user._id as unknown as string, hashedPassword);
      await this.userRep.clearPasswordResetToken(user._id as unknown as string);
    } catch (error) {
      throw new Error('Error processing reset password: ' + error);
    }
  }

  getUserDetails(userId: string): Promise<IUsers | null> {
    return this.userRep.userDetails(userId)
  }

  async generateRefreshToken(userId: string): Promise<string> {
    const refreshToken = jwt.sign({ userId }, process.env.JWT_SECRET || 'wiskandwillow', { expiresIn: '30d' });
    await this.userRep.saveRefreshToken(userId, refreshToken);
    return refreshToken;
}

}
