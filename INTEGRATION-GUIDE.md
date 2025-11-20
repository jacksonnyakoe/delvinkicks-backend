# Delvin Kicks - Netlify Functions Integration Guide

## 🚀 Complete Backend Integration for Your Admin System

This package provides a professional serverless backend for your Delvin Kicks admin system using Netlify Functions.

## 📁 Project Structure

```
your-website/
├── netlify/
│   └── functions/
│       ├── auth-login.js          # Authentication login
│       ├── auth-verify.js         # Token verification
│       ├── products-get.js        # Get all products
│       ├── products-create.js     # Create new product
│       ├── products-update.js     # Update product
│       ├── products-delete.js     # Delete product
│       └── data/
│           └── products-store.json # Product data storage
├── public/
│   ├── admin-updated.js           # Updated admin JavaScript
│   └── data-loader-updated.js     # Updated website data loader
├── netlify.toml                   # Netlify configuration
└── .env.example                   # Environment variables template
```

## 🔧 Installation Steps

### 1. Add Files to Your Netlify Site

Copy all the files from this package to your existing website repository:

```bash
# Copy the netlify folder
cp -r netlify/ /path/to/your/website/

# Copy updated scripts
cp public/admin-updated.js /path/to/your/website/
cp public/data-loader-updated.js /path/to/your/website/

# Copy configuration
cp netlify.toml /path/to/your/website/
cp .env.example /path/to/your/website/.env
```

### 2. Update Your HTML Files

#### In `admin.html`:
Replace the script tag:
```html
<!-- Old -->
<script src="admin.js"></script>

<!-- New -->
<script src="admin-updated.js"></script>
```

#### In `dashboard.html`:
Replace the script tag:
```html
<!-- Old -->
<script src="admin.js"></script>

<!-- New -->
<script src="admin-updated.js"></script>
```

#### In Your Main Website Pages (index.html, etc.):
Replace the data loader script:
```html
<!-- Old -->
<script src="data-loader.js"></script>

<!-- New -->
<script src="data-loader-updated.js"></script>
```

### 3. Configure Environment Variables

#### For Local Development:
1. Create a `.env` file in your project root
2. Add your credentials:
```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password
```

#### For Netlify Production:
1. Go to your Netlify dashboard
2. Navigate to: Site Settings → Environment Variables
3. Add the following variables:
   - `ADMIN_USERNAME` = your admin username
   - `ADMIN_PASSWORD` = your secure password

### 4. Deploy to Netlify

#### Using Git (Recommended):
```bash
git add .
git commit -m "Add Netlify Functions backend"
git push origin main
```

Netlify will automatically detect the functions and deploy them.

#### Using Netlify CLI:
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod
```

## 🎯 API Endpoints

Once deployed, your functions will be available at:

- **Login**: `https://delvinkicks.netlify.app/.netlify/functions/auth-login`
- **Verify Token**: `https://delvinkicks.netlify.app/.netlify/functions/auth-verify`
- **Get Products**: `https://delvinkicks.netlify.app/.netlify/functions/products-get`
- **Create Product**: `https://delvinkicks.netlify.app/.netlify/functions/products-create`
- **Update Product**: `https://delvinkicks.netlify.app/.netlify/functions/products-update`
- **Delete Product**: `https://delvinkicks.netlify.app/.netlify/functions/products-delete`

## 🔒 Security Features

✅ Token-based authentication  
✅ Secure password handling  
✅ CORS protection  
✅ Environment variable encryption  
✅ Session validation  

## 📊 Data Management

### Initial Data
The system comes pre-loaded with your existing products in `netlify/functions/data/products-store.json`.

### Data Persistence
For production, consider upgrading to:
- **FaunaDB** (Serverless database)
- **MongoDB Atlas** (Cloud database)
- **Supabase** (Open source Firebase alternative)

## 🧪 Testing Your Functions

### Test Login:
```bash
curl -X POST https://delvinkicks.netlify.app/.netlify/functions/auth-login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Test Get Products:
```bash
curl https://delvinkicks.netlify.app/.netlify/functions/products-get
```

## 🚨 Troubleshooting

### Functions Not Working?
1. Check Netlify function logs: Site → Functions → [function-name] → Logs
2. Verify environment variables are set in Netlify dashboard
3. Ensure `netlify.toml` is in the root directory
4. Check that functions folder path is correct

### CORS Errors?
- All functions include CORS headers
- Check browser console for specific error messages
- Verify the API_BASE URL in the JavaScript files matches your domain

### Authentication Issues?
- Clear browser localStorage: `localStorage.clear()`
- Check environment variables in Netlify dashboard
- Verify credentials in `.env` file for local testing

## 🔄 Upgrading to Database

To replace the JSON file storage with a real database:

### Option 1: FaunaDB
```bash
npm install faunadb
```

Update functions to use FaunaDB queries instead of file system operations.

### Option 2: MongoDB Atlas
```bash
npm install mongodb
```

Connect using MongoDB connection string in environment variables.

### Option 3: Supabase
```bash
npm install @supabase/supabase-js
```

Use Supabase client for database operations.

## 📱 Admin System Features

✅ Secure login with token authentication  
✅ Product CRUD operations (Create, Read, Update, Delete)  
✅ Dashboard with statistics  
✅ Real-time product management  
✅ Category filtering  
✅ Product search  
✅ Data export functionality  

## 🎨 Customization

### Change Admin Credentials:
Update in Netlify environment variables (recommended) or in `.env` file.

### Modify API Responses:
Edit the respective function files in `netlify/functions/`.

### Add New Endpoints:
Create new JavaScript files in `netlify/functions/` following the existing pattern.

## 📞 Support

For issues or questions:
1. Check Netlify function logs
2. Review browser console errors
3. Test endpoints using curl or Postman
4. Verify all files are properly deployed

## 🎉 You're All Set!

Your admin system now has a professional serverless backend! 

Access your admin at: `https://delvinkicks.netlify.app/admin.html`

Default credentials:
- Username: admin
- Password: admin123

**Important:** Change the default password immediately in production!

---

Made with ❤️ for Delvin Kicks
