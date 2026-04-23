import { supabase } from './supabase'

export const signInAdmin = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    throw error
  }

  return data
}

export const signOutAdmin = async () => {
  const { error } = await supabase.auth.signOut()

  if (error) {
    throw error
  }
}

export const getCurrentUser = async () => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error) {
    throw error
  }

  return user
}