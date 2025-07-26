import axios from 'axios';
import { EXTERNAL_API_URL } from './constants';

export async function sendCallToProvider(to: string, webhookUrl: string): Promise<string> {
    try {
        const response = await axios.post(EXTERNAL_API_URL, {
            to,
            webhookUrl
        });

        if (response.status !== 200 || !response.data?.callId) {
            throw new Error(`Unexpected response from provider: ${JSON.stringify(response.data)}`);
        }

        return response.data.callId;
    } catch (error: any) {
        console.error('Failed to send call to provider:', {
            to,
            webhookUrl,
            message: error.message,
            response: error.response?.data || null,
        });

        throw new Error(`Provider call failed: ${error.message}`);
    }
}
