import { useEffect, useState } from 'react'

import { Box, Typography, Button, CircularProgress } from '@mui/material'
import { useAlert } from '../../../provider/AlertProvider'
import { useAuthContext } from '../../../provider/AuthProvider'
import { useLoading } from '../../../provider/LoadingProvider'
import { useNavigation } from '../../../hooks/useNavigation'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { InvitationApi } from '../api/InvitationApi'




const InviteChecker = () => {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const [groupInfo, setGroupInfo] = useState<{ groupId: number, groupName: string } | null>(null)
  const [error, setError] = useState('')
  const user= useAuthContext()
  const navigate = useNavigate()
  const {loading,setLoading} = useLoading()
  const {toLogin} = useNavigation()
  const { showAlert } = useAlert()
 
 console.log(token) 
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setError('招待リンクが無効です')
        setLoading(false)
        console.log('トークンがない')
        return
      }

      try {
        const response = await InvitationApi.validateInvitation(token)
        setGroupInfo(response.data)
        console.log('正常に発火');
        
        setLoading(false)
      } catch (error) {
        setError('招待リンクが無効か期限切れです')
        setLoading(false)
      }
    }

    validateToken()
  }, [])

  
  const acceptInvitation = async () => {
    if (!token || !user) return  
    try {
      setLoading(true)
      showAlert('グループに参加しました', 'success')
      //　TODO isActive trueにする処理をバックエンドで実行する
      navigate('/task') 
    } catch (error) {
      showAlert('グループへの参加に失敗しました', 'error')
    } finally {
      setLoading(false)
    }
  }

  
  const goToLogin = () => {
    
    navigate(`/login?redirect=/invite&token=${token}`)
  }

  const goToSignup = () => {
    
    navigate(`/signup?redirect=/invite&token=${token}`)
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', p: 4 }}>
        <Typography variant="h5" color="error" gutterBottom>
          {error}
        </Typography>
        <Button variant="contained" onClick={() => toLogin}>
         ログイン画面に戻る
        </Button>
      </Box>
    )
  }

  return (
    <Box sx={{ textAlign: 'center', p: 4 }}>
      <Typography variant="h4" gutterBottom>
        グループ招待
      </Typography>
      
      {groupInfo && (
        <Typography variant="h5" gutterBottom>
          「{groupInfo.groupName}」に招待されています
        </Typography>
      )}

      {user ? (
        <Button 
          variant="contained" 
          color="primary" 
          onClick={acceptInvitation}
          sx={{ mt: 2 }}
        >
          参加する
        </Button>
      ) : (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body1" gutterBottom>
            参加するにはログインまたは新規登録が必要です
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={goToLogin}
            sx={{ mt: 1 }}
          >
            ログインする
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={goToSignup}
            sx={{ mt: 1 }}
          >
            新規登録
          </Button>
        </Box>
      )}
    </Box>
  )
}

export default InviteChecker