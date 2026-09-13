/**
 * User Controller
 * Provides user analytics, travel stats, and dashboard data
 */

export const getUserDashboardStats = async (req, res, next) => {
  try {
    const user = req.user;
    const stats = {
      welcomeName: user?.name || 'Rakesh',
      totalTrips: 12,
      countriesVisited: 8,
      upcomingTrips: 3,
      savedDestinations: 24,
      travelActivity: [
        { month: 'Jan', trips: 1, spend: 1200 },
        { month: 'Feb', trips: 0, spend: 0 },
        { month: 'Mar', trips: 2, spend: 2800 },
        { month: 'Apr', trips: 1, spend: 1800 },
        { month: 'May', trips: 3, spend: 3400 },
        { month: 'Jun', trips: 2, spend: 2200 },
        { month: 'Jul', trips: 1, spend: 1500 },
        { month: 'Aug', trips: 2, spend: 2900 },
      ],
      spendingByCategory: [
        { name: 'Hotels & Stays', value: 4200, color: '#7C3AED' },
        { name: 'Flights & Rail', value: 3800, color: '#2563EB' },
        { name: 'Food & Dining', value: 1900, color: '#38BDF8' },
        { name: 'Activities & Tours', value: 1600, color: '#10B981' },
        { name: 'Local Transport', value: 900, color: '#F59E0B' },
      ],
      countriesList: [
        { country: 'Indonesia', code: 'ID', trips: 3, flag: '🇮🇩' },
        { country: 'Japan', code: 'JP', trips: 2, flag: '🇯🇵' },
        { country: 'Greece', code: 'GR', trips: 2, flag: '🇬🇷' },
        { country: 'Switzerland', code: 'CH', trips: 2, flag: '🇨🇭' },
        { country: 'Maldives', code: 'MV', trips: 1, flag: '🇲🇻' },
        { country: 'United States', code: 'US', trips: 1, flag: '🇺🇸' },
        { country: 'Thailand', code: 'TH', trips: 1, flag: '🇹🇭' },
        { country: 'Spain', code: 'ES', trips: 1, flag: '🇪🇸' },
      ],
    };

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};
