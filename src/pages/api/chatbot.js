export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { uid, question, webhookUrl, keyId } = req.body;
    const url = `${webhookUrl}?keyId=${keyId}`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid, question }),
      });

      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch data' });
    }
  } else {
    res.status(405).json({ message: 'Only POST requests allowed' });
  }
}