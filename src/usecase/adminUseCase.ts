import jwt from "jsonwebtoken"
import adminRepository from "../respository/adminRepository"
import  AdminRepository  from "../respository/adminRepository"
export class AdminUseCase{
    constructor(){}

    async execute(email:string,password:string):Promise<string | null>{
        const adminEmail = AdminRepository.getAdminEmail()
        const adminPassword = adminRepository.getAdminPassword()
        const jwtSecret = AdminRepository.getJwtSecret();

        if(email === adminEmail && password === adminPassword){
            const adminToken = jwt.sign({email},jwtSecret,{expiresIn:'30d'})
            return adminToken
        }
        return null
    }

     executeLogout():void{

    }

    async getAllUsers(){
        return adminRepository.getAllUsers()
    }


}