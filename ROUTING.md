# Production Routing Guide (SPA Redirects)

Since Monetra is a Single Page Application (SPA) utilizing HTML5 History API (`react-router-dom`), the server must serve the core `index.html` file for all incoming requests that do not target static assets (images, CSS, JS, etc.). Otherwise, direct access to permalinks (e.g. `/expenses`, `/income`) will result in server-level `404 Not Found` errors.

Use the configurations below based on your hosting provider.

---

## 1. Apache HTTP Server (`.htaccess`)
A `.htaccess` file is pre-configured and automatically copied to the build directory from `public/.htaccess`.

### If deployed at a sub-path (`/expenses-/`):
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /expenses-/
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /expenses-/index.html [L]
</IfModule>
```

### If deployed at the root of a domain (`/`):
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>
```

---

## 2. Nginx (`nginx.conf`)
If hosting on a Linux instance running Nginx, configure your site's server block to include a `try_files` redirect fallback:

### For root domains:
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/monetra;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### For sub-paths (`/expenses-/`):
```nginx
location /expenses-/ {
    alias /var/www/monetra/;
    try_files $uri $uri/ /expenses-/index.html;
}
```

---

## 3. Netlify (`_redirects`)
If deploying to Netlify, create a file named `_redirects` inside the `public/` directory (it will build into the root of `dist/`):

### For root domains:
```text
/*    /index.html   200
```

### For sub-paths (`/expenses-/`):
```text
/expenses-/*    /expenses-/index.html   200
```

---

## 4. Vercel (`vercel.json`)
For Vercel deployments, configure URL rewrites in a root `vercel.json` file:

```json
{
  "rewrites": [
    {
      "source": "/((?!api|static|favicon.svg|icons.svg).*)",
      "destination": "/index.html"
    }
  ]
}
```

---

## 5. GitHub Pages
GitHub Pages does not native support fallback rewrites. However, a custom workaround is integrated into this repository's build pipeline:
1. `npm run build` runs `vite build`.
2. It then runs a post-build command: `node -e "require('fs').copyFileSync('dist/index.html', 'dist/404.html')"`
3. This creates a duplicate of `index.html` named `404.html` in the build output.
4. When a user requests an invalid route or refreshes a page directly, GitHub Pages falls back to serving `404.html`, which runs our SPA router and correctly parses the URL to render the requested subpage instead of crashing.
