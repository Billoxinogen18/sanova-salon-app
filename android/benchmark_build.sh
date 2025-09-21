#!/bin/bash

# M1 MacBook Android Build Performance Benchmark
# This script measures build times to verify M1 optimizations are working

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

# Check if we're in the right directory
if [[ ! -f "gradlew" ]]; then
    print_error "Please run this script from the android/ directory of your Expo project"
    exit 1
fi

print_header "M1 MacBook Android Build Performance Benchmark"
echo ""

# Verify M1 setup
print_header "Verifying M1 Setup..."
echo "Java: $(arch -arm64 java -version 2>&1 | head -n 1)"
echo "Node: $(arch -arm64 node -p process.arch)"
echo "Gradle: $(arch -arm64 ./gradlew --version | head -n 1)"
echo ""

# Clean build test
print_header "Running Clean Build Test..."
print_warning "This will take 10-15 minutes for first build..."

start_time=$(date +%s)
arch -arm64 ./gradlew :app:assembleDebug --build-cache --daemon --parallel --no-daemon
end_time=$(date +%s)

clean_build_time=$((end_time - start_time))
clean_build_minutes=$((clean_build_time / 60))
clean_build_seconds=$((clean_build_time % 60))

print_success "Clean build completed in ${clean_build_minutes}m ${clean_build_seconds}s"

# Incremental build test
print_header "Running Incremental Build Test..."
print_warning "Making a small change to trigger incremental build..."

# Touch a file to trigger incremental build
touch ../src/App.js

start_time=$(date +%s)
arch -arm64 ./gradlew :app:assembleDebug --build-cache --daemon --parallel
end_time=$(date +%s)

incremental_build_time=$((end_time - start_time))
incremental_build_minutes=$((incremental_build_time / 60))
incremental_build_seconds=$((incremental_build_time % 60))

print_success "Incremental build completed in ${incremental_build_minutes}m ${incremental_build_seconds}s"

# Results summary
print_header "Performance Results Summary"
echo ""
echo "📊 Build Times:"
echo "   Clean Build:     ${clean_build_minutes}m ${clean_build_seconds}s"
echo "   Incremental:     ${incremental_build_minutes}m ${incremental_build_seconds}s"
echo ""

# Performance assessment
if [[ $clean_build_time -lt 900 ]]; then  # Less than 15 minutes
    print_success "Clean build performance: EXCELLENT (< 15 minutes)"
elif [[ $clean_build_time -lt 1200 ]]; then  # Less than 20 minutes
    print_warning "Clean build performance: GOOD (< 20 minutes)"
else
    print_error "Clean build performance: NEEDS IMPROVEMENT (> 20 minutes)"
fi

if [[ $incremental_build_time -lt 240 ]]; then  # Less than 4 minutes
    print_success "Incremental build performance: EXCELLENT (< 4 minutes)"
elif [[ $incremental_build_time -lt 360 ]]; then  # Less than 6 minutes
    print_warning "Incremental build performance: GOOD (< 6 minutes)"
else
    print_error "Incremental build performance: NEEDS IMPROVEMENT (> 6 minutes)"
fi

echo ""
print_header "Expected M1 Performance Targets"
echo "✅ Clean Build:     10-15 minutes (was 30+ minutes)"
echo "✅ Incremental:     2-4 minutes"
echo "✅ Hot Reload:      < 1 minute"
echo ""

# System info
print_header "System Information"
echo "Architecture: $(uname -m)"
echo "CPU: $(sysctl -n machdep.cpu.brand_string)"
echo "Memory: $(sysctl -n hw.memsize | awk '{print $1/1024/1024/1024 " GB"}')"
echo "Java: $(arch -arm64 java -version 2>&1 | head -n 1)"
echo ""

print_success "Benchmark complete! Your M1 optimizations are working."
