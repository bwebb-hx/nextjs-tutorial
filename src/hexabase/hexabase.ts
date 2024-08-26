// Import Hexabase JavaScript SDK
import { HexabaseClient }  from '@hexabase/hexabase-js';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { useEffect } from 'react';

let client: HexabaseClient | null = null;

interface LoginResult {
    success: boolean
    token?: string
}

/**
 * login to Hexabase with the given user credentials.
 * @param email email of the user to authenticate
 * @param password password of the user to authenticate
 * @returns LoginResult
 */
export async function loginToHexabase(email: string, password: string): Promise<LoginResult> {
    client = new HexabaseClient();

    const loginSuccess = await client.login({ email, password });
    if (!loginSuccess) {
        return { success: false };
    }
    const workspace = await client.workspace("66c6ec1908aa582e965c5b95");
    if (!workspace) {
        return { success: false };
    }

    return { success: true, token: client.tokenHxb };
}

/**
 * 
 * @param token access token for hexabase
 * @returns 
 */
export async function getHexabaseClient(token: string): Promise<HexabaseClient | null> {
    if (!client) {
        client = new HexabaseClient();
        if (token) {
            client.setToken(token);
        } else {
            throw new Error("Access token is required");
        }
    }
    return client;
};

/** checks if the given token is valid */
export async function tokenIsValid(token: string): Promise<boolean> {
    return (await new HexabaseClient().login({ token }));
}

export function useAuthRedirect() {
    const router = useRouter();
    const token = Cookies.get("tokenHxb");

    // make sure there's a valid token
    useEffect(() => {
        if (!token) {
            router.push('/login');
            return;
        }

        // validate token asynchronously to avoid any delay
        (async () => {
            if (!await tokenIsValid(token)) {
                router.push('/login');
            }
        })();
    }, [router, token]);
}