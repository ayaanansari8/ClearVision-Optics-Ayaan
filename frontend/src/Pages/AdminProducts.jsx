import React, { useEffect, useState } from "react";
import {
  Button,
  Image,
  ButtonGroup,
  Flex,
  Icon,
  IconButton,
  SimpleGrid,
  Stack,
  chakra,
  useColorModeValue,
  Heading,
  Text,
  Badge,
  useToast,
  Link,
} from "@chakra-ui/react";
import { AiFillEdit } from "react-icons/ai";
import { BsFillTrashFill } from "react-icons/bs";
import axios from "axios";
import AdminNavbar from "../AdminPage/AdminNavbar";

const LOW_STOCK_THRESHOLD = 5;

const AdminProducts = () => {
  const [data, setData] = useState([]);
  const [update, setUpdate] = useState(false);
  const toast = useToast();

  const handleDelete = (id) => {
    axios
      .delete(`${process.env.REACT_APP_BASEURL}/eyeglasses/delete/${id}`)
      .then((res) => {
        toast({
          title: `Product with ID:${id} deleted successfully!!`,
          status: "success",
          isClosable: true,
          duration: 4000,
          position: "top",
        });
        setUpdate(!update);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASEURL}/eyeglasses`)
      .then((res) => setData(res.data))
      .catch((err) => console.log(err));
  }, [update]);

  const bg = useColorModeValue("white", "gray.800");
  const bg2 = useColorModeValue("white", "gray.800");
  const bg3 = useColorModeValue("gray.100", "gray.700");

  const getStockBadge = (stock) => {
    if (stock === 0)
      return <Badge colorScheme="red" fontSize="0.8em">Out of Stock</Badge>;
    if (stock <= LOW_STOCK_THRESHOLD)
      return <Badge colorScheme="orange" fontSize="0.8em">Low Stock</Badge>;
    return <Badge colorScheme="green" fontSize="0.8em">In Stock</Badge>;
  };

  return (
    <>
      <AdminNavbar />
      <Text fontSize={"2xl"} w={"100%"} m={"auto"} textDecoration={"underline"}>
        List of All Products
      </Text>
      <Flex w="full" p={5} alignItems="center" justifyContent="center">
        <Stack direction={{ base: "column" }} w="full" bg={{ md: bg }} shadow="lg">
          {data.map((token, tid) => {
            return (
              <Flex direction={{ base: "row", md: "column" }} bg={bg2} key={tid}>
                {/* Header Row */}
                <SimpleGrid
                  spacingY={3}
                  columns={{ base: 1, md: 7 }}
                  w={{ base: 120, md: "full" }}
                  textTransform="uppercase"
                  bg={bg3}
                  color={"black"}
                  py={{ base: 1, md: 4 }}
                  px={{ base: 2, md: 10 }}
                  fontSize="md"
                  fontWeight="medium"
                >
                  <span>Name</span>
                  <span>Price</span>
                  <span>Rating</span>
                  <span>Stock Qty</span>
                  <span>Stock Status</span>
                  <span>Image</span>
                  <chakra.span textAlign={{ md: "right" }}>Action</chakra.span>
                </SimpleGrid>

                {/* Data Row */}
                <SimpleGrid
                  spacingY={3}
                  columns={{ base: 1, md: 7 }}
                  alignItems={"center"}
                  w="full"
                  py={2}
                  px={10}
                  textColor={"gray.500"}
                  fontWeight="semibold"
                >
                  <span>{token.title}</span>

                  <chakra.span textOverflow="ellipsis" overflow="hidden" whiteSpace="nowrap">
                    ₹{token.price}
                  </chakra.span>

                  <chakra.span textOverflow="ellipsis" overflow="hidden" whiteSpace="nowrap">
                    {token.rating}
                  </chakra.span>

                  {/* Stock Quantity */}
                  <chakra.span
                    fontWeight="bold"
                    color={
                      token.stock === 0
                        ? "red.500"
                        : token.stock <= LOW_STOCK_THRESHOLD
                        ? "orange.400"
                        : "green.500"
                    }
                  >
                    {token.stock ?? 0} units
                  </chakra.span>

                  {/* Stock Alert Badge */}
                  <Flex alignItems="center">
                    {getStockBadge(token.stock ?? 0)}
                  </Flex>

                  <Flex justifyContent={"center"}>
                    <Image w={"100px"} src={token.image} />
                  </Flex>

                  <Flex justify={{ base: "center", md: "end" }}>
                    <ButtonGroup variant="solid" size="sm" spacing={3}>
                      <Link href={`/adminproducts/update/${token._id}`}>
                        <IconButton
                          colorScheme="green"
                          icon={<AiFillEdit />}
                          aria-label="Edit"
                        />
                      </Link>
                      <IconButton
                        onClick={() => handleDelete(token._id)}
                        colorScheme="red"
                        variant="solid"
                        icon={<BsFillTrashFill />}
                        aria-label="Delete"
                      />
                    </ButtonGroup>
                  </Flex>
                </SimpleGrid>
              </Flex>
            );
          })}
        </Stack>
      </Flex>
    </>
  );
};

export default AdminProducts;