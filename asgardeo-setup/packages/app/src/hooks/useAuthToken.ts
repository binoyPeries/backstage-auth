import { useApi } from '@backstage/core-plugin-api';
import { myAsgardeoAuthApiRef } from '../apis';
import { useCallback, useEffect, useState } from 'react';

export interface AuthToken {
    token: string;
    expiresAt?: Date;
}

export const useAuthToken = () => {
    const authApi = useApi(myAsgardeoAuthApiRef);
    const [token, setToken] = useState<AuthToken | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const getToken = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            // Get the original OAuth access token from Asgardeo
            const accessToken = await authApi.getAccessToken(['openid', 'profile']);

            if (accessToken) {
                const authToken: AuthToken = {
                    token: accessToken,
                };
                setToken(authToken);
                return authToken;
            } else {
                throw new Error('No valid access token found. Please sign in.');
            }
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Failed to get auth token');
            setError(error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, [authApi]);

    const refreshToken = useCallback(async () => {
        try {
            // For OAuth2 providers, we typically need to get a fresh token
            return await getToken();
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Failed to refresh token');
            setError(error);
            throw error;
        }
    }, [getToken]);

    // Check if token is expired
    const isTokenExpired = useCallback(() => {
        if (!token?.expiresAt) return false;
        return new Date() >= token.expiresAt;
    }, [token]);

    // Auto-refresh token if it's expired
    useEffect(() => {
        if (token && isTokenExpired()) {
            refreshToken().catch(console.error);
        }
    }, [token, isTokenExpired, refreshToken]);

    return {
        token: token?.token,
        fullToken: token,
        loading,
        error,
        getToken,
        refreshToken,
        isTokenExpired,
    };
};