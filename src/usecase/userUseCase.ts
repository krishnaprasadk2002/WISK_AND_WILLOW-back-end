import mongoose from "mongoose";
import nodemailer from "nodemailer";

import { OtpRepository } from "../respository/otp.repository";
import { UserRepository } from "../respository/userRepository";
import crypto from "crypto";
import IUsers from "../entities/user.entity";
import uploadCloudinary from "../frameworks/configs/cloudinary";

export class UserUseCase {
  private userRep: UserRepository;
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

}
