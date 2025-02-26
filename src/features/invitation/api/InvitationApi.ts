import { api } from "../../../lib/axios"


export const InvitationApi = {
  generateInvitation: (groupId: number) => {
    return api.post('/invitation', { groupId })
  },
  
  validateInvitation: (token: string) => {
    return api.get(`/invitation/validate?token=${token}`)
  },
  
  acceptInvitation: (token: string) => {
    return api.post('/invitation/accept', { token })
  }
}