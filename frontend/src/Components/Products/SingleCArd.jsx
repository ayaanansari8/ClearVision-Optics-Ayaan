import {
  Box, Text, Image, Flex, VStack, Button, HStack,
  Input, InputGroup, InputRightElement, Divider,
} from '@chakra-ui/react';
import {
  Accordion, AccordionItem, AccordionButton,
  AccordionPanel, AccordionIcon,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';
import { addToCart } from '../../redux/cartReducer/action';

const darkStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');
  .sp-page { background: #0a0a0a; min-height: 100vh; color: #f5f5f0; }
  .sp-accordion .chakra-accordion__button {
    background: transparent !important;
    color: #f5f5f0 !important;
    border-bottom: 1px solid rgba(255,255,255,0.07) !important;
    font-family: 'DM Sans', sans-serif !important;
    font-size: 13px !important;
    letter-spacing: 0.08em !important;
    padding: 16px 0 !important;
  }
  .sp-accordion .chakra-accordion__button:hover { background: transparent !important; }
  .sp-accordion .chakra-accordion__panel {
    background: transparent !important;
    color: rgba(245,245,240,0.5) !important;
    font-family: 'DM Sans', sans-serif !important;
    font-size: 12px !important;
    padding: 16px 0 !important;
  }
  .sp-accordion .chakra-accordion__icon { color: #C9A84C !important; }
  .sp-pin-input {
    background: #161616; border: 1px solid rgba(255,255,255,0.07);
    color: #f5f5f0; font-family: 'DM Sans', sans-serif; font-size: 13px;
    padding: 10px 14px; outline: none; width: 100%;
    transition: border-color 0.2s;
  }
  .sp-pin-input:focus { border-color: #C9A84C; }
  .sp-pin-input::placeholder { color: rgba(245,245,240,0.25); }
`;

const SinglePage = () => {
  const toast = useToast();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [data, setData] = useState({});

  const { products } = useSelector((state) => ({
    products: state.productReducer.products,
  }));

  useEffect(() => {
    const found = products.find((el) => el._id === id);
    setData(found || {});
  }, [id, products]);

  const handleClick = () => {
    dispatch(addToCart({
      _id: data._id,
      image: data.image,
      name: data.title,
      title: data.title,
      price: data.price,
      quantity: 1,
    }));
    toast({
      title: 'Added to cart',
      description: `${data.title || 'Item'} added to your cart`,
      status: 'success',
      duration: 3000,
      isClosable: true,
      position: 'top',
    });
  };

  return (
    <Box className="sp-page">
      <style>{darkStyles}</style>

      <Flex
        maxW="1400px" mx="auto"
        px={{ base: '6', md: '12' }}
        py={{ base: '10', md: '16' }}
        direction={{ base: 'column', lg: 'row' }}
        gap={{ base: '10', lg: '16' }}
        align="flex-start"
      >
        {/* Image */}
        <Box flex="1" position="sticky" top="24" maxW={{ lg: '600px' }}>
          <Box bg="#111" border="1px solid rgba(255,255,255,0.07)" overflow="hidden" position="relative">
            <Image
              src={data.image}
              alt={data.title}
              w="full"
              h={{ base: '60vw', lg: '500px' }}
              objectFit="contain"
              p="8"
              fallback={
                <Box w="full" h="500px" bg="#161616" display="flex" alignItems="center" justifyContent="center">
                  <Text fontFamily="'DM Sans'" fontSize="xs" color="rgba(245,245,240,0.2)" letterSpacing="0.2em">EYEWEAR</Text>
                </Box>
              }
            />
            {data.color && (
              <Box position="absolute" top="4" left="4" bg="#C9A84C" px="3" py="1">
                <Text fontFamily="'DM Sans', sans-serif" fontSize="9px" letterSpacing="0.2em" textTransform="uppercase" color="#0a0a0a" fontWeight="500">{data.color}</Text>
              </Box>
            )}
          </Box>
        </Box>

        {/* Details */}
        <Box w={{ base: 'full', lg: '420px' }} flexShrink="0">
          {/* Brand / shape */}
          <Text fontFamily="'DM Sans', sans-serif" fontSize="10px" letterSpacing="0.3em" textTransform="uppercase" color="#C9A84C" mb="3">
            {data.shape || 'Eyeglasses'}
          </Text>

          {/* Title */}
          <Text fontFamily="'Cormorant Garamond', serif" fontSize={{ base: '2xl', md: '3xl' }} fontWeight="300" color="#f5f5f0" lineHeight="1.2" mb="4">
            {data.title || data.name || 'Premium Eyewear Frame'}
          </Text>

          {/* Price */}
          <Text fontFamily="'Bebas Neue', sans-serif" fontSize="48px" color="#C9A84C" letterSpacing="0.04em" lineHeight="1" mb="2">
            ₹{data.price?.toLocaleString?.() || data.price}
          </Text>
          <Text fontFamily="'DM Sans', sans-serif" fontSize="11px" color="rgba(245,245,240,0.35)" letterSpacing="0.12em" mb="8">
            INCL. OF ALL TAXES · FREE SHIPPING ABOVE ₹999
          </Text>

          {/* Size */}
          {data.size && (
            <Box mb="8">
              <Text fontFamily="'DM Sans', sans-serif" fontSize="10px" letterSpacing="0.2em" textTransform="uppercase" color="rgba(245,245,240,0.4)" mb="3">Size</Text>
              <Box display="inline-block" border="1px solid #C9A84C" px="4" py="2">
                <Text fontFamily="'DM Sans', sans-serif" fontSize="12px" color="#f5f5f0" letterSpacing="0.1em">{data.size}</Text>
              </Box>
            </Box>
          )}

          <Divider borderColor="rgba(255,255,255,0.07)" mb="8" />

          {/* CTAs */}
          <VStack spacing="3" mb="8">
            <button
              style={{
                width: '100%', background: '#C9A84C', color: '#0a0a0a', border: 'none',
                fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: '0.2em',
                textTransform: 'uppercase', fontWeight: 500, padding: '18px 24px', cursor: 'pointer',
                transition: 'background 0.2s',
              }}
              onMouseOver={(e) => e.currentTarget.style.background = '#f5f5f0'}
              onMouseOut={(e) => e.currentTarget.style.background = '#C9A84C'}
            >
              Select Lenses
            </button>
            <button
              onClick={handleClick}
              style={{
                width: '100%', background: 'transparent', color: '#f5f5f0',
                border: '1px solid rgba(255,255,255,0.2)',
                fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: '0.2em',
                textTransform: 'uppercase', fontWeight: 400, padding: '17px 24px', cursor: 'pointer',
                transition: 'border-color 0.2s',
              }}
              onMouseOver={(e) => e.currentTarget.style.borderColor = '#C9A84C'}
              onMouseOut={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'}
            >
              Add to Cart
            </button>
          </VStack>

          {/* Delivery note */}
          <HStack spacing="3" mb="8" p="4" bg="#111" border="1px solid rgba(255,255,255,0.07)">
            <Text color="#C9A84C" fontSize="lg">→</Text>
            <Text fontFamily="'DM Sans', sans-serif" fontSize="12px" color="rgba(245,245,240,0.5)">2–3 business days delivery · Free returns</Text>
          </HStack>

          {/* Accordion */}
          <div className="sp-accordion">
            <Accordion allowMultiple defaultIndex={[0]}>
              <AccordionItem border="none">
                <AccordionButton>
                  <Box flex="1" textAlign="start">Technical Information</Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel>
                  <VStack align="start" spacing="3">
                    {[
                      ['Frame Size', data.size || '—'],
                      ['Frame Width', '137 mm'],
                      ['Frame Dimensions', '53-18-135'],
                      ['Color', data.color || '—'],
                      ['Shape', data.shape || '—'],
                    ].map(([label, val]) => (
                      <Flex key={label} w="full" justify="space-between">
                        <Text color="rgba(245,245,240,0.35)" fontSize="12px" fontFamily="'DM Sans'">{label}</Text>
                        <Text color="#f5f5f0" fontSize="12px" fontFamily="'DM Sans'">{val}</Text>
                      </Flex>
                    ))}
                  </VStack>
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem border="none">
                <AccordionButton>
                  <Box flex="1" textAlign="start">Check Delivery</Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel>
                  <HStack spacing="0">
                    <input className="sp-pin-input" placeholder="Enter PIN code" style={{ flex: 1 }} />
                    <button style={{
                      background: '#C9A84C', color: '#0a0a0a', border: 'none', padding: '10px 16px',
                      fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: '0.2em',
                      textTransform: 'uppercase', cursor: 'pointer', fontWeight: 500,
                    }}>Check</button>
                  </HStack>
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem border="none">
                <AccordionButton>
                  <Box flex="1" textAlign="start">Nearby Stores</Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel>
                  <Text fontSize="12px" color="rgba(245,245,240,0.4)">Share your location to find stores near you.</Text>
                  <Text fontSize="12px" color="#C9A84C" mt="2" cursor="pointer">Store Locator →</Text>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </div>
        </Box>
      </Flex>
    </Box>
  );
};

export default SinglePage;