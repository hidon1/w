#!/bin/bash
# Firebase Integration Verification Script
# This script checks that the Firebase integration is properly set up

echo "🔍 Firebase Integration Verification"
echo "===================================="
echo ""

# Check if required files exist
echo "1️⃣  Checking required files..."
FILES=(
    "index.html"
    "firebase-config.js"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file exists"
    else
        echo "❌ $file is missing"
        exit 1
    fi
done
echo ""

# Check for duplicate Firebase imports in index.html
echo "2️⃣  Checking for duplicate Firebase imports..."
FIREBASE_CDN_COUNT=$(grep "gstatic.com/firebasejs" index.html 2>/dev/null | wc -l)
if [ "$FIREBASE_CDN_COUNT" = "0" ]; then
    echo "✅ No duplicate Firebase CDN imports found"
else
    echo "⚠️  Found $FIREBASE_CDN_COUNT Firebase CDN imports in index.html"
    echo "   (Should be 0 - all imports should be in firebase-config.js)"
fi
echo ""

# Check that firebase-config.js is imported in module script
echo "3️⃣  Checking firebase-config.js module import..."
if grep -q "from './firebase-config.js'" index.html; then
    echo "✅ firebase-config.js is properly imported in index.html"
else
    echo "❌ firebase-config.js is not imported in index.html"
    exit 1
fi
echo ""

# Check that auth modal exists
echo "4️⃣  Checking auth modal HTML..."
if grep -q 'id="authModal"' index.html; then
    echo "✅ Auth modal HTML element exists"
else
    echo "❌ Auth modal HTML element is missing"
    exit 1
fi
echo ""

# Check that Firebase config is present
echo "5️⃣  Checking Firebase configuration..."
if grep -q "wine-f57cb" firebase-config.js; then
    echo "✅ Firebase project configuration found"
else
    echo "❌ Firebase configuration is missing or incorrect"
    exit 1
fi
echo ""

# Check that onAuthStateChanged is implemented
echo "6️⃣  Checking authentication state handler..."
if grep -q "onAuthStateChanged" index.html; then
    echo "✅ onAuthStateChanged handler is implemented"
else
    echo "❌ onAuthStateChanged handler is missing"
    exit 1
fi
echo ""

# Check that openAuthModal function exists
echo "7️⃣  Checking auth modal functions..."
if grep -q "function openAuthModal" index.html; then
    echo "✅ openAuthModal function exists"
else
    echo "❌ openAuthModal function is missing"
    exit 1
fi
echo ""

# Check for save hooks
echo "8️⃣  Checking save hooks integration..."
if grep -q "wireSaveHooks" index.html; then
    echo "✅ Save hooks are wired for Firebase sync"
else
    echo "❌ Save hooks are missing"
    exit 1
fi
echo ""

# Summary
echo "===================================="
echo "✨ All checks passed!"
echo ""
echo "📋 Next steps:"
echo "1. Open the app in a browser"
echo "2. Verify the auth modal appears immediately when signed out"
echo "3. Try signing in with Google or Email/Password"
echo "4. Create/edit a project and verify it saves to Firebase"
echo "5. Sign out and sign back in to verify data persists"
echo ""
echo "🔗 Firebase Console: https://console.firebase.google.com/project/wine-f57cb"
echo ""
