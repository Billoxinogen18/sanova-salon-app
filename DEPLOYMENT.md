# Deployment Guide for Sanova Salon App

This guide covers the deployment process for the Sanova Salon App using Expo and EAS Build.

## Prerequisites

1. **Expo CLI**: Install globally
   ```bash
   npm install -g @expo/cli
   ```

2. **EAS CLI**: Install globally
   ```bash
   npm install -g eas-cli
   ```

3. **Expo Account**: Create an account at [expo.dev](https://expo.dev)

4. **Apple Developer Account** (for iOS deployment)
5. **Google Play Console Account** (for Android deployment)

## Setup

### 1. Login to Expo
```bash
expo login
```

### 2. Configure EAS
```bash
eas build:configure
```

This will create the `eas.json` configuration file.

### 3. Update app.json
Ensure your `app.json` includes:
- Correct app name and slug
- Proper bundle identifiers
- App icons and splash screens
- EAS project ID

## Building for Development

### iOS Development Build
```bash
eas build --platform ios --profile development
```

### Android Development Build
```bash
eas build --platform android --profile development
```

## Building for Production

### iOS Production Build
```bash
eas build --platform ios --profile production
```

### Android Production Build
```bash
eas build --platform android --profile production
```

### Universal Build (Both Platforms)
```bash
eas build --platform all --profile production
```

## Submitting to App Stores

### iOS App Store
1. Build the production version
2. Submit to App Store Connect:
   ```bash
   eas submit --platform ios
   ```

### Google Play Store
1. Build the production version
2. Submit to Google Play Console:
   ```bash
   eas submit --platform android
   ```

## Environment Configuration

### Development Environment
- Use Expo Go app for testing
- Enable development client features
- Use local development server

### Staging Environment
- Create internal distribution builds
- Test with TestFlight (iOS) or Internal Testing (Android)
- Use staging API endpoints

### Production Environment
- Optimized builds with production settings
- Use production API endpoints
- Enable crash reporting and analytics

## Assets and Icons

### Required Assets
- App icon (1024x1024px)
- Splash screen (1242x2436px for iOS)
- Adaptive icon (1024x1024px for Android)
- Favicon (32x32px for web)

### Asset Optimization
- Use PNG format for icons
- Optimize file sizes
- Test on different screen densities

## Configuration Files

### eas.json
Contains build profiles and configuration:
- Development profile for testing
- Preview profile for internal testing
- Production profile for app stores

### app.json
Contains app metadata:
- App name and version
- Bundle identifiers
- Asset references
- Platform-specific settings

## Monitoring and Analytics

### Crash Reporting
- Integrate Sentry or similar service
- Monitor app stability
- Track error rates

### Analytics
- Implement user analytics
- Track feature usage
- Monitor performance metrics

## Security Considerations

### API Security
- Use HTTPS for all API calls
- Implement proper authentication
- Secure sensitive data storage

### App Security
- Enable code obfuscation
- Use secure storage for sensitive data
- Implement proper session management

## Troubleshooting

### Common Build Issues
1. **Bundle identifier conflicts**: Ensure unique identifiers
2. **Asset missing errors**: Verify all assets are included
3. **Dependency conflicts**: Check package versions

### Common Submission Issues
1. **App Store rejection**: Review guidelines and fix issues
2. **Metadata errors**: Ensure all required fields are filled
3. **Screenshot requirements**: Provide all required screenshots

## Best Practices

1. **Version Management**: Use semantic versioning
2. **Testing**: Test thoroughly before submission
3. **Documentation**: Keep deployment docs updated
4. **Backup**: Maintain backup of configuration files
5. **Monitoring**: Set up monitoring and alerts

## Support

For deployment issues:
1. Check Expo documentation
2. Review EAS Build logs
3. Contact Expo support if needed
4. Check app store guidelines

## Additional Resources

- [Expo Documentation](https://docs.expo.dev/)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [App Store Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Google Play Guidelines](https://support.google.com/googleplay/android-developer/answer/9859348)
