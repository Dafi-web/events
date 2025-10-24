# 🏢 OneTigray Business Directory - Complete Guide

## 📋 Overview
The OneTigray Business Directory is a comprehensive platform for Tigrayan-owned businesses, professionals, and organizations to connect with the global community. This guide explains how to add and manage business listings.

## 🚀 How to Add Business Owners

### **Method 1: Self-Registration (Recommended)**
Business owners can add their own listings through the public directory page:

1. **Visit the Directory Page**
   - Go to `/directory` on the OneTigray website
   - Click the **"Add Your Business"** button

2. **Fill Out the Business Form**
   - **Business Name** (required)
   - **Type**: Business, Professional, or Organization
   - **Category**: Restaurant, Retail, Services, Healthcare, Education, Technology, Finance, Non-Profit, or Other
   - **Description** (required)
   - **Contact Information**:
     - Email
     - Phone
     - Website
     - City and Country (required)

3. **Submit for Review**
   - All listings are submitted with "pending" status
   - Admins review and approve listings before they appear publicly

### **Method 2: Admin Addition**
Admins can add businesses directly through the Admin Dashboard:

1. **Access Admin Dashboard**
   - Login with admin credentials
   - Go to the **Directory** tab

2. **Use the Admin Interface**
   - View pending listings
   - Approve or reject submissions
   - Mark businesses as verified or featured
   - Edit existing listings

## 🎯 Business Types & Categories

### **Types:**
- **🏢 Business**: Traditional businesses, stores, restaurants
- **👤 Professional**: Individual service providers (lawyers, doctors, consultants)
- **👥 Organization**: Non-profits, community groups, associations

### **Categories:**
- **🍽️ Restaurant**: Food services, cafes, catering
- **🛍️ Retail**: Stores, shops, e-commerce
- **🔧 Services**: Professional services, consulting, maintenance
- **🏥 Healthcare**: Medical services, clinics, wellness
- **🎓 Education**: Schools, training, tutoring
- **💻 Technology**: IT services, software, digital solutions
- **💰 Finance**: Banking, insurance, financial planning
- **🤝 Non-Profit**: Charitable organizations, community groups
- **📋 Other**: Any other type of business or service

## 🔄 Listing Status & Approval Process

### **Status Types:**
1. **⏳ Pending**: Newly submitted, awaiting admin review
2. **✅ Approved**: Approved by admin, visible to public
3. **❌ Rejected**: Rejected by admin, not visible

### **Special Features:**
- **⭐ Verified**: Admin-verified authentic Tigrayan business
- **🌟 Featured**: Highlighted in search results and homepage

## 👨‍💼 Admin Management Features

### **Admin Dashboard - Directory Tab:**
1. **📋 Pending Tab**: Review new submissions
2. **📊 All Listings Tab**: Manage all existing listings

### **Admin Actions:**
- **✅ Approve**: Make listing public
- **❌ Reject**: Remove from consideration
- **⭐ Verify**: Mark as verified Tigrayan business
- **🌟 Feature**: Highlight in search results
- **👁️ View Details**: See complete listing information
- **✏️ Edit**: Modify listing details

### **Bulk Management:**
- Filter by status, type, or category
- Search by business name or description
- Sort by date, status, or verification

## 📱 User Experience Features

### **Public Directory Features:**
- **🔍 Search**: Find businesses by name or description
- **🏷️ Filter**: Filter by type, category, or country
- **📍 Location**: View businesses by location
- **⭐ Featured**: Featured businesses appear first

### **Business Cards Display:**
- Business logo or initial
- Type and category badges
- Contact information
- Verification and featured status
- Direct links to website

## 🔧 Technical Implementation

### **Backend API Endpoints:**
```
GET /api/directory - Get approved listings
POST /api/directory - Create new listing (requires auth)
GET /api/directory/:id - Get specific listing
PUT /api/directory/:id - Update listing
DELETE /api/directory/:id - Delete listing

Admin Endpoints:
GET /api/directory/admin/pending - Get pending listings
GET /api/directory/admin/all - Get all listings
PUT /api/directory/admin/:id/approve - Approve listing
PUT /api/directory/admin/:id/reject - Reject listing
```

### **Database Schema:**
- **Directory Model**: Complete business information
- **User Reference**: Links to user account
- **Status Tracking**: Pending/Approved/Rejected
- **Verification Flags**: Verified and Featured status
- **Contact Information**: Email, phone, website, address
- **Timestamps**: Creation and update tracking

## 📈 Benefits for the Community

### **For Business Owners:**
- **🌍 Global Visibility**: Reach Tigrayan community worldwide
- **🤝 Community Support**: Tap into community network
- **📈 Growth Opportunities**: Connect with customers and partners
- **✅ Trust & Verification**: Admin-verified authenticity

### **For Community Members:**
- **🔍 Easy Discovery**: Find Tigrayan businesses easily
- **🤝 Support Local**: Support community entrepreneurs
- **📍 Location-Based**: Find services in their area
- **⭐ Quality Assurance**: Verified authentic businesses

### **For Admins:**
- **🎛️ Full Control**: Approve and manage all listings
- **📊 Analytics**: Track directory growth and usage
- **🛡️ Quality Control**: Ensure authentic Tigrayan businesses
- **🌟 Feature Management**: Highlight important businesses

## 🚀 Getting Started

### **For Business Owners:**
1. **Register** on OneTigray (if not already registered)
2. **Visit** the Directory page
3. **Click** "Add Your Business"
4. **Fill out** the comprehensive form
5. **Submit** for admin review
6. **Wait** for approval (usually within 24-48 hours)

### **For Admins:**
1. **Login** to admin dashboard
2. **Navigate** to Directory tab
3. **Review** pending submissions
4. **Approve** or reject listings
5. **Verify** authentic businesses
6. **Feature** important listings

## 📞 Support & Contact

### **For Business Owners:**
- **Email**: Use the contact form on the website
- **Help**: Check the FAQ section
- **Updates**: Monitor your listing status

### **For Admins:**
- **Dashboard**: Use the comprehensive admin interface
- **Analytics**: Monitor directory growth
- **Support**: Contact technical support if needed

## 🎯 Best Practices

### **For Business Owners:**
- **Complete Information**: Fill out all relevant fields
- **Accurate Details**: Ensure contact information is correct
- **Professional Description**: Write clear, compelling descriptions
- **Regular Updates**: Keep information current

### **For Admins:**
- **Quick Review**: Process submissions promptly
- **Quality Control**: Verify authentic Tigrayan ownership
- **Fair Treatment**: Apply consistent approval criteria
- **Community Focus**: Prioritize community benefit

---

**The OneTigray Business Directory is more than just a listing - it's a bridge connecting Tigrayan entrepreneurs with their global community, fostering economic growth and cultural unity.** 🌍🤝✨

