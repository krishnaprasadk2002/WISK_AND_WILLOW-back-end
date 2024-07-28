import { Request, Response } from "express";
import { UserUseCase } from "../usecase/userUseCase";

export class UserController{
    private userUseCase:UserUseCase;

    constructor(userUseCase: UserUseCase){
        this.userUseCase  = userUseCase
    }
    async userSignUp(req: Request, res: Response) {
        console.log('Received data:', req.body);  // Log received data
        const { name, email, password, mobile } = req.body;
        console.log('Extracted fields:', { name, email, password, mobile });  // Log extracted fields
        try {
          const user = await this.userUseCase.signUp(name, email, password, mobile);
          console.log('User created:', user);
          res.status(201).json(user);
        } catch (error) {
          console.error('Error during user sign up:', error);
          if (error instanceof Error) {
            res.status(400).json({ message: error.message });
          } else {
            res.status(400).json({ message: "An unknown error occurred" });
          }
        }
      }
    }      