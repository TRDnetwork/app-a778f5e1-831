// SECURITY FIX: Security configuration file
// This should be loaded before your main app

// Content Security Policy configuration
const cspConfig = {
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "https://esm.sh", "'unsafe-inline'"], // Note: unsafe-inline should be removed in production
    styleSrc: ["'self'", "https://fonts.googleapis.com", "'unsafe-inline'"],
    fontSrc: ["'self'", "https://fonts.gstatic.com"],
    imgSrc: ["'self'", "data:", "https:"],
    connectSrc: ["'self'", "https://*.supabase.co"],
    frameSrc: ["'none'"],
    objectSrc: ["'none'"],
    baseUri: ["'self'"],
    formAction: ["'self'"],
    frameAncestors: ["'none'"],
  }
};

// Security headers configuration
const securityHeaders = {
  'Content-Security-Policy': Object.entries(cspConfig.directives)
    .map(([key, values]) => `${key} ${values.join(' ')}`)
    .join('; '),
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
};

// Rate limiting configuration
const rateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: '