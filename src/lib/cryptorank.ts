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

  // Remove the /v2 prefix since it's already in the base URL
  const cleanEndpoint = endpoint.replace('/v2/', '/').replace('/v2', '');
  
  const url = `https://api.cryptorank.io/v2${cleanEndpoint}?${queryParams}`;
  console.log('Fetching CryptoRank data:', url);
  
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