'use client';

import { useEffect } from 'react';

export default function BootstrapClient() {
  useEffect(() => {
    // Dynamically import Bootstrap JS only on client side
    const loadBootstrap = async () => {
      if (typeof window !== 'undefined') {
        try {
          await import('bootstrap/dist/js/bootstrap.bundle.min.js');
        } catch (error) {
          console.warn('Bootstrap JS failed to load:', error);
        }
      }
    };
    
    loadBootstrap();
  }, []);

  return null;
}
