export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

export interface HomeSetting {
  id: number;
  heroTitle: string | null;
  heroSubtitle: string | null;
  profileImage: string | null;
  backgroundImage: string | null;
  ctaText: string | null;
  ctaUrl: string | null;
  aboutText: string | null;
}

export interface Skill {
  id: number;
  name: string;
  category: string | null;
  proficiency: number;
  icon: string | null;
  displayOrder: number;
  isActive: boolean;
}

export interface PortfolioCategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  _count?: { portfolios: number };
}

export interface PortfolioTechnology {
  id: number;
  portfolioId: number;
  technologyName: string;
}

export interface PortfolioGallery {
  id: number;
  portfolioId: number;
  mediaFileId: number;
  displayOrder: number;
  mediaFile?: MediaFile;
}

export interface Portfolio {
  id: number;
  title: string;
  shortDescription: string | null;
  fullDescription: string | null;
  categoryId: number | null;
  featuredImageId: number | null;
  imageUrl: string | null;
  projectUrl: string | null;
  githubUrl: string | null;
  startDate: string | null;
  endDate: string | null;
  isFeatured: boolean;
  isPublished: boolean;
  displayOrder: number;
  category?: PortfolioCategory | null;
  technologies?: PortfolioTechnology[];
  featuredImage?: MediaFile | null;
  gallery?: PortfolioGallery[];
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  createdAt: string;
}

export interface SocialLink {
  id: number;
  platform: string;
  url: string;
  icon: string | null;
  isActive: boolean;
}

export interface SiteSetting {
  id: number;
  siteName: string | null;
  primaryColor: string | null;
  secondaryColor: string | null;
  darkModeEnabled: boolean;
  instagramEnabled: boolean;
  instagramPostLimit: number;
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
  linkedinUrl: string | null;
  githubUrl: string | null;
  layoutMode: string;
  showSkillProficiency: boolean;
  enablePages: boolean;
  resumeLayout: string;
  showEducation: boolean;
  showVolunteer: boolean;
  showPublication: boolean;
  showCourse: boolean;
  showCertification: boolean;
}

export interface DashboardData {
  portfolioCount: number;
  messageCount: number;
  skillCount: number;
  recentMessages: ContactMessage[];
  activeTemplate?: string;
}

export interface HomepageTemplate {
  id: number;
  name: string;
  code: string;
  description: string | null;
  thumbnailImage: string | null;
  previewImage: string | null;
  isActive: boolean;
  configurations?: HomepageConfiguration[];
}

export interface HomepageConfiguration {
  id: number;
  homepageTemplateId: number;
  configurationJson: string;
}

export interface PageTemplate {
  id: number;
  name: string;
  code: string;
  description: string | null;
  previewImage: string | null;
}

export interface PageContent {
  id: number;
  pageId: number;
  contentJson: string;
}

export interface Page {
  id: number;
  title: string;
  slug: string;
  templateId: number;
  seoTitle: string | null;
  seoDescription: string | null;
  isPublished: boolean;
  template?: PageTemplate;
  contents?: PageContent[];
}

export interface Education {
  id: number;
  institution: string;
  degree: string;
  field: string | null;
  startDate: string | null;
  endDate: string | null;
  gpa: string | null;
  description: string | null;
  isActive: boolean;
  displayOrder: number;
}

export interface Volunteer {
  id: number;
  organization: string;
  role: string;
  startDate: string | null;
  endDate: string | null;
  description: string | null;
  isActive: boolean;
  displayOrder: number;
}

export interface Publication {
  id: number;
  title: string;
  publisher: string | null;
  publishedDate: string | null;
  url: string | null;
  description: string | null;
  isActive: boolean;
  displayOrder: number;
}

export interface Course {
  id: number;
  name: string;
  provider: string | null;
  completedDate: string | null;
  url: string | null;
  description: string | null;
  isActive: boolean;
  displayOrder: number;
}

export interface Certification {
  id: number;
  name: string;
  organization: string | null;
  issuedDate: string | null;
  expirationDate: string | null;
  credentialUrl: string | null;
  credentialId: string | null;
  description: string | null;
  isActive: boolean;
  displayOrder: number;
}

export interface CVData {
  name: string;
  role: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  website: string;
  photo: string;
  sections: CVSection[];
}

export interface CVSection {
  type: string;
  title: string;
  content?: string;
  items?: any[];
}

export interface MediaFile {
  id: number;
  filename: string;
  originalFilename: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  altText: string | null;
  uploadedById: number | null;
  createdAt: string;
  uploader?: { username: string };
}
