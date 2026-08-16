import fs from 'fs';
import path from 'path';

console.log('--------------------------------------------------');
console.log('   STUDENT STARTUP TECHNICAL SEO AUDIT GATE      ');
console.log('--------------------------------------------------\n');

let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    passCount++;
  } else {
    console.log(`  ✕ FAIL: ${message}`);
    failCount++;
  }
}

// 1. Check robots.ts
const robotsPath = path.resolve('src/app/robots.ts');
const robotsContent = fs.readFileSync(robotsPath, 'utf8');
assert(robotsContent.includes("'/workspace/'"), "robots.ts disallows /workspace/ route");

// 2. Check sitemap.ts routes
const sitemapPath = path.resolve('src/app/sitemap.ts');
const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
assert(sitemapContent.includes('/services'), "sitemap.ts includes /services");
assert(sitemapContent.includes('/work'), "sitemap.ts includes /work");
assert(sitemapContent.includes('/articles'), "sitemap.ts includes /articles");
assert(!sitemapContent.includes('/workspace'), "sitemap.ts excludes protected /workspace route");

// 3. Check workspace layout noindex directive
const workspaceLayoutPath = path.resolve('src/app/workspace/layout.tsx');
const workspaceLayoutContent = fs.readFileSync(workspaceLayoutPath, 'utf8');
assert(workspaceLayoutContent.includes('index: false') && workspaceLayoutContent.includes('follow: false'), "workspace/layout.tsx enforces strict noindex, nofollow metadata");

// 4. Check 7 services in data
const servicesPath = path.resolve('src/lib/data/services.ts');
const servicesContent = fs.readFileSync(servicesPath, 'utf8');
assert(servicesContent.includes('web-development'), "Services data includes web-development");
assert(servicesContent.includes('promotions'), "Services data includes promotions");
assert(servicesContent.includes('seo'), "Services data includes seo");
assert(servicesContent.includes('social-media'), "Services data includes social-media");
assert(servicesContent.includes('poster-design'), "Services data includes poster-design");
assert(servicesContent.includes('thumbnail-design'), "Services data includes thumbnail-design");
assert(servicesContent.includes('local-business-growth'), "Services data includes local-business-growth");

console.log('\n--------------------------------------------------');
console.log(`Audit Summary: ${passCount} Passed, ${failCount} Failed.`);
console.log('--------------------------------------------------\n');

if (failCount > 0) {
  process.exit(1);
}
