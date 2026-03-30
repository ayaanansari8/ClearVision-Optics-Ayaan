import React, { useState } from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    FormControl,
    FormLabel,
    Input,
    Button,
    Select,
    useToast,
    Image,
    Box,
    Text,
    Spinner
} from '@chakra-ui/react'
import axios from 'axios';

const AdminNavbar = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();
    const initialRef = React.useRef(null);
    const finalRef = React.useRef(null);
    const [title, setTitle] = useState("");
    const [size, setSize] = useState("");
    const [rating, setRating] = useState("");
    const [price, setPrice] = useState("");
    const [shape, setShape] = useState("");
    const [image, setImage] = useState("");
    const [color, setColor] = useState("");
    const [category, setCategory] = useState("");
    const [uploading, setUploading] = useState(false);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "fkzjhcjs");

        setUploading(true);
        try {
            const res = await axios.post(
                `https://api.cloudinary.com/v1_1/dn94mcd3i/image/upload`,
                formData
            );
            setImage(res.data.secure_url);
            toast({
                title: "Image uploaded successfully",
                status: "success",
                isClosable: true,
                duration: 3000,
                position: "top"
            });
        } catch (err) {
            console.log(err);
            toast({
                title: "Image upload failed",
                status: "error",
                isClosable: true,
                duration: 3000,
                position: "top"
            });
        } finally {
            setUploading(false);
        }
    };

    const handleAdd = () => {
        if (!image) {
            toast({
                title: "Please upload an image first",
                status: "warning",
                isClosable: true,
                duration: 3000,
                position: "top"
            });
            return;
        }
        let payload = { title, size, rating, price, shape, image, color, category };
        axios.post(`${process.env.REACT_APP_BASEURL}/eyeglasses/add`, payload)
            .then((res) => {
                toast({
                    title: `Product added to Database`,
                    status: "success",
                    isClosable: true,
                    duration: 4000,
                    position: 'top'
                });
                setTitle(""); setSize(""); setRating(""); setPrice("");
                setShape(""); setImage(""); setColor(""); setCategory("");
                onClose();
            })
            .catch((err) => console.log(err));
    };

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <a className="navbar-brand" href="#" style={{ color: "#4A148C" }}>Welcome Admin</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item">
                            <a className="nav-link" href="/admindashboard">Dashboard</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/allusers">Users</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/adminproducts">Products</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/adminorders">Orders</a>
                        </li>
                        <li className="nav-item" onClick={onOpen}>
                            <a className="nav-link" href="#">Add Products</a>
                        </li>
                    </ul>
                </div>
            </nav>

            <Modal initialFocusRef={initialRef} finalFocusRef={finalRef} isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Add Product</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={2}>
                        <FormControl>
                            <FormLabel>Title</FormLabel>
                            <Input ref={initialRef} value={title} placeholder='Brand' onChange={(e) => setTitle(e.target.value)} />
                        </FormControl>

                        <FormControl mt={2}>
                            <FormLabel>Category</FormLabel>
                            <Select value={category} placeholder='Select category' onChange={(e) => setCategory(e.target.value)}>
                                <option value="Eyeglasses">Eyeglasses</option>
                                <option value="Sunglasses">Sunglasses</option>
                                <option value="Contact Lenses">Contact Lenses</option>
                                <option value="Frames">Frames</option>
                            </Select>
                        </FormControl>

                        <FormControl mt={2}>
                            <FormLabel>Size</FormLabel>
                            <Input value={size} placeholder='Size' onChange={(e) => setSize(e.target.value)} />
                        </FormControl>

                        <FormControl mt={2}>
                            <FormLabel>Rating</FormLabel>
                            <Input value={rating} placeholder='Rating' type='number' onChange={(e) => setRating(e.target.value)} />
                        </FormControl>

                        <FormControl mt={2}>
                            <FormLabel>Price</FormLabel>
                            <Input value={price} placeholder='Price' type='number' onChange={(e) => setPrice(e.target.value)} />
                        </FormControl>

                        <FormControl mt={2}>
                            <FormLabel>Shape</FormLabel>
                            <Input value={shape} placeholder='Shape' onChange={(e) => setShape(e.target.value)} />
                        </FormControl>

                        <FormControl mt={2}>
                            <FormLabel>Image</FormLabel>
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                p={1}
                            />
                            {uploading && (
                                <Box mt={2} display="flex" alignItems="center" gap={2}>
                                    <Spinner size="sm" color="#11DAAC" />
                                    <Text fontSize="sm" color="gray.500">Uploading...</Text>
                                </Box>
                            )}
                            {image && !uploading && (
                                <Box mt={2}>
                                    <Image src={image} alt="preview" maxH="100px" borderRadius="md" />
                                    <Text fontSize="xs" color="green.500" mt={1}>✓ Image uploaded</Text>
                                </Box>
                            )}
                        </FormControl>

                        <FormControl mt={2}>
                            <FormLabel>Color</FormLabel>
                            <Input value={color} placeholder='Color' onChange={(e) => setColor(e.target.value)} />
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button onClick={handleAdd} bgColor='#11DAAC' color={'white'} variant={'solid'} mr={3} isDisabled={uploading}>
                            Save
                        </Button>
                        <Button onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default AdminNavbar;