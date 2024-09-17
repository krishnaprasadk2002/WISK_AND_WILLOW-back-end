import { Request, Response } from "express";
import { UserUseCase } from "../usecase/userUseCase";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { authenticatedRequest } from "../frameworks/middlewares/authenticateToken";
import { HttpStatusCode } from "../enums/httpStatusCodes";


export class UserController {
  private userUseCase: UserUseCase;

  constructor(userUseCase: UserUseCase) {
    this.userUseCase = userUseCase
  }



  async userSignUp(req: Request, res: Response) {
    const { name, email, password, mobile } = req.body;
    try {
      const user = await this.userUseCase.signUp(name, email, password, mobile);
      res.status(HttpStatusCode.CREATED).json(user);
    } catch (error) {
      if (error instanceof Error) {
        res.status(HttpStatusCode.BAD_REQUEST).json({ message: error.message });
      } else {
        res.status(HttpStatusCode.BAD_REQUEST).json({ message: "An unknown error occurred" });
      }
    }
  }

  async verifyOtp(req: Request, res: Response) {
    try {
      const { userId, otp } = req.body
      const result = await this.userUseCase.verifyOtp(userId, otp);
      res.status(HttpStatusCode.OK).json(result)
    } catch (error) {
      if (error instanceof Error) {
        res.status(HttpStatusCode.BAD_REQUEST).json({ message: error.message });
      } else {
        res.status(HttpStatusCode.BAD_REQUEST).json({ message: "An unknown error occurred" });
      }
    }
  }

  async resendOtp(req: Request, res: Response) {
    const { email } = req.body;
    try {
      const user = await this.userUseCase.findUserByEmail(email);
      if (!user) {
        return res.status(HttpStatusCode.NOT_FOUND).json({ message: 'User not found' });
      }

      const otp = this.userUseCase.generateOtp();
      await this.userUseCase.createOtp(String(user._id), otp);
      await this.userUseCase.sendOtpEmail(email, otp);

      res.status(HttpStatusCode.OK).json({ message: 'OTP resent successfully' });

    } catch (error) {
      console.error('Error during OTP resend', error);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'An error occurred during OTP resend' });
    }
  }

  async userLogin(req: Request, res: Response) {
    const { email, password } = req.body;
    try {
      const user = await this.userUseCase.findUserByEmail(email);

      if (!user) {
        return res.status(HttpStatusCode.NOT_FOUND).json({ message: "User not found" });
      }

      if (!user.is_Verified) {
        // Generate OTP create OTP record, and send email in fail to verfication register round
        const otp = this.userUseCase.generateOtp();
        await this.userUseCase.createOtp(String(user._id), otp);
        await this.userUseCase.sendOtpEmail(user.email, otp);

        return res.status(HttpStatusCode.FORBIDDEN).json({
          message: 'Account not verified. Please verify your account.',
          userId: user._id
        });
      }

      if (user.status) {
        return res.status(HttpStatusCode.FORBIDDEN).json({ message: 'Your account is blocked' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password as string);
      if (!isPasswordValid) {
        return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: "Invalid password" });
      }

      // Token generation
      const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET || 'wiskandwillow', { expiresIn: '30d' });
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 3600000
      });

      return res.status(HttpStatusCode.OK).json({ message: 'Login success', token });
    } catch (error) {
      console.error('Error during user login:', error);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Server error' });
    }
  }

  async googleSignin(req: Request, res: Response) {
    try {
      const { token } = req.body
      const jwtToken = await this.userUseCase.userGoogleLogin(token)

      if (jwtToken) {
        res.cookie('token', jwtToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 3600000
        })
        return res.status(HttpStatusCode.OK).json({ message: 'Google Authentication successful', token: jwtToken })
      } else {
        res.status(HttpStatusCode.UNAUTHORIZED).json({ message: 'Authentication Failed' })
      }
    } catch (error) {
      console.error("Goole Atuh error", error)
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error' });
    }
  }


  async forgetPassword(req: Request, res: Response): Promise<Response> {
    const { email } = req.body;
    try {
      await this.userUseCase.forgetPassword(email);
      return res.status(HttpStatusCode.OK).json({ message: 'Password reset link sent to your email' });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(HttpStatusCode.BAD_REQUEST).json({ message: error.message });
      } else {
        return res.status(HttpStatusCode.BAD_REQUEST).json({ message: 'An unknown error occurred' });
      }
    }
  }


  async resetPassword(req: Request, res: Response): Promise<Response> {
    const { token, password } = req.body;
  
    console.log('Token received:', token);
  
    try {
      await this.userUseCase.resetPassword(token, password);
      return res.status(HttpStatusCode.OK).json({ message: 'Password has been reset' });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(HttpStatusCode.BAD_REQUEST).json({ message: error.message });
      } else {
        return res.status(HttpStatusCode.BAD_REQUEST).json({ message: 'An unknown error occurred' });
      }
    }
  }
  

  async userLogout(req: Request, res: Response): Promise<void> {
    this.userUseCase.logoutExecute()

    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    })
    console.log('User logged out');
    res.status(HttpStatusCode.OK).json({ message: 'Logout successful' });
  }

  async userProfile(req: authenticatedRequest, res: Response) {
    try {
      const userId = req.user?.userId as string;
      const user = await this.userUseCase.userProfileData(userId)

      if (!user) {
        return res.status(HttpStatusCode.NOT_FOUND).json({ message: 'User not found' });
      }

      res.json({
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        imageUrl: user.imageUrl
      })
    } catch (error) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'An error occurred' });
    }
  }

  async updateProfile(req: authenticatedRequest, res: Response): Promise<void> {

    const userId = req.user?.userId
    const { name, mobile, oldPassword, newPassword } = req.body

    try {
      if (oldPassword && newPassword) {
        await this.userUseCase.updatePassword(userId as string, oldPassword, newPassword)
      }
      const UpdatedUser = await this.userUseCase.updateUserProfile(userId as string, { name, mobile })
      if (UpdatedUser) {
        res.json(UpdatedUser)
      } else {
        res.status(HttpStatusCode.NOT_FOUND).json({ message: 'User not found' });
      }
    } catch (error) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Error updating profile', error });
    }
  }


  async updateProfileImage(req: authenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId
      console.log(userId);
      const base64Image = req.body.image
      console.log(base64Image);

      const imageUrl = await this.userUseCase.updateProfileImage(userId as string, base64Image)
      res.status(HttpStatusCode.OK).json({ url: imageUrl })

    } catch (error) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: 'Error updating profile image' });
    }
  }

  isAuth(req:Request,res:Response){
    res.status(HttpStatusCode.OK).json({message:"Success"})
  }

    async getUserDetailsByChat (req: authenticatedRequest, res: Response) {
    try {
      const userId = req.user?.userId; 
      if (!userId) {
        return res.status(HttpStatusCode.UNAUTHORIZED).json({ error: 'User ID not found' });
      }
      const userData = await this.userUseCase.getUserDetails(userId); 
      if (!userData) {
        return res.status(HttpStatusCode.NOT_FOUND).json({ error: 'User not found' });
      }
      return res.status(HttpStatusCode.OK).json(userData);
    } catch (error) {
      console.error('Error fetching user details:', error);
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
    }
  };
  
}
