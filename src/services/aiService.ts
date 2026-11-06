import axios from 'axios';

class AIService {
  private static instance: AIService;
  private geminiApiKey: string = ""; 

  private constructor() {
    // Singleton pattern
  }

  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  /**
   * Gemini API'ye istek gönderir ve yanıt alır
   * @param prompt Kullanıcının sorduğu soru veya giriş metni
   * @returns Promise<string> API'den gelen metin yanıtı
   */
  async getGeminiResponse(prompt: string,nearbyParkingSummary:string,messages:string): Promise<string> {
    try {
    
      messages = JSON.stringify(JSON.parse(messages).slice(-5).map((m:any) => m.text));
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.geminiApiKey}`,
        {
          contents: [
            {
              parts: [
                
                  {
                    text: `
                    Otopark Verileri: ${nearbyParkingSummary}
Geçmiş Mesajlar: ${messages}
Kullanıcı Sorusu: '${prompt}'

Cevap Kuralları:
- Kısa, net ve Türkçe olmalı.
- Hava durumu sorusuysa: sadece '2' yaz.
- Trafik sorusuysa: sadece '3' yaz.
- Navigasyon sorusuysa: '4|navigate|lat|lng' formatında yanıt ver.
- Otopark detayı isteniyorsa: '5|detail|id' formatında yanıt ver.
- Fiyatla ilgili soru ise: '6|price|id' formatında yanıt ver.
- Favorilere eklemek ile ilgili soru ise: '7|favorite|add|id' formatında yanıt ver.
- Favorilerden çıkarmak ile ilgili soru ise: '7|favorite|delete|id' formatında yanıt ver.
- ❗ **Kullanıcıdan hiçbir zaman id ya da teknik bilgi isteme.** 
- ❗ Cevaplarında açık yönlendirme ve öneri sun (örn: “Doluluk oranı düşük olan X otoparkı tercih edilebilir” gibi).`
                  }              ]
            }
          ]
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      console.log(response);
      // API yanıtından metni çıkar
      if (response.data && 
          response.data.candidates && 
          response.data.candidates[0] && 
          response.data.candidates[0].content && 
          response.data.candidates[0].content.parts && 
          response.data.candidates[0].content.parts[0]) {
        return response.data.candidates[0].content.parts[0].text;
      }
      
      return ""; // Yanıt alınamazsa boş string döndür
    } catch (error) {
      console.error('Gemini API hatası:', error);
      throw error; // Hatayı yukarı ilet
    }
  }
  async getGeminiResponseComponent(prompt: string): Promise<string> {
    try {
      console.log("getGeminiResponse"+prompt);
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.geminiApiKey}`,
        {
          contents: [
            {
              parts: [
                {
                  text: `Parkomobil uygulaması için kullanıcının '${prompt}' sorusunu yanıtla.Kısa ve net bir yanıt ver.Yanıt Türkçe olmalı.`
                }
              ]
            }
          ]
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      console.log(response);
      // API yanıtından metni çıkar
      if (response.data && 
          response.data.candidates && 
          response.data.candidates[0] && 
          response.data.candidates[0].content && 
          response.data.candidates[0].content.parts && 
          response.data.candidates[0].content.parts[0]) {
        return response.data.candidates[0].content.parts[0].text;
      }
      
      return ""; // Yanıt alınamazsa boş string döndür
    } catch (error) {
      console.error('Gemini API hatası:', error);
      throw error; // Hatayı yukarı ilet
    }
  }
}

export default AIService; 