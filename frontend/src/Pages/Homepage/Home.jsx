// frontend/src/Pages/Homepage/Home.jsx
// Bold dark theme — full drop-in replacement

import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Grid,
  GridItem,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Image,
  Badge,
  Divider,
  AspectRatio,
  SimpleGrid,
  Container,
  Stack,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../../redux/productReducer/action";

// ─── Global dark styles injected once ────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

    :root {
      --c-bg: #0a0a0a;
      --c-surface: #111111;
      --c-card: #161616;
      --c-border: rgba(255,255,255,0.07);
      --c-gold: #C9A84C;
      --c-gold-dim: rgba(201,168,76,0.15);
      --c-white: #f5f5f0;
      --c-muted: rgba(245,245,240,0.45);
      --c-dim: rgba(245,245,240,0.15);
    }

    .cv-page { background: var(--c-bg); color: var(--c-white); }

    /* ── Hero ── */
    .hero-wrap {
      min-height: 100vh;
      background: var(--c-bg);
      position: relative;
      overflow: hidden;
      display: flex;
      align-items: center;
    }
    .hero-noise {
      position: absolute; inset: 0;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
      background-size: 200px 200px;
      pointer-events: none; z-index: 1;
    }
    .hero-grid-line {
      position: absolute; top: 0; bottom: 0; width: 1px;
      background: var(--c-border);
    }
    .hero-accent-circle {
      position: absolute;
      border-radius: 50%;
      border: 1px solid var(--c-gold);
      opacity: 0.12;
      pointer-events: none;
    }

    .hero-title {
      font-family: 'Bebas Neue', sans-serif;
      font-size: clamp(72px, 12vw, 160px);
      line-height: 0.92;
      letter-spacing: 0.01em;
      color: var(--c-white);
    }
    .hero-title .gold { color: var(--c-gold); }
    .hero-title .stroke {
      -webkit-text-stroke: 1px var(--c-white);
      color: transparent;
    }
    .hero-title .stroke-gold {
      -webkit-text-stroke: 1px var(--c-gold);
      color: transparent;
    }

    .hero-sub {
      font-family: 'DM Sans', sans-serif;
      font-size: 13px;
      letter-spacing: 0.08em;
      color: var(--c-muted);
      line-height: 1.9;
      font-weight: 300;
      max-width: 380px;
    }

    .hero-img-wrap {
      position: relative;
    }
    .hero-img-frame {
      position: absolute;
      top: -16px; right: -16px;
      bottom: 16px; left: 16px;
      border: 1px solid var(--c-gold);
      opacity: 0.3;
      pointer-events: none;
      z-index: 0;
    }

    .hero-tag {
      position: absolute;
      background: var(--c-gold);
      color: #0a0a0a;
      font-family: 'DM Sans', sans-serif;
      font-size: 10px;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      font-weight: 500;
      padding: 10px 18px;
    }
    .hero-price-tag {
      position: absolute;
      bottom: -1px; left: -1px;
      background: var(--c-bg);
      border: 1px solid var(--c-border);
      padding: 16px 24px;
      font-family: 'Cormorant Garamond', serif;
    }

    /* ── Marquee ── */
    .marquee-track {
      display: flex; gap: 0; overflow: hidden;
      border-top: 1px solid var(--c-border);
      border-bottom: 1px solid var(--c-border);
      background: var(--c-surface);
    }
    .marquee-inner {
      display: flex; gap: 0;
      animation: marqueeScroll 22s linear infinite;
      white-space: nowrap;
    }
    @keyframes marqueeScroll {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    .marquee-item {
      display: inline-flex; align-items: center; gap: 20px;
      padding: 14px 32px;
      font-family: 'DM Sans', sans-serif;
      font-size: 11px;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      color: var(--c-muted);
      border-right: 1px solid var(--c-border);
      flex-shrink: 0;
    }
    .marquee-dot { width: 4px; height: 4px; background: var(--c-gold); border-radius: 50%; flex-shrink: 0; }

    /* ── Buttons ── */
    .btn-primary {
      display: inline-flex; align-items: center; gap: 10px;
      background: var(--c-gold);
      color: #0a0a0a;
      font-family: 'DM Sans', sans-serif;
      font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; font-weight: 500;
      padding: 16px 32px;
      border: none; cursor: pointer;
      text-decoration: none;
      transition: background 0.2s, color 0.2s;
    }
    .btn-primary:hover { background: var(--c-white); }

    .btn-ghost {
      display: inline-flex; align-items: center; gap: 10px;
      background: transparent;
      color: var(--c-white);
      font-family: 'DM Sans', sans-serif;
      font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; font-weight: 400;
      padding: 15px 32px;
      border: 1px solid var(--c-border); cursor: pointer;
      text-decoration: none;
      transition: border-color 0.2s, color 0.2s;
    }
    .btn-ghost:hover { border-color: var(--c-white); }

    /* ── Section labels ── */
    .section-label {
      font-family: 'DM Sans', sans-serif;
      font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase;
      color: var(--c-gold);
      display: flex; align-items: center; gap: 12px;
    }
    .section-label::before {
      content: ''; display: block;
      width: 32px; height: 1px; background: var(--c-gold);
    }

    .section-heading {
      font-family: 'Bebas Neue', sans-serif;
      letter-spacing: 0.02em;
      color: var(--c-white);
      line-height: 1;
    }

    /* ── Category grid ── */
    .cat-card {
      position: relative; overflow: hidden; cursor: pointer;
      background: var(--c-card);
    }
    .cat-card img { transition: transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94); display: block; }
    .cat-card:hover img { transform: scale(1.06); }
    .cat-card-overlay {
      position: absolute; inset: 0;
      background: linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 60%, transparent 100%);
      transition: background 0.4s;
    }
    .cat-card:hover .cat-card-overlay {
      background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%, transparent 100%);
    }
    .cat-card-content {
      position: absolute; bottom: 0; left: 0; right: 0; padding: 24px;
    }
    .cat-card-arrow {
      position: absolute; top: 16px; right: 16px;
      width: 32px; height: 32px;
      background: var(--c-gold);
      display: flex; align-items: center; justify-content: center;
      font-size: 14px; color: #0a0a0a;
      opacity: 0; transform: translateY(-6px);
      transition: opacity 0.3s, transform 0.3s;
    }
    .cat-card:hover .cat-card-arrow { opacity: 1; transform: translateY(0); }

    /* ── Product card ── */
    .prod-card { cursor: pointer; }
    .prod-card-img-wrap {
      position: relative; overflow: hidden;
      background: var(--c-card);
    }
    .prod-card-img-wrap img { transition: transform 0.5s ease; display: block; }
    .prod-card:hover .prod-card-img-wrap img { transform: scale(1.05); }
    .prod-card-cta {
      position: absolute; bottom: 0; left: 0; right: 0;
      background: rgba(10,10,10,0.92);
      padding: 12px;
      text-align: center;
      transform: translateY(100%);
      transition: transform 0.3s ease;
      border-top: 1px solid var(--c-gold);
    }
    .prod-card:hover .prod-card-cta { transform: translateY(0); }

    /* ── USP ── */
    .usp-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      border-top: 1px solid var(--c-border);
      border-left: 1px solid var(--c-border);
    }
    @media (max-width: 768px) {
      .usp-grid { grid-template-columns: repeat(2, 1fr); }
    }
    .usp-cell {
      border-right: 1px solid var(--c-border);
      border-bottom: 1px solid var(--c-border);
      padding: 40px 32px;
    }
    .usp-icon {
      font-size: 28px; margin-bottom: 20px;
      color: var(--c-gold); display: block;
    }

    /* ── Editorial ── */
    .editorial-card {
      position: relative; overflow: hidden; cursor: pointer;
    }
    .editorial-card img { transition: transform 0.7s ease; display: block; width: 100%; height: 100%; object-fit: cover; }
    .editorial-card:hover img { transform: scale(1.04); }
    .editorial-overlay {
      position: absolute; inset: 0;
      background: linear-gradient(160deg, transparent 30%, rgba(0,0,0,0.6) 100%);
    }

    /* ── Testimonials ── */
    .review-card {
      background: var(--c-card);
      border: 1px solid var(--c-border);
      padding: 36px;
      position: relative;
    }
    .review-card::before {
      content: '"';
      position: absolute; top: 24px; right: 28px;
      font-family: 'Cormorant Garamond', serif;
      font-size: 80px; line-height: 1;
      color: var(--c-gold); opacity: 0.2;
    }

    /* ── Footer ── */
    .footer-bg { background: #050505; border-top: 1px solid var(--c-border); }

    /* ── Scroll line ── */
    .scroll-hint {
      position: absolute; bottom: 32px; left: 50%;
      transform: translateX(-50%);
      display: flex; flex-direction: column; align-items: center; gap: 8px;
      opacity: 0.3;
    }
    .scroll-line {
      width: 1px; height: 48px; background: var(--c-gold);
      animation: scrollPulse 2s ease-in-out infinite;
    }
    @keyframes scrollPulse {
      0%, 100% { transform: scaleY(1); opacity: 1; }
      50% { transform: scaleY(0.5); opacity: 0.4; }
    }
  `}</style>
);

// ─── Hero ─────────────────────────────────────────────────────────────────────
const HeroSection = () => (
  <div className="hero-wrap">
    <GlobalStyles />
    <div className="hero-noise" />

    {/* Vertical grid lines */}
    {[25, 50, 75].map(pct => (
      <div key={pct} className="hero-grid-line" style={{ left: `${pct}%` }} />
    ))}

    {/* Accent circles */}
    <div className="hero-accent-circle" style={{ width: 500, height: 500, top: '-200px', right: '-150px' }} />
    <div className="hero-accent-circle" style={{ width: 200, height: 200, bottom: '10%', left: '5%' }} />

    <div style={{ position: 'relative', zIndex: 2, width: '100%', padding: '0 48px', maxWidth: 1400, margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center', minHeight: '100vh', paddingTop: 80 }}>

        {/* Left */}
        <div>
          <div className="section-label" style={{ marginBottom: 28 }}>New Collection 2026</div>

          <div className="hero-title" style={{ marginBottom: 32 }}>
            <div>SEE THE</div>
            <div className="gold">WORLD</div>
            <div className="stroke-gold">CLEARLY</div>
          </div>

          <p className="hero-sub" style={{ marginBottom: 40 }}>
            Premium eyewear crafted for those who appreciate the intersection of precision and beauty. Every frame, a statement.
          </p>

          <div style={{ display: 'flex', gap: 12 }}>
            <a href="/eyeglasses" className="btn-primary">Shop Now →</a>
            <a href="/eyeglasses" className="btn-ghost">Browse All</a>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 0, marginTop: 56, borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 32 }}>
            {[
              { val: '5K+', label: 'Frame Styles' },
              { val: 'Free', label: 'Home Trial' },
              { val: '1 Yr', label: 'Warranty' },
              { val: '24hr', label: 'Delivery' },
            ].map((s, i) => (
              <div key={s.label} style={{ flex: 1, paddingRight: 24, borderRight: i < 3 ? '1px solid rgba(255,255,255,0.07)' : 'none', marginRight: i < 3 ? 24 : 0 }}>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, color: 'var(--c-gold)', lineHeight: 1, marginBottom: 4 }}>{s.val}</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--c-muted)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — image */}
        <div className="hero-img-wrap" style={{ position: 'relative', zIndex: 1 }}>
          <div className="hero-img-frame" />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <AspectRatio ratio={4/5} style={{ overflow: 'hidden' }}>
              <Box bg="var(--c-card)" overflow="hidden">
                <Image
                  src="https://images.unsplash.com/photo-1508296695146-257a814070b4?w=800&q=90"
                  alt="Premium eyewear"
                  objectFit="cover"
                  w="full" h="full"
                  filter="brightness(0.85) contrast(1.1)"
                  fallback={<Box w="full" h="full" bg="var(--c-card)" display="flex" alignItems="center" justifyContent="center"><Text color="var(--c-muted)" fontSize="xs" letterSpacing="0.2em">EYEWEAR</Text></Box>}
                />
              </Box>
            </AspectRatio>

            <div className="hero-tag" style={{ top: 24, left: 24 }}>Try at Home — Free</div>
            <div className="hero-price-tag">
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--c-muted)', marginBottom: 4 }}>Starting from</div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 40, color: 'var(--c-gold)', lineHeight: 1 }}>₹999</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="scroll-hint">
      <div className="scroll-line" />
      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--c-muted)' }}>Scroll</span>
    </div>
  </div>
);

// ─── Marquee ticker ───────────────────────────────────────────────────────────
const items = ['Premium Frames', 'Free Home Trial', 'Anti-Glare Lenses', 'UV400 Protection', '5-Star Reviews', 'Same Day Dispatch', '1 Year Warranty', 'Virtual Try-On'];

const MarqueeTicker = () => (
  <div className="marquee-track" style={{ padding: '0' }}>
    <div className="marquee-inner">
      {[...items, ...items].map((item, i) => (
        <div className="marquee-item" key={i}>
          <div className="marquee-dot" />
          {item}
        </div>
      ))}
    </div>
  </div>
);

// ─── Category Grid ────────────────────────────────────────────────────────────
const cats = [
  { label: 'Eyeglasses', sub: '1,200+ styles', path: '/eyeglasses', img: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=600&q=80' },
  { label: 'Sunglasses', sub: 'Premium UV', path: '/eyeglasses', img: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&q=80' },
  { label: 'Computer', sub: 'Blue light block', path: '/eyeglasses', img: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=600&q=80' },
  { label: 'Contact Lenses', sub: 'Daily & monthly', path: '/eyeglasses', img: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=600&q=80' },
];

const CategoryGrid = () => (
  <Box py={{ base: '16', md: '24' }} bg="var(--c-surface)">
    <Box maxW="1400px" mx="auto" px={{ base: '6', md: '12' }}>
      <Flex justify="space-between" align="flex-end" mb="12">
        <VStack align="flex-start" spacing="3">
          <div className="section-label">Collections</div>
          <div className="section-heading" style={{ fontSize: 'clamp(40px, 5vw, 64px)' }}>Shop By Category</div>
        </VStack>
        <a href="/eyeglasses" className="btn-ghost" style={{ display: 'none' }}>View All →</a>
      </Flex>

      <Grid templateColumns={{ base: '1fr 1fr', lg: 'repeat(4, 1fr)' }} gap="2">
        {cats.map((cat) => (
          <RouterLink key={cat.path + cat.label} to={cat.path}>
            <div className="cat-card">
              <AspectRatio ratio={3/4}>
                <Box overflow="hidden" position="relative">
                  <Image src={cat.img} alt={cat.label} objectFit="cover" w="full" h="full"
                    fallback={<Box w="full" h="full" bg="var(--c-card)" />} />
                  <div className="cat-card-overlay" />
                  <div className="cat-card-content">
                    <Text fontFamily="'Bebas Neue', sans-serif" fontSize={{ base: 'xl', md: '2xl' }} color="white" letterSpacing="0.04em" lineHeight="1" mb="1">{cat.label}</Text>
                    <Text fontFamily="'DM Sans', sans-serif" fontSize="10px" color="rgba(255,255,255,0.5)" letterSpacing="0.2em" textTransform="uppercase">{cat.sub}</Text>
                  </div>
                  <div className="cat-card-arrow">→</div>
                </Box>
              </AspectRatio>
            </div>
          </RouterLink>
        ))}
      </Grid>
    </Box>
  </Box>
);

// ─── Product Card ─────────────────────────────────────────────────────────────
const ProductCard = ({ product }) => {
  const name = product?.name || product?.productName || 'Eyewear Frame';
  const price = product?.price || product?.productPrice || 0;
  const image = product?.image || product?.productImage || product?.images?.[0];
  const id = product?._id || product?.id;

  return (
    <RouterLink to={`/eyeglasses/${id}`}>
      <div className="prod-card">
        <div className="prod-card-img-wrap" style={{ marginBottom: 12 }}>
          <AspectRatio ratio={1}>
            <Box overflow="hidden" position="relative">
              <Image src={image} alt={name} objectFit="cover" w="full" h="full"
                fallback={<Box w="full" h="full" bg="var(--c-card)" display="flex" alignItems="center" justifyContent="center"><Text fontSize="xs" color="var(--c-muted)" letterSpacing="0.15em">EYEWEAR</Text></Box>} />
              <div className="prod-card-cta">
                <Text fontFamily="'DM Sans', sans-serif" fontSize="10px" letterSpacing="0.2em" textTransform="uppercase" color="var(--c-gold)">View Details</Text>
              </div>
            </Box>
          </AspectRatio>
        </div>
        <div style={{ padding: '0 4px' }}>
          <Text fontFamily="'DM Sans', sans-serif" fontSize="13px" color="var(--c-white)" mb="1" noOfLines={1}>{name}</Text>
          <Text fontFamily="'Bebas Neue', sans-serif" fontSize="20px" color="var(--c-gold)" letterSpacing="0.04em">₹{price?.toLocaleString?.() || price}</Text>
        </div>
      </div>
    </RouterLink>
  );
};

// ─── Featured Products ────────────────────────────────────────────────────────
const FeaturedProducts = ({ products = [] }) => (
  <Box py={{ base: '16', md: '24' }} bg="var(--c-bg)">
    <Box maxW="1400px" mx="auto" px={{ base: '6', md: '12' }}>
      <Flex justify="space-between" align="flex-end" mb="12">
        <VStack align="flex-start" spacing="3">
          <div className="section-label">Handpicked</div>
          <div className="section-heading" style={{ fontSize: 'clamp(40px, 5vw, 64px)' }}>Featured Frames</div>
        </VStack>
        <RouterLink to="/eyeglasses" className="btn-ghost">All Frames →</RouterLink>
      </Flex>

      {products.length > 0 ? (
        <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={{ base: '4', md: '6' }}>
          {products.slice(0, 8).map((p) => <ProductCard key={p._id || p.id} product={p} />)}
        </SimpleGrid>
      ) : (
        <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={{ base: '4', md: '6' }}>
          {Array(8).fill(null).map((_, i) => (
            <Box key={i}>
              <AspectRatio ratio={1} mb="3"><Box bg="var(--c-card)" /></AspectRatio>
              <Box h="3" bg="var(--c-card)" mb="2" w="60%" />
              <Box h="4" bg="var(--c-card)" w="35%" />
            </Box>
          ))}
        </SimpleGrid>
      )}
    </Box>
  </Box>
);

// ─── USP strip ────────────────────────────────────────────────────────────────
const usps = [
  { icon: '◈', title: 'Premium Lenses', desc: 'Anti-glare, UV protection & blue light blocking built-in on every lens.' },
  { icon: '⊙', title: 'Virtual Try-On', desc: 'See how any frame looks on your face before buying.' },
  { icon: '◇', title: 'Home Trial', desc: 'Order 5 frames. Try free at home. Keep only what you love.' },
  { icon: '◉', title: 'Free Eye Test', desc: 'Complimentary checkup at 1000+ partner stores across India.' },
];

const USPStrip = () => (
  <Box bg="var(--c-surface)">
    <Box maxW="1400px" mx="auto" px={{ base: '6', md: '12' }} py={{ base: '14', md: '20' }}>
      <div className="usp-grid">
        {usps.map((u) => (
          <div key={u.title} className="usp-cell">
            <span className="usp-icon">{u.icon}</span>
            <Text fontFamily="'Bebas Neue', sans-serif" fontSize="22px" color="var(--c-white)" letterSpacing="0.04em" mb="2">{u.title}</Text>
            <Text fontFamily="'DM Sans', sans-serif" fontSize="12px" color="var(--c-muted)" lineHeight="1.8" fontWeight="300">{u.desc}</Text>
          </div>
        ))}
      </div>
    </Box>
  </Box>
);

// ─── Editorial ────────────────────────────────────────────────────────────────
const EditorialBanner = () => (
  <Box py={{ base: '16', md: '24' }} bg="var(--c-bg)">
    <Box maxW="1400px" mx="auto" px={{ base: '6', md: '12' }}>
      <div className="section-label" style={{ marginBottom: 32 }}>Editorial</div>
      <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap="2">
        <RouterLink to="/eyeglasses">
          <div className="editorial-card" style={{ height: '100%', minHeight: 480 }}>
            <Image src="https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=900&q=80" alt="Sunglasses" objectFit="cover" w="full" h="full" style={{ position: 'absolute', inset: 0 }}
              fallback={<Box w="full" h="full" bg="var(--c-card)" />} />
            <div className="editorial-overlay" />
            <Box position="absolute" bottom="10" left="10">
              <Badge bg="var(--c-gold)" color="#0a0a0a" fontSize="9px" letterSpacing="0.2em" mb="4" px="3" py="1.5">New Arrivals</Badge>
              <Text fontFamily="'Bebas Neue', sans-serif" fontSize={{ base: '3xl', md: '5xl' }} color="white" lineHeight="0.95" letterSpacing="0.02em" mb="6">
                SUMMER<br />SUNGLASSES '26
              </Text>
              <div className="btn-ghost" style={{ display: 'inline-flex', fontSize: 10 }}>Shop Now →</div>
            </Box>
          </div>
        </RouterLink>

        <VStack spacing="2">
          {[
            { label: "Kids Collection", img: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=900&q=80" },
            { label: "Contact Lenses", img: "https://images.unsplash.com/photo-1508296695146-257a814070b4?w=900&q=80" },
          ].map((item) => (
            <RouterLink key={item.label} to="/eyeglasses" style={{ width: '100%' }}>
              <div className="editorial-card" style={{ height: 236 }}>
                <Image src={item.img} alt={item.label} objectFit="cover" w="full" h="full" style={{ position: 'absolute', inset: 0 }}
                  fallback={<Box w="full" h="full" bg="var(--c-card)" />} />
                <div className="editorial-overlay" />
                <Flex position="absolute" bottom="6" left="6" right="6" justify="space-between" align="center">
                  <Text fontFamily="'Bebas Neue', sans-serif" fontSize="2xl" color="white" letterSpacing="0.04em">{item.label}</Text>
                  <Text color="var(--c-gold)" fontSize="lg">→</Text>
                </Flex>
              </div>
            </RouterLink>
          ))}
        </VStack>
      </Grid>
    </Box>
  </Box>
);

// ─── Testimonials ─────────────────────────────────────────────────────────────
const reviews = [
  { name: 'Priya S.', rating: 5, text: 'The frames are absolutely stunning. Quality rivals luxury brands at a fraction of the price.', location: 'Mumbai' },
  { name: 'Rahul M.', rating: 5, text: 'Home trial changed everything. I found my perfect pair without leaving the house.', location: 'Bengaluru' },
  { name: 'Aisha K.', rating: 5, text: 'Prescription was perfect, delivery was fast, and the packaging felt genuinely premium.', location: 'Delhi' },
];

const Testimonials = () => (
  <Box py={{ base: '16', md: '24' }} bg="var(--c-surface)">
    <Box maxW="1400px" mx="auto" px={{ base: '6', md: '12' }}>
      <VStack spacing="12">
        <VStack spacing="3" textAlign="center">
          <div className="section-label" style={{ justifyContent: 'center' }}>Reviews</div>
          <div className="section-heading" style={{ fontSize: 'clamp(36px, 5vw, 56px)', textAlign: 'center' }}>What Our Customers Say</div>
        </VStack>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing="4" w="full">
          {reviews.map((r) => (
            <div key={r.name} className="review-card">
              <HStack mb="4" spacing="1">
                {Array(r.rating).fill(null).map((_, i) => <Text key={i} color="var(--c-gold)" fontSize="xs">★</Text>)}
              </HStack>
              <Text fontFamily="'Cormorant Garamond', serif" fontSize="lg" color="var(--c-white)" fontStyle="italic" lineHeight="1.8" mb="6" fontWeight="300">
                "{r.text}"
              </Text>
              <Divider borderColor="var(--c-border)" mb="4" />
              <Flex justify="space-between" align="center">
                <Text fontFamily="'DM Sans', sans-serif" fontSize="sm" color="var(--c-white)" fontWeight="500">{r.name}</Text>
                <Text fontFamily="'DM Sans', sans-serif" fontSize="10px" color="var(--c-muted)" letterSpacing="0.15em" textTransform="uppercase">{r.location}</Text>
              </Flex>
            </div>
          ))}
        </SimpleGrid>
      </VStack>
    </Box>
  </Box>
);

// ─── Footer ────────────────────────────────────────────────────────────────────
const footerCols = [
  {
    title: 'Shop',
    links: [
      { label: 'Eyeglasses', to: '/eyeglasses' },
      { label: 'Sunglasses', to: '/eyeglasses' },
      { label: 'Computer Glasses', to: '/eyeglasses' },
      { label: 'Contact Lenses', to: '/eyeglasses' },
      { label: 'Kids', to: '/eyeglasses' },
    ],
  },
  {
    title: 'Services',
    links: [
      { label: 'Home Trial', to: '/eyeglasses' },
      { label: 'Virtual Try-On', to: '/eyeglasses' },
      { label: 'Eye Checkup', to: '/eyeglasses' },
      { label: 'Corporate Orders', to: '/eyeglasses' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Track Order', to: '/myorders' },
      { label: 'Returns', to: '/myorders' },
      { label: 'FAQ', to: '/' },
      { label: 'Contact Us', to: '/' },
      { label: 'Stores', to: '/' },
    ],
  },
];

const Footer = () => (
  <Box className="footer-bg" pt={{ base: '14', md: '20' }} pb="8">
    <Box maxW="1400px" mx="auto" px={{ base: '6', md: '12' }}>
      <Grid templateColumns={{ base: '1fr 1fr', md: '2fr 1fr 1fr 1fr' }} gap="8" mb="16">
        <GridItem colSpan={{ base: 2, md: 1 }}>
          <Text fontFamily="'Bebas Neue', sans-serif" fontSize="3xl" letterSpacing="0.06em" mb="4">
            CLEAR <Text as="span" color="var(--c-gold)">VISION</Text>
          </Text>
          <Text fontFamily="'DM Sans', sans-serif" fontSize="12px" color="var(--c-muted)" maxW="260px" lineHeight="1.9" fontWeight="300" mb="6">
            Premium eyewear for the discerning. Crafted with precision, worn with confidence.
          </Text>
          <HStack spacing="5">
            {['IG', 'TW', 'FB'].map((s) => (
              <Text key={s} fontFamily="'DM Sans', sans-serif" fontSize="10px" color="var(--c-muted)" letterSpacing="0.15em" cursor="pointer" _hover={{ color: 'var(--c-gold)' }} transition="color 0.2s">{s}</Text>
            ))}
          </HStack>
        </GridItem>

        {footerCols.map((col) => (
          <GridItem key={col.title}>
            <Text fontFamily="'DM Sans', sans-serif" fontSize="10px" letterSpacing="0.25em" textTransform="uppercase" color="var(--c-gold)" mb="5" fontWeight="500">{col.title}</Text>
            <VStack align="flex-start" spacing="3">
              {col.links.map((link) => (
                <RouterLink key={link.label} to={link.to}>
                  <Text fontFamily="'DM Sans', sans-serif" fontSize="13px" color="var(--c-muted)" fontWeight="300" _hover={{ color: 'var(--c-white)' }} transition="color 0.2s">
                    {link.label}
                  </Text>
                </RouterLink>
              ))}
            </VStack>
          </GridItem>
        ))}
      </Grid>
      <Divider borderColor="var(--c-border)" mb="8" />
      <Flex justify="space-between" align="center" flexDir={{ base: 'column', md: 'row' }} gap="4">
        <Text fontFamily="'DM Sans', sans-serif" fontSize="10px" color="var(--c-dim)" letterSpacing="0.1em">© 2026 CLEAR VISION. ALL RIGHTS RESERVED.</Text>
        <HStack spacing="6">
          {['Privacy', 'Terms', 'Cookies'].map((item) => (
            <Text key={item} fontFamily="'DM Sans', sans-serif" fontSize="10px" color="var(--c-dim)" cursor="pointer" _hover={{ color: 'var(--c-white)' }} letterSpacing="0.08em">{item}</Text>
          ))}
        </HStack>
      </Flex>
    </Box>
  </Box>
);

// ─── Main ─────────────────────────────────────────────────────────────────────
const Home = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.productReducer?.products || []);

  useEffect(() => { dispatch(getProducts()); }, [dispatch]);

  return (
    <Box className="cv-page">
      <HeroSection />
      <MarqueeTicker />
      <CategoryGrid />
      <FeaturedProducts products={products} />
      <USPStrip />
      <EditorialBanner />
      <Testimonials />
      <Footer />
    </Box>
  );
};

export default Home;
