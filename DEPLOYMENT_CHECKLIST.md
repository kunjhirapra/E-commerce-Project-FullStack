# Deployment Checklist for E-commerce Project

This checklist ensures a smooth deployment of the E-commerce FullStack project to production.

---

## 📋 Pre-Deployment

### 1. Code Review

- [ ] All features are tested locally
- [ ] No debug/console.log statements left in code
- [ ] All TODO comments are addressed
- [ ] Code is committed to the repository

### 2. Database

- [ ] Database schema is finalized
- [ ] Export local database (`kunj_ecommerce`)
- [ ] Backup existing production database (if updating)
- [ ] Prepare SQL migration scripts if needed

### 3. Configuration Files

- [ ] Review `config.php` for production settings
- [ ] Update production database credentials:
  - `$servername`
  - `$username`
  - `$password`
  - `$dbname`
- [ ] Verify `$Base_Url` and `$Admin_Base_Url` are correct for production domain
- [ ] Review `conn.php` for any hardcoded values

---

## 🚀 Deployment Steps

### 1. Server Preparation

- [ ] Ensure PHP version is compatible (PHP 7.4+ recommended)
- [ ] Verify MySQL/MariaDB is installed and running
- [ ] Check required PHP extensions:
  - `mysqli`
  - `pdo_mysql`
  - `gd` (for image processing)
  - `mbstring`
  - `json`

### 2. File Upload

- [ ] Upload all project files to server via FTP/SFTP/Git
- [ ] Set correct file permissions:

  ```bash
  # Directories: 755
  find /path/to/project -type d -exec chmod 755 {} \;

  # Files: 644
  find /path/to/project -type f -exec chmod 644 {} \;

  # Upload directories need write permissions: 777 or 775
  chmod -R 775 assets/images/uploads/
  chmod -R 775 assets/images/user-sign-up-uploads/
  ```

### 3. Database Setup

- [ ] Create production database
- [ ] Create database user with appropriate privileges
- [ ] Import database schema/data
- [ ] Verify all tables are created correctly

### 4. Configuration Updates

- [ ] Update `config.php` with production credentials
- [ ] Ensure HTTPS is configured (if applicable)
- [ ] Set appropriate error reporting for production:
  ```php
  error_reporting(0);
  ini_set('display_errors', 0);
  ```

---

## 🔒 Security Checklist

### 1. File Security

- [ ] Remove any test/debug files
- [ ] Ensure `.htaccess` is properly configured
- [ ] Block direct access to sensitive directories:
  - `/includes/`
  - `/admin/assets/api/`
  - `/assets/api/`

### 2. Database Security

- [ ] Use strong database password
- [ ] Database user has minimal required privileges
- [ ] No default/empty passwords

### 3. Application Security

- [ ] Review `includes/security.php` is implemented
- [ ] SQL injection protection is in place
- [ ] XSS protection is implemented
- [ ] CSRF tokens are used in forms
- [ ] Password hashing is secure (use `password_hash()`)

### 4. Admin Panel

- [ ] Change default admin credentials
- [ ] Verify admin authentication is working
- [ ] Test admin access restrictions

---

## ✅ Post-Deployment Testing

### 1. Frontend Testing

- [ ] Homepage loads correctly
- [ ] Product listing works
- [ ] Product detail pages display correctly
- [ ] Images load properly
- [ ] CSS and JS files load correctly
- [ ] Responsive design works on mobile

### 2. User Features

- [ ] User registration works
- [ ] User login/logout works
- [ ] Password reset functionality
- [ ] User profile update
- [ ] Address management

### 3. E-commerce Features

- [ ] Add to cart functionality
- [ ] Wishlist functionality
- [ ] Checkout process
- [ ] Coupon code application
- [ ] Order placement
- [ ] Order confirmation page
- [ ] Order history (My Orders)
- [ ] Return order functionality

### 4. Admin Panel

- [ ] Admin login works
- [ ] Dashboard displays correctly
- [ ] Add/Edit/Delete products
- [ ] Order management
- [ ] User management
- [ ] Coupon management

### 5. API Endpoints

- [ ] Test all API endpoints in `/assets/api/`
- [ ] Test all admin API endpoints in `/admin/assets/api/`

---

## 📁 Important Files & Directories

| Path                                  | Purpose                                      |
| ------------------------------------- | -------------------------------------------- |
| `config.php`                          | Base URLs and database configuration         |
| `conn.php`                            | Database connection                          |
| `includes/security.php`               | Security functions                           |
| `assets/images/uploads/`              | Product images (needs write permission)      |
| `assets/images/user-sign-up-uploads/` | User profile images (needs write permission) |

---

## 🔧 Troubleshooting

### Common Issues

1. **500 Internal Server Error**

   - Check PHP error logs
   - Verify file permissions
   - Check `.htaccess` configuration

2. **Database Connection Failed**

   - Verify database credentials in `config.php`
   - Check if database server is running
   - Verify database user has correct privileges

3. **Images Not Loading**

   - Check file permissions on upload directories
   - Verify image paths in database
   - Check `$Base_Url` configuration

4. **CSS/JS Not Loading**

   - Check browser console for 404 errors
   - Verify `$Base_Url` is correct
   - Check file permissions

5. **Session Issues**
   - Verify PHP session configuration
   - Check `session_start()` is called before output

---

## 📝 Notes

- Production URL: `projectstore.kunjdeveloper.me`
- Local Development: `localhost/E-commerce-Project-FullStack`
- Always backup before making changes
- Test thoroughly before going live

---

## 🗓️ Deployment Log

| Date | Version | Changes | Deployed By |
| ---- | ------- | ------- | ----------- |
|      |         |         |             |

---

_Last Updated: December 2025_
