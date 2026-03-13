import React, { useState } from "react";
import {
  Box, SimpleGrid, Image, Text, VStack, HStack,
  Flex, Badge, Spacer, AspectRatio,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { SearchIcon } from "@chakra-ui/icons";

const darkStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');
  .el-page { background: #0a0a0a; min-height: 100vh; color: #f5f5f0; }
  .el-input {
    background: #161616; border: 1px solid rgba(255,255,255,0.07);
    color: #f5f5f0; font-family: 'DM Sans', sans-serif; font-size: 13px;
    padding: 10px 14px 10px 38px; width: 280px; outline: none;
    transition: border-color 0.2s;
  }
  .el-input:focus { border-color: #C9A84C; }
  .el-input::placeholder { color: rgba(245,245,240,0.3); }
  .el-select {
    background: #161616; border: 1px solid rgba(255,255,255,0.07);
    color: #f5f5f0; font-family: 'DM Sans', sans-serif; font-size: 11px;
    padding: 10px 14px; letter-spacing: 0.08em; outline: none; cursor: pointer;
    transition: border-color 0.2s;
  }
  .el-select:focus { border-color: #C9A84C; }
  .el-select option { background: #161616; }
  .prod-grid-card { cursor: pointer; }
  .prod-grid-img {
    background: #161616; overflow: hidden; position: relative; margin-bottom: 12px;
  }
  .prod-grid-img img { transition: transform 0.5s ease; display: block; }
  .prod-grid-card:hover .prod-grid-img img { transform: scale(1.05); }
  .prod-grid-cta {
    position: absolute; bottom: 0; left: 0; right: 0;
    background: rgba(10,10,10,0.92); padding: 10px;
    text-align: center; transform: translateY(100%);
    transition: transform 0.3s ease;
    border-top: 1px solid #C9A84C;
    font-family: 'DM Sans', sans-serif; font-size: 10px;
    letter-spacing: 0.2em; text-transform: uppercase; color: #C9A84C;
  }
  .prod-grid-card:hover .prod-grid-cta { transform: translateY(0); }
`;

const EyeglassesList = () => {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("default");

  const products = useSelector((state) => state.productReducer?.products || []);

  const filtered = products
    .filter((p) => (p.title || p.name || "").toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "price-asc") return (a.price || 0) - (b.price || 0);
      if (sortBy === "price-desc") return (b.price || 0) - (a.price || 0);
      return 0;
    });

  return (
    <Box className="el-page">
      <style>{darkStyles}</style>

      {/* Header */}
      <Box borderBottom="1px solid rgba(255,255,255,0.07)" py="12" px={{ base: "6", md: "12" }} maxW="1400px" mx="auto">
        <Text fontFamily="'Bebas Neue', sans-serif" fontSize="clamp(48px,6vw,80px)" letterSpacing="0.02em" color="#f5f5f0" lineHeight="1">
          Eyeglasses
        </Text>
        <Text fontFamily="'DM Sans', sans-serif" fontSize="12px" color="rgba(245,245,240,0.4)" letterSpacing="0.15em" textTransform="uppercase" mt="2">
          {filtered.length} styles
        </Text>
      </Box>

      {/* Filters */}
      <Box borderBottom="1px solid rgba(255,255,255,0.07)" py="4" px={{ base: "6", md: "12" }} maxW="1400px" mx="auto">
        <Flex align="center" gap="4" wrap="wrap">
          <Box position="relative">
            <Box position="absolute" left="10px" top="50%" transform="translateY(-50%)" zIndex={1} pointerEvents="none">
              <SearchIcon color="rgba(245,245,240,0.3)" boxSize="3" />
            </Box>
            <input
              className="el-input"
              placeholder="Search frames..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Box>
          <Spacer />
          <HStack spacing="3">
            <Text fontFamily="'DM Sans', sans-serif" fontSize="10px" color="rgba(245,245,240,0.4)" letterSpacing="0.25em" textTransform="uppercase">
              Sort By
            </Text>
            <select className="el-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="default">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </HStack>
        </Flex>
      </Box>

      {/* Grid */}
      <Box maxW="1400px" mx="auto" px={{ base: "6", md: "12" }} py="12">
        {filtered.length === 0 ? (
          <VStack py="20" spacing="4">
            <Text fontFamily="'Cormorant Garamond', serif" fontSize="2xl" color="rgba(245,245,240,0.3)">No products found</Text>
            <button
              onClick={() => setSearch("")}
              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C9A84C', background: 'transparent', border: '1px solid #C9A84C', padding: '10px 24px', cursor: 'pointer' }}
            >
              Clear Search
            </button>
          </VStack>
        ) : (
          <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={{ base: "4", md: "6" }}>
            {filtered.map((product) => (
              <RouterLink key={product._id} to={`/eyeglasses/${product._id}`}>
                <div className="prod-grid-card">
                  <div className="prod-grid-img">
                    <AspectRatio ratio={1}>
                      <Box overflow="hidden" position="relative">
                        <Image
                          src={product.image}
                          alt={product.title || product.name}
                          w="full" h="full"
                          objectFit="contain"
                          p="4"
                          fallback={
                            <Box w="full" h="full" bg="#161616" display="flex" alignItems="center" justifyContent="center">
                              <Text fontSize="xs" color="rgba(245,245,240,0.2)" letterSpacing="0.15em">EYEWEAR</Text>
                            </Box>
                          }
                        />
                        {product.color && (
                          <Badge
                            position="absolute" top="3" left="3"
                            bg="#C9A84C" color="#0a0a0a"
                            fontSize="9px" letterSpacing="0.12em"
                            px="2" py="1" fontWeight="500"
                            fontFamily="'DM Sans', sans-serif"
                            borderRadius="0"
                          >
                            {product.color}
                          </Badge>
                        )}
                        <div className="prod-grid-cta">View Details</div>
                      </Box>
                    </AspectRatio>
                  </div>
                  <VStack align="flex-start" spacing="1" px="1">
                    <Text fontFamily="'DM Sans', sans-serif" fontSize="10px" color="rgba(245,245,240,0.35)" letterSpacing="0.15em" textTransform="uppercase">
                      {product.shape || "Eyeglasses"}
                    </Text>
                    <Text fontFamily="'DM Sans', sans-serif" fontSize="13px" color="#f5f5f0" noOfLines={1}>
                      {product.title || product.name}
                    </Text>
                    <Text fontFamily="'Bebas Neue', sans-serif" fontSize="22px" color="#C9A84C" letterSpacing="0.04em" lineHeight="1">
                      ₹{(product.price || 0).toLocaleString()}
                    </Text>
                  </VStack>
                </div>
              </RouterLink>
            ))}
          </SimpleGrid>
        )}
      </Box>
    </Box>
  );
};

export default EyeglassesList;