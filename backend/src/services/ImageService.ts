import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

export class ImageService {
  /**
   * Processa uma imagem. Se for Base64, salva no Supabase Storage e retorna a URL pública.
   * Se já for uma URL, apenas retorna a mesma URL.
   */
  static async processImage(imageData: string | null | undefined): Promise<string | null> {
    if (!imageData) return null;

    // Se já for uma URL, não faz nada
    if (imageData.startsWith('http') || imageData.startsWith('/uploads')) {
      return imageData;
    }

    // Se for Base64 (data:image/jpeg;base64,.....)
    if (imageData.startsWith('data:image')) {
      try {
        const matches = imageData.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        
        if (!matches || matches.length !== 3) {
          throw new Error('Formato base64 inválido');
        }

        const type = matches[1]; // ex: image/jpeg
        const buffer = Buffer.from(matches[2], 'base64');
        
        // Determinar extensão
        let extension = 'jpg';
        if (type === 'image/png') extension = 'png';
        if (type === 'image/webp') extension = 'webp';
        if (type === 'image/gif') extension = 'gif';

        // Nome único
        const fileName = `${crypto.randomUUID()}.${extension}`;
        
        // Fazer upload para o bucket 'uploads' no Supabase
        const { data, error } = await supabase.storage
          .from('uploads')
          .upload(fileName, buffer, {
            contentType: type,
            upsert: false
          });

        if (error) {
          throw error;
        }

        // Retornar a URL Pública
        const { data: publicUrlData } = supabase.storage
          .from('uploads')
          .getPublicUrl(fileName);

        return publicUrlData.publicUrl;

      } catch (err) {
        console.error('Erro ao processar imagem Base64 para o Supabase:', err);
        return null;
      }
    }

    return imageData;
  }
}
