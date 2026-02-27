#!/bin/bash
# Script สำหรับเตรียมโฟลเดอร์ก่อนส่งให้ backend

echo "🧹 Cleaning up for delivery..."

# ลบ node_modules และ dist
echo "Removing node_modules..."
rm -rf node_modules

echo "Removing dist..."
rm -rf dist

# ลบไฟล์อื่นๆ ที่ไม่จำเป็น
echo "Removing other unnecessary files..."
rm -rf .DS_Store
find . -name "*.log" -type f -delete
find . -name ".DS_Store" -type f -delete

echo "✅ Cleanup complete!"
echo ""
echo "📦 Ready to zip or share the folder"
echo "   Backend can run 'npm install' to restore dependencies"
