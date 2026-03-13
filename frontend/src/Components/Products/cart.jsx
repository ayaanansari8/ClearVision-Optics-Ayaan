import React from "react";
import { Box, Flex, Text, VStack, HStack, Image, Divider } from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, updateCartQuantity } from "../../redux/cartReducer/action";

const darkStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');
  .cart-page { background: #0a0a0a; min-height: 100vh; color: #f5f5f0; }
  .cart-item { transition: background 0.2s; }
  .cart-item:hover { background: rgba(255,255,255,0.015); }
  .qty-btn {
    width: 32px; height: 32px; background: transparent;
    border: 1px solid rgba(255,255,255,0.07); color: #f5f5f0;
    font-size: 16px; cursor: pointer; display: flex;
    align-items: center; justify-content: center;
    transition: border-color 0.2s;
    font-family: 'DM Sans', sans-serif;
  }
  .qty-btn:hover { border-color: #C9A84C; color: #C9A84C; }
  .remove-btn {
    background: transparent; border: none; color: rgba(245,245,240,0.25);
    cursor: pointer; padding: 6px; transition: color 0.2s; display: flex; align-items: center;
  }
  .remove-btn:hover { color: #ef4444; }
  .cart-summary { background: #111; border: 1px solid rgba(255,255,255,0.07); padding: 28px; }
`;

const RemoveIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" />
    <path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" />
  </svg>
);

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cartReducer?.cartItems || []);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
  const shipping = subtotal > 999 ? 0 : 99;
  const total = subtotal + shipping;

  const handleRemove = (id) => dispatch(removeFromCart(id));
  const handleQty = (id, qty) => {
    if (qty < 1) { dispatch(removeFromCart(id)); return; }
    dispatch(updateCartQuantity({ id, quantity: qty }));
  };

  if (cartItems.length === 0) {
    return (
      <Box className="cart-page" display="flex" alignItems="center" justifyContent="center">
        <style>{darkStyles}</style>
        <VStack spacing="6" textAlign="center" py="24">
          <Text fontFamily="'Cormorant Garamond', serif" fontSize={{ base: '3xl', md: '5xl' }} fontWeight="300" color="rgba(245,245,240,0.2)">
            Your cart is empty
          </Text>
          <Text fontFamily="'DM Sans', sans-serif" fontSize="12px" color="rgba(245,245,240,0.3)" letterSpacing="0.1em">
            Discover our curated collection of premium eyewear.
          </Text>
          <RouterLink to="/eyeglasses">
            <button style={{
              background: '#C9A84C', color: '#0a0a0a', border: 'none',
              fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: '0.2em',
              textTransform: 'uppercase', fontWeight: 500, padding: '16px 32px', cursor: 'pointer', marginTop: 8,
            }}>
              Shop Eyeglasses →
            </button>
          </RouterLink>
        </VStack>
      </Box>
    );
  }

  return (
    <Box className="cart-page">
      <style>{darkStyles}</style>

      {/* Header */}
      <Box borderBottom="1px solid rgba(255,255,255,0.07)" py="10" px={{ base: '6', md: '12' }} maxW="1300px" mx="auto">
        <Text fontFamily="'Bebas Neue', sans-serif" fontSize="clamp(40px,5vw,64px)" letterSpacing="0.02em" color="#f5f5f0" lineHeight="1">
          Shopping Cart{' '}
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '18px', color: 'rgba(245,245,240,0.3)', fontWeight: 300, letterSpacing: '0.05em' }}>
            ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
          </span>
        </Text>
      </Box>

      <Box maxW="1300px" mx="auto" px={{ base: '6', md: '12' }} py="10">
        <Flex gap="10" direction={{ base: 'column', lg: 'row' }}>

          {/* Items */}
          <Box flex="1">
            <VStack spacing="0" align="stretch">
              {cartItems.map((item, i) => (
                <Box key={item._id || item.id || i} className="cart-item">
                  <Flex py="6" gap="5" align="flex-start">
                    {/* Image */}
                    <Box w="90px" h="70px" flexShrink="0" bg="#161616" overflow="hidden">
                      <Image
                        src={item.image || item.images?.[0]}
                        alt={item.name}
                        w="full" h="full" objectFit="contain" p="2"
                        fallback={<Box w="full" h="full" bg="#161616" />}
                      />
                    </Box>

                    {/* Info */}
                    <Box flex="1">
                      <Text fontFamily="'Cormorant Garamond', serif" fontSize="lg" color="#f5f5f0" fontWeight="300" lineHeight="1.2" mb="1">
                        {item.name || item.productName || 'Eyewear Frame'}
                      </Text>
                      {item.brand && (
                        <Text fontFamily="'DM Sans', sans-serif" fontSize="10px" color="rgba(245,245,240,0.3)" letterSpacing="0.15em" textTransform="uppercase" mb="3">
                          {item.brand}
                        </Text>
                      )}
                      <HStack spacing="3" mt="3">
                        <HStack spacing="0">
                          <button className="qty-btn" onClick={() => handleQty(item._id || item.id, (item.quantity || 1) - 1)}>−</button>
                          <Box w="10" textAlign="center" borderTop="1px solid rgba(255,255,255,0.07)" borderBottom="1px solid rgba(255,255,255,0.07)" h="32px" display="flex" alignItems="center" justifyContent="center">
                            <Text fontFamily="'DM Sans', sans-serif" fontSize="13px" color="#f5f5f0">{item.quantity || 1}</Text>
                          </Box>
                          <button className="qty-btn" onClick={() => handleQty(item._id || item.id, (item.quantity || 1) + 1)}>+</button>
                        </HStack>
                        <button className="remove-btn" onClick={() => handleRemove(item._id || item.id)}>
                          <RemoveIcon />
                        </button>
                      </HStack>
                    </Box>

                    {/* Price */}
                    <Text fontFamily="'Bebas Neue', sans-serif" fontSize="24px" color="#C9A84C" letterSpacing="0.04em" lineHeight="1" flexShrink="0">
                      ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                    </Text>
                  </Flex>
                  <Divider borderColor="rgba(255,255,255,0.07)" />
                </Box>
              ))}
            </VStack>

            <RouterLink to="/eyeglasses">
              <button style={{
                marginTop: 24, background: 'transparent', border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(245,245,240,0.5)', fontFamily: "'DM Sans', sans-serif", fontSize: 10,
                letterSpacing: '0.2em', textTransform: 'uppercase', padding: '10px 20px', cursor: 'pointer',
                transition: 'border-color 0.2s',
              }}>
                ← Continue Shopping
              </button>
            </RouterLink>
          </Box>

          {/* Summary */}
          <Box w={{ base: 'full', lg: '340px' }} flexShrink="0">
            <div className="cart-summary">
              <Text fontFamily="'Bebas Neue', sans-serif" fontSize="28px" letterSpacing="0.04em" color="#f5f5f0" mb="6">Order Summary</Text>

              <VStack spacing="4" align="stretch" mb="5">
                <Flex justify="space-between">
                  <Text fontFamily="'DM Sans', sans-serif" fontSize="12px" color="rgba(245,245,240,0.4)">Subtotal</Text>
                  <Text fontFamily="'DM Sans', sans-serif" fontSize="12px" color="#f5f5f0">₹{subtotal.toLocaleString()}</Text>
                </Flex>
                <Flex justify="space-between">
                  <Text fontFamily="'DM Sans', sans-serif" fontSize="12px" color="rgba(245,245,240,0.4)">Shipping</Text>
                  <Text fontFamily="'DM Sans', sans-serif" fontSize="12px" color={shipping === 0 ? '#34d399' : '#f5f5f0'}>
                    {shipping === 0 ? 'Free' : `₹${shipping}`}
                  </Text>
                </Flex>
                {shipping > 0 && (
                  <Text fontFamily="'DM Sans', sans-serif" fontSize="10px" color="rgba(245,245,240,0.25)">Free shipping on orders above ₹999</Text>
                )}
              </VStack>

              <Divider borderColor="rgba(255,255,255,0.07)" mb="5" />

              <Flex justify="space-between" mb="6">
                <Text fontFamily="'Cormorant Garamond', serif" fontSize="lg" color="#f5f5f0">Total</Text>
                <Text fontFamily="'Bebas Neue', sans-serif" fontSize="28px" color="#C9A84C" letterSpacing="0.04em" lineHeight="1">₹{total.toLocaleString()}</Text>
              </Flex>

              <button
                onClick={() => navigate('/payment')}
                style={{
                  width: '100%', background: '#C9A84C', border: 'none', color: '#0a0a0a',
                  fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: '0.2em',
                  textTransform: 'uppercase', fontWeight: 500, padding: '18px 24px', cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
                onMouseOver={(e) => e.currentTarget.style.background = '#f5f5f0'}
                onMouseOut={(e) => e.currentTarget.style.background = '#C9A84C'}
              >
                Proceed to Checkout →
              </button>

              <Text fontFamily="'DM Sans', sans-serif" fontSize="10px" color="rgba(245,245,240,0.2)" textAlign="center" mt="3" letterSpacing="0.1em">
                SECURE CHECKOUT · FREE RETURNS
              </Text>
            </div>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
};

export default Cart;