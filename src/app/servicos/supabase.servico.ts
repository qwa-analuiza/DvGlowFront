import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { configuracao } from '../configuracao';

/** Conexão única com o Supabase (banco, login e armazenamento de imagens). */
@Injectable({ providedIn: 'root' })
export class SupabaseServico {
  readonly cliente: SupabaseClient = createClient(configuracao.supabaseUrl, configuracao.supabaseChave);
}
