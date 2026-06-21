export interface Destination {
  id: number;
  name: string;
  slug: string;
  categoryId: number;
  description?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  ticketPrice: number;
  openingHours?: string;
  coverImage?: string;
  status: string;
  viewCount: number;
  averageRating: number;
  totalReviews: number;
  createdAt: string;
  updatedAt: string;
  category?: DestinationCategory;
  destinationFacilities?: DestinationFacilityRelation[];
  galleries?: Gallery[];
  reviews?: Review[];
}

export interface DestinationCategory {
  id: number;
  name: string;
  slug: string;
  icon?: string;
}

export interface DestinationFacilityRelation {
  id: number;
  destinationId: number;
  facilityId: number;
  facility?: Facility;
}

export interface Facility {
  id: number;
  name: string;
  icon?: string;
  description?: string;
}

export interface Gallery {
  id: number;
  destinationId?: number;
  title?: string;
  mediaUrl: string;
  mediaType: string;
  thumbnailUrl?: string;
  sortOrder: number;
  isFeatured: boolean;
  createdAt: string;
}

export interface Event {
  id: number;
  title: string;
  slug: string;
  description?: string;
  eventDate: string;
  eventTime?: string;
  endDate?: string;
  location?: string;
  bannerUrl?: string;
  status: string;
  createdAt: string;
}

export interface Booking {
  id: number;
  bookingNumber: string;
  userId: number;
  destinationId: number;
  visitDate: string;
  numberOfVisitors: number;
  totalPrice: number;
  status: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  user?: { fullName: string; email: string };
  destination?: { name: string; coverImage?: string };
}

export interface Review {
  id: number;
  userId: number;
  destinationId: number;
  rating: number;
  comment?: string;
  isApproved: boolean;
  createdAt: string;
  user?: { fullName: string; avatarUrl?: string };
  destination?: { name: string };
}

export interface Article {
  id: number;
  title: string;
  slug: string;
  content?: string;
  thumbnailUrl?: string;
  authorId: number;
  isPublished: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  author?: { fullName: string };
}

export interface Contact {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface DashboardStats {
  totalDestinations: number;
  totalVisitors: number;
  totalBookings: number;
  totalReviews: number;
  totalEvents: number;
  totalArticles: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
