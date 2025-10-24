# 🧪 Business Directory Submission & Approval Test Guide

## 🎯 Complete Workflow Testing

This guide will help you test the complete business submission and approval workflow:

**User submits business → Admin reviews → Admin approves → Business displays publicly**

---

## 📋 **Step 1: Test User Business Submission**

### **Access the Directory Page:**
1. **Open your browser** and go to: `http://localhost:3002/directory`
2. **Look for the "Add Your Business" button** (amber/golden color)

### **Submit a Test Business:**
1. **Click "Add Your Business"** button
2. **Fill out the form** with test data:

```
Business Name: Test Restaurant
Type: Business
Category: Restaurant
Description: A wonderful Ethiopian restaurant serving authentic Tigrayan cuisine in the heart of the city.

Contact Information:
Email: test@restaurant.com
Phone: +31686371240
Website: https://testrestaurant.com
City: New York
Country: United States
```

3. **Click "Submit for Review"**
4. **You should see a success message** or the form should close

### **Expected Result:**
- ✅ Business submission created successfully
- ✅ Status: "Pending" (not visible to public yet)
- ✅ Admin can see it in the dashboard

---

## 👨‍💼 **Step 2: Test Admin Approval Process**

### **Access Admin Dashboard:**
1. **Login as admin** at: `http://localhost:3002/login`
   - Email: `admin@onetigray.org`
   - Password: (your admin password)

2. **Go to Admin Dashboard** at: `http://localhost:3002/admin`

### **Review Pending Business:**
1. **Click on the "Directory" tab** in the admin dashboard
2. **You should see your test business** in the "Pending" tab
3. **Click "View Details"** to see the complete information
4. **Review the business details**:
   - Business name, type, category
   - Contact information
   - Owner details
   - Submission date

### **Approve the Business:**
1. **Click "Approve"** button (green button)
2. **Optionally mark as "Verified"** or "Featured"
3. **Business status changes** from "Pending" to "Approved"

### **Expected Result:**
- ✅ Business moves from "Pending" to "Approved" status
- ✅ Business becomes visible in public directory
- ✅ Admin can still edit or manage the business

---

## 🌐 **Step 3: Verify Public Display**

### **Check Public Directory:**
1. **Go back to public directory**: `http://localhost:3002/directory`
2. **Refresh the page**
3. **Your approved business should now be visible** in the listings

### **Test Search and Filter:**
1. **Search for "Test Restaurant"** in the search bar
2. **Filter by "Restaurant" category**
3. **Filter by "Business" type**
4. **Filter by "United States" country**

### **Expected Result:**
- ✅ Business appears in the directory grid
- ✅ All business information is displayed correctly
- ✅ Search and filters work properly
- ✅ Business card shows contact information
- ✅ Status shows as "Approved"

---

## 🔄 **Step 4: Test Additional Features**

### **Test Multiple Submissions:**
1. **Submit 2-3 more test businesses** with different types:
   - Professional (lawyer, doctor, consultant)
   - Organization (non-profit, community group)

2. **Approve some and reject others** to test the full workflow

### **Test Admin Management:**
1. **In admin dashboard, test these features:**
   - ✅ Approve businesses
   - ❌ Reject businesses
   - ⭐ Mark as verified
   - 🌟 Mark as featured
   - 👁️ View detailed information
   - ✏️ Edit business information

### **Test Public Features:**
1. **In public directory, test:**
   - 🔍 Search functionality
   - 🏷️ Filter by type, category, country
   - 📱 Responsive design (mobile/desktop)
   - 🎨 Visual design and styling

---

## 🐛 **Troubleshooting Common Issues**

### **If Business Submission Fails:**
1. **Check browser console** (F12 → Console) for errors
2. **Verify user is logged in** (required for submission)
3. **Check server logs** for backend errors
4. **Ensure all required fields** are filled

### **If Admin Can't See Submissions:**
1. **Verify admin login** and role permissions
2. **Check "Directory" tab** in admin dashboard
3. **Refresh the admin dashboard**
4. **Check server logs** for API errors

### **If Approved Business Doesn't Display:**
1. **Refresh the public directory page**
2. **Clear browser cache** (Ctrl+F5 or Cmd+Shift+R)
3. **Check business status** in admin dashboard
4. **Verify API endpoint** is working: `http://localhost:4000/api/directory`

---

## 📊 **Expected Database State**

### **After Submission (Pending):**
```json
{
  "name": "Test Restaurant",
  "type": "business",
  "category": "restaurant",
  "status": "pending",
  "verified": false,
  "featured": false,
  "owner": "user_id_here"
}
```

### **After Approval:**
```json
{
  "name": "Test Restaurant",
  "type": "business", 
  "category": "restaurant",
  "status": "approved",
  "verified": true,
  "featured": false,
  "owner": "user_id_here"
}
```

---

## 🎯 **Success Criteria**

### **✅ User Experience:**
- Users can easily find and access the directory
- Business submission form is intuitive and complete
- Clear feedback on submission status
- Beautiful, responsive design

### **✅ Admin Experience:**
- Easy access to pending submissions
- Clear approval/rejection workflow
- Comprehensive business information display
- Efficient management tools

### **✅ Public Display:**
- Approved businesses appear immediately
- Search and filter functionality works
- Professional, trustworthy appearance
- Mobile-friendly design

---

## 🚀 **Next Steps After Testing**

### **For Production:**
1. **Configure email notifications** for new submissions
2. **Set up automated verification** processes
3. **Add business logo upload** functionality
4. **Implement business hours** and additional details
5. **Add review/rating system** for businesses

### **For Marketing:**
1. **Announce the directory** to the community
2. **Encourage business owners** to submit their listings
3. **Promote verified businesses** as trusted partners
4. **Use featured listings** for community highlights

---

**🎉 Once this workflow is tested and working, your OneTigray Business Directory will be fully operational and ready to serve the community!**

