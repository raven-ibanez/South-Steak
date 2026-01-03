import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

export const config = {
    // This endpoint can be triggered by Vercel Cron
    maxDuration: 10, // 10 seconds timeout
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Verify this is a legitimate cron request (optional security)
    const authHeader = req.headers.authorization;
    const cronSecret = process.env.CRON_SECRET;

    // If CRON_SECRET is set, verify the request
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
        return res.status(401).json({
            success: false,
            error: 'Unauthorized',
            timestamp: new Date().toISOString(),
        });
    }

    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        return res.status(500).json({
            success: false,
            error: 'Missing Supabase environment variables',
            timestamp: new Date().toISOString(),
        });
    }

    try {
        const supabase = createClient(supabaseUrl, supabaseKey);

        let checkedTable: 'categories' | 'site_settings' | 'none' = 'none';
        let categoriesError: string | null = null;
        let settingsError: string | null = null;

        // Perform a simple query to keep the database active
        // This queries any table to verify connection - using categories as an example
        const { error: catError } = await supabase
            .from('categories')
            .select('id')
            .limit(1);

        if (!catError) {
            checkedTable = 'categories';
        } else {
            categoriesError = catError.message;
            console.log('Categories table query failed, attempting site_settings:', categoriesError);

            // Try querying site_settings as an alternative
            const { error: setError } = await supabase
                .from('site_settings')
                .select('id')
                .limit(1);

            if (!setError) {
                checkedTable = 'site_settings';
            } else {
                settingsError = setError.message;
                console.log('Site settings query also failed:', settingsError);
            }
        }

        const timestamp = new Date().toISOString();

        // If both queries failed, return error response
        if (checkedTable === 'none') {
            console.error(`Database health check failed at ${timestamp} - both queries failed`);
            return res.status(500).json({
                success: false,
                message: 'Database health check failed - all queries unsuccessful',
                errors: {
                    categories: categoriesError,
                    site_settings: settingsError,
                },
                checked: 'none',
                timestamp,
            });
        }

        // At least one query succeeded
        console.log(`Database health check completed at ${timestamp} - checked: ${checkedTable}`);
        return res.status(200).json({
            success: true,
            message: 'Database health check completed successfully',
            checked: checkedTable,
            timestamp,
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Database health check failed:', errorMessage);

        return res.status(500).json({
            success: false,
            error: errorMessage,
            timestamp: new Date().toISOString(),
        });
    }
}
