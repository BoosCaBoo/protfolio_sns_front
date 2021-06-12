import { Avatar } from "@chakra-ui/avatar";
import { Button } from "@chakra-ui/button";
import { FormLabel } from "@chakra-ui/form-control";
import { useDisclosure } from "@chakra-ui/hooks";
import { AddIcon } from "@chakra-ui/icons";
import { Box, Flex, Heading, Spacer, Stack, Wrap, WrapItem } from "@chakra-ui/layout";
import { Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay } from "@chakra-ui/modal";
import { Textarea } from "@chakra-ui/textarea";
import React, { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../app/store";


import {
    selectMyProfile,
    selectIsLoadingAuth,
    setOpenSignIn,
    resetOpenSignIn,
    setOpenSignUp,
    resetOpenSignUp,
    setOpenProfile,
    resetOpenProfile,
    fetchAsyncLogin,
    fetchAsyncGetMyProf,
    fetchAsyncGetProfs,
} from "../../../features/auth/authSlice";


import {
    selectPosts,
    selectIsLoadingPost,
    setOpenNewPost,
    resetOpenNewPost,
    fetchAsyncGetPosts,
    fetchAsyncGetComments,
} from "../../../features/post/postSlice";


export const Header:FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const profile = useSelector(selectMyProfile);
    const posts = useSelector(selectPosts);
    const isLoadingAuth = useSelector(selectIsLoadingAuth);
    const isLoadingPost = useSelector(selectIsLoadingPost);

    useEffect(() => {
        const fetchBootLoader = async () => {
          if (localStorage.localJWT) {
            dispatch(resetOpenSignIn());
            const result = await dispatch(fetchAsyncGetMyProf());

            if (fetchAsyncGetMyProf.rejected.match(result)) {
              dispatch(setOpenSignIn());
              return null;
            }
            await dispatch(fetchAsyncGetPosts());
            await dispatch(fetchAsyncGetProfs());
            await dispatch(fetchAsyncGetComments());
          }
        };
        fetchBootLoader();
      }, [dispatch]);





    const { isOpen, onOpen, onClose } = useDisclosure();


    return (
        <>
            <Flex
                as="nav"
                bg="teal.500"
                color="gray.50"
                align="center"
                justify="space-between"
                padding={{ base: 3, md: 5}}
                position="fixed"
                w="100%"
                h={100}
                zIndex="1"
            >
                <Flex
                    align="center"
                    as="a"
                    mr={8}
                    _hover={{ cursor: "pointer" }}
                >
                    <Heading as="h2" size="xl" fontSize={{ base: "md", md: "lg"}} >
                        SNS COLONE
                    </Heading>
                    <Flex
                        align="center"
                        fontSize="sm"
                        flexGrow={2}
                        display={{ base: "none", md: "flex"}}
                    >
                        <Box pr={4} pl={4} >
                            <Button colorScheme="teal">ホーム</Button>
                        
                        <Button colorScheme="teal">プロフィール</Button>
                        
                        <Button 
                            colorScheme="teal"
                            onClick={() => {
                                localStorage.removeItem("localJWT");
                                dispatch(resetOpenProfile());
                                dispatch(resetOpenNewPost());
                                dispatch(setOpenSignIn());
                            }}
                        >ログアウト
                        </Button>
                        </Box>
                    </Flex>
                </Flex>
                <Spacer/>
                <Wrap>
                    <WrapItem>
                        <Avatar
                            size="md"
                            src={profile?.avatar}
                        />{" "}
                    </WrapItem>
                </Wrap>
                
                <Button 
                    leftIcon={<AddIcon/>} 
                    colorScheme="teal" 
                    onClick={onOpen}
                    _hover={{ opacity: 0.6}}
                >
                    投稿
                </Button>
                
                <Drawer
                    isOpen={isOpen}
                    placement="right"
                    onClose={onClose}
                    size="sm"
                >   
                    <DrawerOverlay />
                    <DrawerContent>
                    <DrawerCloseButton/>
                    <DrawerHeader borderBottomWidth="1px">投稿をする</DrawerHeader>

                    <DrawerBody>
                        <Stack spacing="25px">
                            <Box>
                                <FormLabel htmlFor="desc">投稿内容</FormLabel>
                                    <Textarea htmlFor="desc" 
                                        id="body"
                                        placeholder="...150文字まで"
                                    ></Textarea>
                            </Box>        
                            <Box>
                                <h1>kokoni image</h1>
                            </Box>
                        </Stack>
                    </DrawerBody>
                    <DrawerFooter borderTopWidth="1px">
                        <Button variant="outline" mr={3} onClick={onClose}>キャンセル</Button>
                        <Button variant="blue" >投稿</Button>                                    
                    </DrawerFooter>                        
                    </DrawerContent>
                </Drawer>
                

            </Flex>
        </>
    )
}