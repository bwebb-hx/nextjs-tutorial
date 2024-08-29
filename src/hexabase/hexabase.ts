// Import Hexabase JavaScript SDK
import { HexabaseClient }  from '@hexabase/hexabase-js';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { useEffect } from 'react';

let client: HexabaseClient | null = null;
export const WORKSPACE_ID = process.env.NEXT_PUBLIC_WORKSPACE_ID;
export const PROJECT_ID = process.env.NEXT_PUBLIC_PROJECT_ID!;
export const DATASTORE_ID = process.env.NEXT_PUBLIC_DATASTORE_ID!;

interface LoginResult {
    success: boolean
    token?: string
    err?: string
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
        return { success: false, err: "Login unsuccessful. Confirm your credentials and try again." };
    }
    if (!WORKSPACE_ID) {
        console.error("internal server error: failed to get environment variables");
        return { success: false, err: "Internal server error. Please contact an administrator." };
    }
    const workspace = await client.workspace(WORKSPACE_ID);
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