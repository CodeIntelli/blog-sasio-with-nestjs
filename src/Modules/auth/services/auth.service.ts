
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtAuthService } from '../../../common/services/jwt.service';
import { ContextService } from '../../../common/services/context.service';
import { userDocument } from 'src/Models/user.schema';
import { MailService } from 'src/common/services/mail.service';
import { PasswordService } from '../../../common/services/password.service';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel('User') private readonly userModel: Model<userDocument>,
        private readonly jwtService: JwtAuthService,
        private readonly message: ContextService,
        private readonly mailService: MailService,
        private readonly passwordService: PasswordService
    ) {

    }

    public async doCheckUser(userId) {
        let verifiedUser = await this.userModel.findOne({ _id: userId, isActive: true });
        if (!verifiedUser) {
            throw new NotFoundException(this.message.userNotFound);
        }
        return verifiedUser;
    }

    public async registerUser(user: any) {
        user.email = user.email.toLowerCase();
        const isAlreadyExist = await this.userModel.findOne({ email: user.email });
        if (isAlreadyExist != null) {
            throw new Error(this.message.userExist);
        }
        let securePassword = await this.passwordService.securedPassword(user.password)
        user.password = securePassword;
        const registerUserData = new this.userModel(user);
        let storedData = await registerUserData.save();

        return storedData;

    }

    public async loginUser(userEmail, UserPassword) {
        let loginData = await this.userModel.findOne({ email: userEmail }).select('+password');
        if (!loginData) {
            throw new Error(this.message.invalidCred);
        }
        if (loginData.isActive === false) {
            throw new BadRequestException("user can't actvie please send email");
        }

        let isPasswordMatched = await this.passwordService.verifyPassword(UserPassword, loginData.password);
        if (!isPasswordMatched) {
            throw new BadRequestException(this.message.invalidCred);
        }
        const payload = { username: loginData.firstname, id: loginData._id }
        let access_token = await this.jwtService.generateJwtToken(payload);
        loginData.password = undefined;
        const result = { loginData, access_token: access_token };
        return result;
    }




    public async forgotPassword(data) {
        let findUser = await this.userModel.findOne({ email: data })
        if (!findUser) {
            throw new BadRequestException(this.message.invalidEmail);
        }
        // generate token and store in the db
        let sendToken = await this.createResetPasswordToken(findUser.email)
        if (sendToken) {
            let resetTokenUrl = `http://localhost:2030/api/v1/user/reset-password/${sendToken}`;
            let generateTime = Date.now();
            let sendResetEmail = await this.mailService.resetPasswordEmail(findUser.email, findUser.firstname, generateTime, resetTokenUrl)
            console.log(sendResetEmail);
        }
    }

    public async createResetPasswordToken(email) {
        let checkEmail = await this.userModel.findOne({ email: email });
        let payload = { email: email }
        const token = await this.jwtService.generateJwtToken(payload)
        if (checkEmail) {
            checkEmail.resetPasswordToken = token
            checkEmail.save()
            return checkEmail.resetPasswordToken;
        }
        else {
            throw new BadRequestException(this.message.invalidEmail)
        }
    }

    public async resetPassword(data) {
        let existToken = await this.userModel.findOne({ resetPasswordToken: data.token });
        if (!existToken) {
            throw new BadRequestException(this.message.resetPasswordTokenNotMatch)
        }
        let secureNewPassword = await this.passwordService.securedPassword(data.newPassword);
        existToken.password = secureNewPassword;
        existToken.resetPasswordToken = null;
        let result = existToken.save();
        return result;

    }

    public async logoutUser(userId) {
        const user = await this.doCheckUser(userId)
        if (user.isOnline === true) {
            user.isOnline = false;
        }
        await user.save();
    }
}
