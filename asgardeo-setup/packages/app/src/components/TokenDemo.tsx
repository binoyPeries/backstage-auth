import { useState } from 'react';
import { Button, Typography, Box } from '@material-ui/core';
import { useAuthToken } from '../hooks/useAuthToken';

export const TokenDemo = () => {
  const { getToken } = useAuthToken();
  const [result, setResult] = useState<string>('');
  const [currentToken, setCurrentToken] = useState<string>('');

  const testFlow = async () => {
    try {
      // Get Asgardeo access token
      const tokenData = await getToken();
      setCurrentToken(tokenData.token);
      console.log('✅ Got token:', tokenData.token);

      // Test calling Asgardeo userinfo directly
      const userInfoResponse = await fetch(
        'https://api.asgardeo.io/t/binoyperiesintern/oauth2/userinfo',
        {
          headers: { Authorization: `Bearer ${tokenData.token}` },
        },
      );

      if (userInfoResponse.ok) {
        const userInfo = await userInfoResponse.json();
        console.log('✅ User info:', userInfo);
        setResult(
          `SUCCESS: Token works! User: ${userInfo.email || userInfo.sub}`,
        );
      } else {
        setResult(
          `FAILED: Asgardeo call failed with status ${userInfoResponse.status}`,
        );
      }
    } catch (error) {
      console.error('❌ Error:', error);
      setResult(
        `ERROR: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  };

  const copyToken = () => {
    if (currentToken) {
      navigator.clipboard.writeText(currentToken);
      alert('Token copied to clipboard!');
    } else {
      alert('No token available. Please test first.');
    }
  };

  return (
    <Box style={{ padding: 20 }}>
      <Typography variant="h5">Token Test</Typography>
      <br />

      <Button
        variant="contained"
        color="primary"
        onClick={testFlow}
        style={{ marginRight: 10 }}
      >
        Get Token & Test
      </Button>

      <Button variant="outlined" onClick={copyToken} disabled={!currentToken}>
        Copy Token
      </Button>

      <br />
      <br />

      {result && (
        <Typography
          style={{
            padding: 10,
            backgroundColor: 'black',
            border: '1px solid #ddd',
          }}
        >
          {result}
        </Typography>
      )}
    </Box>
  );
};
