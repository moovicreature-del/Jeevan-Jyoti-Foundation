import sharp from 'sharp';
import fs from 'fs';

const svgContent = `<svg width="800" height="800" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Text Path for arched header -->
    <path id="textPathTop" d="M 68,250 A 182,182 0 1,1 432,250" fill="none" />
    
    <!-- Gradient for Leaves -->
    <linearGradient id="leafGradLeft" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00B050" />
      <stop offset="100%" stop-color="#008035" />
    </linearGradient>
    <linearGradient id="leafGradRight" x1="100%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#00B050" />
      <stop offset="100%" stop-color="#008035" />
    </linearGradient>
  </defs>

  <!-- Transparent Background (Completely Clean, Zero Black Dots/Artifacts) -->

  <!-- 1. Outer Circle (Yellow Disc + Deep Indigo Border) -->
  <circle cx="250" cy="250" r="236" fill="#FFD500" stroke="#332488" stroke-width="8"/>

  <!-- 2. Arched Top Typography: JEEVAN JYOTI FOUNDATION -->
  <text fill="#332488" font-family="Arial Black, Impact, 'Trebuchet MS', sans-serif" font-weight="900" font-size="33" letter-spacing="4">
    <textPath href="#textPathTop" startOffset="50%" text-anchor="middle">JEEVAN JYOTI FOUNDATION</textPath>
  </text>

  <!-- 3. Concentric Orange Ring -->
  <circle cx="250" cy="250" r="162" fill="none" stroke="#FF8500" stroke-width="26"/>

  <!-- 4. Sunburst Rays (Clean Orange Polygons radiating behind meditator) -->
  <g fill="#FF8500">
    <!-- Center top vertical ray -->
    <polygon points="250,115 257,175 243,175"/>
    
    <!-- Angled rays -->
    <!-- +30 deg -->
    <polygon points="318,133 306,188 294,180"/>
    <!-- +60 deg -->
    <polygon points="368,182 344,222 336,210"/>
    <!-- +85 deg -->
    <polygon points="385,245 350,257 348,243"/>
    
    <!-- -30 deg -->
    <polygon points="182,133 206,180 194,188"/>
    <!-- -60 deg -->
    <polygon points="132,182 164,210 156,222"/>
    <!-- -85 deg -->
    <polygon points="115,245 152,243 150,257"/>
  </g>

  <!-- 5. Meditating Yogi Silhouette (Clean Slate Charcoal) -->
  <g fill="#434352">
    <!-- Head -->
    <circle cx="250" cy="180" r="24"/>
    
    <!-- Torso and Limbs in Lotus Pose -->
    <path d="M 250,204 
             C 241,204 231,213 218,226 
             C 207,237 195,255 186,270 
             C 178,284 182,290 196,290 
             C 208,290 218,283 228,274 
             L 228,296 
             C 228,310 200,320 178,325 
             C 158,330 152,342 174,348 
             C 205,356 235,356 250,356 
             C 265,356 295,356 326,348 
             C 348,342 342,330 322,325 
             C 300,320 272,310 272,296 
             L 272,274 
             C 282,283 292,290 304,290 
             C 318,290 322,284 314,270 
             C 305,255 293,237 282,226 
             C 269,213 259,204 250,204 Z"/>
  </g>

  <!-- 6. Vibrant Green Leaves at Bottom (Zero Speckles or Black Dots) -->
  <!-- Left Leaf -->
  <path d="M 250,476 
           C 185,410 70,390 28,342 
           C 76,324 165,338 218,382 
           C 236,398 247,432 250,476 Z" 
        fill="url(#leafGradLeft)"/>
        
  <!-- Right Leaf -->
  <path d="M 250,476 
           C 315,410 430,390 472,342 
           C 424,324 335,338 282,382 
           C 264,398 253,432 250,476 Z" 
        fill="url(#leafGradRight)"/>

  <!-- Leaf Central Stem Accent -->
  <path d="M 248,474 C 248,420 250,370 250,360 C 250,370 252,420 252,474 Z" fill="#007A33"/>
</svg>`;

async function generate() {
  fs.writeFileSync('public/assets/jeevan_jyoti_logo.svg', svgContent);
  fs.writeFileSync('public/favicon.svg', svgContent);

  const pngBuffer = await sharp(Buffer.from(svgContent))
    .resize(800, 800)
    .png({ quality: 100 })
    .toBuffer();

  fs.writeFileSync('public/assets/jeevan_jyoti_logo.png', pngBuffer);
  fs.writeFileSync('src/assets/jeevan_jyoti_logo.png', pngBuffer);
  fs.writeFileSync('public/assets/jeevan_jyoti_logo.jpg', await sharp(pngBuffer).jpeg({ quality: 95 }).toBuffer());

  console.log('Successfully generated clean logo without black dots!');
}

generate();
