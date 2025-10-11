import { Shop } from '../types';

export const getShopStatus = (shop: Shop): { isOpen: boolean; message: string } => {
  const now = new Date();
  const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  const currentTime = now.toTimeString().slice(0, 5); // HH:MM format

  const todayHours = shop.openingHours[currentDay];
  
  if (!todayHours) {
    return { isOpen: false, message: 'Hours not available' };
  }

  if (todayHours.isClosed) {
    return { isOpen: false, message: 'Closed today' };
  }

  const openTime = todayHours.open;
  const closeTime = todayHours.close;

  if (currentTime >= openTime && currentTime <= closeTime) {
    return { isOpen: true, message: `Open until ${closeTime}` };
  } else if (currentTime < openTime) {
    return { isOpen: false, message: `Opens at ${openTime}` };
  } else {
    return { isOpen: false, message: `Closed - Opens tomorrow` };
  }
};

export const formatWorkingHours = (openingHours: Shop['openingHours']): string => {
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const dayAbbr = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  const formattedHours = days.map((day, index) => {
    const hours = openingHours[day];
    if (!hours || hours.isClosed) {
      return `${dayAbbr[index]}: Closed`;
    }
    return `${dayAbbr[index]}: ${hours.open} - ${hours.close}`;
  });

  return formattedHours.join(', ');
};