import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, globalStyles } from '../../theme/styles';
import Header from '../../components/Header';

export default function PaymentsScreen({ navigation }) {
  const [selectedFilter, setSelectedFilter] = useState('Month');

  const filters = ['Day', 'Week', 'Month', 'Year'];

  const paymentMethods = [
    { name: 'Card (Stripe)', amount: '56,700' },
    { name: 'MobilePay', amount: '27,300' },
    { name: 'Apple Pay', amount: '4,500' },
    { name: 'Cash', amount: '3,900' },
  ];

  const taxData = [
    { label: 'Taxable revenue', amount: '96,600' },
    { label: 'Non-taxable revenue', amount: '12,600' },
    { label: 'Calculated tax (25%)', amount: '24,150' },
  ];

  return (
    <View style={globalStyles.container}>
      <Header 
        rightIcon="settings-outline"
        onRightPress={() => {}}
      />
      
      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Payments</Text>
        <View style={styles.filters}>
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterButton,
                selectedFilter === filter && styles.activeFilter
              ]}
              onPress={() => setSelectedFilter(filter)}
            >
              <Text style={[
                styles.filterText,
                selectedFilter === filter && styles.activeFilterText
              ]}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.revenueSummary}>
          <Text style={styles.summaryTitle}>Revenue Summary</Text>
          <Text style={styles.summaryAmount}>$17,500</Text>
          <Text style={styles.summaryTransactions}>60 Transactions</Text>
        </View>

        <View style={styles.salesTax}>
          <Text style={styles.sectionTitle}>Sales Tax</Text>
          <View style={styles.taxItem}>
            <Text style={styles.taxLabel}>Taxable Revenue</Text>
            <Text style={styles.taxAmount}>$15,000</Text>
          </View>
          <View style={styles.taxItem}>
            <Text style={styles.taxLabel}>Calculated Tax (25%)</Text>
            <Text style={styles.taxAmount}>$3,750</Text>
          </View>
          <View style={styles.taxItem}>
            <Text style={styles.taxLabel}>Non-Taxable Services</Text>
            <Text style={styles.taxAmount}>$2,500</Text>
          </View>
        </View>

        <View style={styles.payouts}>
          <Text style={styles.sectionTitle}>Payouts</Text>
          <Text style={styles.payoutAmount}>$10,000</Text>
          <Text style={styles.payoutDate}>Apr 15</Text>
          <Text style={styles.payoutDate}>Apr 15</Text>
        </View>

        <View style={styles.exportOptions}>
          <TouchableOpacity style={styles.exportButton}>
            <Text style={styles.exportButtonText}>Download PDF</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.exportButton}>
            <Text style={styles.exportButtonText}>Export to Excel</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.charts}>
          <View style={styles.revenueChart}>
            <Text style={styles.chartTitle}>Revenue</Text>
            <View style={styles.chartPlaceholder}>
              <Text style={styles.chartText}>Revenue Chart</Text>
              <Text style={styles.chartSubtext}>$5,000 - $65,000 kr</Text>
              <Text style={styles.chartDate}>Apr 15</Text>
            </View>
          </View>

          <View style={styles.paymentMethodsChart}>
            <Text style={styles.chartTitle}>Payment Methods</Text>
            <View style={styles.chartPlaceholder}>
              <Text style={styles.chartText}>Payment Methods Chart</Text>
              <Text style={styles.chartSubtext}>Card, MobilePay, ApplePay</Text>
            </View>
          </View>
        </View>

        <View style={styles.paymentMethods}>
          <Text style={styles.sectionTitle}>Payment Methods</Text>
          {paymentMethods.map((method, index) => (
            <View key={index} style={styles.paymentMethodItem}>
              <Text style={styles.paymentMethodName}>{method.name}</Text>
              <Text style={styles.paymentMethodAmount}>{method.amount}</Text>
            </View>
          ))}
          <TouchableOpacity style={styles.reportCashButton}>
            <Ionicons name="receipt-outline" size={16} color={colors.primary} />
            <Text style={styles.reportCashText}>Report Cash Payment</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.taxSection}>
          <Text style={styles.sectionTitle}>Tax</Text>
          {taxData.map((item, index) => (
            <View key={index} style={styles.taxItem}>
              <Text style={styles.taxLabel}>{item.label}</Text>
              <Text style={styles.taxAmount}>{item.amount}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 20,
    marginTop: 20,
  },
  filters: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 8,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: colors.background.white,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  activeFilter: {
    backgroundColor: colors.primary,
  },
  filterText: {
    fontSize: 14,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  activeFilterText: {
    color: colors.text.white,
  },
  revenueSummary: {
    backgroundColor: colors.background.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 8,
  },
  summaryAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 4,
  },
  summaryTransactions: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  salesTax: {
    backgroundColor: colors.background.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 16,
  },
  taxItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  taxLabel: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  taxAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
  },
  payouts: {
    backgroundColor: colors.background.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  payoutAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 8,
  },
  payoutDate: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  exportOptions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  exportButton: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  exportButtonText: {
    color: colors.text.white,
    fontSize: 14,
    fontWeight: '600',
  },
  charts: {
    marginBottom: 24,
  },
  revenueChart: {
    backgroundColor: colors.background.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  paymentMethodsChart: {
    backgroundColor: colors.background.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
  },
  chartPlaceholder: {
    height: 120,
    backgroundColor: colors.lightGray,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  chartSubtext: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  chartDate: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  paymentMethods: {
    backgroundColor: colors.background.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  paymentMethodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  paymentMethodName: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  paymentMethodAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
  },
  reportCashButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingVertical: 8,
  },
  reportCashText: {
    fontSize: 14,
    color: colors.primary,
    marginLeft: 8,
    fontWeight: '600',
  },
  taxSection: {
    backgroundColor: colors.background.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
