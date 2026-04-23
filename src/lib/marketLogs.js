import { supabase } from './supabase'

export const createMarketLog = async ({
  productKey,
  productTitle,
  oldBuyOffset,
  oldSellOffset,
  newBuyOffset,
  newSellOffset,
  adminEmail,
}) => {
  const { data, error } = await supabase
    .from('market_logs')
    .insert({
      product_key: productKey,
      product_title: productTitle,
      old_buy_offset: oldBuyOffset,
      old_sell_offset: oldSellOffset,
      new_buy_offset: newBuyOffset,
      new_sell_offset: newSellOffset,
      admin_email: adminEmail,
    })
    .select()

  if (error) {
    throw error
  }

  return data
}

export const getMarketLogs = async () => {
  const { data, error } = await supabase
    .from('market_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) {
    throw error
  }

  return data
}