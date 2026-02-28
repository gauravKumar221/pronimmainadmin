/**
 * API client for backend (pronim-backend)
 * Super Admin authentication and future API calls
 */

const getApiUrl = () => {
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
  }
  return process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
};

const COOKIE_NAME = 'super_admin_token';

/**
 * Get Super Admin JWT from cookie (client-side)
 */
export function getSuperAdminToken(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )' + COOKIE_NAME + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

/**
 * Super Admin login - calls backend API
 */
export async function superAdminLogin(identifier: string, password: string) {
  const res = await fetch(`${getApiUrl()}/super-admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    return { success: false, error: data.message || 'Login failed' };
  }

  if (data.success && data.data?.token) {
    return {
      success: true,
      token: data.data.token,
      username: data.data.username,
      email: data.data.email,
    };
  }

  return { success: false, error: 'Invalid response from server' };
}

/**
 * Fetch Super Admin dashboard stats
 */
export async function fetchSuperAdminStats(): Promise<{
  newsletter: { total: number; subscribed: number };
  contactUs: { total: number; read: number; pending: number };
  enquiry: { total: number };
  blog: { total: number };
  faq: { total: number };
}> {
  const res = await fetch(`${getApiUrl()}/super-admin/stats`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch stats');
  return data.data.stats;
}

/**
 * Verify Super Admin token (for optional token validation)
 */
export async function verifySuperAdminToken(token: string): Promise<boolean> {
  const res = await fetch(`${getApiUrl()}/super-admin/verify`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.ok;
}

/* ========== Blog API (Super Admin) ========== */

export interface BlogPost {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  content?: string | null;
  createdAt: string;
  updatedAt?: string;
}

function getAuthHeaders(): Record<string, string> {
  const token = getSuperAdminToken();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

export async function fetchBlogs(): Promise<BlogPost[]> {
  const res = await fetch(`${getApiUrl()}/public/blogs?limit=100`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch blogs');
  return data.data?.blogs || [];
}

export async function fetchBlog(id: string): Promise<BlogPost | null> {
  const res = await fetch(`${getApiUrl()}/public/blogs/${id}`);
  const data = await res.json();
  if (!res.ok) return null;
  return data.data || null;
}

export async function createBlog(payload: { title: string; description: string; imageUrl?: string; content?: string }) {
  const res = await fetch(`${getApiUrl()}/super-admin/blogs`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to create blog');
  return data.data;
}

export async function updateBlog(id: string, payload: Partial<{ title: string; description: string; imageUrl?: string; content?: string }>) {
  const res = await fetch(`${getApiUrl()}/super-admin/blogs/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update blog');
  return data.data;
}

export async function deleteBlog(id: string) {
  const res = await fetch(`${getApiUrl()}/super-admin/blogs/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to delete blog');
}

/**
 * Upload blog image to S3 via FormData
 * @param file - File from input
 * @returns S3 URL of uploaded image
 */
/* ========== Newsletter API (Super Admin) ========== */

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribed: boolean;
  createdAt: string;
  updatedAt?: string;
}

export async function fetchNewsletters(options?: { page?: number; limit?: number; subscribed?: boolean }): Promise<{
  newsletters: NewsletterSubscriber[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}> {
  const params = new URLSearchParams();
  if (options?.page) params.set('page', String(options.page));
  if (options?.limit) params.set('limit', String(options.limit));
  if (options?.subscribed !== undefined) params.set('subscribed', String(options.subscribed));

  const res = await fetch(`${getApiUrl()}/super-admin/newsletters?${params}`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch newsletters');
  return data.data;
}

export async function deleteNewsletter(id: string): Promise<void> {
  const res = await fetch(`${getApiUrl()}/super-admin/newsletters/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to delete');
}

export async function addNewsletterSubscriber(email: string): Promise<NewsletterSubscriber> {
  const res = await fetch(`${getApiUrl()}/public/newsletter/subscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to add subscriber');
  return data.data.newsletter;
}

export async function toggleNewsletterSubscription(id: string, subscribed: boolean): Promise<NewsletterSubscriber> {
  const res = await fetch(`${getApiUrl()}/super-admin/newsletters/${id}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ subscribed }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update');
  return data.data.newsletter;
}

/* ========== Send Messages / Contact Us API (Super Admin) ========== */

export interface SendMessage {
  id: string;
  name: string;
  lastName: string;
  email: string;
  phone: string | null;
  message: string;
  gdprAgreed: boolean;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export async function fetchSendMessages(options?: { page?: number; limit?: number }): Promise<{
  messages: SendMessage[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}> {
  const params = new URLSearchParams();
  if (options?.page) params.set('page', String(options.page));
  if (options?.limit) params.set('limit', String(options.limit));

  const res = await fetch(`${getApiUrl()}/super-admin/send-messages?${params}`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch messages');
  return data.data;
}

export async function fetchSendMessage(id: string): Promise<SendMessage | null> {
  const res = await fetch(`${getApiUrl()}/super-admin/send-messages/${id}`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) return null;
  return data.data?.message || null;
}

export async function markSendMessageAsRead(id: string, isRead: boolean): Promise<SendMessage> {
  const res = await fetch(`${getApiUrl()}/super-admin/send-messages/${id}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ isRead }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update message');
  return data.data.message;
}

export async function deleteSendMessage(id: string): Promise<void> {
  const res = await fetch(`${getApiUrl()}/super-admin/send-messages/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to delete message');
}

/* ========== FAQ API (Super Admin) ========== */

export interface Faq {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export async function fetchFaqs(options?: { page?: number; limit?: number; category?: string }): Promise<{
  faqs: Faq[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}> {
  const params = new URLSearchParams();
  if (options?.page) params.set('page', String(options.page));
  if (options?.limit) params.set('limit', String(options.limit));
  if (options?.category) params.set('category', options.category);

  const res = await fetch(`${getApiUrl()}/super-admin/faqs?${params}`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch FAQs');
  return data.data;
}

export async function createFaq(payload: { question: string; answer: string; category: string; order?: number }): Promise<Faq> {
  const res = await fetch(`${getApiUrl()}/super-admin/faqs`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to create FAQ');
  return data.data.faq;
}

export async function updateFaq(id: string, payload: Partial<{ question: string; answer: string; category: string; order: number }>): Promise<Faq> {
  const res = await fetch(`${getApiUrl()}/super-admin/faqs/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update FAQ');
  return data.data.faq;
}

export async function deleteFaq(id: string): Promise<void> {
  const res = await fetch(`${getApiUrl()}/super-admin/faqs/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to delete FAQ');
}

/* ========== Privacy Policy API (Super Admin) ========== */

export interface PrivacyPolicy {
  id?: string;
  title: string;
  content: string;
  updatedAt: string | null;
}

export async function fetchPrivacyPolicy(): Promise<PrivacyPolicy> {
  const res = await fetch(`${getApiUrl()}/super-admin/privacy-policy`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch privacy policy');
  return data.data.privacyPolicy;
}

export async function updatePrivacyPolicy(payload: { title: string; content: string }): Promise<PrivacyPolicy> {
  const res = await fetch(`${getApiUrl()}/super-admin/privacy-policy`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update privacy policy');
  return data.data.privacyPolicy;
}

/* ========== Terms & Conditions API (Super Admin) ========== */

export interface TermsAndConditions {
  id?: string;
  title: string;
  content: string;
  updatedAt: string | null;
}

export async function fetchTermsAndConditions(): Promise<TermsAndConditions> {
  const res = await fetch(`${getApiUrl()}/super-admin/terms-and-conditions`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch terms');
  return data.data.termsAndConditions;
}

export async function updateTermsAndConditions(payload: { title: string; content: string }): Promise<TermsAndConditions> {
  const res = await fetch(`${getApiUrl()}/super-admin/terms-and-conditions`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update terms');
  return data.data.termsAndConditions;
}

/* ========== Enquiry / Request Form API (Super Admin) ========== */

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  consentAgreed: boolean;
  createdAt: string;
  updatedAt: string;
}

export async function fetchEnquiries(options?: { page?: number; limit?: number }): Promise<{
  enquiries: Enquiry[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}> {
  const params = new URLSearchParams();
  if (options?.page) params.set('page', String(options.page));
  if (options?.limit) params.set('limit', String(options.limit));

  const res = await fetch(`${getApiUrl()}/super-admin/request-forms?${params}`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch enquiries');
  return data.data;
}

export async function deleteEnquiry(id: string): Promise<void> {
  const res = await fetch(`${getApiUrl()}/super-admin/request-forms/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to delete enquiry');
}

export async function uploadBlogImage(file: File): Promise<string> {
  const token = getSuperAdminToken();
  if (!token) throw new Error('Not authenticated');

  const formData = new FormData();
  formData.append('image', file);

  const res = await fetch(`${getApiUrl()}/super-admin/blogs/upload-image`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to upload image');
  if (!data.data?.url) throw new Error('No URL returned');
  return data.data.url;
}
