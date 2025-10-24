#!/bin/bash

echo "🚀 DafiTech Platform Deployment Script"
echo "======================================"

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📁 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit - Ready for deployment"
    echo "✅ Git repository initialized"
else
    echo "📁 Git repository already exists"
fi

# Check if remote origin exists
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "⚠️  No remote origin found. Please add your GitHub repository:"
    echo "   git remote add origin https://github.com/yourusername/dafitech-platform.git"
    echo "   git push -u origin main"
else
    echo "📤 Pushing to GitHub..."
    git add .
    git commit -m "Update: Ready for deployment $(date)"
    git push origin main
    echo "✅ Code pushed to GitHub"
fi

echo ""
echo "🎯 Next Steps:"
echo "1. Go to https://render.com and deploy your backend"
echo "2. Go to https://vercel.com and deploy your frontend"
echo "3. Configure your custom domain"
echo "4. Set up environment variables"
echo ""
echo "📖 See DEPLOYMENT_GUIDE.md for detailed instructions"
echo ""
echo "🌐 Your platform will be live at your custom domain!"
