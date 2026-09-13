import { supabase } from './supabase';
import type { Database } from '../types/database.types';

type TransactionInsert = Database['public']['Tables']['transactions']['Insert'];

export const spendifyApi = {
  async getProfile(userId: string) {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
    if (error) throw error;
    return data;
  },

  async getCards(userId: string) {
    const { data, error } = await supabase.from('cards').select('*').eq('user_id', userId);
    if (error) throw error;
    return data;
  },
  
  async getPeople(userId: string) {
    const { data, error } = await supabase.from('people').select('*').eq('user_id', userId);
    if (error) throw error;
    return data;
  },

  async getTransactions(userId: string) {
    const { data, error } = await supabase.from('transactions').select('*, cards(brand, last4)').eq('user_id', userId).order('date', { ascending: false }).limit(5);
    if (error) throw error;
    return data;
  },

  async getAllTransactions(userId: string) {
    const { data, error } = await supabase.from('transactions').select('amount, date').eq('user_id', userId).order('date', { ascending: true });
    if (error) throw error;
    return data;
  },

  async getInsights(userId: string) {
    const { data, error } = await supabase.from('ai_insights').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(1);
    if (error) throw error;
    return data;
  },

  async createTransaction(transaction: TransactionInsert) {
    const { data, error } = await supabase.from('transactions').insert(transaction).select().single();
    if (error) throw error;
    return data;
  }
};
