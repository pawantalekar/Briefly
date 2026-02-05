import dotenv from 'dotenv';

dotenv.config();

export const config = {
    port: process.env.PORT || 5000,
    supabase: {
        url: process.env.SUPABASE_URL!,
        anonKey: process.env.SUPABASE_ANON_KEY!,
        serviceKey: process.env.SUPABASE_SERVICE_KEY!,
    },
    jwt: {
        secret: process.env.JWT_SECRET!,
    },
    nodeEnv: process.env.NODE_ENV || 'development',
};
