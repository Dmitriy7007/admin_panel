import { saveTokenStorage } from '@/services/auth/auth.helper'
import authService from '@/services/auth/auth.service'
import { transformUserToState } from '@/utils/transform-user-to-state'
import { useQuery } from '@tanstack/react-query'
import { redirect } from 'next/navigation'
import { useEffect } from 'react'

export function useProfile() {
  const {
    data,
    isLoading,
    isError: isErrorProfile,
  } = useQuery({
    queryKey: ['profile'],
    queryFn: () => authService.profile(),
    refetchInterval: 1800000, // 30 minutes in milliseconds
  })

  const {
    isSuccess,
    data: dataTokens,
    isError: isErrorTokens,
  } = useQuery({
    queryKey: ['new tokens'],
    queryFn: () => authService.getNewTokens(),
    enabled: !data?.data,
  })

  if (isErrorProfile || isErrorTokens) {
    return redirect('/login')
  }

  useEffect(() => {
    if (!isSuccess) return

    if (dataTokens.data.accessToken)
      saveTokenStorage(dataTokens.data.accessToken)
  }, [isSuccess])

  const profile = data?.data

  const userState = profile ? transformUserToState(profile) : null

  return {
    isLoading,

    user: {
      ...profile,
      ...userState,
    },
  }
}
