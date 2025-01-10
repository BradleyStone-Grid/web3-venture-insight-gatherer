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
  
  // Clean the endpoint by removing any version prefixes and ensuring it starts with a slash
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  const url = `https://api.cryptorank.io${cleanEndpoint}?${queryParams}`;
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
      const errorData = await response.json();
      console.error('CryptoRank API error response:', errorData);
      throw new Error(errorData.message || 'Failed to fetch data from CryptoRank');
    }

    const data = await response.json();
    console.log('CryptoRank API response:', data);
    return data;
  } catch (error) {
    console.error('CryptoRank API error:', error);
    throw error;
  }
};