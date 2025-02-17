import { prisma } from "../lib/prismaClient"

export type UserData ={
  id:string,
  user_name:string,
  icon_url:string | null
}

export const AuthRepo ={
  
 findUser:async(id:string)=>{
  return await prisma.users.findUnique({
    where: { id }
  })
 },

 createUser:async({id,user_name,icon_url}:UserData)=>{
return await prisma.users.create({
  data: {
    id,
		user_name,
		icon_url
  }
})
 }
  
}