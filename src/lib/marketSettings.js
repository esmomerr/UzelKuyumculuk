import { supabase } from './supabase'

export const getMarketSettings = async () => {
  const { data, error } = await supabase
    .from('market_settings')
    .select('*')
    .order('id', { ascending: true })

  if (error) {
    throw error
  }

  return data
}

export const updateMarketSetting = async (
  productKey,
  buyOffset,
  sellOffset
) => {
  const { data, error } = await supabase
    .from('market_settings')
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