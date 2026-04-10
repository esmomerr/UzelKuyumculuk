import axios from 'axios'

const BASE_URL = 'https://api.gold-api.com'

export const getGoldPrice = async (symbol = 'XAU') => {
  try {
    const response = await axios.get(`${BASE_URL}/price/${symbol}`)
    return response.data
  } catch (error) {
    console.error('API hata verdi:', error)
    throw error
  }
}