import React, { useState } from 'react';
import {
    Progress, Box, ButtonGroup, Button, Heading, Flex,
    FormControl, GridItem, FormLabel, Input, Select,
    SimpleGrid, InputGroup, InputRightElement, RadioGroup,
    Radio, Stack, Text, Divider, VStack, HStack, Image,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useToast } from '@chakra-ui/react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart } from '../../redux/cartReducer/action';
import axios from 'axios';

// ── Step 1: Shipping Address ──────────────────────────────────────────────────
const Form2 = () => (
    <>
        <Heading w="100%" textAlign={'center'} fontWeight="normal" mb="2%">
            Shipping Address
        </Heading>
        <FormControl isRequired as={GridItem} colSpan={[6, 3]}>
            <FormLabel fontSize="sm" fontWeight="md" color="gray.700">Country / Region</FormLabel>
            <Select placeholder="Select option" focusBorderColor="brand.400" shadow="sm" size="sm" w="full" rounded="md">
                <option>India</option>
                <option>United States</option>
                <option>Canada</option>
                <option>United Kingdom</option>
                <option>Australia</option>
            </Select>
        </FormControl>

        <FormControl isRequired as={GridItem} colSpan={6} mt="2%">
            <FormLabel fontSize="sm" fontWeight="md" color="gray.700">Street address</FormLabel>
            <Input type="text" focusBorderColor="brand.400" shadow="sm" size="sm" w="full" rounded="md" />
        </FormControl>

        <SimpleGrid columns={3} spacing={4} mt="2%">
            <FormControl isRequired>
                <FormLabel fontSize="sm" fontWeight="md" color="gray.700">City</FormLabel>
                <Input type="text" focusBorderColor="brand.400" shadow="sm" size="sm" rounded="md" />
            </FormControl>
            <FormControl isRequired>
                <FormLabel fontSize="sm" fontWeight="md" color="gray.700">State</FormLabel>
                <Input type="text" focusBorderColor="brand.400" shadow="sm" size="sm" rounded="md" />
            </FormControl>
            <FormControl isRequired>
                <FormLabel fontSize="sm" fontWeight="md" color="gray.700">PIN Code</FormLabel>
                <Input type="text" focusBorderColor="brand.400" shadow="sm" size="sm" rounded="md" />
            </FormControl>
        </SimpleGrid>

        <FormControl isRequired mt="2%">
            <FormLabel fontSize="sm" fontWeight="md" color="gray.700">Phone Number</FormLabel>
            <Input type="tel" placeholder="+91 XXXXX XXXXX" focusBorderColor="brand.400" shadow="sm" size="sm" w="full" rounded="md" />
        </FormControl>
    </>
);

// ── Step 2: Payment ───────────────────────────────────────────────────────────
const Form3 = ({ paymentMethod, setPaymentMethod }) => {
    const [showCVV, setShowCVV] = useState(false);

    return (
        <>
            <Heading w="100%" textAlign={'center'} fontWeight="normal" mb="6%">
                Payment
            </Heading>

            {/* Payment Method Selector */}
            <FormControl mb="6">
                <FormLabel fontWeight="semibold" fontSize="sm" color="gray.700" mb="3">
                    Select Payment Method
                </FormLabel>
                <RadioGroup value={paymentMethod} onChange={setPaymentMethod}>
                    <Stack spacing="3">
                        {/* Card */}
                        <Box
                            border="2px solid"
                            borderColor={paymentMethod === 'card' ? 'teal.400' : 'gray.200'}
                            rounded="md"
                            p="4"
                            cursor="pointer"
                            onClick={() => setPaymentMethod('card')}
                            transition="all 0.2s"
                        >
                            <Radio value="card" colorScheme="teal">
                                <HStack spacing="3">
                                    <Text fontWeight="500">Credit / Debit Card</Text>
                                    <HStack spacing="1">
                                        <Text fontSize="xs" bg="blue.600" color="white" px="2" py="0.5" rounded="sm">VISA</Text>
                                        <Text fontSize="xs" bg="red.500" color="white" px="2" py="0.5" rounded="sm">MC</Text>
                                        <Text fontSize="xs" bg="blue.400" color="white" px="2" py="0.5" rounded="sm">RUPAY</Text>
                                    </HStack>
                                </HStack>
                            </Radio>
                        </Box>

                        {/* UPI */}
                        <Box
                            border="2px solid"
                            borderColor={paymentMethod === 'upi' ? 'teal.400' : 'gray.200'}
                            rounded="md"
                            p="4"
                            cursor="pointer"
                            onClick={() => setPaymentMethod('upi')}
                            transition="all 0.2s"
                        >
                            <Radio value="upi" colorScheme="teal">
                                <HStack spacing="3">
                                    <Text fontWeight="500">UPI</Text>
                                    <HStack spacing="1">
                                        <Text fontSize="xs" bg="green.500" color="white" px="2" py="0.5" rounded="sm">GPay</Text>
                                        <Text fontSize="xs" bg="blue.500" color="white" px="2" py="0.5" rounded="sm">PhonePe</Text>
                                        <Text fontSize="xs" bg="orange.400" color="white" px="2" py="0.5" rounded="sm">Paytm</Text>
                                    </HStack>
                                </HStack>
                            </Radio>
                        </Box>

                        {/* COD */}
                        <Box
                            border="2px solid"
                            borderColor={paymentMethod === 'cod' ? 'teal.400' : 'gray.200'}
                            rounded="md"
                            p="4"
                            cursor="pointer"
                            onClick={() => setPaymentMethod('cod')}
                            transition="all 0.2s"
                        >
                            <Radio value="cod" colorScheme="teal">
                                <Text fontWeight="500">Cash on Delivery</Text>
                            </Radio>
                        </Box>
                    </Stack>
                </RadioGroup>
            </FormControl>

            <Divider mb="4" />

            {/* Card Fields */}
            {paymentMethod === 'card' && (
                <SimpleGrid columns={1} spacing={4}>
                    <FormControl isRequired>
                        <FormLabel fontSize="sm">Card Number</FormLabel>
                        <Input type="text" placeholder="1234 5678 9012 3456" maxLength={19} />
                    </FormControl>
                    <SimpleGrid columns={2} spacing={4}>
                        <FormControl isRequired>
                            <FormLabel fontSize="sm">Expiry Date</FormLabel>
                            <Input type="text" placeholder="MM/YY" maxLength={5} />
                        </FormControl>
                        <FormControl isRequired>
                            <FormLabel fontSize="sm">CVV</FormLabel>
                            <InputGroup>
                                <Input type={showCVV ? 'text' : 'password'} placeholder="•••" maxLength={4} />
                                <InputRightElement>
                                    <Button variant="ghost" size="sm" onClick={() => setShowCVV(!showCVV)}>
                                        {showCVV ? <ViewOffIcon /> : <ViewIcon />}
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                        </FormControl>
                    </SimpleGrid>
                    <FormControl isRequired>
                        <FormLabel fontSize="sm">Name on Card</FormLabel>
                        <Input type="text" placeholder="As printed on card" />
                    </FormControl>
                </SimpleGrid>
            )}

            {/* UPI Fields */}
            {paymentMethod === 'upi' && (
                <SimpleGrid columns={1} spacing={4}>
                    <FormControl isRequired>
                        <FormLabel fontSize="sm">UPI ID</FormLabel>
                        <Input type="text" placeholder="yourname@upi" />
                    </FormControl>
                    <Text fontSize="xs" color="gray.500">
                        Enter your UPI ID (e.g. name@okaxis, name@ybl, name@paytm)
                    </Text>
                </SimpleGrid>
            )}

            {/* COD Info */}
            {paymentMethod === 'cod' && (
                <Box bg="orange.50" border="1px solid" borderColor="orange.200" rounded="md" p="4">
                    <VStack align="start" spacing="2">
                        <Text fontWeight="600" color="orange.700" fontSize="sm">Cash on Delivery</Text>
                        <Text fontSize="sm" color="gray.600">Pay with cash when your order is delivered. Additional ₹49 COD fee applies.</Text>
                        <Text fontSize="xs" color="gray.500">Available for orders up to ₹10,000.</Text>
                    </VStack>
                </Box>
            )}
        </>
    );
};

// ── Main Payment Component ────────────────────────────────────────────────────
export default function Payment() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [step, setStep] = useState(1);
    const [progress, setProgress] = useState(50);
    const [paymentMethod, setPaymentMethod] = useState('card');

    const cartItems = useSelector((state) => state.cartReducer?.cartItems || []);

    const handlePlaceOrder = async () => {
        const orderPayload = cartItems.map((item) => ({
            title: item.title || item.name,
            image: item.image,
            price: item.price,
            quantity: item.quantity || 1,
            paymentMethod,
            status: 'Placed',
        }));

        try {
            await axios.post(`${process.env.REACT_APP_BASEURL}/order`, orderPayload);
        } catch (err) {
            console.error('Order save failed:', err);
        }

        Swal.fire({
            title: 'Order Placed!!',
            text: `Your order will be delivered in 5-8 business days. Payment: ${paymentMethod.toUpperCase()}`,
            icon: 'success',
            confirmButtonColor: '#00bac6',
        }).then(() => {
            dispatch(clearCart());
            navigate('/');
        });
    };

    return (
        <Box
            borderWidth="1px"
            rounded="lg"
            shadow="1px 1px 3px rgba(0,0,0,0.3)"
            maxWidth={800}
            p={6}
            m="10px auto"
        >
            <Progress hasStripe value={progress} mb="5%" mx="5%" isAnimated colorScheme="teal" />

            {step === 1 ? <Form2 /> : <Form3 paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} />}

            <ButtonGroup mt="5%" w="100%">
                <Flex w="100%" justifyContent="space-between">
                    <Flex>
                        <Button
                            onClick={() => { setStep(step - 1); setProgress(50); }}
                            isDisabled={step === 1}
                            colorScheme="teal"
                            variant="solid"
                            w="7rem"
                            mr="5%">
                            Back
                        </Button>
                        <Button
                            w="7rem"
                            isDisabled={step === 2}
                            onClick={() => { setStep(2); setProgress(100); }}
                            colorScheme="teal"
                            variant="outline">
                            Next
                        </Button>
                    </Flex>
                    {step === 2 && (
                        <Button
                            w="9rem"
                            colorScheme="teal"
                            variant="solid"
                            onClick={handlePlaceOrder}>
                            Place Order
                        </Button>
                    )}
                </Flex>
            </ButtonGroup>
        </Box>
    );
}
