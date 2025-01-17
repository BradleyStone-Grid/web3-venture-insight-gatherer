const LOCAL_STORAGE_API_KEY = 'cryptorank_api_key';

export const getCryptoRankApiKey = () => {
  return localStorage.getItem(LOCAL_STORAGE_API_KEY);
};

export const setCryptoRankApiKey = (apiKey: string) => {
  localStorage.setItem(LOCAL_STORAGE_API_KEY, apiKey);
};

export const removeCryptoRankApiKey = () => {
  localStorage.removeItem(LOCAL_STORAGE_API_KEY);
};

export const fetchCryptoRankData = async (endpoint: string, params: Record<string, any> = {}) => {
  const apiKey = getCryptoRankApiKey();
  if (!apiKey) {
    throw new Error('No API key found');
  }

  const queryParams = new URLSearchParams(params);
  const url = `https://api.cryptorank.io${endpoint}?${queryParams}`;
  
  console.log('Fetching CryptoRank data:', url);
  console.log('Request headers:', { 'x-api-key': apiKey });
  
  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'x-api-key': apiKey
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('CryptoRank API error response:', errorText);
      throw new Error(`Failed to fetch data: ${errorText}`);
    }

    const data = await response.json();
    console.log('CryptoRank API response:', data);
    return data;
  } catch (error) {
    console.error('CryptoRank API error:', error);
    throw error;
  }
};