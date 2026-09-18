const https = require('https');

const apiKey = 'sk-25-YpvLEBKmsZFVBsQRgzLKx6RjL2';

function testAirFailKey() {
  console.log('Checking Air.fail OpenAI-compatible endpoint...');

  const options = {
    hostname: 'app.air.fail',
    port: 443,
    path: '/v1/models',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    }
  };

  const req = https.request(options, (res) => {
    let body = '';
    res.on('data', d => body += d);
    res.on('end', () => {
      console.log(`HTTP Status: ${res.statusCode}`);
      console.log(`Response Body: ${body.substring(0, 500)}`);
    });
  });

  req.on('error', err => console.error('Error:', err.message));
  req.end();
}

testAirFailKey();
