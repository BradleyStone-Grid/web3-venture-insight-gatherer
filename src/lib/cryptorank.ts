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

  const response = await fetch(
    `https://api.cryptorank.io/v1${endpoint}?${queryParams}`,
    {
      headers: {
        'Accept': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch data from CryptoRank');
  }

  return response.json();
};