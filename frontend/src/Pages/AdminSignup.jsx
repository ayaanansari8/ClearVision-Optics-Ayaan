import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    HStack,
    InputRightElement,
    Stack,
    Button,
    Heading,
    Text,
    useColorModeValue,
    Link,
    useToast,
  } from '@chakra-ui/react';
  import { useState } from 'react';
  import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
  import axios from 'axios';
import { useNavigate } from 'react-router-dom';
  
  export default function AdminSignup() {
    const [showPassword, setShowPassword] = useState(false);
    const [name,setName]=useState("");
    const [phone,setPhone]=useState("");
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [loading, setLoading]=useState(false);
    const toast=useToast();
    const navigate=useNavigate()

    const handleSubmit=()=>{
        if(!name || !phone || !email || !password){
          toast({ title:"Please fill in all fields", status:"warning", duration:3000, isClosable:true, position:"top" });
          return;
        }
        const payload={name,phone,email,password};
        setLoading(true);
        axios.post(`${process.env.REACT_APP_BASEURL || "http://localhost:8080"}/admin/register`,payload)
        .then((res)=>{
            console.log(res);
            if(res.data.error){
              toast({ title:res.data.error, status:"error", duration:4000, isClosable:true, position:"top" });
            }
            else if(res.data.message==="Already Register please login"){
              toast({ title:"Already registered, please login", status:"info", duration:4000, isClosable:true, position:"top" });
            }
            else if(res.data.message==="Admin Registered Successfully"){
              setName(""); setPhone(""); setEmail(""); setPassword("");
              toast({ title:"Admin Registered Successfully!!", description:"Please Login now!", status:"success", duration:4000, isClosable:true, position:"top" });
              navigate("/adminlogin");
            }
        })
        .catch((err)=>{
            console.log(err);
            toast({ title:"Something went wrong. Please try again.", status:"error", duration:4000, isClosable:true, position:"top" });
        })
        .finally(()=>{
          setLoading(false);
        });
    }
  
    return (
      <Flex
        minH={'100vh'}
        align={'center'}
        justify={'center'}
        bg={useColorModeValue('gray.50', 'gray.800')}>
        <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
          <Stack align={'center'}>
            <Heading fontSize={'4xl'} textAlign={'center'}>
              Admin Signup
            </Heading>
          </Stack>
          <Box
            rounded={'lg'}
            bg={useColorModeValue('white', 'gray.700')}
            boxShadow={'lg'}
            p={8}>
            <Stack spacing={4}>
              <HStack>
                <Box>
                  <FormControl id="name" isRequired>
                    <FormLabel>Name</FormLabel>
                    <Input value={name} type="text" onChange={(e)=>setName(e.target.value)} />
                  </FormControl>
                </Box>
                <Box>
                  <FormControl id="phone" isRequired>
                    <FormLabel>Phone</FormLabel>
                    <Input value={phone} type="number" htmlSize="10" onChange={(e)=>setPhone(e.target.value)} />
                  </FormControl>
                </Box>
              </HStack>
              <FormControl id="email" isRequired>
                <FormLabel>Email address</FormLabel>
                <Input value={email} type="email" onChange={(e)=>setEmail(e.target.value)} />
              </FormControl>
              <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input value={password} type={showPassword ? 'text' : 'password'} onChange={(e)=>setPassword(e.target.value)} />
                  <InputRightElement h={'full'}>
                    <Button
                      variant={'ghost'}
                      onClick={() => setShowPassword((showPassword) => !showPassword)}>
                      {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <Stack spacing={10} pt={2}>
                <Button
                  onClick={handleSubmit}
                  isLoading={loading}
                  loadingText="Submitting..."
                  size="lg"
                  bg={'#11DAAC'}
                  color={'white'}
                  _hover={{ bg: '#0ec99b' }}>
                  Sign up
                </Button>
              </Stack>
              <Stack pt={6}>
                <Text align={'center'}>
                  Already a admin? <Link href='/adminlogin' color={'blue.400'}>Login</Link>
                </Text>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    );
  }