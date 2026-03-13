import React, { useState, useEffect } from "react";
import {
  Box, Grid, GridItem, Flex, VStack, HStack, Heading, Text,
  Image, Divider, SimpleGrid, AspectRatio, IconButton,
  Container, useToast,
} from "@chakra-ui/react";
import { Link as RouterLink, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/cartReducer/action";

const darkStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');
  .pd-page { background: #0a0a0a; min-height: 100vh; color: #f5f5f0; }

  /* breadcrumb */
  .pd-breadcrumb { display: flex; align-items: center; gap: 8px; }
  .pd-breadcrumb a, .pd-breadcrumb span {
    font-family: 'DM Sans', sans-serif; font-size: 11px;
    letter-spacing: 0.12em; text-transform: uppercase;
    color: rgba(245,245,240,0.35); text-decoration: none;
    transition: color 0.2s;
  }
  .pd-breadcrumb a:hover { color: #f5f5f0; }
  .pd-breadcrumb .sep { color: rgba(255,255,255,0.15); }
  .pd-breadcrumb .current { color: rgba(245,245,240,0.7); }

  /* tabs */
  .pd-tabs { display: flex; gap: 0; border-bottom: 1px solid rgba(255,255,255,0.07); margin-bottom: 32px; }
  .pd-tab {
    font-family: 'DM Sans', sans-serif; font-size: 10px; letter-spacing: 0.25em;
    text-transform: uppercase; color: rgba(245,245,240,0.3);
    padding: 14px 0; margin-right: 36px; background: transparent; border: none;
    cursor: pointer; transition: color 0.2s; position: relative;
  }
  .pd-tab.active { color: #f5f5f0; }
  .pd-tab.active::after {
    content: ''; position: absolute; bottom: -1px; left: 0; right: 0;
    height: 1.5px; background: #C9A84C;
  }

  /* lens selector */
  .lens-card {
    border: 1px solid rgba(255,255,255,0.07); padding: 14px 16px;
    cursor: pointer; transition: all 0.2s; background: transparent;
  }
  .lens-card.selected { border-color: #C9A84C; background: rgba(201,168,76,0.06); }
  .lens-card:hover { border-color: rgba(201,168,76,0.4); }

  /* spec table */
  .spec-row { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border-bottom: 1px solid rgba(255,255,255,0.05); }
  .spec-row:nth-child(odd) { background: rgba(255,255,255,0.02); }

  /* related card */
  .rel-card { cursor: pointer; }
  .rel-card-img { overflow: hidden; background: #161616; margin-bottom: 10px; }
  .rel-card-img img { transition: transform 0.5s ease; display: block; }
  .rel-card:hover .rel-card-img img { transform: scale(1.05); }

  /* wishlist btn */
  .action-btn {
    flex: 1; padding: 14px 20px; background: transparent;
    border: 1px solid rgba(255,255,255,0.12);
    color: #f5f5f0; font-family: 'DM Sans', sans-serif;
    font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase;
    cursor: pointer; transition: border-color 0.2s; display: flex;
    align-items: center; justify-content: center; gap: 8px;
  }
  .action-btn:hover { border-color: #C9A84C; }
  .action-btn.wishlisted { border-color: #ef4444; color: #ef4444; }
`;

// ─── Icons ────────────────────────────────────────────────────────────────────
const HeartIcon = ({ filled, size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
  </svg>
);
const ShareIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
  </svg>
);

// ─── Image Gallery ────────────────────────────────────────────────────────────
const ImageGallery = ({ images = [], name = "" }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const displayImages = images.length > 0 ? images : ["https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=800&q=80"];

  const handleMouseMove = (e) => {
    if (!isZoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({ x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 });
  };

  return (
    <Box position="sticky" top="24">
      <Box
        position="relative" overflow="hidden" bg="#111"
        border="1px solid rgba(255,255,255,0.07)"
        cursor={isZoomed ? "zoom-out" : "zoom-in"}
        onClick={() => setIsZoomed(!isZoomed)}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => isZoomed && setIsZoomed(false)}
      >
        <AspectRatio ratio={1}>
          <Box overflow="hidden">
            <Image
              src={displayImages[activeIdx]} alt={name}
              objectFit="contain" w="full" h="full" p="6"
              transition="transform 0.3s ease"
              transformOrigin={isZoomed ? `${mousePos.x}% ${mousePos.y}%` : "center"}
              transform={isZoomed ? "scale(2)" : "scale(1)"}
              fallback={<Box w="full" h="full" bg="#161616" display="flex" alignItems="center" justifyContent="center"><Text fontFamily="'DM Sans'" fontSize="xs" color="rgba(245,245,240,0.15)" letterSpacing="0.2em">EYEWEAR</Text></Box>}
            />
          </Box>
        </AspectRatio>
        <Box position="absolute" bottom="4" right="4" bg="rgba(10,10,10,0.8)" px="3" py="1" border="1px solid rgba(255,255,255,0.07)">
          <Text fontFamily="'DM Sans', sans-serif" fontSize="10px" color="rgba(245,245,240,0.4)" letterSpacing="0.1em">
            {activeIdx + 1} / {displayImages.length}
          </Text>
        </Box>
      </Box>
      {displayImages.length > 1 && (
        <HStack spacing="2" mt="3">
          {displayImages.map((img, i) => (
            <Box key={i} w="16" h="16" overflow="hidden" cursor="pointer"
              border="1.5px solid" borderColor={activeIdx === i ? "#C9A84C" : "rgba(255,255,255,0.07)"}
              transition="border-color 0.2s" onClick={() => setActiveIdx(i)} flex="0 0 auto" bg="#111">
              <Image src={img} alt={`View ${i + 1}`} objectFit="contain" w="full" h="full" p="1"
                opacity={activeIdx === i ? 1 : 0.4} transition="opacity 0.2s" _hover={{ opacity: 1 }} />
            </Box>
          ))}
        </HStack>
      )}
    </Box>
  );
};

// ─── Config ───────────────────────────────────────────────────────────────────
const frameColors = [
  { name: "Matte Black", hex: "#1a1a1a" },
  { name: "Tortoise",    hex: "#7B4F2E" },
  { name: "Gold",        hex: "#C9A84C" },
  { name: "Crystal",     hex: "#d4d4d4" },
];
const lensTypes = [
  { id: "clear",        label: "Clear",        price: 0    },
  { id: "antiglare",    label: "Anti-Glare",   price: 500  },
  { id: "bluelight",    label: "Blue Light",   price: 800  },
  { id: "photochromic", label: "Photochromic", price: 1500 },
];

// ─── Product Info ─────────────────────────────────────────────────────────────
const ProductInfo = ({ product, onAddToCart }) => {
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedLens, setSelectedLens]   = useState("clear");
  const [wishlisted, setWishlisted]       = useState(false);
  const toast = useToast();

  const name          = product?.name || product?.productName || "Premium Eyewear Frame";
  const price         = product?.price || product?.discountPrice || product?.productPrice || 0;
  const originalPrice = product?.originalPrice || product?.mrp;
  const discount      = originalPrice && originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : null;
  const brand         = product?.brand || product?.brandName || "ClearDekho";
  const sku           = product?.sku || product?._id?.slice(-8).toUpperCase() || "CD00001";
  const inStock       = product?.stock !== 0 && product?.inStock !== false;
  const lensAddon     = lensTypes.find((l) => l.id === selectedLens)?.price || 0;
  const totalPrice    = price + lensAddon;

  const handleAddToCart = () => {
    if (onAddToCart) onAddToCart(product);
    toast({ title: "Added to cart", description: `${name} added.`, status: "success", duration: 2500, isClosable: true, position: "bottom-right" });
  };

  return (
    <VStack align="flex-start" spacing="0">
      {/* Brand + badges */}
      <HStack spacing="3" mb="4">
        <Text fontFamily="'DM Sans', sans-serif" fontSize="10px" color="#C9A84C" letterSpacing="0.3em" textTransform="uppercase">{brand}</Text>
        {inStock
          ? <Box px="2" py="0.5" border="1px solid rgba(52,211,153,0.4)"><Text fontFamily="'DM Sans', sans-serif" fontSize="9px" letterSpacing="0.2em" textTransform="uppercase" color="#34d399">In Stock</Text></Box>
          : <Box px="2" py="0.5" border="1px solid rgba(239,68,68,0.4)"><Text fontFamily="'DM Sans', sans-serif" fontSize="9px" letterSpacing="0.2em" textTransform="uppercase" color="#ef4444">Out of Stock</Text></Box>
        }
        {discount && <Box px="2" py="0.5" bg="#C9A84C"><Text fontFamily="'DM Sans', sans-serif" fontSize="9px" letterSpacing="0.15em" color="#0a0a0a" fontWeight="600">−{discount}%</Text></Box>}
      </HStack>

      {/* Name */}
      <Text fontFamily="'Cormorant Garamond', serif" fontSize={{ base: "2xl", md: "3xl" }} fontWeight="300" color="#f5f5f0" lineHeight="1.2" mb="5" letterSpacing="-0.01em">
        {name}
      </Text>

      {/* Price */}
      <HStack align="baseline" spacing="3" mb="6">
        <Text fontFamily="'Bebas Neue', sans-serif" fontSize="52px" color="#C9A84C" letterSpacing="0.04em" lineHeight="1">
          ₹{totalPrice.toLocaleString()}
        </Text>
        {originalPrice && originalPrice > price && (
          <Text fontFamily="'DM Sans', sans-serif" fontSize="sm" color="rgba(245,245,240,0.3)" textDecoration="line-through">₹{originalPrice.toLocaleString()}</Text>
        )}
        {lensAddon > 0 && <Text fontFamily="'DM Sans', sans-serif" fontSize="10px" color="rgba(245,245,240,0.35)">incl. lens</Text>}
      </HStack>

      <Divider borderColor="rgba(255,255,255,0.07)" mb="6" />

      {/* Color picker */}
      <Box mb="6" w="full">
        <HStack spacing="2" mb="3">
          <Text fontFamily="'DM Sans', sans-serif" fontSize="10px" letterSpacing="0.2em" textTransform="uppercase" color="rgba(245,245,240,0.35)">Frame Colour:</Text>
          <Text fontFamily="'DM Sans', sans-serif" fontSize="10px" color="#f5f5f0" letterSpacing="0.1em">{frameColors[selectedColor].name}</Text>
        </HStack>
        <HStack spacing="3">
          {frameColors.map((c, i) => (
            <Box key={c.name} w="8" h="8" bg={c.hex} cursor="pointer"
              border="2px solid" borderColor={selectedColor === i ? "#C9A84C" : "transparent"}
              outline="1px solid" outlineColor="rgba(255,255,255,0.1)"
              transition="transform 0.2s, border-color 0.2s"
              _hover={{ transform: "scale(1.1)" }}
              title={c.name} onClick={() => setSelectedColor(i)}
            />
          ))}
        </HStack>
      </Box>

      {/* Lens selector */}
      <Box mb="8" w="full">
        <Text fontFamily="'DM Sans', sans-serif" fontSize="10px" letterSpacing="0.2em" textTransform="uppercase" color="rgba(245,245,240,0.35)" mb="3">Lens Type:</Text>
        <SimpleGrid columns={2} spacing="2" w="full">
          {lensTypes.map((lens) => (
            <div key={lens.id} className={`lens-card ${selectedLens === lens.id ? 'selected' : ''}`} onClick={() => setSelectedLens(lens.id)}>
              <Text fontFamily="'DM Sans', sans-serif" fontSize="12px" color="#f5f5f0" mb="1">{lens.label}</Text>
              <Text fontFamily="'DM Sans', sans-serif" fontSize="10px" color={selectedLens === lens.id ? "#C9A84C" : "rgba(245,245,240,0.3)"}>
                {lens.price === 0 ? "Included" : `+₹${lens.price}`}
              </Text>
            </div>
          ))}
        </SimpleGrid>
      </Box>

      {/* CTAs */}
      <VStack spacing="3" w="full" mb="6">
        <button
          disabled={!inStock} onClick={handleAddToCart}
          style={{
            width: '100%', background: inStock ? '#C9A84C' : 'rgba(255,255,255,0.05)',
            color: inStock ? '#0a0a0a' : 'rgba(245,245,240,0.2)',
            border: 'none', fontFamily: "'DM Sans', sans-serif",
            fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase',
            fontWeight: 500, padding: '18px 24px',
            cursor: inStock ? 'pointer' : 'not-allowed', transition: 'background 0.2s',
          }}
          onMouseOver={(e) => inStock && (e.currentTarget.style.background = '#f5f5f0')}
          onMouseOut={(e) => inStock && (e.currentTarget.style.background = '#C9A84C')}
        >
          {inStock ? "Add to Cart" : "Out of Stock"}
        </button>
        <HStack w="full" spacing="3">
          <button
            className={`action-btn ${wishlisted ? 'wishlisted' : ''}`}
            onClick={() => setWishlisted(!wishlisted)}
          >
            <HeartIcon filled={wishlisted} size={13} />
            {wishlisted ? "Wishlisted" : "Wishlist"}
          </button>
          <button
            className="action-btn"
            style={{ flex: 'none', padding: '14px 16px' }}
            onClick={() => navigator.share?.({ title: name, url: window.location.href })}
          >
            <ShareIcon size={13} />
          </button>
        </HStack>
      </VStack>

      {/* Offers */}
      <Box w="full" bg="#111" p="5" border="1px solid rgba(255,255,255,0.07)" mb="6">
        <Text fontFamily="'DM Sans', sans-serif" fontSize="10px" letterSpacing="0.2em" textTransform="uppercase" color="rgba(245,245,240,0.35)" mb="4">Available Offers</Text>
        <VStack align="flex-start" spacing="3">
          {["10% off on first order with code FIRST10", "Free home trial — try before you buy", "EMI available on orders above ₹3,000"].map((offer) => (
            <HStack key={offer} spacing="3" align="flex-start">
              <Text color="#C9A84C" fontSize="10px" mt="0.5" flexShrink="0">✦</Text>
              <Text fontFamily="'DM Sans', sans-serif" fontSize="12px" color="rgba(245,245,240,0.45)" lineHeight="1.7">{offer}</Text>
            </HStack>
          ))}
        </VStack>
      </Box>

      <Text fontFamily="'DM Sans', sans-serif" fontSize="10px" color="rgba(245,245,240,0.2)" letterSpacing="0.15em">SKU: {sku}</Text>
    </VStack>
  );
};

// ─── Tabs ─────────────────────────────────────────────────────────────────────
const ProductTabs = ({ product }) => {
  const [activeTab, setActiveTab] = useState(0);
  const description = product?.description || "Premium quality eyewear frame crafted with attention to detail. Lightweight design for all-day comfort.";
  const specs = [
    ["Frame Material", product?.material || "Acetate"],
    ["Frame Width",    product?.frameWidth || "140mm"],
    ["Bridge Width",   product?.bridgeWidth || "18mm"],
    ["Temple Length",  product?.templeLength || "145mm"],
    ["Lens Width",     product?.lensWidth || "52mm"],
    ["Frame Shape",    product?.shape || "Rectangle"],
    ["Gender",         product?.gender || "Unisex"],
    ["Weight",         product?.weight || "18g"],
  ];
  const tabs = ["Description", "Specifications", "Shipping & Returns"];

  return (
    <Box mt="16">
      <div className="pd-tabs">
        {tabs.map((t, i) => (
          <button key={t} className={`pd-tab ${activeTab === i ? 'active' : ''}`} onClick={() => setActiveTab(i)}>{t}</button>
        ))}
      </div>

      {activeTab === 0 && (
        <Text fontFamily="'DM Sans', sans-serif" fontSize="13px" color="rgba(245,245,240,0.5)" lineHeight="2" maxW="680px" fontWeight="300">{description}</Text>
      )}

      {activeTab === 1 && (
        <Box maxW="560px" border="1px solid rgba(255,255,255,0.07)">
          {specs.map(([label, val], i) => (
            <div key={label} className="spec-row">
              <Text fontFamily="'DM Sans', sans-serif" fontSize="11px" color="rgba(245,245,240,0.35)" letterSpacing="0.08em">{label}</Text>
              <Text fontFamily="'DM Sans', sans-serif" fontSize="11px" color="#f5f5f0">{val}</Text>
            </div>
          ))}
        </Box>
      )}

      {activeTab === 2 && (
        <VStack align="flex-start" spacing="6" maxW="580px">
          {[
            ["Delivery", "Free standard delivery on all orders above ₹999. Express delivery (2-3 days) available for ₹99."],
            ["Home Trial", "Order up to 5 frames for a free 7-day home trial. Pay only for what you keep."],
            ["Returns", "30-day hassle-free returns. Return for a full refund or exchange."],
            ["Warranty", "1-year manufacturer warranty on all frames. Covers manufacturing defects."],
          ].map(([title, desc]) => (
            <Box key={title}>
              <Text fontFamily="'DM Sans', sans-serif" fontSize="11px" letterSpacing="0.15em" textTransform="uppercase" color="#C9A84C" mb="2">{title}</Text>
              <Text fontFamily="'DM Sans', sans-serif" fontSize="13px" color="rgba(245,245,240,0.45)" lineHeight="1.9" fontWeight="300">{desc}</Text>
            </Box>
          ))}
        </VStack>
      )}
    </Box>
  );
};

// ─── Related Products ─────────────────────────────────────────────────────────
const RelatedProducts = ({ products = [] }) => {
  if (!products.length) return null;
  return (
    <Box py="16" bg="#111" borderTop="1px solid rgba(255,255,255,0.07)">
      <Box maxW="1400px" mx="auto" px={{ base: "6", md: "12" }}>
        <Flex justify="space-between" align="center" mb="10">
          <Text fontFamily="'Bebas Neue', sans-serif" fontSize="clamp(32px,4vw,48px)" letterSpacing="0.02em" color="#f5f5f0">You May Also Like</Text>
          <RouterLink to="/eyeglasses">
            <button style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(245,245,240,0.4)', fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', padding: '10px 18px', cursor: 'pointer' }}>
              View All →
            </button>
          </RouterLink>
        </Flex>
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={{ base: "4", md: "6" }}>
          {products.slice(0, 4).map((p) => (
            <RouterLink key={p._id || p.id} to={`/eyeglasses/${p._id || p.id}`}>
              <div className="rel-card">
                <div className="rel-card-img">
                  <AspectRatio ratio={1}>
                    <Box overflow="hidden">
                      <Image src={p.image || p.images?.[0]} alt={p.name} objectFit="contain" w="full" h="full" p="3"
                        fallback={<Box w="full" h="full" bg="#161616" />} />
                    </Box>
                  </AspectRatio>
                </div>
                <Text fontFamily="'DM Sans', sans-serif" fontSize="12px" color="rgba(245,245,240,0.7)" noOfLines={1} mb="1">{p.name || p.productName}</Text>
                <Text fontFamily="'Bebas Neue', sans-serif" fontSize="20px" color="#C9A84C" letterSpacing="0.04em" lineHeight="1">
                  ₹{(p.price || p.productPrice || 0).toLocaleString()}
                </Text>
              </div>
            </RouterLink>
          ))}
        </SimpleGrid>
      </Box>
    </Box>
  );
};

// ─── Main ─────────────────────────────────────────────────────────────────────
const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const allProducts = useSelector((state) => state.productReducer?.products || []);
  const product = allProducts.find((p) => (p._id || p.id) === id) || null;
  const loading = useSelector((state) => state.productReducer?.isLoading || false);

  useEffect(() => { window.scrollTo(0, 0); }, [id]);

  const images = product?.images || (product?.image ? [product.image] : []);
  const relatedProducts = allProducts.filter((p) => (p._id || p.id) !== id).slice(0, 4);

  const handleAddToCart = (item) => {
    const p = item || product;
    if (!p) return;
    dispatch(addToCart({
      ...p,
      price: p.price || p.productPrice || 0,
      image: p.image || p.images?.[0] || "",
      name: p.name || p.productName || "Eyewear Frame",
    }));
  };

  if (loading) {
    return (
      <Box className="pd-page" style={{ background: '#0a0a0a' }}>
        <style>{darkStyles}</style>
        <Box maxW="1400px" mx="auto" px={{ base: "6", md: "12" }} py="20">
          <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap="16">
            <Box bg="#161616" h="500px" />
            <VStack align="flex-start" spacing="4">
              {[200, 300, 150, 100, 200].map((w, i) => <Box key={i} bg="#161616" h="4" w={`${w}px`} maxW="full" />)}
            </VStack>
          </Grid>
        </Box>
      </Box>
    );
  }

  if (!product) {
    return (
      <Box className="pd-page" display="flex" alignItems="center" justifyContent="center" minH="80vh">
        <style>{darkStyles}</style>
        <VStack spacing="5" textAlign="center">
          <Text fontFamily="'Cormorant Garamond', serif" fontSize="3xl" color="rgba(245,245,240,0.2)" fontWeight="300">Product not found</Text>
          <RouterLink to="/eyeglasses">
            <button style={{ background: '#C9A84C', border: 'none', color: '#0a0a0a', fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 500, padding: '14px 28px', cursor: 'pointer' }}>
              Browse Eyeglasses →
            </button>
          </RouterLink>
        </VStack>
      </Box>
    );
  }

  return (
    <Box className="pd-page">
      <style>{darkStyles}</style>

      {/* Breadcrumb */}
      <Box borderBottom="1px solid rgba(255,255,255,0.07)" py="4" px={{ base: "6", md: "12" }} maxW="1400px" mx="auto">
        <div className="pd-breadcrumb">
          <RouterLink to="/">Home</RouterLink>
          <span className="sep">/</span>
          <RouterLink to="/eyeglasses">Eyeglasses</RouterLink>
          <span className="sep">/</span>
          <span className="current">{product?.name || "Product"}</span>
        </div>
      </Box>

      {/* Main content */}
      <Box maxW="1400px" mx="auto" px={{ base: "6", md: "12" }} py={{ base: "10", md: "16" }}>
        <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={{ base: "10", lg: "20" }}>
          <GridItem>
            <ImageGallery images={images} name={product?.name || product?.productName} />
          </GridItem>
          <GridItem>
            <ProductInfo product={product} onAddToCart={handleAddToCart} />
          </GridItem>
        </Grid>
        <ProductTabs product={product} />
      </Box>

      <RelatedProducts products={relatedProducts} />
    </Box>
  );
};

export { ProductDetail as Product };
export default ProductDetail;