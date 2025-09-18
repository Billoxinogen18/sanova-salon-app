import { firestoreService } from './firebaseService';

export class ExportService {
  constructor() {
    this.apiBaseUrl = 'https://sanova-salon-app.vercel.app/api';
  }

  // Export salon reports to Excel
  async exportSalonReportsToExcel(salonId, dateRange) {
    try {
      // Get salon data
      const salonResult = await firestoreService.salons.getById(salonId);
      if (!salonResult.success) {
        throw new Error('Failed to fetch salon data');
      }

      // Get bookings data
      const bookingsResult = await firestoreService.bookings.getBySalon(salonId);
      if (!bookingsResult.success) {
        throw new Error('Failed to fetch bookings data');
      }

      // Get reviews data
      const reviewsResult = await firestoreService.reviews.getBySalon(salonId);
      if (!reviewsResult.success) {
        throw new Error('Failed to fetch reviews data');
      }

      // Prepare data for export
      const exportData = {
        type: 'excel',
        data: {
          salon: salonResult.data,
          bookings: bookingsResult.data,
          reviews: reviewsResult.data,
          dateRange,
          generatedAt: new Date().toISOString()
        }
      };

      // Call our Vercel API to generate Excel file
      const response = await fetch(`${this.apiBaseUrl}/export-reports`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(exportData)
      });

      if (!response.ok) {
        throw new Error('Failed to generate Excel report');
      }

      // Get the file blob
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `salon-reports-${salonId}-${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return { success: true };
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      return { success: false, error: error.message };
    }
  }

  // Export salon reports to PDF
  async exportSalonReportsToPDF(salonId, dateRange) {
    try {
      // Get salon data
      const salonResult = await firestoreService.salons.getById(salonId);
      if (!salonResult.success) {
        throw new Error('Failed to fetch salon data');
      }

      // Get bookings data
      const bookingsResult = await firestoreService.bookings.getBySalon(salonId);
      if (!bookingsResult.success) {
        throw new Error('Failed to fetch bookings data');
      }

      // Get reviews data
      const reviewsResult = await firestoreService.reviews.getBySalon(salonId);
      if (!reviewsResult.success) {
        throw new Error('Failed to fetch reviews data');
      }

      // Prepare data for export
      const exportData = {
        type: 'pdf',
        data: {
          salon: salonResult.data,
          bookings: bookingsResult.data,
          reviews: reviewsResult.data,
          dateRange,
          generatedAt: new Date().toISOString()
        }
      };

      // Call our Vercel API to generate PDF file
      const response = await fetch(`${this.apiBaseUrl}/export-reports`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(exportData)
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF report');
      }

      // Get the file blob
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `salon-reports-${salonId}-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return { success: true };
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      return { success: false, error: error.message };
    }
  }

  // Export customer data to Excel
  async exportCustomerDataToExcel(userId) {
    try {
      // Get user data
      const userResult = await firestoreService.users.get(userId);
      if (!userResult.success) {
        throw new Error('Failed to fetch user data');
      }

      // Get user bookings
      const bookingsResult = await firestoreService.bookings.getByUser(userId);
      if (!bookingsResult.success) {
        throw new Error('Failed to fetch bookings data');
      }

      // Get user reviews
      const reviewsResult = await firestoreService.reviews.getByUser(userId);
      if (!reviewsResult.success) {
        throw new Error('Failed to fetch reviews data');
      }

      // Prepare data for export
      const exportData = {
        type: 'excel',
        data: {
          user: userResult.data,
          bookings: bookingsResult.data,
          reviews: reviewsResult.data,
          generatedAt: new Date().toISOString()
        }
      };

      // Call our Vercel API to generate Excel file
      const response = await fetch(`${this.apiBaseUrl}/export-reports`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(exportData)
      });

      if (!response.ok) {
        throw new Error('Failed to generate Excel report');
      }

      // Get the file blob
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `customer-data-${userId}-${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return { success: true };
    } catch (error) {
      console.error('Error exporting customer data:', error);
      return { success: false, error: error.message };
    }
  }

  // Generate analytics report
  async generateAnalyticsReport(salonId, dateRange) {
    try {
      // Get all data
      const [salonResult, bookingsResult, reviewsResult] = await Promise.all([
        firestoreService.salons.getById(salonId),
        firestoreService.bookings.getBySalon(salonId),
        firestoreService.reviews.getBySalon(salonId)
      ]);

      if (!salonResult.success || !bookingsResult.success || !reviewsResult.success) {
        throw new Error('Failed to fetch data for analytics');
      }

      // Calculate analytics
      const analytics = this.calculateAnalytics(
        bookingsResult.data,
        reviewsResult.data,
        dateRange
      );

      // Prepare data for export
      const exportData = {
        type: 'excel',
        data: {
          salon: salonResult.data,
          analytics,
          dateRange,
          generatedAt: new Date().toISOString()
        }
      };

      // Call our Vercel API to generate Excel file
      const response = await fetch(`${this.apiBaseUrl}/export-reports`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(exportData)
      });

      if (!response.ok) {
        throw new Error('Failed to generate analytics report');
      }

      // Get the file blob
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `analytics-report-${salonId}-${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return { success: true };
    } catch (error) {
      console.error('Error generating analytics report:', error);
      return { success: false, error: error.message };
    }
  }

  // Calculate analytics from data
  calculateAnalytics(bookings, reviews, dateRange) {
    const analytics = {
      totalBookings: bookings.length,
      totalRevenue: bookings.reduce((sum, booking) => sum + (booking.price || 0), 0),
      averageRating: 0,
      totalReviews: reviews.length,
      completedBookings: bookings.filter(b => b.status === 'completed').length,
      cancelledBookings: bookings.filter(b => b.status === 'cancelled').length,
      pendingBookings: bookings.filter(b => b.status === 'pending').length,
      monthlyStats: {},
      serviceStats: {},
      customerStats: {}
    };

    // Calculate average rating
    if (reviews.length > 0) {
      analytics.averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
    }

    // Calculate monthly stats
    const monthlyStats = {};
    bookings.forEach(booking => {
      const month = new Date(booking.createdAt).toISOString().substring(0, 7); // YYYY-MM
      if (!monthlyStats[month]) {
        monthlyStats[month] = { bookings: 0, revenue: 0 };
      }
      monthlyStats[month].bookings++;
      monthlyStats[month].revenue += booking.price || 0;
    });
    analytics.monthlyStats = monthlyStats;

    // Calculate service stats
    const serviceStats = {};
    bookings.forEach(booking => {
      const serviceName = booking.serviceName || 'Unknown Service';
      if (!serviceStats[serviceName]) {
        serviceStats[serviceName] = { count: 0, revenue: 0 };
      }
      serviceStats[serviceName].count++;
      serviceStats[serviceName].revenue += booking.price || 0;
    });
    analytics.serviceStats = serviceStats;

    // Calculate customer stats
    const customerStats = {};
    bookings.forEach(booking => {
      const customerId = booking.userId;
      if (!customerStats[customerId]) {
        customerStats[customerId] = { bookings: 0, totalSpent: 0 };
      }
      customerStats[customerId].bookings++;
      customerStats[customerId].totalSpent += booking.price || 0;
    });
    analytics.customerStats = customerStats;

    return analytics;
  }

  // Export booking details to PDF
  async exportBookingDetailsToPDF(bookingId) {
    try {
      // This would typically get booking details from Firestore
      // For now, we'll create a simple PDF with booking info
      
      const exportData = {
        type: 'pdf',
        data: {
          bookingId,
          generatedAt: new Date().toISOString()
        }
      };

      const response = await fetch(`${this.apiBaseUrl}/export-reports`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(exportData)
      });

      if (!response.ok) {
        throw new Error('Failed to generate booking PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `booking-${bookingId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return { success: true };
    } catch (error) {
      console.error('Error exporting booking details:', error);
      return { success: false, error: error.message };
    }
  }
}

// Create singleton instance
const exportServiceInstance = new ExportService();

export default exportServiceInstance;
