const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

app.use(express.json());

app.get('/numbers', async (req, res) => {
  const urls = req.query.url;

  if (!urls || !Array.isArray(urls)) {
    return res.status(400).json({ error: 'Invalid URL parameters' });
  }

  const uniqueNumbers = await getUniqueNumbersFromURLs(urls);

  res.json({ numbers: uniqueNumbers });
});

const getUniqueNumbersFromURLs = async (urls) => {
  const requests = urls.map(async (url) => {
    try {
      const response = await axios.get(url, { timeout: 500 });
      if (response && response.data && Array.isArray(response.data)) {
        return response.data;
      }
    } catch (error) {
      // Ignore timeouts and other errors for simplicity
      console.error('Error fetching data from URL:', url);
    }
    return [];

  });

  const responses = await Promise.all(requests);
  const allNumbers = responses.flat();
  return [...new Set(allNumbers)].sort((a, b) => a - b);


};

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
