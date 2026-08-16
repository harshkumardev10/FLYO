import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAqyIRwu2f19Jf6T_dWiZVAfdEdRoHHdvY",
  authDomain: "flyo-1863c.firebaseapp.com",
  projectId: "flyo-1863c",
  storageBucket: "flyo-1863c.firebasestorage.app",
  messagingSenderId: "42047084161",
  appId: "1:42047084161:web:11b1706c4a0265869e5f80",
  measurementId: "G-7DD6XREWGY"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const ARTICLES = [
  {
    slug: '5-things-every-local-business-should-have-online',
    title: '5 Things Every Local Business Should Have Online',
    summary: 'A simple, practical checklist for local business owners looking to establish a reliable digital footprint.',
    category: 'Local Business',
    publishedAt: '2026-02-10',
    authorName: 'Alex Rivers',
    authorRole: 'Founder & Tech Lead',
    readingTimeMinutes: 5,
    heroImage: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?q=80&w=1200&auto=format&fit=crop',
    contentHtml: `
      <h2>1. An Updated Google Business Profile</h2>
      <p>When nearby customers search for services, your Google Business Profile is often the first thing they see. Keep your address, operating hours, phone number, and primary services 100% up to date.</p>
      
      <h2>2. A Mobile-Friendly Website</h2>
      <p>Over 65% of local searches happen on mobile phones. If your website is slow, hard to read, or relies on multi-megabyte PDF menus, prospective customers will quickly hit the back button.</p>

      <h2>3. Clear Contact & Direction Signals</h2>
      <p>Make sure your phone number, email, and location map are clearly visible at the top of every page. A single click should let a customer call or navigate directly to your shop.</p>

      <h2>4. Authentic Local Photos</h2>
      <p>Generic stock images of corporate skyscrapers don't build local trust. Show authentic photos of your store, your team, and your actual work in the community.</p>

      <h2>5. A Simple System for Customer Feedback</h2>
      <p>Encourage happy customers to leave authentic reviews on Google. Real feedback from local neighbors builds lasting credibility faster than any advertisement.</p>
    `,
    relatedServiceSlug: 'local-business-growth',
    status: 'approved'
  },
  {
    slug: 'why-your-business-needs-a-professional-website',
    title: 'Why Your Business Needs a Professional Website',
    summary: 'Why relying solely on social media pages is a risk, and how a fast website builds instant trust with customers.',
    category: 'Websites',
    publishedAt: '2026-02-05',
    authorName: 'Sam Vance',
    authorRole: 'Lead Web Designer',
    readingTimeMinutes: 4,
    heroImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop',
    contentHtml: `
      <h2>Social Platforms Change—Your Website Belongs to You</h2>
      <p>Social algorithms constantly shift, hiding posts behind paywalls or changing layout rules. Your website is your primary digital storefront where you control 100% of the customer experience.</p>
      
      <h2>Instant Credibility & Professionalism</h2>
      <p>When customers decide between competing local services, having a clean, fast website proves you take your business seriously.</p>
    `,
    relatedServiceSlug: 'web-development',
    status: 'approved'
  },
  {
    slug: 'how-google-search-can-help-local-businesses',
    title: 'How Google Search Can Help Local Businesses',
    summary: 'Understanding local search intent and how organic visibility brings ready-to-buy customers to your doorstep.',
    category: 'SEO',
    publishedAt: '2026-01-28',
    authorName: 'Alex Rivers',
    authorRole: 'Founder & Tech Lead',
    readingTimeMinutes: 6,
    heroImage: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=1200&auto=format&fit=crop',
    contentHtml: `
      <h2>Meeting Customers at the Exact Moment of Intent</h2>
      <p>Unlike broadcast ads, search engine traffic consists of users actively seeking solutions in your area right now.</p>
    `,
    relatedServiceSlug: 'seo',
    status: 'approved'
  }
];

const ALLOWED_EMAILS = [
  'harshkumarrr143@gmail.com',
  'chirag2006chak@gmail.com',
  'harshkumar.dev10@gmail.com'
];

async function seed() {
  console.log('🌱 Starting Firestore Seeding...');

  // 1. Seed Authorized Emails Document & Collection
  console.log('📌 Seeding Authorized Partner Emails...');
  await setDoc(doc(db, 'settings', 'allowed_emails'), { emails: ALLOWED_EMAILS });
  
  for (const email of ALLOWED_EMAILS) {
    const clean = email.toLowerCase().trim();
    await setDoc(doc(db, 'allowed_emails', clean), {
      email: clean,
      isOwner: clean === 'harshkumarrr143@gmail.com',
      addedAt: new Date().toISOString()
    });
    console.log(`  ✅ Added allowed email: ${clean}`);
  }

  // 2. Seed Initial Articles
  console.log('📌 Seeding Articles into Firestore...');
  for (const article of ARTICLES) {
    await setDoc(doc(db, 'articles', article.slug), article);
    console.log(`  ✅ Uploaded article: ${article.slug}`);
  }

  console.log('🎉 Firestore Seeding Successfully Completed!');
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
