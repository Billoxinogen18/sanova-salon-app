import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Animated, 
  StatusBar,
  Alert,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

export default function PaymentsScreen({ navigation }) {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [isLoading, setIsLoading] = useState(false);

  // Animated values for smooth entrance animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  // Time period filters
  const periods = [
    { id: 'day', name: 'Today' },
    { id: 'week', name: 'This Week' },
    { id: 'month', name: 'This Month' },
    { id: 'year', name: 'This Year' },
  ];

  // Sample financial data with Danish currency
  const financialData = {
    day: {
      totalRevenue: 1250,
      transactions: 8,
      services: 1050,
      products: 200,
      growth: '+12%',
    },
    week: {
      totalRevenue: 6200,
      transactions: 42,
      services: 5100,
      products: 1100,
      growth: '+8%',
    },
    month: {
      totalRevenue: 24800,
      transactions: 156,
      services: 20400,
      products: 4400,
      growth: '+15%',
    },
    year: {
      totalRevenue: 285000,
      transactions: 1840,
      services: 235000,
      products: 50000,
      growth: '+22%',
    },
  };

  // Payment methods breakdown
  const paymentMethods = [
    { 
      id: 'card', 
      name: 'Card Payments', 
      amount: 18200, 
      percentage: 73,
      icon: 'card-outline',
      color: '#3B82F6' 
    },
    { 
      id: 'mobilepay', 
      name: 'MobilePay', 
      amount: 4800, 
      percentage: 19,
      icon: 'phone-portrait-outline',
      color: '#8B5CF6' 
    },
    { 
      id: 'applepay', 
      name: 'Apple Pay', 
      amount: 1500, 
      percentage: 6,
      icon: 'logo-apple',
      color: '#000000' 
    },
    { 
      id: 'cash', 
      name: 'Cash', 
      amount: 300, 
      percentage: 2,
      icon: 'cash-outline',
      color: '#10B981' 
    },
  ];

  // Recent transactions
  const recentTransactions = [
    {
      id: 1,
      customer: 'Emma Nielsen',
      service: 'Classic Manicure',
      amount: 350,
      method: 'card',
      time: '14:30',
      status: 'completed',
    },
    {
      id: 2,
      customer: 'Lars Hansen',
      service: 'Men\'s Haircut',
      amount: 450,
      method: 'mobilepay',
      time: '13:15',
      status: 'completed',
    },
    {
      id: 3,
      customer: 'Sofia Andersen',
      service: 'Hair Color Treatment',
      amount: 800,
      method: 'card',
      time: '11:00',
      status: 'pending',
    },
  ];

  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    
    // Start entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Format currency
  const formatCurrency = (amount) => {
    return `${amount.toLocaleString()} kr`;
  };

  // Handle period change
  const handlePeriodChange = (periodId) => {
    setSelectedPeriod(periodId);
  };

  // Handle export
  const handleExport = (type) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert('Export Complete', `${type} report has been generated successfully.`);
    }, 2000);
  };

  // Get current data
  const currentData = financialData[selectedPeriod];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="light-content" backgroundColor="#213527" />

      {/* Header - Deep green (#213527) - Same as other screens */}
      <Animated.View
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }
        ]}
      >
        {/* Logo Leaf & SANOVA - Centered horizontally and vertically */}
        <View style={styles.logoContainer}>
          {/* Logo - Same dimensions as other screens */}
          <Image 
            source={require('../../../assets/logo.png')}
            style={styles.logoIcon}
            resizeMode="contain"
          />
          {/* SANOVA text - Same styling as other screens */}
          <Text style={styles.headerTitle}>SANOVA</Text>
        </View>
      </Animated.View>

      {/* Main Card - Very light cream (#FAF6EC) */}
      <Animated.View
        style={[
          styles.mainCard,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }
        ]}
      >
        {/* Content Section */}
        <View style={styles.contentSection}>
          {/* Header Section with Title and Export Button */}
          <View style={styles.pageHeader}>
            <Text style={styles.sectionTitle}>Payments</Text>
            <TouchableOpacity
              style={styles.exportButton}
              onPress={() => handleExport('PDF')}
              activeOpacity={0.8}
            >
              <Ionicons name="download-outline" size={20} color="#FFFFFF" />
              <Text style={styles.exportButtonText}>Export</Text>
            </TouchableOpacity>
          </View>

          {/* Period Filter Tabs */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.periodScrollView}
            contentContainerStyle={styles.periodContainer}
          >
            {periods.map((period) => (
              <TouchableOpacity
                key={period.id}
                style={[
                  styles.periodTab,
                  selectedPeriod === period.id && styles.activePeriodTab
                ]}
                onPress={() => handlePeriodChange(period.id)}
                activeOpacity={0.8}
              >
                <Text style={[
                  styles.periodTabText,
                  selectedPeriod === period.id && styles.activePeriodTabText
                ]}>
                  {period.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Revenue Summary Card */}
          <View style={styles.revenueSummaryCard}>
            <View style={styles.revenueHeader}>
              <View>
                <Text style={styles.revenueLabel}>Total Revenue</Text>
                <Text style={styles.revenueAmount}>{formatCurrency(currentData.totalRevenue)}</Text>
                <Text style={styles.revenueGrowth}>{currentData.growth} from last period</Text>
              </View>
              <View style={styles.trendIcon}>
                <Ionicons name="trending-up" size={28} color="#22C55E" />
              </View>
            </View>
            
            <View style={styles.revenueBreakdown}>
              <View style={styles.revenueItem}>
                <Text style={styles.revenueItemLabel}>Services</Text>
                <Text style={styles.revenueItemValue}>{formatCurrency(currentData.services)}</Text>
              </View>
              <View style={styles.revenueItem}>
                <Text style={styles.revenueItemLabel}>Products</Text>
                <Text style={styles.revenueItemValue}>{formatCurrency(currentData.products)}</Text>
              </View>
              <View style={styles.revenueItem}>
                <Text style={styles.revenueItemLabel}>Transactions</Text>
                <Text style={styles.revenueItemValue}>{currentData.transactions}</Text>
              </View>
            </View>
          </View>

          {/* Payment Methods Breakdown */}
          <View style={styles.paymentMethodsCard}>
            <Text style={styles.cardTitle}>Payment Methods</Text>
            {paymentMethods.map((method) => (
              <View key={method.id} style={styles.paymentMethodItem}>
                <View style={styles.paymentMethodLeft}>
                  <View style={[styles.methodIcon, { backgroundColor: `${method.color}15` }]}>
                    <Ionicons name={method.icon} size={20} color={method.color} />
                  </View>
                  <View style={styles.methodInfo}>
                    <Text style={styles.methodName}>{method.name}</Text>
                    <Text style={styles.methodPercentage}>{method.percentage}% of payments</Text>
                  </View>
                </View>
                <Text style={styles.methodAmount}>{formatCurrency(method.amount)}</Text>
              </View>
            ))}
          </View>

          {/* Recent Transactions */}
          <View style={styles.transactionsCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Recent Transactions</Text>
              <TouchableOpacity onPress={() => Alert.alert('View All', 'Navigate to full transaction history')}>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            
            {recentTransactions.map((transaction) => (
              <View key={transaction.id} style={styles.transactionItem}>
                <View style={styles.transactionLeft}>
                  <View style={styles.customerAvatar}>
                    <Text style={styles.customerInitial}>
                      {transaction.customer.charAt(0)}
                    </Text>
                  </View>
                  <View style={styles.transactionInfo}>
                    <Text style={styles.customerName}>{transaction.customer}</Text>
                    <Text style={styles.serviceInfo}>{transaction.service} • {transaction.time}</Text>
                  </View>
                </View>
                <View style={styles.transactionRight}>
                  <Text style={styles.transactionAmount}>{formatCurrency(transaction.amount)}</Text>
                  <View style={[
                    styles.transactionStatus,
                    transaction.status === 'completed' ? styles.statusCompleted : styles.statusPending
                  ]}>
                    <Text style={[
                      styles.statusText,
                      transaction.status === 'completed' ? styles.statusTextCompleted : styles.statusTextPending
                    ]}>
                      {transaction.status}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* Tax Information */}
          <View style={styles.taxCard}>
            <Text style={styles.cardTitle}>Tax Information</Text>
            <View style={styles.taxItem}>
              <Text style={styles.taxLabel}>Taxable Revenue (25% VAT)</Text>
              <Text style={styles.taxAmount}>{formatCurrency(currentData.totalRevenue * 0.8)}</Text>
            </View>
            <View style={styles.taxItem}>
              <Text style={styles.taxLabel}>VAT Collected</Text>
              <Text style={styles.taxAmount}>{formatCurrency(currentData.totalRevenue * 0.2)}</Text>
            </View>
            <View style={styles.taxItem}>
              <Text style={styles.taxLabel}>Tax Period</Text>
              <Text style={styles.taxAmount}>{periods.find(p => p.id === selectedPeriod)?.name}</Text>
            </View>
          </View>

          {/* Export Options */}
          <View style={styles.exportCard}>
            <Text style={styles.cardTitle}>Export Reports</Text>
            <View style={styles.exportButtons}>
              <TouchableOpacity
                style={styles.exportOptionButton}
                onPress={() => handleExport('PDF')}
                activeOpacity={0.8}
              >
                <Ionicons name="document-text-outline" size={20} color="#213527" />
                <Text style={styles.exportOptionText}>PDF Report</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.exportOptionButton}
                onPress={() => handleExport('Excel')}
                activeOpacity={0.8}
              >
                <Ionicons name="grid-outline" size={20} color="#213527" />
                <Text style={styles.exportOptionText}>Excel Export</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF6EC', // Exact cream background
  },

  // Header - Deep green (#213527) - Same as other screens
  header: {
    backgroundColor: '#213527', // Exact deep green color
    height: 115, // Same height as other screens
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoIcon: {
    width: 80,
    height: 50,
    marginBottom: 6, // Same spacing as other screens
  },
  headerTitle: {
    fontSize: 25, // Same as other screens
    fontFamily: 'System',
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 2,
    textTransform: 'uppercase',
    textAlign: 'center',
  },

  // Main Card - Very light cream (#FAF6EC)
  mainCard: {
    backgroundColor: '#FAF6EC', // Very light cream
    borderTopLeftRadius: 28, // Top corners only, same as other screens
    borderTopRightRadius: 28,
    width: '100%',
    flex: 1,
    paddingHorizontal: 26, // 26px from left/right
    paddingTop: 38, // 38px margin-top
  },

  // Content Section
  contentSection: {
    flex: 1,
  },

  // Page Header with Title and Export Button
  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },

  // Section Title - "Payments", 25px, weight 700, #223527
  sectionTitle: {
    fontSize: 25, // 25px
    fontWeight: '700', // Weight 700
    color: '#223527', // #223527
  },

  // Export Button - Green with download icon
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#213527', // Deep green background
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
  },

  exportButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // Period Filter
  periodScrollView: {
    marginBottom: 24,
  },

  periodContainer: {
    paddingHorizontal: 0,
  },

  // Period Tab
  periodTab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginRight: 12,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },

  // Active Period Tab
  activePeriodTab: {
    backgroundColor: '#213527', // Deep green background
  },

  // Period Tab Text - 14px, #626463
  periodTabText: {
    fontSize: 14, // 14px
    color: '#626463', // #626463
    fontWeight: '500',
  },

  // Active Period Tab Text - White
  activePeriodTabText: {
    color: '#FFFFFF', // White
    fontWeight: '600',
  },

  // Revenue Summary Card
  revenueSummaryCard: {
    backgroundColor: '#FFFFFF', // White background
    borderRadius: 18, // 18px radius
    padding: 24, // 24px internal padding
    marginBottom: 20, // 20px below
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },

  // Revenue Header
  revenueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },

  // Revenue Label - "Total Revenue", 16px, #626463
  revenueLabel: {
    fontSize: 16, // 16px
    color: '#626463', // #626463
    marginBottom: 8,
  },

  // Revenue Amount - Large amount, 32px, weight 700, #223527
  revenueAmount: {
    fontSize: 32, // 32px
    fontWeight: '700', // Weight 700
    color: '#223527', // #223527
    marginBottom: 6,
  },

  // Revenue Growth - "+15% from last period", 14px, #22C55E
  revenueGrowth: {
    fontSize: 14, // 14px
    color: '#22C55E', // Green
    fontWeight: '500',
  },

  // Trend Icon Container
  trendIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Revenue Breakdown
  revenueBreakdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },

  // Revenue Item
  revenueItem: {
    alignItems: 'center',
  },

  // Revenue Item Label - "Services", 13px, #626463
  revenueItemLabel: {
    fontSize: 13, // 13px
    color: '#626463', // #626463
    marginBottom: 6,
  },

  // Revenue Item Value - Amount, 16px, weight 600, #223527
  revenueItemValue: {
    fontSize: 16, // 16px
    fontWeight: '600', // Weight 600
    color: '#223527', // #223527
  },

  // Payment Methods Card
  paymentMethodsCard: {
    backgroundColor: '#FFFFFF', // White background
    borderRadius: 18, // 18px radius
    padding: 20, // 20px internal padding
    marginBottom: 20, // 20px below
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },

  // Card Title - "Payment Methods", 18px, weight 600, #223527
  cardTitle: {
    fontSize: 18, // 18px
    fontWeight: '600', // Weight 600
    color: '#223527', // #223527
    marginBottom: 16,
  },

  // Payment Method Item
  paymentMethodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  // Payment Method Left
  paymentMethodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  // Method Icon
  methodIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  // Method Info
  methodInfo: {
    flex: 1,
  },

  // Method Name - "Card Payments", 15px, weight 600, #223527
  methodName: {
    fontSize: 15, // 15px
    fontWeight: '600', // Weight 600
    color: '#223527', // #223527
    marginBottom: 2,
  },

  // Method Percentage - "73% of payments", 13px, #626463
  methodPercentage: {
    fontSize: 13, // 13px
    color: '#626463', // #626463
  },

  // Method Amount - "18,200 kr", 16px, weight 600, #223527
  methodAmount: {
    fontSize: 16, // 16px
    fontWeight: '600', // Weight 600
    color: '#223527', // #223527
  },

  // Transactions Card
  transactionsCard: {
    backgroundColor: '#FFFFFF', // White background
    borderRadius: 18, // 18px radius
    padding: 20, // 20px internal padding
    marginBottom: 20, // 20px below
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },

  // Card Header
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  // View All Text - "View All", 14px, #223527
  viewAllText: {
    fontSize: 14, // 14px
    color: '#223527', // #223527
    fontWeight: '500',
  },

  // Transaction Item
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  // Transaction Left
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  // Customer Avatar
  customerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#213527',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  // Customer Initial - "E", 16px, weight 600, #FFF
  customerInitial: {
    fontSize: 16, // 16px
    fontWeight: '600', // Weight 600
    color: '#FFFFFF', // #FFF
  },

  // Transaction Info
  transactionInfo: {
    flex: 1,
  },

  // Customer Name - "Emma Nielsen", 15px, weight 600, #223527
  customerName: {
    fontSize: 15, // 15px
    fontWeight: '600', // Weight 600
    color: '#223527', // #223527
    marginBottom: 2,
  },

  // Service Info - "Classic Manicure • 14:30", 13px, #626463
  serviceInfo: {
    fontSize: 13, // 13px
    color: '#626463', // #626463
  },

  // Transaction Right
  transactionRight: {
    alignItems: 'flex-end',
  },

  // Transaction Amount - "350 kr", 16px, weight 600, #223527
  transactionAmount: {
    fontSize: 16, // 16px
    fontWeight: '600', // Weight 600
    color: '#223527', // #223527
    marginBottom: 4,
  },

  // Transaction Status
  transactionStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },

  // Status Completed
  statusCompleted: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
  },

  // Status Pending
  statusPending: {
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
  },

  // Status Text - 11px, weight 500
  statusText: {
    fontSize: 11, // 11px
    fontWeight: '500', // Weight 500
    textTransform: 'capitalize',
  },

  // Status Text Completed - Green
  statusTextCompleted: {
    color: '#22C55E',
  },

  // Status Text Pending - Orange
  statusTextPending: {
    color: '#FBBF24',
  },

  // Tax Card
  taxCard: {
    backgroundColor: '#FFFFFF', // White background
    borderRadius: 18, // 18px radius
    padding: 20, // 20px internal padding
    marginBottom: 20, // 20px below
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },

  // Tax Item
  taxItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  // Tax Label - "Taxable Revenue (25% VAT)", 14px, #626463
  taxLabel: {
    fontSize: 14, // 14px
    color: '#626463', // #626463
  },

  // Tax Amount - "19,840 kr", 15px, weight 600, #223527
  taxAmount: {
    fontSize: 15, // 15px
    fontWeight: '600', // Weight 600
    color: '#223527', // #223527
  },

  // Export Card
  exportCard: {
    backgroundColor: '#FFFFFF', // White background
    borderRadius: 18, // 18px radius
    padding: 20, // 20px internal padding
    marginBottom: 40, // 40px below for bottom spacing
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },

  // Export Buttons
  exportButtons: {
    flexDirection: 'row',
    gap: 12,
  },

  // Export Option Button
  exportOptionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F3E6', // Light background
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
  },

  // Export Option Text - "PDF Report", 14px, weight 600, #213527
  exportOptionText: {
    fontSize: 14, // 14px
    fontWeight: '600', // Weight 600
    color: '#213527', // #213527
  },
});
