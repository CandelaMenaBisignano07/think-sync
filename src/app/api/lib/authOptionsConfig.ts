import GoogleProvider from 'next-auth/providers/google';
import { connect } from './connect';
import { configs } from '@/app/lib/config';
import { userModel } from '../model/user.model';
import GithubProvider from 'next-auth/providers/github'
import { AuthOptions } from 'next-auth';

export const authOptions ={
    secret: configs.nextAuthSecret,
    providers:[
        GoogleProvider({
            clientId:configs.googleClientId as string,
            clientSecret:configs.googleClientSecret as string,
        }),
        GithubProvider({
            clientId:configs.githubClientId as string,
            clientSecret: configs.githubClientSecret as string
        })
    ],
    session:{
        maxAge:60*1000*1000,
        strategy:'jwt',
    },
    callbacks:{
        async signIn({user,account}){
            await connect();
            const userExists = await userModel.findOne({email:user.email, provider:account?.provider});
            if(!userExists){
                const newUser = {
                    email:user.email,
                    name:user.name || null,
                    image:user.image || null,
                    provider:account?.provider as string,
                }
                const createdUser= await userModel.create(newUser);
                user._id = createdUser._id
            }
            return true
        },
        async jwt({user,token, account}){
            if(account){
                token.provider = account.provider
                const userFound = await userModel.findOne({email:user.email, provider:account.provider});
                if(!userFound) return token
                token._id = userFound._id
            }
            return token
        },
        async session({token, session}){
            if(token){
                session.user._id = token._id 
                session.user.provider = token.provider
                console.log(session, '2')
            }
            return session
        }
    },
} as AuthOptions