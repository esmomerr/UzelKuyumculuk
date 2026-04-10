import axios from 'axios'

const BASE_URL = 'https://api.frankfurter.dev/v1'

export const getUsdToTry = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/latest?base=USD&symbols=TRY`)
    return response.data
  } catch (error) {
    console.error('USD/TRY verisi alınamadı:', error)
    throw error
  }
}