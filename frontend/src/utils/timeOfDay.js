export function getTimeOfDay() {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) {
    return {
      period: 'morning',
      greeting: 'Good Morning',
      icon: '🌅',
      badge: 'Solar Morning Shift',
      accentGlow: 'from-amber-100/40 via-stone-100 to-stone-50',
      tagline: 'Morning pipeline dispatch & scheduled inquiries'
    };
  } else if (hour >= 12 && hour < 17) {
    return {
      period: 'afternoon',
      greeting: 'Good Afternoon',
      icon: '☀️',
      badge: 'Peak Daylight Operations',
      accentGlow: 'from-emerald-100/30 via-stone-100 to-stone-50',
      tagline: 'Active site visits, negotiation & inventory lock-ins'
    };
  } else if (hour >= 17 && hour < 21) {
    return {
      period: 'evening',
      greeting: 'Good Evening',
      icon: '🌇',
      badge: 'Golden Hour Floor',
      accentGlow: 'from-orange-100/40 via-stone-100 to-stone-50',
      tagline: 'Daily close summaries, pending follow-ups & ledger audits'
    };
  } else {
    return {
      period: 'night',
      greeting: 'Good Night',
      icon: '🌙',
      badge: 'Twilight Ledger Active',
      accentGlow: 'from-emerald-950/20 via-stone-900 to-[#121513]',
      tagline: 'Off-hours inventory protection & automated lead queues'
    };
  }
}