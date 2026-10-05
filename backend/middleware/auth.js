import { supabaseAdmin, supabasePublic } from '../config/supabase.js';

export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const headerUserId = req.headers['x-user-id'];

    // 1. If explicit Authorization header with Bearer token is provided
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      if (token && token !== 'demo-token' && token !== 'null' && token !== 'undefined') {
        const { data: { user }, error } = await supabasePublic.auth.getUser(token);
        if (!error && user) {
          req.user = user;
          return next();
        }
      }
    }

    // 2. Demo / Dev Mode Quick Fallback using x-user-id header if available
    if (headerUserId) {
      req.user = {
        id: headerUserId,
        email: 'user@skillmentor.edu',
        role: 'authenticated'
      };
      return next();
    }

    // 3. Default demo active user (Alex Chen) for seamless testing
    req.user = {
      id: 'a1111111-1111-1111-1111-111111111111',
      email: 'alex.chen@university.edu',
      role: 'authenticated'
    };
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    res.status(401).json({ success: false, error: 'Authentication failed', message: err.message });
  }
};
