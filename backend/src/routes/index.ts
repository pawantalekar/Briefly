import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes';
import blogRoutes from '../modules/blog/blog.routes';
import commentRoutes from '../modules/comment/comment.routes';
import likeRoutes from '../modules/like/like.routes';
import categoryRoutes from '../modules/category/category.routes';
import adminRoutes from '../modules/admin/admin.routes';


const router = Router();


router.get('/health', async (req, res) => {
    try {
        const { supabase } = await import('../config/supabaseClient');


        const { count: blogCount } = await supabase.from('blogs').select('*', { count: 'exact', head: true });
        const { count: userCount } = await supabase.from('users').select('*', { count: 'exact', head: true });
        const { count: categoryCount } = await supabase.from('categories').select('*', { count: 'exact', head: true });

        res.json({
            status: 'OK',
            message: 'Briefly API is running',
            timestamp: new Date().toISOString(),
            database: {
                connected: true,
                counts: {
                    blogs: blogCount || 0,
                    users: userCount || 0,
                    categories: categoryCount || 0
                }
            }
        });
    } catch (error: any) {
        res.status(500).json({
            status: 'ERROR',
            message: 'Database connection failed',
            error: error.message
        });
    }
});


router.use('/auth', authRoutes);
router.use('/blogs', blogRoutes);
router.use('/comments', commentRoutes);
router.use('/likes', likeRoutes);
router.use('/categories', categoryRoutes);
router.use('/admin', adminRoutes);


export default router;
