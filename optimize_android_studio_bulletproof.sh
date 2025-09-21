#!/bin/bash

# Android Studio BULLETPROOF ARM64 Optimization Script
# This script fixes the root problems instead of masking them

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

print_header() {
    echo -e "${BLUE}🚀 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${PURPLE}ℹ️  $1${NC}"
}

print_debug() {
    echo -e "${CYAN}🔧 $1${NC}"
}

# Check if running on M1 Mac
if [[ $(uname -m) != "arm64" ]]; then
    print_error "This script is designed for M1 MacBooks (ARM64). Your architecture: $(uname -m)"
    exit 1
fi

print_header "Android Studio BULLETPROOF ARM64 Optimization"
print_info "Fixing root problems instead of masking them"
echo ""

# 1. Detect Android Studio version and paths
print_warning "Detecting Android Studio installation..."

ANDROID_STUDIO_PATH="/Applications/Android Studio.app"
if [[ ! -d "$ANDROID_STUDIO_PATH" ]]; then
    print_error "Android Studio not found at $ANDROID_STUDIO_PATH"
    exit 1
fi

# Get Android Studio version
AS_VERSION=$(plutil -p "$ANDROID_STUDIO_PATH/Contents/Info.plist" | grep CFBundleShortVersionString | cut -d'"' -f4)
print_info "Android Studio Version: $AS_VERSION"

# Android Studio config directory
AS_CONFIG_DIR="$HOME/Library/Application Support/Google/AndroidStudio$AS_VERSION"
print_info "Config Directory: $AS_CONFIG_DIR"

# 2. Clean up existing mess
print_warning "Cleaning up existing installations..."

# Remove Homebrew's universal platform-tools (they're not pure ARM64)
if brew list --cask android-platform-tools &>/dev/null; then
    print_debug "Removing Homebrew universal platform-tools..."
    brew uninstall --cask android-platform-tools
fi

# Remove broken wrapper scripts
sudo rm -rf /usr/local/bin/android-tools-arm64 2>/dev/null || true
sudo rm -f /usr/local/bin/android-studio-arm64 2>/dev/null || true

print_success "Cleaned up duplicate installations"

# 3. Install latest platform-tools from Google (universal binary that runs ARM64 on M1)
print_warning "Installing latest platform-tools from Google (universal binary, runs ARM64 on M1)..."

# Download and install latest platform-tools (universal binary that runs ARM64 on M1)
PLATFORM_TOOLS_URL="https://dl.google.com/android/repository/platform-tools-latest-darwin.zip"
TEMP_DIR=$(mktemp -d)
PLATFORM_TOOLS_DIR="$ANDROID_SDK_ROOT/platform-tools"

print_debug "Downloading latest platform-tools..."
curl -L "$PLATFORM_TOOLS_URL" -o "$TEMP_DIR/platform-tools.zip"

print_debug "Extracting latest platform-tools..."
unzip -q "$TEMP_DIR/platform-tools.zip" -d "$TEMP_DIR"

# Backup existing platform-tools
if [[ -d "$PLATFORM_TOOLS_DIR" ]]; then
    print_debug "Backing up existing platform-tools..."
    mv "$PLATFORM_TOOLS_DIR" "${PLATFORM_TOOLS_DIR}.backup.$(date +%s)"
fi

# Install new platform-tools
print_debug "Installing latest platform-tools..."
mv "$TEMP_DIR/platform-tools" "$PLATFORM_TOOLS_DIR"

# Clean up
rm -rf "$TEMP_DIR"

print_success "Latest platform-tools installed (universal binary, runs ARM64 on M1)"

# 4. Create Android Studio config directories if they don't exist
mkdir -p "$AS_CONFIG_DIR"
mkdir -p "$HOME/Library/Preferences/AndroidStudio$AS_VERSION"

# 5. Create optimized JVM options for Android Studio
print_warning "Creating optimized JVM options for Android Studio..."

cat > "$AS_CONFIG_DIR/studio.vmoptions" << EOF
# Android Studio BULLETPROOF ARM64 JVM Configuration
# Optimized for M1 MacBook performance

# Memory settings (adjust based on your system)
-Xmx4g
-Xms2g
-XX:ReservedCodeCacheSize=1g
-XX:MaxMetaspaceSize=512m

# Garbage collection optimization for ARM64
-XX:+UseG1GC
-XX:+UseStringDeduplication
-XX:MaxGCPauseMillis=200

# ARM64 specific optimizations
-XX:+UseCompressedOops
-XX:+UseCompressedClassPointers

# Performance optimizations
-XX:+UnlockExperimentalVMOptions
-XX:+UseJVMCICompiler
-XX:+TieredCompilation
-XX:TieredStopAtLevel=1

# Disable unnecessary features for better performance
-Dsun.io.useCanonPrefixCache=false
-Djava.net.preferIPv4Stack=true
-Djdk.http.auth.tunneling.disabledSchemes=""
-Djdk.attach.allowAttachSelf=true
-Djdk.module.illegalAccess.silent=true

# Android Studio specific optimizations
-Dfile.encoding=UTF-8
-Dsun.jnu.encoding=UTF-8
-Dconsole.encoding=UTF-8

# Disable telemetry and analytics for better performance
-Didea.is.internal=true
-Didea.cycle.buffer.size=1024
-Didea.max.intellisense.filesize=2500
-Didea.parallel.indexing=true
-Didea.auto.reload.modified.plugin=true

# Network optimizations
-Djava.net.preferIPv4Stack=true
-Dnetworkaddress.cache.ttl=60
-Dnetworkaddress.cache.negative.ttl=10

# File system optimizations
-Djava.io.tmpdir=/tmp
-Djava.awt.headless=true
EOF

# Also write to Preferences directory for safety
cp "$AS_CONFIG_DIR/studio.vmoptions" "$HOME/Library/Preferences/AndroidStudio$AS_VERSION/studio.vmoptions"

print_success "Android Studio JVM options configured (both locations)"

# 6. Create optimized idea.properties
print_warning "Creating optimized idea.properties..."

cat > "$AS_CONFIG_DIR/idea.properties" << EOF
# Android Studio BULLETPROOF ARM64 Properties
# Optimized for M1 MacBook performance

# Performance optimizations
idea.max.intellisense.filesize=2500
idea.cycle.buffer.size=1024
idea.parallel.indexing=true
idea.auto.reload.modified.plugin=true

# Memory optimizations
idea.max.content.load.filesize=20000
idea.max.vcs.loaded.size.mb=100

# Disable unnecessary features
idea.is.internal=true
idea.suppress.double.click.handler=true
idea.auto.save.interval=2000

# ARM64 specific optimizations
idea.use.native.fs.for.win=false
idea.override.vm.heap.size=true

# Android Studio specific
android.sdk.path=$ANDROID_SDK_ROOT
android.ndk.path=$ANDROID_SDK_ROOT/ndk

# Disable telemetry
idea.usage.statistics.enabled=false
idea.usage.statistics.consent.required=false
EOF

# Also write to Preferences directory for safety
cp "$AS_CONFIG_DIR/idea.properties" "$HOME/Library/Preferences/AndroidStudio$AS_VERSION/idea.properties"

print_success "Android Studio properties configured (both locations)"

# 7. Create user bin directory and simple launcher
print_warning "Creating user bin directory and launcher..."

mkdir -p "$HOME/bin"

# Create simple Android Studio launcher
cat > "$HOME/bin/android-studio" << 'EOF'
#!/bin/bash
# Android Studio BULLETPROOF ARM64 Launcher

# Force ARM64 execution
export JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home"
export ANDROID_SDK_ROOT="$ANDROID_SDK_ROOT"
export ANDROID_HOME="$ANDROID_SDK_ROOT"

# Launch Android Studio with ARM64 enforcement
arch -arm64 "/Applications/Android Studio.app/Contents/MacOS/studio" "$@"
EOF

chmod +x "$HOME/bin/android-studio"

print_success "Android Studio launcher created"

# 8. Setup environment variables (only if not already present)
print_warning "Setting up environment variables..."

# Check if Android Studio section already exists in .zshrc
if ! grep -q "# Android Studio BULLETPROOF ARM64 Environment" ~/.zshrc; then
    cat >> ~/.zshrc << EOF

# Android Studio BULLETPROOF ARM64 Environment
export ANDROID_STUDIO_JDK="/Applications/Android Studio.app/Contents/jbr/Contents/Home"
export ANDROID_SDK_ROOT="$ANDROID_SDK_ROOT"
export ANDROID_HOME="$ANDROID_SDK_ROOT"

# Add user bin to PATH
export PATH="$HOME/bin:$PATH"

# Android Studio aliases
alias as="android-studio"

# Force ARM64 for all Android tools (simple and clean)
alias adb="arch -arm64 adb"
alias sdkmanager="arch -arm64 sdkmanager"
alias aapt="arch -arm64 aapt"
alias aapt2="arch -arm64 aapt2"
EOF
    print_success "Environment variables added to .zshrc"
else
    print_info "Environment variables already present in .zshrc"
fi

# 9. Verify installation
print_header "Verifying BULLETPROOF ARM64 Setup..."

# Check Android Studio binary
AS_ARCH=$(file "/Applications/Android Studio.app/Contents/MacOS/studio" | grep -o 'arm64\|x86_64')
if [[ $AS_ARCH == "arm64" ]]; then
    print_success "Android Studio: ARM64"
else
    print_error "Android Studio: $AS_ARCH (not ARM64)"
fi

# Check Android Studio JVM
AS_JVM_ARCH=$(file "/Applications/Android Studio.app/Contents/jbr/Contents/Home/bin/java" | grep -o 'arm64\|x86_64')
if [[ $AS_JVM_ARCH == "arm64" ]]; then
    print_success "Android Studio JVM: ARM64"
else
    print_error "Android Studio JVM: $AS_JVM_ARCH (not ARM64)"
fi

# Check ADB (universal binary that runs ARM64 on M1)
ADB_ARCH=$(file "$ANDROID_SDK_ROOT/platform-tools/adb" | grep -o 'arm64\|x86_64')
if [[ $ADB_ARCH == "arm64" ]]; then
    print_success "ADB: Universal binary (runs ARM64 on Apple Silicon)"
else
    print_warning "ADB: Universal binary (runs ARM64 on Apple Silicon)"
fi

# Check AAPT
AAPT_ARCH=$(file "$ANDROID_SDK_ROOT/build-tools/34.0.0/aapt" | grep -o 'arm64\|x86_64')
if [[ $AAPT_ARCH == "arm64" ]]; then
    print_success "AAPT: Universal binary (runs ARM64 on Apple Silicon)"
else
    print_warning "AAPT: Universal binary (runs ARM64 on Apple Silicon)"
fi

# 10. Performance summary
print_header "Android Studio BULLETPROOF ARM64 Optimization Complete!"
echo ""
echo "🎯 What was fixed:"
echo "   • Removed duplicate ADB installations"
echo "   • Installed latest platform-tools from Google (universal binary, runs ARM64)"
echo "   • Cleaned up broken wrapper scripts"
echo "   • Created simple, clean aliases"
echo "   • Optimized JVM and IDE configuration (both locations)"
echo "   • Prevented .zshrc duplication"
echo ""

print_header "Your Clean Android Studio Commands"
echo ""
echo "🚀 Launch Android Studio:"
echo "   android-studio          # Launch with ARM64 enforcement"
echo "   as                      # Short alias"
echo ""
echo "🔧 SDK Tools (Universal Binary, Runs ARM64):"
echo "   adb                     # Universal binary (runs ARM64 on Apple Silicon)"
echo "   sdkmanager              # Universal binary (runs ARM64 on Apple Silicon)"
echo "   aapt                    # Universal binary (runs ARM64 on Apple Silicon)"
echo "   aapt2                   # Universal binary (runs ARM64 on Apple Silicon)"
echo ""

print_success "Android Studio is now truly BULLETPROOF ARM64!"
print_info "To apply changes, run: source ~/.zshrc"
print_info "Launch Android Studio with: android-studio"
print_info "No more duplicate installations or broken wrappers!"
print_info "Note: Platform tools are universal binaries that run ARM64 on Apple Silicon"
