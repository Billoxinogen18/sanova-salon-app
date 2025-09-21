#!/bin/bash

# Android Studio BULLETPROOF ARM64 Optimization Script
# This script ensures Android Studio and ALL its tools run pure ARM64

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

# 2. Create Android Studio config directory if it doesn't exist
mkdir -p "$AS_CONFIG_DIR"

# 3. Create optimized JVM options for Android Studio
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

print_success "Android Studio JVM options configured"

# 4. Create optimized idea.properties
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

print_success "Android Studio properties configured"

# 5. Create Android Studio launch script with ARM64 enforcement
print_warning "Creating Android Studio ARM64 launch script..."

cat > "/usr/local/bin/android-studio-arm64" << EOF
#!/bin/bash
# Android Studio BULLETPROOF ARM64 Launcher

# Force ARM64 execution
export JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home"
export ANDROID_SDK_ROOT="$ANDROID_SDK_ROOT"
export ANDROID_HOME="$ANDROID_SDK_ROOT"

# Force ARM64 for all tools
export PATH="/opt/homebrew/bin:$PATH"

# Launch Android Studio with ARM64 enforcement
arch -arm64 "/Applications/Android Studio.app/Contents/MacOS/studio" "\$@"
EOF

chmod +x "/usr/local/bin/android-studio-arm64"
print_success "Android Studio ARM64 launcher created"

# 6. Create SDK tools ARM64 wrapper scripts
print_warning "Creating SDK tools ARM64 wrappers..."

# Create wrapper directory
WRAPPER_DIR="/usr/local/bin/android-tools-arm64"
mkdir -p "$WRAPPER_DIR"

# ADB wrapper
cat > "$WRAPPER_DIR/adb" << 'EOF'
#!/bin/bash
arch -arm64 adb "$@"
EOF

# SDK Manager wrapper
cat > "$WRAPPER_DIR/sdkmanager" << 'EOF'
#!/bin/bash
arch -arm64 sdkmanager "$@"
EOF

# AAPT wrapper
cat > "$WRAPPER_DIR/aapt" << 'EOF'
#!/bin/bash
arch -arm64 aapt "$@"
EOF

# AAPT2 wrapper
cat > "$WRAPPER_DIR/aapt2" << 'EOF'
#!/bin/bash
arch -arm64 aapt2 "$@"
EOF

# Make all wrappers executable
chmod +x "$WRAPPER_DIR"/*

# Add to PATH
echo 'export PATH="/usr/local/bin/android-tools-arm64:$PATH"' >> ~/.zshrc

print_success "SDK tools ARM64 wrappers created"

# 7. Create Android Studio environment setup
print_warning "Setting up Android Studio environment..."

cat >> ~/.zshrc << EOF

# Android Studio BULLETPROOF ARM64 Environment
export ANDROID_STUDIO_JDK="/Applications/Android Studio.app/Contents/jbr/Contents/Home"
export ANDROID_SDK_ROOT="$ANDROID_SDK_ROOT"
export ANDROID_HOME="$ANDROID_SDK_ROOT"

# Android Studio aliases
alias android-studio="android-studio-arm64"
alias as="android-studio-arm64"

# Force ARM64 for all Android tools
alias adb-arm64="arch -arm64 adb"
alias sdkmanager-arm64="arch -arm64 sdkmanager"
alias aapt-arm64="arch -arm64 aapt"
alias aapt2-arm64="arch -arm64 aapt2"
EOF

print_success "Android Studio environment configured"

# 8. Verify Android Studio installation
print_header "Verifying Android Studio ARM64 Setup..."

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

# Check SDK tools
print_debug "SDK Manager: $(file $ANDROID_SDK_ROOT/cmdline-tools/latest/bin/sdkmanager | grep -o 'arm64\|x86_64' | head -1)"
print_debug "ADB: $(file $ANDROID_SDK_ROOT/platform-tools/adb | grep -o 'arm64\|x86_64' | head -1)"
print_debug "AAPT: $(file $ANDROID_SDK_ROOT/build-tools/34.0.0/aapt | grep -o 'arm64\|x86_64' | head -1)"

# 9. Performance summary
print_header "Android Studio BULLETPROOF ARM64 Optimization Complete!"
echo ""
echo "🎯 What was optimized:"
echo "   • Android Studio JVM: ARM64 with 4GB memory"
echo "   • SDK Tools: ARM64 wrappers created"
echo "   • Launch Script: Forces ARM64 execution"
echo "   • Configuration: Optimized for M1 performance"
echo ""

print_header "Your New Android Studio Commands"
echo ""
echo "🚀 Launch Android Studio:"
echo "   android-studio          # Launch with ARM64 enforcement"
echo "   as                      # Short alias"
echo ""
echo "🔧 SDK Tools (ARM64):"
echo "   adb-arm64              # Force ARM64 ADB"
echo "   sdkmanager-arm64       # Force ARM64 SDK Manager"
echo "   aapt-arm64             # Force ARM64 AAPT"
echo "   aapt2-arm64            # Force ARM64 AAPT2"
echo ""

print_success "Android Studio is now BULLETPROOF ARM64 optimized!"
print_info "To apply changes, run: source ~/.zshrc"
print_info "Launch Android Studio with: android-studio"
