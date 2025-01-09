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

  const queryParams = new URLSearchParams({
    ...params,
    api_key: apiKey,
  });

  const url = `https://api.cryptorank.io/v0${endpoint}?${queryParams}`;
  console.log('Fetching CryptoRank data:', url);
  
  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch data from CryptoRank');
    }

    return response.json();
  } catch (error) {
    console.error('CryptoRank API error:', error);
    throw error;
  }
};