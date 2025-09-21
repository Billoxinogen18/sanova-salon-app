#!/bin/bash

echo "Setting up SANOVA React Native App..."

# Install dependencies
echo "Installing dependencies..."
npm install

# Install iOS dependencies if on macOS
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "Installing iOS dependencies..."
    cd ios && pod install && cd ..
fi

echo "Setup complete! You can now run:"
echo "  npm run ios     (for iOS)"
echo "  npm run android (for Android)"
echo "  npm start       (to start Metro bundler)"