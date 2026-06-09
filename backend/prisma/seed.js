const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 12);

  await prisma.user.upsert({
    where: { username: 'devid_admin' },
    update: {},
    create: {
      username: 'devid_admin',
      email: 'admin@devidjoshua.com',
      password: adminPassword,
      role: 'admin'
    }
  });

  await prisma.homeSetting.upsert({
    where: { id: 1 },
    update: {},
    create: {
      heroTitle: 'Devid Joshua',
      heroSubtitle: 'Full-Stack Software Engineer | System Architect | AI & Automation Enthusiast',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
      ctaText: 'View My Work',
      ctaUrl: '/portfolio',
      aboutText: 'Experienced Software Engineer with a demonstrated history of working in the financial services industry. Skilled in Backend Development, System Architecture, Payment Systems, and Product Development.'
    }
  });

  const skills = [
    { name: 'TypeScript', category: 'Software Engineering', proficiency: 95, icon: 'fab fa-js', displayOrder: 1 },
    { name: 'Node.js', category: 'Backend Development', proficiency: 90, icon: 'fab fa-node-js', displayOrder: 2 },
    { name: 'React', category: 'Software Engineering', proficiency: 88, icon: 'fab fa-react', displayOrder: 3 },
    { name: 'System Design', category: 'System Architecture', proficiency: 92, icon: 'fas fa-sitemap', displayOrder: 4 },
    { name: 'Payment Systems', category: 'Payment Systems', proficiency: 90, icon: 'fas fa-credit-card', displayOrder: 5 },
    { name: 'Product Development', category: 'Product Development', proficiency: 85, icon: 'fas fa-box', displayOrder: 6 },
    { name: 'Leadership', category: 'Leadership', proficiency: 82, icon: 'fas fa-users', displayOrder: 7 },
    { name: 'AI & Automation', category: 'AI & Automation', proficiency: 80, icon: 'fas fa-robot', displayOrder: 8 },
    { name: 'PostgreSQL', category: 'Backend Development', proficiency: 88, icon: 'fas fa-database', displayOrder: 9 },
    { name: 'Microservices', category: 'System Architecture', proficiency: 87, icon: 'fas fa-cubes', displayOrder: 10 },
    { name: 'Docker', category: 'Software Engineering', proficiency: 85, icon: 'fab fa-docker', displayOrder: 11 },
    { name: 'Go', category: 'Software Engineering', proficiency: 75, icon: 'fab fa-golang', displayOrder: 12 }
  ];

  for (const skill of skills) {
    await prisma.skill.upsert({
      where: { id: skills.indexOf(skill) + 1 },
      update: {},
      create: skill
    });
  }

  const categories = [
    { name: 'Payment Systems', slug: 'payment-systems', description: 'Payment processing and financial technology projects' },
    { name: 'System Architecture', slug: 'system-architecture', description: 'Architecture design and migration projects' },
    { name: 'AI & Automation', slug: 'ai-automation', description: 'Artificial intelligence and process automation' },
    { name: 'Product Development', slug: 'product-development', description: 'End-to-end product development projects' },
  ];

  for (const cat of categories) {
    await prisma.portfolioCategory.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat
    });
  }

  const catMap = {};
  for (const cat of await prisma.portfolioCategory.findMany()) {
    catMap[cat.name] = cat.id;
  }

  const stockImages = [
    { filename: 'payment.jpg', originalFilename: 'payment-system.jpg', filePath: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop', fileSize: 50000, mimeType: 'image/jpeg', altText: 'Payment system dashboard' },
    { filename: 'microservices.jpg', originalFilename: 'microservices-arch.jpg', filePath: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=600&h=400&fit=crop', fileSize: 50000, mimeType: 'image/jpeg', altText: 'Microservices architecture diagram' },
    { filename: 'ai-doc.jpg', originalFilename: 'ai-document.jpg', filePath: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop', fileSize: 50000, mimeType: 'image/jpeg', altText: 'AI document processing' },
    { filename: 'analytics.jpg', originalFilename: 'analytics-dashboard.jpg', filePath: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop', fileSize: 50000, mimeType: 'image/jpeg', altText: 'Analytics dashboard' },
    { filename: 'profile.jpg', originalFilename: 'profile.jpg', filePath: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face', fileSize: 40000, mimeType: 'image/jpeg', altText: 'Profile photo' },
  ];

  const mediaIds = [];
  for (const img of stockImages) {
    const media = await prisma.mediaFile.create({ data: img });
    mediaIds.push(media.id);
  }

  const portfolioItems = [
    {
      title: 'Payment Gateway Integration Platform',
      shortDescription: 'Built a scalable payment gateway integration platform supporting multiple payment providers.',
      fullDescription: 'Built a scalable payment gateway integration platform supporting multiple payment providers with features like fraud detection, recurring billing, and real-time transaction monitoring. The platform handled millions of transactions daily with 99.99% uptime.',
      featuredImageId: mediaIds[0],
      categoryId: catMap['Payment Systems'],
      isFeatured: true,
      displayOrder: 1,
      technologies: ['Node.js', 'TypeScript', 'PostgreSQL', 'Redis', 'Kafka']
    },
    {
      title: 'Microservices Architecture Migration',
      shortDescription: 'Led migration from monolithic architecture to microservices, improving deployment frequency by 300%.',
      fullDescription: 'Led the migration from monolithic architecture to microservices, improving deployment frequency by 300% and system reliability. Designed service boundaries, implemented event-driven communication, and established monitoring infrastructure.',
      featuredImageId: mediaIds[1],
      categoryId: catMap['System Architecture'],
      isFeatured: true,
      displayOrder: 2,
      technologies: ['Go', 'Docker', 'Kubernetes', 'gRPC', 'Prometheus']
    },
    {
      title: 'AI-Powered Document Processing',
      shortDescription: 'Developed AI-powered document processing using NLP and computer vision.',
      fullDescription: 'Developed an AI-powered document processing system using NLP and computer vision to automate data extraction from financial documents. Reduced manual processing time by 85% and achieved 97% accuracy.',
      featuredImageId: mediaIds[2],
      categoryId: catMap['AI & Automation'],
      isFeatured: true,
      displayOrder: 3,
      technologies: ['Python', 'TensorFlow', 'OpenCV', 'FastAPI', 'MongoDB']
    },
    {
      title: 'Real-time Analytics Dashboard',
      shortDescription: 'Created a real-time analytics dashboard with interactive charts and custom reports.',
      fullDescription: 'Created a real-time analytics dashboard for business intelligence with interactive charts, custom report builder, and data export capabilities. Used by 500+ internal users daily.',
      featuredImageId: mediaIds[3],
      categoryId: catMap['Product Development'],
      isFeatured: false,
      displayOrder: 4,
      technologies: ['React', 'D3.js', 'WebSocket', 'Express.js', 'ClickHouse']
    }
  ];

  for (const item of portfolioItems) {
    const { technologies, ...data } = item;
    await prisma.portfolio.create({
      data: {
        ...data,
        isPublished: true,
        technologies: { create: technologies.map(t => ({ technologyName: t })) }
      }
    });
  }

  await prisma.siteSetting.upsert({
    where: { id: 1 },
    update: {},
    create: {
      siteName: 'Devid Joshua',
      primaryColor: '#FF8473',
      secondaryColor: '#7152E1',
      darkModeEnabled: false,
      instagramEnabled: true,
      instagramPostLimit: 6,
      layoutMode: 'single',
      showSkillProficiency: true,
      enablePages: true,
      email: 'hello@devidjoshua.com',
      linkedinUrl: 'https://www.linkedin.com/in/devid-joshua/',
      githubUrl: 'https://github.com/devidjoshua'
    }
  });

  const socialLinks = [
    { platform: 'LinkedIn', url: 'https://www.linkedin.com/in/devid-joshua/', icon: 'fab fa-linkedin-in', isActive: true },
    { platform: 'GitHub', url: 'https://github.com/devidjoshua', icon: 'fab fa-github', isActive: true },
    { platform: 'Email', url: 'mailto:hello@devidjoshua.com', icon: 'fas fa-envelope', isActive: true },
    { platform: 'WhatsApp', url: 'https://wa.me/6281234567890', icon: 'fab fa-whatsapp', isActive: true }
  ];

  for (const link of socialLinks) {
    await prisma.socialLink.create({ data: link });
  }

  const homepageTemplates = [
    { name: 'Professional Resume', code: 'professional', description: 'Clean professional layout with focus on experience and skills', isActive: true },
    { name: 'Modern Portfolio', code: 'modern', description: 'Bold modern design with full-width sections and animations' },
    { name: 'Minimalist', code: 'minimalist', description: 'Simple, clean, and minimal design focusing on content' },
    { name: 'Creative Designer', code: 'creative', description: 'Creative layout with unique visual elements and typography' },
    { name: 'Developer', code: 'developer', description: 'Developer-focused design with code snippets and tech badges' },
  ];

  for (const tmpl of homepageTemplates) {
    await prisma.homepageTemplate.upsert({
      where: { code: tmpl.code },
      update: {},
      create: tmpl
    });
  }

  const pageTemplates = [
    { name: 'Single Column', code: 'single-column', description: 'Simple single column layout for text-heavy pages' },
    { name: 'Two Column', code: 'two-column', description: 'Two column layout with sidebar' },
    { name: 'Hero + Content', code: 'hero-content', description: 'Hero section followed by content area' },
    { name: 'Portfolio Layout', code: 'portfolio-layout', description: 'Grid-based portfolio page layout' },
    { name: 'Gallery Layout', code: 'gallery', description: 'Image gallery with lightbox support' },
    { name: 'Timeline Layout', code: 'timeline', description: 'Vertical timeline for experience or education' },
  ];

  for (const tmpl of pageTemplates) {
    await prisma.pageTemplate.upsert({
      where: { code: tmpl.code },
      update: {},
      create: tmpl
    });
  }

  const aboutTemplate = await prisma.pageTemplate.findUnique({ where: { code: 'single-column' } });
  const existingContent = await prisma.pageContent.findFirst({
    where: { page: { slug: 'about' } }
  });
  const aboutPage = await prisma.page.upsert({
    where: { slug: 'about' },
    update: {},
    create: {
      title: 'About Me',
      slug: 'about',
      templateId: aboutTemplate.id,
      seoTitle: 'About Devid Joshua - Full-Stack Software Engineer',
      seoDescription: 'Learn more about Devid Joshua, a full-stack software engineer with expertise in backend development, system architecture, and AI.',
      isPublished: true
    }
  });
  if (!existingContent) {
    await prisma.pageContent.create({
      data: {
        pageId: aboutPage.id,
        contentJson: JSON.stringify({
          sections: [
            { type: 'text', title: 'Background', content: 'Experienced Software Engineer with a demonstrated history of working in the financial services industry.' },
            { type: 'text', title: 'Expertise', content: 'Skilled in Backend Development, System Architecture, Payment Systems, and Product Development.' }
          ]
        })
      }
    });
  }

  console.log('Seed data created successfully');
  console.log('Admin credentials - username: devid_admin, password: admin123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
