import { supabase } from './supabase'

export const getSecondMarketSettings = async () => {
  const { data, error } = await supabase
    .from('second_market_settings')
    .select('*')
    .order('id', { ascending: true })

  if (error) {
    throw error
  }

  return data
}

export const updateSecondMarketSetting = async (
  productKey,
  buyOffset,
  sellOffset
) => {
  const { data, error } = await supabase
    .from('second_market_settings')
    .update({
      buy_offset: buyOffset,
      sell_offset: sellOffset,
      updated_at: new Date().toISOString(),
    })
    .eq('product_key', productKey)
    .select()

  if (error) {
    throw error
  }

  return data
}