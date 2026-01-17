import { useState, useMemo, useEffect, forwardRef, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Filter, ChevronRight, Upload, FileText, Download } from 'lucide-react'
import { saveFile, getFile } from '../utils/db'

// 3-Tier Hierarchy Definition
const CATEGORY_HIERARCHY = {
  'Fashion': {
    'Women': ['Dresses', 'Tops', 'Jeans', 'Hoodies', 'Sweatshirts', 'Pants', 'Activewear', 'Shoes', 'Socks', 'Accessories'],
    'Men': ['T-Shirts', 'Shirts', 'Hoodies', 'Sweatshirts', 'Jeans', 'Pants', 'Jackets', 'Shoes', 'Socks', 'Accessories'],
    'Girls': ['Dresses', 'Tops', 'Hoodies', 'Sweatshirts', 'Leggings', 'Pants', 'School Uniform', 'Shoes', 'Socks'],
    'Boys': ['T-Shirts', 'Hoodies', 'Sweatshirts', 'Jeans', 'Pants', 'Shorts', 'Shoes', 'Socks'],
    'Baby': ['Bodysuits', 'Rompers', 'Sets', 'Nursery']
  },
  'Home & Bed': {
    'Bedding': ['Pillows', 'Duvet Covers', 'Throws', 'Sheets'],
    'Decor': ['Wall Art', 'Neon Signs', 'Clocks'],
    'Comfort': ['Cushions', 'Bean Bags'],
    'Floor': ['Rugs', 'Floor Mats']
  },
  'Tech Accessories': {
    'Phone': ['iPhone Cases', 'Samsung Cases', 'Pixel Cases', 'Other Android Cases', 'Screen Protectors'],
    'Laptop': ['Skins', 'Sleeves', 'Hard Cases', 'Stickers'],
    'Desk': ['Mousepads', 'Desk Mats', 'Cable Management'],
    'Gaming': ['Console Skins', 'Controller Grips', 'Controller Skins']
  },
  'Bags & Lifestyle': {
    'Carry': ['Backpacks', 'Messenger Bags', 'Slings'],
    'Travel': ['Duffle Bags', 'Toiletry Bags', 'Luggage Tags'],
    'Daily': ['Tote Bags', 'Pouches', 'Wallets'],
    'Accessories': ['Keychains', 'Pins', 'Patches', 'Bottles']
  },
  'Smart & Large Products': {
    'Home': ['Smart Projector', 'Smart Lighting', 'Smart Fridge'],
    'Office': ['Ergo Chairs', 'Standing Desks'],
    'Entertainment': ['Speakers', 'Streaming Decks']
  },
  'Electronics & Photo': {
    'Cameras': ['Action Cams', 'Drones', 'Webcams'],
    'Audio': ['Headphones', 'Earbuds', 'Microphones'],
    'Wearables': ['Smart Watches', 'Fitness Trackers']
  },
  'DIY & Tools': {
    'Power Tools': ['Electric Screwdrivers', 'Rotary Tools'],
    'Hand Tools': ['Precision Sets', 'Soldering Kits'],
    'Safety': ['Goggles', 'Anti-Static Mats']
  },
  'PC & Video Games': {
    'Components': ['SSDs', 'RAM Kits', 'Fans'],
    'Peripherals': ['Keyboards', 'Mice', 'Headsets'],
    'Streaming': ['Capture Cards', 'Green Screens']
  },
  'Stationery & Office': {
    'Paper': ['Notebooks', 'Planners', 'Sketchbooks'],
    'Writing': ['Pens', 'Markers', 'Pencils'],
    'Organization': ['File Organizers', 'Desk Trays']
  },
  'Health & Personal Care': {
    'Wellness': ['Blue Light Glasses', 'Posture Correctors'],
    'Fitness': ['Resistance Bands', 'Smart Scales'],
    'Air': ['Purifiers', 'Humidifiers']
  },
  'Private: Gelato Vault': {
    'Master Designs': ['Textures', 'Logos', 'Documentation']
  }
}

// Mock Data with Tier 1/2/3 Structure
const MERCH_ITEMS = [
  // Private: Gelato Vault
  {
    id: 9001,
    name: 'Master Nebula Print',
    category: 'Private: Gelato Vault',
    subCategory: 'Master Designs',
    type: 'Textures',
    price: 0.00,
    series: 'Gelato',
    description: 'High-res seamless deep space nebula texture for all-over prints (Hoodies, Joggers). Dark blue/purple.'
  },
  {
    id: 9002,
    name: 'Soft Nebula Variant',
    category: 'Private: Gelato Vault',
    subCategory: 'Master Designs',
    type: 'Textures',
    price: 0.00,
    series: 'Gelato',
    description: 'Pastel nebula variant for Kids/Baby lines. Softer gradients, nursery aesthetic.'
  },
  {
    id: 9003,
    name: 'Neon Angel Logo',
    category: 'Private: Gelato Vault',
    subCategory: 'Master Designs',
    type: 'Logos',
    price: 0.00,
    series: 'Gelato',
    description: 'Transparent background neon angel logo for direct placement on dark fabrics.'
  },
  {
    id: 9004,
    name: 'Placement Guide',
    category: 'Private: Gelato Vault',
    subCategory: 'Master Designs',
    type: 'Documentation',
    price: 0.00,
    series: 'Gelato',
    description: 'Internal documentation for logo positioning and print margins across all apparel types.'
  },
  
  // Fashion - Men
  { 
    id: 1, 
    name: 'Guardian Hoodie', 
    category: 'Fashion', 
    subCategory: 'Men', 
    type: 'Hoodies', 
    price: 59.99, 
    series: 'Guardian',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'],
    description: 'Heavyweight premium cotton blend with reinforced stitching. Features a stealth pocket and thumbholes. Built for late-night coding sessions.'
  },
  { 
    id: 2, 
    name: 'Nebula Tee', 
    category: 'Fashion', 
    subCategory: 'Men', 
    type: 'T-Shirts', 
    price: 29.99, 
    series: 'Optimizer',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'],
    description: 'Breathable organic cotton with a soft-touch nebula print. Anti-shrink, anti-fade. The standard uniform for CoreLink operators.'
  },
  { 
    id: 3, 
    name: 'Cyber Denim Jeans', 
    category: 'Fashion', 
    subCategory: 'Men', 
    type: 'Jeans', 
    price: 69.99, 
    series: 'Night Mode',
    sizes: ['28', '30', '32', '34', '36', '38', '40'],
    description: 'Stretch denim with tech-fleece lining. Deep pockets for large phones. Durable, flexible, and ready for any environment.'
  },
  { 
    id: 11, 
    name: 'Core Cap', 
    category: 'Fashion', 
    subCategory: 'Men', 
    type: 'Accessories', 
    price: 24.99, 
    series: 'Guardian',
    sizes: ['One Size Fits All'],
    description: 'Classic 6-panel dad hat with embroidered CoreLink logo. Adjustable strap. Keeps the glare off your screens.'
  },
  { 
    id: 701, 
    name: 'Stealth Bomber Jacket', 
    category: 'Fashion', 
    subCategory: 'Men', 
    type: 'Jackets', 
    price: 129.99, 
    series: 'Night Mode',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'Water-resistant nylon shell with thermal lining. Multiple hidden pockets. Sleek, minimal, and warm.'
  },
  { 
    id: 711, 
    name: 'Glacier Parka', 
    category: 'Fashion', 
    subCategory: 'Men', 
    type: 'Jackets', 
    price: 199.99, 
    series: 'Guardian',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'Heavy-duty winter protection. Insulated with synthetic down. Fur-lined hood and storm cuffs.'
  },
  { 
    id: 712, 
    name: 'Storm Breaker Windbreaker', 
    category: 'Fashion', 
    subCategory: 'Men', 
    type: 'Jackets', 
    price: 89.99, 
    series: 'Optimizer',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'Lightweight and packable. Fully waterproof with sealed seams. Breathable mesh lining.'
  },
  { 
    id: 713, 
    name: 'Void Runners', 
    category: 'Fashion', 
    subCategory: 'Men', 
    type: 'Shoes', 
    price: 119.99, 
    series: 'Night Mode',
    sizes: ['7', '8', '9', '10', '11', '12'],
    description: 'High-performance running shoes with energy-returning foam. Knit upper for adaptive fit.'
  },
  { 
    id: 714, 
    name: 'Tactical Boots', 
    category: 'Fashion', 
    subCategory: 'Men', 
    type: 'Shoes', 
    price: 149.99, 
    series: 'Guardian',
    sizes: ['7', '8', '9', '10', '11', '12'],
    description: 'Rugged durability meets urban style. Waterproof leather and slip-resistant sole.'
  },

  // Fashion - Women
  { 
    id: 702, 
    name: 'Neon Flow Dress', 
    category: 'Fashion', 
    subCategory: 'Women', 
    type: 'Dresses', 
    price: 79.99, 
    series: 'Optimizer',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    description: 'Flowy, lightweight fabric with a subtle neon gradient. Perfect for summer days or layering. Comfortable elegance.'
  },
  { 
    id: 703, 
    name: 'Galaxy Crop Top', 
    category: 'Fashion', 
    subCategory: 'Women', 
    type: 'Tops', 
    price: 29.99, 
    series: 'Night Mode',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description: 'Soft modal fabric with a cropped cut. Pairs perfectly with high-rise jeans or leggings. Breathable and stylish.'
  },
  { 
    id: 704, 
    name: 'Guardian High-Rise Jeans', 
    category: 'Fashion', 
    subCategory: 'Women', 
    type: 'Jeans', 
    price: 59.99, 
    series: 'Guardian',
    sizes: ['24', '25', '26', '27', '28', '29', '30', '31', '32'],
    description: 'High-waisted skinny jeans with superior stretch retention. Sculpting fit that moves with you all day.'
  },
  { 
    id: 705, 
    name: 'Tech Active Leggings', 
    category: 'Fashion', 
    subCategory: 'Women', 
    type: 'Activewear', 
    price: 49.99, 
    series: 'Optimizer',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    description: 'Moisture-wicking compression fabric with side pockets. Squat-proof and buttery soft. Ideal for gym or lounge.'
  },
  { 
    id: 715, 
    name: 'Aurora Puffer', 
    category: 'Fashion', 
    subCategory: 'Women', 
    type: 'Jackets', 
    price: 159.99, 
    series: 'Guardian',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description: 'High-gloss finish with iridescent sheen. Warmth without the weight. Cropped silhouette.'
  },
  { 
    id: 716, 
    name: 'Hydro Shell', 
    category: 'Fashion', 
    subCategory: 'Women', 
    type: 'Jackets', 
    price: 99.99, 
    series: 'Optimizer',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description: 'Sleek rain jacket with adjustable waist cinch. Waterproof zippers and reflective details.'
  },
  { 
    id: 717, 
    name: 'Nebula Kicks', 
    category: 'Fashion', 
    subCategory: 'Women', 
    type: 'Shoes', 
    price: 89.99, 
    series: 'Optimizer',
    sizes: ['5', '6', '7', '8', '9', '10'],
    description: 'Lightweight sneakers with galaxy print accents. Memory foam insole for all-day comfort.'
  },
  { 
    id: 718, 
    name: 'Combat Chic Boots', 
    category: 'Fashion', 
    subCategory: 'Women', 
    type: 'Shoes', 
    price: 139.99, 
    series: 'Night Mode',
    sizes: ['5', '6', '7', '8', '9', '10'],
    description: 'Chunky platform boots with side zipper. Edgy, durable, and surprisingly lightweight.'
  },
  
  // Fashion - Kids (Girls & Boys)
  { 
    id: 706, 
    name: 'Little Star Dress', 
    category: 'Fashion', 
    subCategory: 'Girls', 
    type: 'Dresses', 
    price: 34.99, 
    series: 'Guardian',
    sizes: ['2Y', '3Y', '4Y', '5Y', '6Y', '7Y', '8Y', '9-10Y', '11-12Y'],
    description: 'Sparkly star pattern on soft cotton. Twirl-ready skirt. Durable enough for play, cute enough for parties.'
  },
  { 
    id: 707, 
    name: 'Junior Dev Tee', 
    category: 'Fashion', 
    subCategory: 'Boys', 
    type: 'T-Shirts', 
    price: 19.99, 
    series: 'Optimizer',
    sizes: ['2Y', '3Y', '4Y', '5Y', '6Y', '7Y', '8Y', '9-10Y', '11-12Y'],
    description: '100% cotton tee with a fun code-themed graphic. Pre-shrunk and tagless for maximum comfort.'
  },
  { 
    id: 708, 
    name: 'Mini Hoodie', 
    category: 'Fashion', 
    subCategory: 'Boys', 
    type: 'Hoodies', 
    price: 39.99, 
    series: 'Night Mode',
    sizes: ['2Y', '3Y', '4Y', '5Y', '6Y', '7Y', '8Y', '9-10Y', '11-12Y'],
    description: 'Just like the adult version, but mini. Soft fleece lining to keep them warm on chilly days.'
  },
  { 
    id: 719, 
    name: 'Mini Explorer Jacket', 
    category: 'Fashion', 
    subCategory: 'Boys', 
    type: 'Jackets', 
    price: 49.99, 
    series: 'Guardian',
    sizes: ['2Y', '3Y', '4Y', '5Y', '6Y', '7Y', '8Y', '9-10Y', '11-12Y'],
    description: 'Durable outdoor jacket with plenty of pockets for treasures. Hooded and water-resistant.'
  },
  { 
    id: 720, 
    name: 'Star Walker Shoes', 
    category: 'Fashion', 
    subCategory: 'Boys', 
    type: 'Shoes', 
    price: 39.99, 
    series: 'Optimizer',
    sizes: ['10K', '11K', '12K', '13K', '1', '2', '3'],
    description: 'Velcro strap sneakers for easy on/off. Durable rubber sole for active play.'
  },
  { 
    id: 721, 
    name: 'Cosmic Cozy Coat', 
    category: 'Fashion', 
    subCategory: 'Girls', 
    type: 'Jackets', 
    price: 49.99, 
    series: 'Night Mode',
    sizes: ['2Y', '3Y', '4Y', '5Y', '6Y', '7Y', '8Y', '9-10Y', '11-12Y'],
    description: 'Soft faux-fur lined coat with a galaxy print. Warm, stylish, and comfortable.'
  },
  { 
    id: 722, 
    name: 'Glitter Step Shoes', 
    category: 'Fashion', 
    subCategory: 'Girls', 
    type: 'Shoes', 
    price: 34.99, 
    series: 'Guardian',
    sizes: ['10K', '11K', '12K', '13K', '1', '2', '3'],
    description: 'Sparkly high-tops that light up with every step. The coolest shoes on the playground.'
  },
  
  // Fashion - Baby
  { 
    id: 709, 
    name: 'Future Coder Onesie', 
    category: 'Fashion', 
    subCategory: 'Baby', 
    type: 'Bodysuits', 
    price: 14.99, 
    series: 'Guardian',
    sizes: ['0-3M', '3-6M', '6-9M', '9-12M', '12-18M', '18-24M'],
    description: 'Super soft organic cotton with snap closures for easy changes. Hypoallergenic and gentle on baby skin.'
  },
  { 
    id: 710, 
    name: 'Tiny Tech Set', 
    category: 'Fashion', 
    subCategory: 'Baby', 
    type: 'Sets', 
    price: 24.99, 
    series: 'Optimizer',
    sizes: ['0-3M', '3-6M', '6-9M', '9-12M', '12-18M', '18-24M'],
    description: 'Matching top and bottom set. Stretchy waistband and comfy fit. The perfect gift for new tech parents.'
  },
  
  // Home & Bed
  { 
    id: 4, 
    name: 'CoreLink Pillow', 
    category: 'Home & Bed', 
    subCategory: 'Bedding', 
    type: 'Pillows', 
    price: 24.99, 
    series: 'Night Mode',
    description: 'Memory foam core with a cooling gel layer. Hypoallergenic cover. Universal size for all sleepers.'
  },
  { 
    id: 5, 
    name: 'System Duvet Cover', 
    category: 'Home & Bed', 
    subCategory: 'Bedding', 
    type: 'Duvet Covers', 
    price: 89.99, 
    series: 'Guardian',
    description: '400 thread count sateen weave cotton. Silky smooth and breathable. Features internal ties to keep duvet in place. Available in Full/Queen and King.'
  },
  { 
    id: 12, 
    name: 'Neon Void Rug', 
    category: 'Home & Bed', 
    subCategory: 'Floor', 
    type: 'Rugs', 
    price: 129.99, 
    series: 'Night Mode',
    description: 'High-pile plush rug with a striking neon geometric design. Non-slip backing. Adds a cyber edge to any room. 5x7 feet.'
  },
  
  // Tech Accessories - Phone (Comprehensive: Low to High End, Old to New)
  { 
    id: 6, 
    name: 'iPhone XR/11 Basic Clear Case', 
    category: 'Tech Accessories', 
    subCategory: 'Phone', 
    type: 'iPhone Cases', 
    price: 9.99, 
    series: 'Optimizer',
    description: 'Durable clear TPU case with anti-yellowing technology. Simple, effective protection.'
  },
  { 
    id: 101, 
    name: 'iPhone 12/13 Silicone Core', 
    category: 'Tech Accessories', 
    subCategory: 'Phone', 
    type: 'iPhone Cases', 
    price: 19.99, 
    series: 'Guardian',
    description: 'Soft-touch silicone exterior with microfiber lining. Precise cutouts and tactile buttons.'
  },
  { 
    id: 102, 
    name: 'iPhone 14/15 Pro Max Guardian', 
    category: 'Tech Accessories', 
    subCategory: 'Phone', 
    type: 'iPhone Cases', 
    price: 49.99, 
    series: 'Night Mode',
    description: 'Military-grade drop protection with a sleek carbon fiber finish. MagSafe compatible.'
  },
  { 
    id: 103, 
    name: 'iPhone 15 Ultra MagSafe Elite', 
    category: 'Tech Accessories', 
    subCategory: 'Phone', 
    type: 'iPhone Cases', 
    price: 59.99, 
    series: 'Guardian',
    description: 'Premium aerospace aluminum frame with transparent back. The ultimate protection for your flagship device.'
  },
  
  { 
    id: 104, 
    name: 'Samsung A54 Slim Cover', 
    category: 'Tech Accessories', 
    subCategory: 'Phone', 
    type: 'Samsung Cases', 
    price: 14.99, 
    series: 'Optimizer',
    description: 'Ultra-thin polycarbonate shell that adds grip without bulk. Matte finish resists fingerprints.'
  },
  { 
    id: 105, 
    name: 'Samsung S21/S22 Standard Shell', 
    category: 'Tech Accessories', 
    subCategory: 'Phone', 
    type: 'Samsung Cases', 
    price: 24.99, 
    series: 'Guardian',
    description: 'Rugged dual-layer design with kickstand. Raised bezels protect screen and camera.'
  },
  { 
    id: 106, 
    name: 'Samsung S24 Ultra Carbon Fiber', 
    category: 'Tech Accessories', 
    subCategory: 'Phone', 
    type: 'Samsung Cases', 
    price: 54.99, 
    series: 'Night Mode',
    description: 'Real aramid fiber construction. Incredibly light yet stronger than steel. Wireless charging ready.'
  },
  { 
    id: 107, 
    name: 'Samsung Z Fold 5 Hinge Armor', 
    category: 'Tech Accessories', 
    subCategory: 'Phone', 
    type: 'Samsung Cases', 
    price: 69.99, 
    series: 'Guardian',
    description: 'Full-body protection including hinge coverage. Integrated S-Pen slot and front screen glass.'
  },

  // More Samsung Cases
  { 
    id: 801, 
    name: 'Samsung S24 Ultra Guardian', 
    category: 'Tech Accessories', 
    subCategory: 'Phone', 
    type: 'Samsung Cases', 
    price: 39.99, 
    series: 'Guardian',
    description: 'Heavy-duty impact protection with a built-in kickstand. Raised edges for screen and camera safety.'
  },
  { 
    id: 802, 
    name: 'Samsung S23 FE Silicone Grip', 
    category: 'Tech Accessories', 
    subCategory: 'Phone', 
    type: 'Samsung Cases', 
    price: 19.99, 
    series: 'Optimizer',
    description: 'Soft-touch silicone with enhanced grip texture. Vibrant colors and slim profile.'
  },
  { 
    id: 803, 
    name: 'Samsung A55 5G Rugged Shield', 
    category: 'Tech Accessories', 
    subCategory: 'Phone', 
    type: 'Samsung Cases', 
    price: 24.99, 
    series: 'Guardian',
    description: 'Affordable, tough protection for the A-series. Shock-absorbing corners and non-slip back.'
  },

  // Pixel Cases
  { 
    id: 810, 
    name: 'Pixel 8 Pro Cyber Visor', 
    category: 'Tech Accessories', 
    subCategory: 'Phone', 
    type: 'Pixel Cases', 
    price: 34.99, 
    series: 'Night Mode',
    description: 'Accentuates the unique camera bar with a cyber-aesthetic outline. Matte black finish.'
  },
  { 
    id: 811, 
    name: 'Pixel 7a Everyday Case', 
    category: 'Tech Accessories', 
    subCategory: 'Phone', 
    type: 'Pixel Cases', 
    price: 19.99, 
    series: 'Optimizer',
    description: 'Lightweight and durable. Perfect fit for the Pixel 7a. Wireless charging compatible.'
  },

  // Other Android / Low Budget Cases
  { 
    id: 820, 
    name: 'Nothing Phone (2a) Glyph Case', 
    category: 'Tech Accessories', 
    subCategory: 'Phone', 
    type: 'Other Android Cases', 
    price: 29.99, 
    series: 'Night Mode',
    description: 'Transparent hard shell designed to enhance the Glyph Interface lighting. Anti-yellowing.'
  },
  { 
    id: 821, 
    name: 'Motorola Edge+ Slim Shell', 
    category: 'Tech Accessories', 
    subCategory: 'Phone', 
    type: 'Other Android Cases', 
    price: 14.99, 
    series: 'Optimizer',
    description: 'Ultra-thin case that preserves the sleek feel of the Edge+. Basic scratch protection.'
  },
  { 
    id: 822, 
    name: 'Xiaomi Redmi Note 13 Armor', 
    category: 'Tech Accessories', 
    subCategory: 'Phone', 
    type: 'Other Android Cases', 
    price: 19.99, 
    series: 'Guardian',
    description: 'Heavy-duty protection for budget kings. Reinforced bumper corners and tactile buttons.'
  },
  { 
    id: 823, 
    name: 'Universal Waterproof Pouch', 
    category: 'Tech Accessories', 
    subCategory: 'Phone', 
    type: 'Other Android Cases', 
    price: 14.99, 
    series: 'Guardian',
    description: 'IPX8 waterproof rating. Fits any phone up to 7 inches. Perfect for beach or rain protection.'
  },

  { 
    id: 108, 
    name: 'Standard Tempered Glass (2-Pack)', 
    category: 'Tech Accessories', 
    subCategory: 'Phone', 
    type: 'Screen Protectors', 
    price: 9.99, 
    series: 'Optimizer',
    description: '9H hardness glass with oleophobic coating. Easy installation kit included. Crystal clear clarity.'
  },
  { 
    id: 109, 
    name: 'Privacy Glass Shield', 
    category: 'Tech Accessories', 
    subCategory: 'Phone', 
    type: 'Screen Protectors', 
    price: 19.99, 
    series: 'Guardian',
    description: 'Keeps your screen visible only to you. Protects sensitive data from prying eyes in public.'
  },
  { 
    id: 110, 
    name: 'Nano-Liquid Screen Protection', 
    category: 'Tech Accessories', 
    subCategory: 'Phone', 
    type: 'Screen Protectors', 
    price: 29.99, 
    series: 'Night Mode',
    description: 'Invisible liquid coating that bonds to the glass. enhancing scratch resistance and touch sensitivity.'
  },

  // Tech Accessories - Laptop (Cases, Skins, Sleeves)
  { 
    id: 13, 
    name: 'Laptop Skin - Matrix', 
    category: 'Tech Accessories', 
    subCategory: 'Laptop', 
    type: 'Skins', 
    price: 24.99, 
    series: 'Guardian',
    description: 'Premium 3M vinyl skin with air-release technology for bubble-free application. Matrix code design.'
  },
  { 
    id: 111, 
    name: 'MacBook Air M1/M2 Nebula Skin', 
    category: 'Tech Accessories', 
    subCategory: 'Laptop', 
    type: 'Skins', 
    price: 19.99, 
    series: 'Night Mode',
    description: 'Stunning high-res nebula print. Protects against scratches while customizing your device.'
  },
  
  { 
    id: 112, 
    name: 'Universal 13-inch Neoprene Sleeve', 
    category: 'Tech Accessories', 
    subCategory: 'Laptop', 
    type: 'Sleeves', 
    price: 14.99, 
    series: 'Optimizer',
    description: 'Soft neoprene interior protects against bumps and scratches. Water-resistant exterior.'
  },
  { 
    id: 113, 
    name: 'Shockproof Gaming Sleeve 16"', 
    category: 'Tech Accessories', 
    subCategory: 'Laptop', 
    type: 'Sleeves', 
    price: 34.99, 
    series: 'Guardian',
    description: 'Reinforced corners and rigid exterior shell. Designed for heavy gaming laptops.'
  },




  { 
    id: 117, 
    name: 'CoreLink Logo Sticker Pack', 
    category: 'Tech Accessories', 
    subCategory: 'Laptop', 
    type: 'Stickers', 
    price: 4.99, 
    series: 'Guardian',
    description: 'Pack of 5 high-quality vinyl stickers featuring the CoreLink logo and icons.'
  },
  { 
    id: 118, 
    name: 'Dev Humor Sticker Set', 
    category: 'Tech Accessories', 
    subCategory: 'Laptop', 
    type: 'Stickers', 
    price: 9.99, 
    series: 'Night Mode',
    description: '10-pack of coding jokes and tech memes. Water and fade resistant.'
  },

  { 
    id: 123, 
    name: 'CryoFlow Cooling Pad', 
    category: 'Tech Accessories', 
    subCategory: 'Laptop', 
    type: 'Cooling Pads', 
    price: 24.99, 
    series: 'Optimizer',
    description: 'High-performance active cooling with silent dual fans. Adjustable tilt and USB pass-through. Keeps your laptop running at peak efficiency.'
  },
  { 
    id: 124, 
    name: 'FrostByte Pro RGB', 
    category: 'Tech Accessories', 
    subCategory: 'Laptop', 
    type: 'Cooling Pads', 
    price: 39.99, 
    series: 'Guardian',
    description: 'Aerospace-grade aluminum body with full RGB underglow. Quad-fan array for maximum airflow. Supports laptops up to 17 inches.'
  },
  { 
    id: 125, 
    name: 'SilentRun Slim', 
    category: 'Tech Accessories', 
    subCategory: 'Laptop', 
    type: 'Cooling Pads', 
    price: 19.99, 
    series: 'Night Mode',
    description: 'Ultra-portable and whisper-quiet. Fits in any bag. Single large fan design for efficient, low-noise cooling.'
  },
  
  // Tech Accessories - Desk & Gaming (Filling gaps)
  { 
    id: 7, 
    name: 'XL Mousepad - Void', 
    category: 'Tech Accessories', 
    subCategory: 'Desk', 
    type: 'Mousepads', 
    price: 34.99, 
    series: 'Night Mode',
    description: 'Extended mousepad (900x400mm). Speed surface for gaming. Anti-fray stitched edges.'
  },
  { 
    id: 119, 
    name: 'Pro Desk Mat - Cyber', 
    category: 'Tech Accessories', 
    subCategory: 'Desk', 
    type: 'Desk Mats', 
    price: 39.99, 
    series: 'Guardian',
    description: 'Premium vegan leather desk mat. Waterproof and easy to clean. Adds a sleek look to your setup.'
  },
  { 
    id: 120, 
    name: 'Cable Organizer Clips', 
    category: 'Tech Accessories', 
    subCategory: 'Desk', 
    type: 'Cable Management', 
    price: 9.99, 
    series: 'Optimizer',
    description: 'Pack of 6 magnetic cable clips. Keep your charging cables tidy and accessible.'
  },
  { 
    id: 121, 
    name: 'PS5 Console Skin - Nebula', 
    category: 'Tech Accessories', 
    subCategory: 'Gaming', 
    type: 'Console Skins', 
    price: 29.99, 
    series: 'Night Mode',
    description: 'Full wrap for PS5 Disc/Digital editions. Precision cut. Transforms your console into a centerpiece.'
  },
  { 
    id: 122, 
    name: 'Xbox Controller Grip', 
    category: 'Tech Accessories', 
    subCategory: 'Gaming', 
    type: 'Controller Grips', 
    price: 14.99, 
    series: 'Guardian',
    description: 'Silicone skin with textured grips for Xbox Series X/S controllers. Sweat-resistant.'
  },
  { 
    id: 126, 
    name: 'PS4 Controller Skin - Cyber', 
    category: 'Tech Accessories', 
    subCategory: 'Gaming', 
    type: 'Controller Skins', 
    price: 12.99, 
    series: 'Night Mode',
    description: 'Precision-cut vinyl skin for DualShock 4. Protects against scratches and adds grip. Cyberpunk aesthetic.'
  },
  { 
    id: 127, 
    name: 'PS4 Pro Console Skin - Guardian', 
    category: 'Tech Accessories', 
    subCategory: 'Gaming', 
    type: 'Console Skins', 
    price: 24.99, 
    series: 'Guardian',
    description: 'Full body wrap for PlayStation 4 Pro. Matte finish to prevent fingerprints. Easy bubble-free installation.'
  },
  { 
    id: 128, 
    name: 'PS5 Controller Skin - Nebula', 
    category: 'Tech Accessories', 
    subCategory: 'Gaming', 
    type: 'Controller Skins', 
    price: 14.99, 
    series: 'Night Mode',
    description: 'Precision-cut vinyl skin for DualSense controller. Protects against scratches and adds grip. Nebula aesthetic.'
  },
  { 
    id: 129, 
    name: 'Xbox Series X Console Skin - Void', 
    category: 'Tech Accessories', 
    subCategory: 'Gaming', 
    type: 'Console Skins', 
    price: 29.99, 
    series: 'Night Mode',
    description: 'Full wrap for Xbox Series X. Matte black finish with subtle cyber accents. Scratch protection.'
  },
  
  // Bags
  { 
    id: 8, 
    name: 'Tactical Backpack', 
    category: 'Bags & Lifestyle', 
    subCategory: 'Carry', 
    type: 'Backpacks', 
    price: 79.99, 
    series: 'Guardian',
    description: '30L capacity with dedicated laptop compartment. Molle webbing system. Weather-resistant.'
  },
  { 
    id: 9, 
    name: 'Hydration Node', 
    category: 'Bags & Lifestyle', 
    subCategory: 'Accessories', 
    type: 'Bottles', 
    price: 24.99, 
    series: 'Optimizer',
    description: 'Vacuum insulated stainless steel bottle. Keeps drinks cold for 24h, hot for 12h. 32oz capacity.'
  },
  
  // Smart
  { 
    id: 10, 
    name: 'Smart Projector Core', 
    category: 'Smart & Large Products', 
    subCategory: 'Home', 
    type: 'Smart Projector', 
    price: 299.99, 
    series: 'Guardian',
    description: '1080p native resolution with Android TV built-in. Auto-keystone correction. Portable cinema experience.'
  },
  { 
    id: 14, 
    name: 'Ergo Chair Pro', 
    category: 'Smart & Large Products', 
    subCategory: 'Office', 
    type: 'Ergo Chairs', 
    price: 499.99, 
    series: 'Optimizer',
    description: 'Fully adjustable mesh chair with lumbar support. Headrest and 4D armrests included. Designed for 8+ hour sessions.'
  },

  // Electronics & Photo
  { 
    id: 201, 
    name: 'CoreCam 4K Action', 
    category: 'Electronics & Photo', 
    subCategory: 'Cameras', 
    type: 'Action Cams', 
    price: 149.99, 
    series: 'Guardian',
    description: 'Capture life in stunning 4K/60fps. Waterproof up to 10m without case. Dual touchscreens.'
  },
  { 
    id: 202, 
    name: 'SkyGuard Drone Mini', 
    category: 'Electronics & Photo', 
    subCategory: 'Cameras', 
    type: 'Drones', 
    price: 299.99, 
    series: 'Optimizer',
    description: 'Ultralight folding drone. 4K camera with 3-axis gimbal. 30-minute flight time per battery.'
  },
  { 
    id: 203, 
    name: 'Streamer Pro Webcam', 
    category: 'Electronics & Photo', 
    subCategory: 'Cameras', 
    type: 'Webcams', 
    price: 89.99, 
    series: 'Night Mode',
    description: '1080p/60fps streaming camera with ring light. Auto-focus and low-light correction.'
  },
  { 
    id: 204, 
    name: 'Neural Noise Cancelling Headphones', 
    category: 'Electronics & Photo', 
    subCategory: 'Audio', 
    type: 'Headphones', 
    price: 199.99, 
    series: 'Guardian',
    description: 'Industry-leading active noise cancellation. 40-hour battery life. Immersive soundstage.'
  },
  { 
    id: 205, 
    name: 'Pulse Earbuds', 
    category: 'Electronics & Photo', 
    subCategory: 'Audio', 
    type: 'Earbuds', 
    price: 79.99, 
    series: 'Optimizer',
    description: 'True wireless earbuds with transparency mode. IPX5 water resistance. Punchy bass.'
  },
  { 
    id: 206, 
    name: 'Studio Mic Arm Kit', 
    category: 'Electronics & Photo', 
    subCategory: 'Audio', 
    type: 'Microphones', 
    price: 129.99, 
    series: 'Night Mode',
    description: 'XLR cardioid condenser microphone with boom arm and pop filter. Professional broadcast quality.'
  },
  { 
    id: 207, 
    name: 'Vitality Smart Watch', 
    category: 'Electronics & Photo', 
    subCategory: 'Wearables', 
    type: 'Smart Watches', 
    price: 149.99, 
    series: 'Guardian',
    description: 'Advanced health monitoring including ECG and SpO2. Always-on AMOLED display. 7-day battery.'
  },
  { 
    id: 208, 
    name: 'Slim Fitness Tracker', 
    category: 'Electronics & Photo', 
    subCategory: 'Wearables', 
    type: 'Fitness Trackers', 
    price: 49.99, 
    series: 'Optimizer',
    description: 'Tracks steps, sleep, and heart rate. Slim profile and lightweight. Swim-proof.'
  },

  // DIY & Tools
  { 
    id: 301, 
    name: 'Precision Electric Screwdriver', 
    category: 'DIY & Tools', 
    subCategory: 'Power Tools', 
    type: 'Electric Screwdrivers', 
    price: 59.99, 
    series: 'Optimizer',
    description: 'Pen-shaped electric screwdriver with 24 bits. LED work light. USB-C rechargeable.'
  },
  { 
    id: 302, 
    name: 'Craft Rotary Tool', 
    category: 'DIY & Tools', 
    subCategory: 'Power Tools', 
    type: 'Rotary Tools', 
    price: 39.99, 
    series: 'Guardian',
    description: 'Cordless rotary tool for sanding, polishing, and cutting. Variable speed control.'
  },
  { 
    id: 303, 
    name: '128-Bit Precision Set', 
    category: 'DIY & Tools', 
    subCategory: 'Hand Tools', 
    type: 'Precision Sets', 
    price: 29.99, 
    series: 'Night Mode',
    description: 'Comprehensive toolkit for electronics repair. Includes every bit you will ever need.'
  },
  { 
    id: 304, 
    name: 'Digital Soldering Station', 
    category: 'DIY & Tools', 
    subCategory: 'Hand Tools', 
    type: 'Soldering Kits', 
    price: 89.99, 
    series: 'Guardian',
    description: 'PID temperature control with rapid heating. Sleep mode and calibration function.'
  },
  { 
    id: 305, 
    name: 'CyberSafety Goggles', 
    category: 'DIY & Tools', 
    subCategory: 'Safety', 
    type: 'Goggles', 
    price: 19.99, 
    series: 'Optimizer',
    description: 'Anti-fog and scratch-resistant lenses. Comfortable fit over prescription glasses.'
  },
  { 
    id: 306, 
    name: 'Large Anti-Static Mat', 
    category: 'DIY & Tools', 
    subCategory: 'Safety', 
    type: 'Anti-Static Mats', 
    price: 24.99, 
    series: 'Night Mode',
    description: 'Protects sensitive electronics from ESD damage. Grounding cord included. Heat resistant.'
  },

  // PC & Video Games
  { 
    id: 401, 
    name: '1TB NVMe Guardian SSD', 
    category: 'PC & Video Games', 
    subCategory: 'Components', 
    type: 'SSDs', 
    price: 89.99, 
    series: 'Guardian',
    description: 'Blazing fast Gen4 speeds up to 7000MB/s. Graphene heat spreader for thermal management.'
  },
  { 
    id: 402, 
    name: 'RGB RAM Kit 32GB', 
    category: 'PC & Video Games', 
    subCategory: 'Components', 
    type: 'RAM Kits', 
    price: 129.99, 
    series: 'Night Mode',
    description: 'DDR5 6000MHz CL30. Customizable RGB lighting. Optimized for high-performance gaming.'
  },
  { 
    id: 403, 
    name: 'Silent Air Fan 120mm', 
    category: 'PC & Video Games', 
    subCategory: 'Components', 
    type: 'Fans', 
    price: 19.99, 
    series: 'Optimizer',
    description: 'Fluid dynamic bearing for quiet operation. High airflow pressure. Addressable RGB.'
  },
  { 
    id: 404, 
    name: 'Mechanical Keyboard 60%', 
    category: 'PC & Video Games', 
    subCategory: 'Peripherals', 
    type: 'Keyboards', 
    price: 79.99, 
    series: 'Night Mode',
    description: 'Hot-swappable switches (Red/Blue/Brown). PBT double-shot keycaps. Compact layout.'
  },
  { 
    id: 405, 
    name: 'Ultralight Hex Mouse', 
    category: 'PC & Video Games', 
    subCategory: 'Peripherals', 
    type: 'Mice', 
    price: 49.99, 
    series: 'Guardian',
    description: 'Honeycomb shell design weighs only 60g. Pixart 3389 sensor. Flexible paracord cable.'
  },
  { 
    id: 406, 
    name: '7.1 Surround Headset', 
    category: 'PC & Video Games', 
    subCategory: 'Peripherals', 
    type: 'Headsets', 
    price: 69.99, 
    series: 'Optimizer',
    description: 'Virtual 7.1 surround sound. Detachable noise-cancelling mic. Memory foam ear cushions.'
  },
  { 
    id: 407, 
    name: '4K Capture Card', 
    category: 'PC & Video Games', 
    subCategory: 'Streaming', 
    type: 'Capture Cards', 
    price: 119.99, 
    series: 'Guardian',
    description: 'Pass-through 4K60 HDR. Record 1080p60. Low latency for real-time monitoring.'
  },
  { 
    id: 408, 
    name: 'Pop-Up Green Screen', 
    category: 'PC & Video Games', 
    subCategory: 'Streaming', 
    type: 'Green Screens', 
    price: 149.99, 
    series: 'Optimizer',
    description: 'Collapsible chroma key panel. Pneumatic X-frame. Sets up in seconds.'
  },

  // Stationery & Office
  { 
    id: 501, 
    name: 'CoreLink Hardcover Notebook', 
    category: 'Stationery & Office', 
    subCategory: 'Paper', 
    type: 'Notebooks', 
    price: 19.99, 
    series: 'Guardian',
    description: 'Dot grid pages (120gsm). Lay-flat binding. Elastic closure and pen loop.'
  },
  { 
    id: 502, 
    name: 'Productivity Planner 2025', 
    category: 'Stationery & Office', 
    subCategory: 'Paper', 
    type: 'Planners', 
    price: 24.99, 
    series: 'Optimizer',
    description: 'Daily, weekly, and monthly views. Goal tracking sections. Stay organized and focused.'
  },
  { 
    id: 503, 
    name: 'Technical Sketchbook', 
    category: 'Stationery & Office', 
    subCategory: 'Paper', 
    type: 'Sketchbooks', 
    price: 14.99, 
    series: 'Night Mode',
    description: 'Isometric grid pages for 3D drafting and design. Heavyweight acid-free paper.'
  },
  { 
    id: 504, 
    name: 'Tactical Bolt Pen', 
    category: 'Stationery & Office', 
    subCategory: 'Writing', 
    type: 'Pens', 
    price: 29.99, 
    series: 'Guardian',
    description: 'Machined aluminum body with bolt-action mechanism. Compatible with standard refills.'
  },
  { 
    id: 505, 
    name: 'Neon Marker Set', 
    category: 'Stationery & Office', 
    subCategory: 'Writing', 
    type: 'Markers', 
    price: 9.99, 
    series: 'Night Mode',
    description: 'Set of 6 fluorescent highlighters. Smear-guard ink. Perfect for color-coding notes.'
  },
  { 
    id: 506, 
    name: 'Drafting Pencils', 
    category: 'Stationery & Office', 
    subCategory: 'Writing', 
    type: 'Pencils', 
    price: 12.99, 
    series: 'Optimizer',
    description: 'Set of 3 mechanical pencils (0.5, 0.7, 0.9mm). Metal grip and eraser tip.'
  },
  { 
    id: 507, 
    name: 'Mesh File Organizer', 
    category: 'Stationery & Office', 
    subCategory: 'Organization', 
    type: 'File Organizers', 
    price: 19.99, 
    series: 'Guardian',
    description: 'Vertical desktop file sorter. Sturdy metal mesh construction. Keeps documents upright.'
  },
  { 
    id: 508, 
    name: 'Stackable Desk Trays', 
    category: 'Stationery & Office', 
    subCategory: 'Organization', 
    type: 'Desk Trays', 
    price: 24.99, 
    series: 'Optimizer',
    description: 'Set of 2 stackable trays for A4 paper. Sliding design for easy access.'
  },

  // Health & Personal Care
  { 
    id: 601, 
    name: 'Anti-Blue Light Glasses', 
    category: 'Health & Personal Care', 
    subCategory: 'Wellness', 
    type: 'Blue Light Glasses', 
    price: 39.99, 
    series: 'Guardian',
    description: 'Filters out harmful blue light from screens. Reduces eye strain and improves sleep quality.'
  },
  { 
    id: 602, 
    name: 'Smart Posture Corrector', 
    category: 'Health & Personal Care', 
    subCategory: 'Wellness', 
    type: 'Posture Correctors', 
    price: 49.99, 
    series: 'Optimizer',
    description: 'Vibrates when you slouch. Trains muscle memory for better posture over time.'
  },
  { 
    id: 603, 
    name: 'Heavy Resistance Bands', 
    category: 'Health & Personal Care', 
    subCategory: 'Fitness', 
    type: 'Resistance Bands', 
    price: 19.99, 
    series: 'Night Mode',
    description: 'Set of 5 latex bands with varying resistance levels. Includes carrying bag and workout guide.'
  },
  { 
    id: 604, 
    name: 'Body Composition Scale', 
    category: 'Health & Personal Care', 
    subCategory: 'Fitness', 
    type: 'Smart Scales', 
    price: 34.99, 
    series: 'Optimizer',
    description: 'Measures weight, BMI, body fat %, and more. Syncs with mobile app via Bluetooth.'
  },
  { 
    id: 605, 
    name: 'Desktop Air Purifier', 
    category: 'Health & Personal Care', 
    subCategory: 'Air', 
    type: 'Purifiers', 
    price: 59.99, 
    series: 'Guardian',
    description: 'HEPA filter removes 99.97% of dust and allergens. Quiet operation for office use.'
  },
  { 
    id: 606, 
    name: 'Ultrasonic Humidifier', 
    category: 'Health & Personal Care', 
    subCategory: 'Air', 
    type: 'Humidifiers', 
    price: 44.99, 
    series: 'Night Mode',
    description: 'Cool mist humidifier with essential oil tray. Auto shut-off. Improves air quality in dry rooms.'
  },

  // Expanded Fashion - Men
  { id: 800, name: 'Core Knit Jumper', category: 'Fashion', subCategory: 'Men', type: 'Sweatshirts', price: 49.99, series: 'Optimizer', sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'], image: 'https://placehold.co/800x800/050505/00ffff?text=Core%20Knit%20Jumper', description: 'Premium knit jumper with subtle tech patterns. Warm, breathable, and perfect for layering.' },
  { id: 801, name: 'Operator Long Sleeve', category: 'Fashion', subCategory: 'Men', type: 'T-Shirts', price: 34.99, series: 'Night Mode', sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'], image: 'https://placehold.co/800x800/050505/e0e0e0?text=Operator%20Long%20Sleeve', description: 'Long sleeve tee with reinforced cuffs. Moisture-wicking fabric for extended shifts.' },
  { id: 802, name: 'Tech Fleece Joggers', category: 'Fashion', subCategory: 'Men', type: 'Pants', price: 54.99, series: 'Guardian', sizes: ['S', 'M', 'L', 'XL', 'XXL'], image: 'https://placehold.co/800x800/050505/bf00ff?text=Tech%20Fleece%20Joggers', description: 'Tapered fit joggers with zippered pockets. Soft fleece lining for maximum comfort.' },
  { id: 803, name: 'Utility Cargo Pants', category: 'Fashion', subCategory: 'Men', type: 'Pants', price: 64.99, series: 'Night Mode', sizes: ['30', '32', '34', '36', '38'], image: 'https://placehold.co/800x800/050505/e0e0e0?text=Utility%20Cargo%20Pants', description: 'Heavy-duty cargos with multiple functional pockets. Durable ripstop fabric.' },
  { id: 804, name: 'Smart Chino Trousers', category: 'Fashion', subCategory: 'Men', type: 'Pants', price: 59.99, series: 'Optimizer', sizes: ['30', '32', '34', '36', '38'], image: 'https://placehold.co/800x800/050505/00ffff?text=Smart%20Chino%20Trousers', description: 'Stretch chinos that look formal but feel like loungewear. Stain-resistant.' },
  { id: 805, name: 'Performance Crew Socks', category: 'Fashion', subCategory: 'Men', type: 'Socks', price: 14.99, series: 'Guardian', sizes: ['One Size'], image: 'https://placehold.co/800x800/050505/bf00ff?text=Performance%20Crew%20Socks', description: '3-pack of cushioned crew socks. Arch support and reinforced heel/toe.' },
  { id: 806, name: 'Stealth Tech Hoodie', category: 'Fashion', subCategory: 'Men', type: 'Hoodies', price: 69.99, series: 'Night Mode', sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'], image: 'https://placehold.co/800x800/050505/e0e0e0?text=Stealth%20Tech%20Hoodie', description: 'Premium heavyweight hoodie with waterproof zippers. Hidden media pocket.' },
  { id: 807, name: 'Vector Graphic Tee', category: 'Fashion', subCategory: 'Men', type: 'T-Shirts', price: 29.99, series: 'Optimizer', sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'], image: 'https://placehold.co/800x800/050505/00ffff?text=Vector%20Graphic%20Tee', description: 'Soft cotton tee with abstract vector graphic. Athletic fit.' },

  // Expanded Fashion - Women
  { id: 810, name: 'Stellar Sweatshirt', category: 'Fashion', subCategory: 'Women', type: 'Sweatshirts', price: 49.99, series: 'Night Mode', sizes: ['XS', 'S', 'M', 'L', 'XL'], image: 'https://placehold.co/800x800/050505/e0e0e0?text=Stellar%20Sweatshirt', description: 'Oversized fit sweatshirt with star chart embroidery. Ultra-soft interior.' },
  { id: 811, name: 'Lunar Long Sleeve', category: 'Fashion', subCategory: 'Women', type: 'Tops', price: 34.99, series: 'Optimizer', sizes: ['XS', 'S', 'M', 'L', 'XL'], image: 'https://placehold.co/800x800/050505/00ffff?text=Lunar%20Long%20Sleeve', description: 'Fitted long sleeve top. Breathable mesh panels for ventilation.' },
  { id: 812, name: 'Motion Joggers', category: 'Fashion', subCategory: 'Women', type: 'Pants', price: 54.99, series: 'Guardian', sizes: ['XS', 'S', 'M', 'L', 'XL'], image: 'https://placehold.co/800x800/050505/bf00ff?text=Motion%20Joggers', description: 'High-waisted joggers with a streamlined silhouette. 4-way stretch fabric.' },
  { id: 813, name: 'Tactical Cargo Pants', category: 'Fashion', subCategory: 'Women', type: 'Pants', price: 64.99, series: 'Night Mode', sizes: ['24', '26', '28', '30', '32'], image: 'https://placehold.co/800x800/050505/e0e0e0?text=Tactical%20Cargo%20Pants', description: 'Functional cargos with a feminine cut. Adjustable ankle cuffs.' },
  { id: 814, name: 'Tailored Tech Trousers', category: 'Fashion', subCategory: 'Women', type: 'Pants', price: 59.99, series: 'Optimizer', sizes: ['24', '26', '28', '30', '32'], image: 'https://placehold.co/800x800/050505/00ffff?text=Tailored%20Tech%20Trousers', description: 'Professional trousers with hidden elastic waist. Wrinkle-free fabric.' },
  { id: 815, name: 'Ankle Socks Pack', category: 'Fashion', subCategory: 'Women', type: 'Socks', price: 12.99, series: 'Guardian', sizes: ['One Size'], image: 'https://placehold.co/800x800/050505/bf00ff?text=Ankle%20Socks%20Pack', description: '5-pack of no-show socks. Silicone grip on heel to prevent slipping.' },
  { id: 816, name: 'Nova Hoodie', category: 'Fashion', subCategory: 'Women', type: 'Hoodies', price: 59.99, series: 'Guardian', sizes: ['XS', 'S', 'M', 'L', 'XL'], image: 'https://placehold.co/800x800/050505/bf00ff?text=Nova%20Hoodie', description: 'Relaxed fit hoodie with holographic details. Kangaroo pocket with zipper.' },
  { id: 817, name: 'Core Essential Tee', category: 'Fashion', subCategory: 'Women', type: 'Tops', price: 29.99, series: 'Optimizer', sizes: ['XS', 'S', 'M', 'L', 'XL'], image: 'https://placehold.co/800x800/050505/00ffff?text=Core%20Essential%20Tee', description: 'Classic crew neck tee in premium cotton. The perfect base layer.' },

  // Expanded Fashion - Teen Girls
  { id: 820, name: 'Teen Galaxy Hoodie', category: 'Fashion', subCategory: 'Girls', type: 'Hoodies', price: 39.99, series: 'Night Mode', sizes: ['10Y', '12Y', '14Y', '16Y'], image: 'https://placehold.co/800x800/050505/e0e0e0?text=Teen%20Galaxy%20Hoodie', description: 'Cropped hoodie with all-over galaxy print. Trendy and comfortable.' },
  { id: 821, name: 'Teen Star Jumper', category: 'Fashion', subCategory: 'Girls', type: 'Sweatshirts', price: 34.99, series: 'Optimizer', sizes: ['10Y', '12Y', '14Y', '16Y'], image: 'https://placehold.co/800x800/050505/00ffff?text=Teen%20Star%20Jumper', description: 'Crewneck jumper with sequin star detail. Soft cotton blend.' },
  { id: 822, name: 'Teen Nebula Tee', category: 'Fashion', subCategory: 'Girls', type: 'Tops', price: 24.99, series: 'Guardian', sizes: ['10Y', '12Y', '14Y', '16Y'], image: 'https://placehold.co/800x800/050505/bf00ff?text=Teen%20Nebula%20Tee', description: 'Boxy fit tee with nebula graphic. 100% organic cotton.' },
  { id: 823, name: 'Teen Cloud Long Sleeve', category: 'Fashion', subCategory: 'Girls', type: 'Tops', price: 29.99, series: 'Optimizer', sizes: ['10Y', '12Y', '14Y', '16Y'], image: 'https://placehold.co/800x800/050505/00ffff?text=Teen%20Cloud%20Long%20Sleeve', description: 'Ribbed long sleeve top. Lettuce edge hem for a stylish touch.' },
  { id: 824, name: 'Teen Comfy Joggers', category: 'Fashion', subCategory: 'Girls', type: 'Pants', price: 34.99, series: 'Night Mode', sizes: ['10Y', '12Y', '14Y', '16Y'], image: 'https://placehold.co/800x800/050505/e0e0e0?text=Teen%20Comfy%20Joggers', description: 'Plush joggers with drawstring waist. Perfect for study or chill.' },
  { id: 825, name: 'Teen Street Cargos', category: 'Fashion', subCategory: 'Girls', type: 'Pants', price: 39.99, series: 'Guardian', sizes: ['10Y', '12Y', '14Y', '16Y'], image: 'https://placehold.co/800x800/050505/bf00ff?text=Teen%20Street%20Cargos', description: 'Wide-leg cargo pants with chain detail. Durable and cool.' },
  { id: 826, name: 'Teen Smart Trousers', category: 'Fashion', subCategory: 'Girls', type: 'Pants', price: 39.99, series: 'Optimizer', sizes: ['10Y', '12Y', '14Y', '16Y'], image: 'https://placehold.co/800x800/050505/00ffff?text=Teen%20Smart%20Trousers', description: 'Pleated trousers for school or events. Stretchy and comfortable.' },
  { id: 827, name: 'Teen Pattern Socks', category: 'Fashion', subCategory: 'Girls', type: 'Socks', price: 9.99, series: 'Night Mode', sizes: ['One Size'], image: 'https://placehold.co/800x800/050505/e0e0e0?text=Teen%20Pattern%20Socks', description: '3-pack of fun patterned socks. Soft cotton blend.' },

  // Expanded Fashion - Teen Boys
  { id: 830, name: 'Teen Stealth Hoodie', category: 'Fashion', subCategory: 'Boys', type: 'Hoodies', price: 39.99, series: 'Night Mode', sizes: ['10Y', '12Y', '14Y', '16Y'], image: 'https://placehold.co/800x800/050505/e0e0e0?text=Teen%20Stealth%20Hoodie', description: 'Blackout hoodie with hidden pockets. Tech fleece material.' },
  { id: 831, name: 'Teen Core Jumper', category: 'Fashion', subCategory: 'Boys', type: 'Sweatshirts', price: 34.99, series: 'Guardian', sizes: ['10Y', '12Y', '14Y', '16Y'], image: 'https://placehold.co/800x800/050505/bf00ff?text=Teen%20Core%20Jumper', description: 'Classic crewneck with embroidered logo. Durable for daily wear.' },
  { id: 832, name: 'Teen Glitch Tee', category: 'Fashion', subCategory: 'Boys', type: 'T-Shirts', price: 24.99, series: 'Optimizer', sizes: ['10Y', '12Y', '14Y', '16Y'], image: 'https://placehold.co/800x800/050505/00ffff?text=Teen%20Glitch%20Tee', description: 'Graphic tee with digital glitch art. Soft and breathable.' },
  { id: 833, name: 'Teen Matrix Long Sleeve', category: 'Fashion', subCategory: 'Boys', type: 'T-Shirts', price: 29.99, series: 'Night Mode', sizes: ['10Y', '12Y', '14Y', '16Y'], image: 'https://placehold.co/800x800/050505/e0e0e0?text=Teen%20Matrix%20Long%20Sleeve', description: 'Layered look long sleeve. Code rain print on sleeves.' },
  { id: 834, name: 'Teen Active Joggers', category: 'Fashion', subCategory: 'Boys', type: 'Pants', price: 34.99, series: 'Guardian', sizes: ['10Y', '12Y', '14Y', '16Y'], image: 'https://placehold.co/800x800/050505/bf00ff?text=Teen%20Active%20Joggers', description: 'Performance joggers for sports or gaming. Zippered ankle cuffs.' },
  { id: 835, name: 'Teen Urban Cargos', category: 'Fashion', subCategory: 'Boys', type: 'Pants', price: 39.99, series: 'Night Mode', sizes: ['10Y', '12Y', '14Y', '16Y'], image: 'https://placehold.co/800x800/050505/e0e0e0?text=Teen%20Urban%20Cargos', description: 'Slim fit cargos with plenty of pockets. Rugged construction.' },
  { id: 836, name: 'Teen Formal Trousers', category: 'Fashion', subCategory: 'Boys', type: 'Pants', price: 39.99, series: 'Optimizer', sizes: ['10Y', '12Y', '14Y', '16Y'], image: 'https://placehold.co/800x800/050505/00ffff?text=Teen%20Formal%20Trousers', description: 'Smart trousers for special occasions. Adjustable waist.' },
  { id: 837, name: 'Teen Sport Socks', category: 'Fashion', subCategory: 'Boys', type: 'Socks', price: 9.99, series: 'Guardian', sizes: ['One Size'], image: 'https://placehold.co/800x800/050505/bf00ff?text=Teen%20Sport%20Socks', description: '3-pack of athletic socks. Moisture-wicking technology.' },

  // Expanded Fashion - Little Girls
  { id: 840, name: 'Little Sparkle Hoodie', category: 'Fashion', subCategory: 'Girls', type: 'Hoodies', price: 29.99, series: 'Optimizer', sizes: ['2Y', '3Y', '4Y', '5Y', '6Y', '7Y', '8Y'], image: 'https://placehold.co/800x800/050505/00ffff?text=Little%20Sparkle%20Hoodie', description: 'Zip-up hoodie with glitter thread. Soft and warm.' },
  { id: 841, name: 'Little Joy Jumper', category: 'Fashion', subCategory: 'Girls', type: 'Sweatshirts', price: 24.99, series: 'Guardian', sizes: ['2Y', '3Y', '4Y', '5Y', '6Y', '7Y', '8Y'], image: 'https://placehold.co/800x800/050505/bf00ff?text=Little%20Joy%20Jumper', description: 'Cute sweatshirt with happy robot graphic. Durable for play.' },
  { id: 842, name: 'Little Dream Tee', category: 'Fashion', subCategory: 'Girls', type: 'Tops', price: 19.99, series: 'Night Mode', sizes: ['2Y', '3Y', '4Y', '5Y', '6Y', '7Y', '8Y'], image: 'https://placehold.co/800x800/050505/e0e0e0?text=Little%20Dream%20Tee', description: 'Soft tee with dreamcatcher design. Tagless comfort.' },
  { id: 843, name: 'Little Heart Long Sleeve', category: 'Fashion', subCategory: 'Girls', type: 'Tops', price: 22.99, series: 'Optimizer', sizes: ['2Y', '3Y', '4Y', '5Y', '6Y', '7Y', '8Y'], image: 'https://placehold.co/800x800/050505/00ffff?text=Little%20Heart%20Long%20Sleeve', description: 'Long sleeve with heart elbow patches. Stretchy fabric.' },
  { id: 844, name: 'Little Play Joggers', category: 'Fashion', subCategory: 'Girls', type: 'Pants', price: 24.99, series: 'Guardian', sizes: ['2Y', '3Y', '4Y', '5Y', '6Y', '7Y', '8Y'], image: 'https://placehold.co/800x800/050505/bf00ff?text=Little%20Play%20Joggers', description: 'Comfy joggers for active play. Reinforced knees.' },
  { id: 845, name: 'Little Explorer Cargos', category: 'Fashion', subCategory: 'Girls', type: 'Pants', price: 29.99, series: 'Night Mode', sizes: ['2Y', '3Y', '4Y', '5Y', '6Y', '7Y', '8Y'], image: 'https://placehold.co/800x800/050505/e0e0e0?text=Little%20Explorer%20Cargos', description: 'Pink cargo pants with pockets for treasures. Adjustable waist.' },
  { id: 846, name: 'Little Soft Trousers', category: 'Fashion', subCategory: 'Girls', type: 'Pants', price: 29.99, series: 'Optimizer', sizes: ['2Y', '3Y', '4Y', '5Y', '6Y', '7Y', '8Y'], image: 'https://placehold.co/800x800/050505/00ffff?text=Little%20Soft%20Trousers', description: 'Soft leggings-style trousers. Fancy enough for parties.' },
  { id: 847, name: 'Little Fun Socks', category: 'Fashion', subCategory: 'Girls', type: 'Socks', price: 7.99, series: 'Guardian', sizes: ['One Size'], image: 'https://placehold.co/800x800/050505/bf00ff?text=Little%20Fun%20Socks', description: '3-pack of colorful socks. Non-slip soles.' },

  // Expanded Fashion - Little Boys
  { id: 850, name: 'Little Hero Hoodie', category: 'Fashion', subCategory: 'Boys', type: 'Hoodies', price: 29.99, series: 'Guardian', sizes: ['2Y', '3Y', '4Y', '5Y', '6Y', '7Y', '8Y'], image: 'https://placehold.co/800x800/050505/bf00ff?text=Little%20Hero%20Hoodie', description: 'Cape-style back detail. Super hero vibes.' },
  { id: 851, name: 'Little Dino Jumper', category: 'Fashion', subCategory: 'Boys', type: 'Sweatshirts', price: 24.99, series: 'Optimizer', sizes: ['2Y', '3Y', '4Y', '5Y', '6Y', '7Y', '8Y'], image: 'https://placehold.co/800x800/050505/00ffff?text=Little%20Dino%20Jumper', description: 'Tech-dino graphic. Warm and cozy.' },
  { id: 852, name: 'Little Rocket Tee', category: 'Fashion', subCategory: 'Boys', type: 'T-Shirts', price: 19.99, series: 'Night Mode', sizes: ['2Y', '3Y', '4Y', '5Y', '6Y', '7Y', '8Y'], image: 'https://placehold.co/800x800/050505/e0e0e0?text=Little%20Rocket%20Tee', description: 'Rocket ship print. Glow in the dark elements.' },
  { id: 853, name: 'Little Stripe Long Sleeve', category: 'Fashion', subCategory: 'Boys', type: 'T-Shirts', price: 22.99, series: 'Guardian', sizes: ['2Y', '3Y', '4Y', '5Y', '6Y', '7Y', '8Y'], image: 'https://placehold.co/800x800/050505/bf00ff?text=Little%20Stripe%20Long%20Sleeve', description: 'Classic striped long sleeve. Durable cotton.' },
  { id: 854, name: 'Little Zoom Joggers', category: 'Fashion', subCategory: 'Boys', type: 'Pants', price: 24.99, series: 'Optimizer', sizes: ['2Y', '3Y', '4Y', '5Y', '6Y', '7Y', '8Y'], image: 'https://placehold.co/800x800/050505/00ffff?text=Little%20Zoom%20Joggers', description: 'Speed stripes on the side. Elastic waist.' },
  { id: 855, name: 'Little Adventure Cargos', category: 'Fashion', subCategory: 'Boys', type: 'Pants', price: 29.99, series: 'Night Mode', sizes: ['2Y', '3Y', '4Y', '5Y', '6Y', '7Y', '8Y'], image: 'https://placehold.co/800x800/050505/e0e0e0?text=Little%20Adventure%20Cargos', description: 'Rugged cargos for outdoor play. Easy snap buttons.' },
  { id: 856, name: 'Little Smart Trousers', category: 'Fashion', subCategory: 'Boys', type: 'Pants', price: 29.99, series: 'Guardian', sizes: ['2Y', '3Y', '4Y', '5Y', '6Y', '7Y', '8Y'], image: 'https://placehold.co/800x800/050505/bf00ff?text=Little%20Smart%20Trousers', description: 'Chino style trousers for little gentlemen. Soft wash fabric.' },
  { id: 857, name: 'Little Stripe Socks', category: 'Fashion', subCategory: 'Boys', type: 'Socks', price: 7.99, series: 'Optimizer', sizes: ['One Size'], image: 'https://placehold.co/800x800/050505/00ffff?text=Little%20Stripe%20Socks', description: '3-pack of durable socks. Reinforced heel.' },
]

// Helper to return local asset path
const getMerchImage = (item) => {
  const slug = item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  return `/assets/merch/${slug}.jpg`;
}

// Enhance items with real images
const ENHANCED_MERCH_ITEMS = MERCH_ITEMS.map(item => ({
  ...item,
  image: getMerchImage(item)
}));

const SERIES = ['All', 'Guardian', 'Optimizer', 'Night Mode']

const Merch = () => {
  const [selectedCategory, setSelectedCategory] = useState(null) // Tier 1
  const [selectedSubCategory, setSelectedSubCategory] = useState(null) // Tier 2
  const [selectedType, setSelectedType] = useState(null) // Tier 3
  const [selectedSeries, setSelectedSeries] = useState('All')
  const [selectedSize, setSelectedSize] = useState(null)
  const [showFilters, setShowFilters] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  
  // Secret Admin Trigger
  const handleAdminTrigger = () => {
    setIsAdmin(prev => !prev)
  }

  // Reset child filters when parent changes - kept as backup, but state reset in handlers is preferred
  useEffect(() => {
    setSelectedSubCategory(null)
    setSelectedType(null)
    setSelectedSize(null)
  }, [selectedCategory])

  useEffect(() => {
    setSelectedType(null)
    setSelectedSize(null)
  }, [selectedSubCategory])

  const filteredItems = useMemo(() => {
    return ENHANCED_MERCH_ITEMS.filter(item => {
      // 1. Tier 1 Filter (Category)
      if (selectedCategory && item.category !== selectedCategory) return false
      
      // HIDE PRIVATE VAULT FROM "ALL" VIEW UNLESS ADMIN
      if (!isAdmin && item.category === 'Private: Gelato Vault') return false

      // 2. Tier 2 Filter (SubCategory)
      if (selectedSubCategory && item.subCategory !== selectedSubCategory) return false

      // 3. Tier 3 Filter (Type)
      if (selectedType && item.type !== selectedType) return false
      
      // 4. Series Filter
      if (selectedSeries !== 'All' && item.series !== selectedSeries) return false
      
      // 5. Size Filter
      if (selectedSize && (!item.sizes || !item.sizes.includes(selectedSize))) return false

      return true
    })
  }, [selectedCategory, selectedSubCategory, selectedType, selectedSeries, selectedSize, isAdmin])

  // Get available sizes based on current category selection
  const availableSizes = useMemo(() => {
    if (!selectedCategory || selectedCategory !== 'Fashion') return []
    
    const relevantItems = ENHANCED_MERCH_ITEMS.filter(item => {
      if (item.category !== 'Fashion') return false
      if (selectedSubCategory && item.subCategory !== selectedSubCategory) return false
      return true
    })

    const sizes = new Set()
    relevantItems.forEach(item => {
      if (item.sizes) {
        item.sizes.forEach(size => sizes.add(size))
      }
    })
    
    // Sort sizes logically? For now, alphanumeric sort might be enough, or custom sort.
    // Let's just convert to array and sort.
    return Array.from(sizes).sort((a, b) => {
      // Custom sort logic could go here, e.g. XS < S < M < L
      const order = ['0-3M', '3-6M', '6-9M', '9-12M', '12-18M', '18-24M', '2Y', '3Y', '4Y', '5Y', '6Y', '7Y', '8Y', '9-10Y', '11-12Y', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', 'One Size Fits All']
      const indexA = order.indexOf(a)
      const indexB = order.indexOf(b)
      
      if (indexA !== -1 && indexB !== -1) return indexA - indexB
      if (indexA !== -1) return -1
      if (indexB !== -1) return 1
      
      // For numeric sizes (24, 25, etc), sort numerically
      const numA = parseInt(a)
      const numB = parseInt(b)
      if (!isNaN(numA) && !isNaN(numB)) return numA - numB
      
      return a.localeCompare(b)
    })
  }, [selectedCategory, selectedSubCategory])

  return (
    <div className="pt-10 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-10 border-b border-white/10 pb-6">
          <div>
            <h1 
              onClick={handleAdminTrigger}
              className="text-4xl font-display font-bold text-white mb-2 cursor-pointer select-none"
              title="CoreLink Gear"
            >
              CoreLink Gear
            </h1>
            <p className="text-gray-400">Wear the future. Galaxy-grade fabrics and neon aesthetics.</p>
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden flex items-center gap-2 text-core-primary border border-core-primary/30 px-4 py-2 rounded"
          >
            <Filter size={18} /> Filters
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`md:w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden md:block'}`}>
            <div className="bg-core-surface p-6 rounded-xl border border-white/5 sticky top-24 space-y-8">
              
              {/* TIER 1: CATEGORY */}
              <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Department</h3>
                <div className="space-y-1">
                  <button 
                    onClick={() => {
                      setSelectedCategory(null)
                      setSelectedSubCategory(null)
                      setSelectedType(null)
                    }}
                    className={`block w-full text-left text-sm py-1.5 px-3 rounded transition-colors ${
                      !selectedCategory ? 'bg-white/10 text-white font-bold' : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    All Departments
                  </button>
                  {Object.keys(CATEGORY_HIERARCHY)
                    .filter(cat => isAdmin || cat !== 'Private: Gelato Vault')
                    .map(cat => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat)
                        setSelectedSubCategory(null)
                        setSelectedType(null)
                      }}
                      className={`flex justify-between items-center w-full text-left text-sm py-1.5 px-3 rounded transition-colors ${
                        selectedCategory === cat 
                          ? 'bg-core-primary/10 text-core-primary font-bold' 
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {cat}
                      {selectedCategory === cat && <ChevronRight size={14} />}
                    </button>
                  ))}
                </div>
              </div>

              {/* TIER 2: SUBCATEGORY (Contextual) */}
              <AnimatePresence>
                {selectedCategory && CATEGORY_HIERARCHY[selectedCategory] && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 pt-4 border-t border-white/10">Category</h3>
                    <div className="space-y-1">
                      <button 
                        onClick={() => setSelectedSubCategory(null)}
                        className={`block w-full text-left text-sm py-1.5 px-3 rounded transition-colors ${
                          !selectedSubCategory ? 'bg-white/10 text-white font-bold' : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        All {selectedCategory}
                      </button>
                      {Object.keys(CATEGORY_HIERARCHY[selectedCategory]).map(sub => (
                        <button
                          key={sub}
                          onClick={() => {
                            setSelectedSubCategory(sub)
                            setSelectedType(null)
                          }}
                          className={`flex justify-between items-center w-full text-left text-sm py-1.5 px-3 rounded transition-colors ${
                            selectedSubCategory === sub 
                              ? 'bg-core-secondary/10 text-core-secondary font-bold' 
                              : 'text-gray-400 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          {sub}
                          {selectedSubCategory === sub && <ChevronRight size={14} />}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* TIER 3: TYPE (Dynamic) */}
              <AnimatePresence>
                {selectedCategory && selectedSubCategory && CATEGORY_HIERARCHY[selectedCategory]?.[selectedSubCategory] && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 pt-4 border-t border-white/10">Item Type</h3>
                    <div className="space-y-1">
                      <button 
                        onClick={() => setSelectedType(null)}
                        className={`block w-full text-left text-sm py-1.5 px-3 rounded transition-colors ${
                          !selectedType ? 'bg-white/10 text-white font-bold' : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        All Types
                      </button>
                      {CATEGORY_HIERARCHY[selectedCategory][selectedSubCategory].map(type => (
                        <button
                          key={type}
                          onClick={() => setSelectedType(type)}
                          className={`block w-full text-left text-sm py-1.5 px-3 rounded transition-colors ${
                            selectedType === type
                              ? 'bg-core-accent/10 text-core-accent font-bold' 
                              : 'text-gray-400 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* SIZE FILTER (Fashion Only) */}
              <AnimatePresence>
                {selectedCategory === 'Fashion' && availableSizes.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-4 border-t border-white/10">
                      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Size</h3>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => setSelectedSize(null)}
                          className={`text-xs px-2 py-1 rounded border transition-colors ${
                            !selectedSize 
                              ? 'bg-white text-black border-white font-bold' 
                              : 'bg-transparent text-gray-400 border-white/20 hover:border-white/50'
                          }`}
                        >
                          All
                        </button>
                        {availableSizes.map(size => (
                          <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`text-xs px-2 py-1 rounded border transition-colors ${
                              selectedSize === size 
                                ? 'bg-core-primary text-black border-core-primary font-bold' 
                                : 'bg-transparent text-gray-400 border-white/20 hover:border-white/50'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* SERIES FILTER (Global) */}
              <div className="pt-4 border-t border-white/10">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Collection</h3>
                <div className="flex flex-wrap gap-2">
                  {SERIES.map(series => (
                    <button
                      key={series}
                      onClick={() => setSelectedSeries(series)}
                      className={`text-xs px-2 py-1 rounded border transition-colors ${
                        selectedSeries === series 
                          ? 'bg-white text-black border-white font-bold' 
                          : 'bg-transparent text-gray-400 border-white/20 hover:border-white/50'
                      }`}
                    >
                      {series}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-grow">
             {/* Active Filters Breadcrumb */}
            {(selectedCategory || selectedSeries !== 'All' || selectedSize) && (
               <div className="flex flex-wrap items-center gap-2 mb-6 text-sm text-gray-400">
                 <span>Filters:</span>
                 {selectedCategory && <span className="text-core-primary bg-core-primary/10 px-2 py-0.5 rounded">{selectedCategory}</span>}
                 {selectedSubCategory && <span className="text-core-secondary bg-core-secondary/10 px-2 py-0.5 rounded flex items-center gap-1"><ChevronRight size={12}/> {selectedSubCategory}</span>}
                 {selectedType && <span className="text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded flex items-center gap-1"><ChevronRight size={12}/> {selectedType}</span>}
                 {selectedSize && <span className="text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded flex items-center gap-1"><ChevronRight size={12}/> Size: {selectedSize}</span>}
                 {selectedSeries !== 'All' && <span className="text-white bg-white/10 px-2 py-0.5 rounded">{selectedSeries}</span>}
                 <button onClick={() => {setSelectedCategory(null); setSelectedSeries('All'); setSelectedSize(null);}} className="ml-auto text-xs underline hover:text-white">Clear All</button>
               </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode='popLayout'>
                {filteredItems.map((item) => (
                  <MerchCard 
                    key={item.id} 
                    item={item} 
                  />
                ))}
              </AnimatePresence>
            </div>
            {filteredItems.length === 0 && (
              <div className="text-center py-20 text-gray-500 bg-core-surface rounded-xl border border-white/5">
                <p className="text-lg mb-2">No items found matching your filters.</p>
                <button 
                  onClick={() => {setSelectedCategory(null); setSelectedSeries('All'); setSelectedSize(null);}}
                  className="text-core-primary hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

const MerchCard = forwardRef(({ item }, ref) => {
  const [imgSrc, setImgSrc] = useState(`/assets/merch/${slugify(item.name)}.jpg`)
  const [hasError, setHasError] = useState(false)
  const fileInputRef = useRef(null)

  // Load from DB on mount
  useEffect(() => {
    const loadSavedFile = async () => {
      try {
        const blob = await getFile(item.id)
        if (blob) {
          const url = URL.createObjectURL(blob)
          setImgSrc(url)
          setHasError(false)
        }
      } catch (err) {
        console.error('Failed to load file from DB', err)
      }
    }
    loadSavedFile()
  }, [item.id])

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setImgSrc(url)
      setHasError(false)
      
      // Save to DB
      try {
        await saveFile(item.id, file)
      } catch (err) {
        console.error('Failed to save file to DB', err)
      }
    }
  }

  // Ultra-reliable fallback (SVG Data URI) to ensure NO black screens ever
  const FALLBACK_SVG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 800 800'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%23050505'/%3E%3Cstop offset='100%25' stop-color='%231a1a1a'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23g)'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='24' font-weight='bold' fill='%2300ffff' opacity='0.5'%3ECORE LINK%3C/text%3E%3C/svg%3E`

  const handleError = () => {
    // OFFLINE MODE: Only fallback to SVG if local file fails. 
    // No external API calls allowed.
    if (!imgSrc.includes('data:image') && !imgSrc.startsWith('blob:')) {
       setImgSrc(FALLBACK_SVG)
    }
    else {
       setHasError(true)
    }
  }

  // Special rendering for Documentation items
  if (item.type === 'Documentation') {
    return (
      <motion.div
        ref={ref}
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        whileHover={{ y: -5 }}
        className="bg-core-surface group rounded-xl overflow-hidden border border-white/5 hover:border-core-primary/30 transition-all duration-300 flex flex-col relative"
      >
        <div className="aspect-square bg-core-bg relative flex items-center justify-center group-hover:bg-core-surface/50 transition-colors">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto bg-core-primary/10 rounded-xl flex items-center justify-center mb-4 text-core-primary border border-core-primary/20 group-hover:scale-110 transition-transform duration-300">
              <FileText size={40} />
            </div>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Document</span>
            {imgSrc.startsWith('blob:') && <span className="block text-[10px] text-green-400 mt-1">Custom File Loaded</span>}
          </div>

          {/* Download Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/60 backdrop-blur-sm z-20 gap-4">
             {/* Download Button */}
             <a 
               href={imgSrc.startsWith('blob:') ? imgSrc : "/assets/gelato-vault/placement-guides/GUIDE.md"} 
               download={imgSrc.startsWith('blob:') ? "CoreLink_Placement_Guide_Custom.docx" : "CoreLink_Placement_Guide.docx"}
               className="flex flex-col items-center gap-2 text-white hover:text-core-primary transition-colors cursor-pointer"
               title="Download File"
             >
                <div className="p-3 bg-core-primary text-black rounded-full hover:bg-white transition-colors">
                  <Download size={24} />
                </div>
                <span className="font-bold text-sm">Download</span>
             </a>

             {/* Upload Button */}
             <div 
               onClick={() => fileInputRef.current?.click()}
               className="flex flex-col items-center gap-2 text-white hover:text-core-primary transition-colors cursor-pointer"
               title="Upload New File"
             >
                <div className="p-3 bg-white/10 text-white rounded-full border border-white/20 hover:bg-white/20 transition-colors">
                  <Upload size={24} />
                </div>
                <span className="font-bold text-sm">Upload</span>
             </div>
          </div>
        </div>
        
        {/* Hidden File Input for Docs */}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept=".doc,.docx,.pdf,.md,.txt" 
          className="hidden" 
        />

        <div className="p-4 flex-grow flex flex-col">
          <h3 className="text-white font-bold mb-1 truncate">{item.name}</h3>
          {item.description && (
            <p className="text-gray-500 text-xs mb-3 line-clamp-2">{item.description}</p>
          )}
          <div className="flex justify-between items-center mt-auto">
            <span className="text-xs font-bold text-core-primary bg-core-primary/10 px-2 py-1 rounded">INTERNAL</span>
            <span className="text-xs text-gray-500">{item.subCategory}</span>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -5 }}
      className={`bg-core-surface group rounded-xl overflow-hidden border border-white/5 hover:border-core-primary/30 transition-all duration-300 flex flex-col relative`}
    >
      <div className="aspect-square bg-core-bg relative overflow-hidden transition-all group-hover:shadow-[0_0_20px_rgba(0,255,255,0.1)]">
        {!hasError ? (
          <img 
            src={imgSrc}
            alt={item.name}
            loading="lazy"
            decoding="async"
            onError={handleError}
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${
              ['Night Mode', 'Guardian'].includes(item.series) ? 'brightness-125' : ''
            }`}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-core-bg to-core-surface flex items-center justify-center text-gray-700 flex-col group-hover:bg-core-surface/80 transition-colors">
            <span className="text-xs uppercase tracking-widest text-core-primary/50 font-bold">No Image</span>
          </div>
        )}
        
        {/* Series Badge */}
        <div className="absolute top-3 left-3 px-2 py-1 bg-black/60 backdrop-blur rounded text-[10px] uppercase font-bold text-white border border-white/10 z-10 pointer-events-none">
          {item.series}
        </div>

        {/* Drag/Upload Indicator (Clickable) */}
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer z-20 bg-black/40 hover:bg-black/50"
          title="Click to upload image"
        >
           <div className="bg-black/50 p-3 rounded-full border border-white/20 backdrop-blur-sm transform hover:scale-110 transition-transform">
              <Upload className="w-6 h-6 text-white" />
           </div>
        </div>

        {/* Hidden File Input */}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          className="hidden" 
        />

        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300 pointer-events-none" />
      </div>
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="text-white font-bold mb-1 truncate">{item.name}</h3>
        {item.description && (
          <p className="text-gray-500 text-xs mb-3 line-clamp-2">{item.description}</p>
        )}
        <div className="flex justify-between items-center mt-auto">
          <p className="text-gray-400 text-sm">£{item.price}</p>
          <span className="text-xs text-core-primary/70">{item.subCategory}</span>
        </div>
      </div>
    </motion.div>
  )
})

MerchCard.displayName = 'MerchCard'

export default Merch
