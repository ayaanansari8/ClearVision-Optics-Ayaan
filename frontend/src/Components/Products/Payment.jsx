import React, { useState } from 'react';
import { Box, Flex, Text, VStack, HStack, SimpleGrid, Divider } from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart } from '../../redux/cartReducer/action';
import axios from 'axios';

const darkStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');
  .pay-page { background: #0a0a0a; min-height: 100vh; color: #f5f5f0; }
  .pay-input {
    width: 100%; background: #161616;
    border: 1px solid rgba(255,255,255,0.07);
    color: #f5f5f0; font-family: 'DM Sans', sans-serif; font-size: 13px;
    padding: 12px 14px; outline: none; transition: border-color 0.2s;
    box-sizing: border-box;
  }
  .pay-input:focus { border-color: #C9A84C; }
  .pay-input::placeholder { color: rgba(245,245,240,0.25); }
  .pay-select {
    width: 100%; background: #161616;
    border: 1px solid rgba(255,255,255,0.07);
    color: #f5f5f0; font-family: 'DM Sans', sans-serif; font-size: 13px;
    padding: 12px 14px; outline: none; transition: border-color 0.2s; cursor: pointer;
  }
  .pay-select:focus { border-color: #C9A84C; }
  .pay-select option { background: #161616; }
  .pay-label {
    font-family: 'DM Sans', sans-serif; font-size: 10px;
    letter-spacing: 0.2em; text-transform: uppercase;
    color: rgba(245,245,240,0.4); display: block; margin-bottom: 8px;
  }
  .pay-method-card {
    border: 1px solid rgba(255,255,255,0.07); padding: 16px 20px;
    cursor: pointer; transition: border-color 0.2s; display: flex;
    align-items: center; gap: 12px;
  }
  .pay-method-card.active { border-color: #C9A84C; }
  .pay-method-card:hover { border-color: rgba(201,168,76,0.4); }
  .pay-radio {
    width: 16px; height: 16px; border-radius: 50%;
    border: 1px solid rgba(255,255,255,0.2); flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    transition: border-color 0.2s;
  }
  .pay-radio.active { border-color: #C9A84C; }
  .pay-radio-dot {
    width: 8px; height: 8px; border-radius: 50%; background: #C9A84C;
  }
  .pay-tag {
    font-family: 'DM Sans', sans-serif; font-size: 9px;
    letter-spacing: 0.1em; padding: 3px 8px; font-weight: 500;
  }
  .pay-progress-track {
    height: 2px; background: rgba(255,255,255,0.07); position: relative; overflow: hidden;
  }
  .pay-progress-fill {
    height: 100%; background: #C9A84C; transition: width 0.4s ease;
  }
`;

const FormField = ({ label, children }) => (
  <Box mb="5">
    <label className="pay-label">{label}</label>
    {children}
  </Box>
);

const ShippingForm = () => (
  <Box>
    <Text fontFamily="'Bebas Neue', sans-serif" fontSize="32px" letterSpacing="0.04em" color="#f5f5f0" mb="8">Shipping Address</Text>
    <FormField label="Country / Region">
      <select className="pay-select">
        <option>India</option>
        <option>United States</option>
        <option>Canada</option>
        <option>United Kingdom</option>
      </select>
    </FormField>
    <FormField label="Street Address">
      <input className="pay-input" type="text" placeholder="House no., Street name" />
    </FormField>
    <SimpleGrid columns={3} spacing="4">
      <FormField label="City"><input className="pay-input" type="text" placeholder="Mumbai" /></FormField>
      <FormField label="State"><input className="pay-input" type="text" placeholder="Maharashtra" /></FormField>
      <FormField label="PIN Code"><input className="pay-input" type="text" placeholder="400001" /></FormField>
    </SimpleGrid>
    <FormField label="Phone Number">
      <input className="pay-input" type="tel" placeholder="+91 XXXXX XXXXX" />
    </FormField>
  </Box>
);

const PaymentForm = ({ paymentMethod, setPaymentMethod }) => {
  const [showCVV, setShowCVV] = useState(false);

  const methods = [
    { id: 'card', label: 'Credit / Debit Card', tags: [{ label: 'VISA', bg: '#1a56db' }, { label: 'MC', bg: '#e02424' }, { label: 'RUPAY', bg: '#057a55' }] },
    { id: 'upi', label: 'UPI', tags: [{ label: 'GPay', bg: '#15803d' }, { label: 'PhonePe', bg: '#3730a3' }, { label: 'Paytm', bg: '#b45309' }] },
    { id: 'cod', label: 'Cash on Delivery', tags: [] },
  ];

  return (
    <Box>
      <Text fontFamily="'Bebas Neue', sans-serif" fontSize="32px" letterSpacing="0.04em" color="#f5f5f0" mb="8">Payment</Text>

      <label className="pay-label" style={{ marginBottom: 12 }}>Select Payment Method</label>
      <VStack spacing="3" align="stretch" mb="8">
        {methods.map((m) => (
          <div
            key={m.id}
            className={`pay-method-card ${paymentMethod === m.id ? 'active' : ''}`}
            onClick={() => setPaymentMethod(m.id)}
          >
            <div className={`pay-radio ${paymentMethod === m.id ? 'active' : ''}`}>
              {paymentMethod === m.id && <div className="pay-radio-dot" />}
            </div>
            <Text fontFamily="'DM Sans', sans-serif" fontSize="13px" color="#f5f5f0" flex="1">{m.label}</Text>
            <HStack spacing="1">
              {m.tags.map((t) => (
                <span key={t.label} className="pay-tag" style={{ background: t.bg, color: 'white' }}>{t.label}</span>
              ))}
            </HStack>
          </div>
        ))}
      </VStack>

      <Divider borderColor="rgba(255,255,255,0.07)" mb="6" />

      {paymentMethod === 'card' && (
        <VStack spacing="0" align="stretch">
          <FormField label="Card Number">
            <input className="pay-input" type="text" placeholder="1234 5678 9012 3456" maxLength={19} />
          </FormField>
          <SimpleGrid columns={2} spacing="4">
            <FormField label="Expiry"><input className="pay-input" type="text" placeholder="MM/YY" maxLength={5} /></FormField>
            <FormField label="CVV">
              <Box position="relative">
                <input className="pay-input" type={showCVV ? 'text' : 'password'} placeholder="•••" maxLength={4} style={{ paddingRight: 40 }} />
                <Box position="absolute" right="12px" top="50%" transform="translateY(-50%)" cursor="pointer" onClick={() => setShowCVV(!showCVV)} color="rgba(245,245,240,0.4)">
                  {showCVV ? <ViewOffIcon /> : <ViewIcon />}
                </Box>
              </Box>
            </FormField>
          </SimpleGrid>
          <FormField label="Name on Card">
            <input className="pay-input" type="text" placeholder="As printed on card" />
          </FormField>
        </VStack>
      )}

      {paymentMethod === 'upi' && (
        <VStack spacing="0" align="stretch">
          <FormField label="UPI ID">
            <input className="pay-input" type="text" placeholder="yourname@upi" />
          </FormField>
          <Text fontFamily="'DM Sans', sans-serif" fontSize="11px" color="rgba(245,245,240,0.3)">e.g. name@okaxis, name@ybl, name@paytm</Text>
        </VStack>
      )}

      {paymentMethod === 'cod' && (
        <Box border="1px solid rgba(201,168,76,0.2)" bg="rgba(201,168,76,0.05)" p="5">
          <Text fontFamily="'DM Sans', sans-serif" fontSize="13px" color="#C9A84C" mb="2" fontWeight="500">Cash on Delivery</Text>
          <Text fontFamily="'DM Sans', sans-serif" fontSize="12px" color="rgba(245,245,240,0.4)" lineHeight="1.8">Pay with cash when your order is delivered. Additional ₹49 COD fee applies. Available for orders up to ₹10,000.</Text>
        </Box>
      )}
    </Box>
  );
};

export default function Payment() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const cartItems = useSelector((state) => state.cartReducer?.cartItems || []);

  const handlePlaceOrder = async () => {
    const userData = JSON.parse(localStorage.getItem("userData")) || {};
    const userID = userData._id || userData.id || "guest";
    const userName = userData.name || userData.username || "Guest User";

    const orderPayload = cartItems.map((item) => ({
      title: item.title || item.name,
      image: item.image,
      price: item.price,
      quantity: item.quantity || 1,
      paymentMethod,
      status: 'Placed',
      userID,
      userName,
    }));

    try {
      await axios.post(`${process.env.REACT_APP_BASEURL}/orders`, orderPayload);
    } catch (err) {
      console.error('Order save failed:', err);
    }

    Swal.fire({
      title: 'Order Placed!',
      text: `Delivery in 2–3 business days. Payment: ${paymentMethod.toUpperCase()}`,
      icon: 'success',
      confirmButtonColor: '#C9A84C',
      background: '#111',
      color: '#f5f5f0',
    }).then(() => {
      dispatch(clearCart());
      navigate('/');
    });
  };

  return (
    <Box className="pay-page">
      <style>{darkStyles}</style>
      <Box maxW="700px" mx="auto" px={{ base: '6', md: '12' }} py={{ base: '10', md: '16' }}>

        {/* Steps header */}
        <Flex mb="10" align="center" gap="4">
          {['Shipping', 'Payment'].map((s, i) => (
            <React.Fragment key={s}>
              <Flex align="center" gap="2">
                <Box w="6" h="6" bg={step >= i + 1 ? '#C9A84C' : 'transparent'} border="1px solid" borderColor={step >= i + 1 ? '#C9A84C' : 'rgba(255,255,255,0.15)'} display="flex" alignItems="center" justifyContent="center">
                  <Text fontFamily="'DM Sans', sans-serif" fontSize="10px" color={step >= i + 1 ? '#0a0a0a' : 'rgba(245,245,240,0.3)'} fontWeight="600">{i + 1}</Text>
                </Box>
                <Text fontFamily="'DM Sans', sans-serif" fontSize="11px" letterSpacing="0.15em" textTransform="uppercase" color={step >= i + 1 ? '#f5f5f0' : 'rgba(245,245,240,0.3)'}>{s}</Text>
              </Flex>
              {i < 1 && <Box flex="1" h="1px" bg={step > 1 ? '#C9A84C' : 'rgba(255,255,255,0.07)'} />}
            </React.Fragment>
          ))}
        </Flex>

        {/* Progress */}
        <Box mb="10">
          <div className="pay-progress-track">
            <div className="pay-progress-fill" style={{ width: step === 1 ? '50%' : '100%' }} />
          </div>
        </Box>

        {/* Form */}
        <Box mb="10">
          {step === 1 ? <ShippingForm /> : <PaymentForm paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} />}
        </Box>

        {/* Buttons */}
        <Flex justify="space-between" pt="6" borderTop="1px solid rgba(255,255,255,0.07)">
          <button
            onClick={() => setStep(step - 1)}
            disabled={step === 1}
            style={{
              background: 'transparent', border: '1px solid rgba(255,255,255,0.15)',
              color: step === 1 ? 'rgba(245,245,240,0.2)' : '#f5f5f0',
              fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: '0.2em',
              textTransform: 'uppercase', padding: '14px 28px', cursor: step === 1 ? 'not-allowed' : 'pointer',
            }}
          >
            ← Back
          </button>

          {step === 1 ? (
            <button
              onClick={() => setStep(2)}
              style={{
                background: '#C9A84C', border: 'none', color: '#0a0a0a',
                fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: '0.2em',
                textTransform: 'uppercase', fontWeight: 500, padding: '14px 32px', cursor: 'pointer',
              }}
            >
              Continue →
            </button>
          ) : (
            <button
              onClick={handlePlaceOrder}
              style={{
                background: '#C9A84C', border: 'none', color: '#0a0a0a',
                fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: '0.2em',
                textTransform: 'uppercase', fontWeight: 500, padding: '14px 32px', cursor: 'pointer',
              }}
            >
              Place Order →
            </button>
          )}
        </Flex>
      </Box>
    </Box>
  );
}