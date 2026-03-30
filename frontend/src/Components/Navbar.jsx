import React from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { HiShoppingBag } from "react-icons/hi";
import { AiOutlineSearch } from "react-icons/ai";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import {
  Box, HStack, Text, Button, Flex, Link,
  Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton,
  DrawerHeader, DrawerBody, VStack, Divider, useDisclosure,
  IconButton,
} from "@chakra-ui/react";
import Login from "../Pages/login/Login";
import Signup from "../Pages/Signup/Signup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MobileNav from "./MobileNav";

const Navbar = () => {
  let isAuth = JSON.parse(localStorage.getItem("auth")) || false;
  let userdata = JSON.parse(localStorage.getItem("userData")) || {};
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleLogout = () => {
    localStorage.removeItem("auth");
    localStorage.removeItem("userData");
    localStorage.removeItem("token");
    toast.success("Logout Successful!", { position: toast.POSITION.TOP_RIGHT });
    setTimeout(() => navigate("/"), 1000);
    onClose();
  };

  const navLinkStyle = {
    fontSize: "13px",
    letterSpacing: "0.12em",
    color: "#1a1a1a",
    textTransform: "uppercase",
    fontFamily: "'DM Sans', sans-serif",
    padding: "12px 0",
    borderBottom: "1px solid rgba(0,0,0,0.06)",
    display: "block",
    width: "100%",
  };

  return (
    <Box position="sticky" top="0" zIndex="1000" bg="white" boxShadow="sm">
      <ToastContainer />

      {/* Announcement bar */}
      <Box bg="black" color="white" textAlign="center" py="2" fontSize="12px" letterSpacing="0.1em">
        FREE SHIPPING ON ORDERS ABOVE ₹999 · TRY AT HOME — 5 FRAMES FREE
      </Box>

      {/* Desktop Navbar */}
      <Box
        display={{ base: "none", xl: "block" }}
        px={{ xl: "40px", "2xl": "80px" }}
        py="3"
        bg="white"
        borderBottom="1px solid"
        borderColor="gray.100"
      >
        <Flex align="center" justify="space-between">

          {/* Hamburger + Left nav links */}
          <HStack spacing="8" flex="1">
            <IconButton
              icon={<HamburgerIcon />}
              variant="ghost"
              size="sm"
              aria-label="Menu"
              onClick={onOpen}
              color="gray.700"
              _hover={{ color: "black" }}
            />
            <Link as={RouterLink} to="/eyeglasses" fontSize="13px" letterSpacing="0.08em" color="gray.700" _hover={{ color: "black" }}>
              EYEGLASSES
            </Link>
            <Link as={RouterLink} to="/sunglasses" fontSize="13px" letterSpacing="0.08em" color="gray.700" _hover={{ color: "black" }}>
              SUNGLASSES
            </Link>
            <Link as={RouterLink} to="/contact-lenses" fontSize="13px" letterSpacing="0.08em" color="gray.700" _hover={{ color: "black" }}>
              CONTACT LENSES
            </Link>
          </HStack>

          {/* Logo center */}
          <Box flex="1" textAlign="center">
            <RouterLink to="/">
              <Text fontSize="22px" letterSpacing="0.15em" fontWeight="400" fontFamily="'Cormorant Garamond', serif" display="inline">
                CLEAR <span style={{ color: "#C9A84C", fontStyle: "italic" }}>Vision</span>
              </Text>
            </RouterLink>
          </Box>

          {/* Right icons */}
          <HStack spacing="6" flex="1" justify="flex-end">
            <Box cursor="pointer" color="gray.700" _hover={{ color: "black" }}>
              <AiOutlineSearch fontSize="20px" />
            </Box>
            {isAuth ? (
              <>
                <Text fontSize="13px" color="gray.700">Hi, {userdata.name?.split(" ")[0] || "User"}</Text>
                {userdata.role === "admin" && (
                  <Link as={RouterLink} to="/admindashboard" fontSize="13px" letterSpacing="0.08em" color="gray.700" _hover={{ color: "black" }}>ADMIN</Link>
                )}
                <Link as={RouterLink} to="/myorders" fontSize="13px" letterSpacing="0.08em" color="gray.700" _hover={{ color: "black" }}>MY ORDERS</Link>
                <Button size="sm" variant="ghost" fontSize="13px" letterSpacing="0.08em" onClick={handleLogout}>SIGN OUT</Button>
              </>
            ) : (
              <>
                <Login />
                <Signup />
              </>
            )}
            <RouterLink to="/cart">
              <Box color="gray.700" _hover={{ color: "black" }}>
                <HiShoppingBag fontSize="22px" />
              </Box>
            </RouterLink>
          </HStack>
        </Flex>
      </Box>

      {/* Mobile Navbar */}
      <MobileNav />

      {/* Hamburger Drawer */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="xs">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton mt="2" />
          <DrawerHeader borderBottom="1px solid" borderColor="gray.100" pb="4">
            <Text fontSize="18px" letterSpacing="0.15em" fontWeight="400" fontFamily="'Cormorant Garamond', serif">
              CLEAR <span style={{ color: "#C9A84C", fontStyle: "italic" }}>Vision</span>
            </Text>
          </DrawerHeader>

          <DrawerBody px="6" py="4">
            <VStack align="flex-start" spacing="0" w="full">

              {/* Shop links */}
              <Text fontSize="10px" letterSpacing="0.2em" color="gray.400" textTransform="uppercase" mb="2" mt="2">
                Shop
              </Text>
              <RouterLink to="/" onClick={onClose} style={{ ...navLinkStyle }}>Home</RouterLink>
              <RouterLink to="/eyeglasses" onClick={onClose} style={{ ...navLinkStyle }}>Eyeglasses</RouterLink>
              <RouterLink to="/sunglasses" onClick={onClose} style={{ ...navLinkStyle }}>Sunglasses</RouterLink>
              <RouterLink to="/contact-lenses" onClick={onClose} style={{ ...navLinkStyle }}>Contact Lenses</RouterLink>

              <Divider my="4" />

              {/* Account links */}
              <Text fontSize="10px" letterSpacing="0.2em" color="gray.400" textTransform="uppercase" mb="2">
                Account
              </Text>

              {isAuth ? (
                <>
                  <Text fontSize="13px" color="gray.500" pb="3">
                    Hi, {userdata.name?.split(" ")[0] || "User"}
                  </Text>
                  <RouterLink to="/myorders" onClick={onClose} style={{ ...navLinkStyle }}>My Orders</RouterLink>
                  <RouterLink to="/cart" onClick={onClose} style={{ ...navLinkStyle }}>Cart</RouterLink>
                  {userdata.role === "admin" && (
                    <RouterLink to="/admindashboard" onClick={onClose} style={{ ...navLinkStyle }}>Admin Dashboard</RouterLink>
                  )}
                  <Box pt="4" w="full">
                    <Button
                      w="full"
                      size="sm"
                      variant="outline"
                      fontSize="12px"
                      letterSpacing="0.12em"
                      onClick={handleLogout}
                      borderRadius="none"
                    >
                      SIGN OUT
                    </Button>
                  </Box>
                </>
              ) : (
                <>
                  <RouterLink to="/cart" onClick={onClose} style={{ ...navLinkStyle }}>Cart</RouterLink>
                  <HStack pt="4" spacing="3" w="full">
                    <Box flex="1">
                      <Login />
                    </Box>
                    <Box flex="1">
                      <Signup />
                    </Box>
                  </HStack>
                </>
              )}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default Navbar;