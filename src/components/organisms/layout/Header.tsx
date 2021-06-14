import { Avatar } from "@chakra-ui/avatar";
import { Button } from "@chakra-ui/button";
import { FormLabel } from "@chakra-ui/form-control";
import { useDisclosure } from "@chakra-ui/hooks";
import { AddIcon } from "@chakra-ui/icons";
import { Box, Flex, Heading, Spacer, Stack, Wrap, WrapItem } from "@chakra-ui/layout";
import { Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay } from "@chakra-ui/modal";
import { Textarea } from "@chakra-ui/textarea";
import React, { Children, FC, useEffect } from "react";
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
import { NewPost } from "./NewPost";
import { ProfileDetail } from "./ProfileDetail";


export const Header:FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const profile = useSelector(selectMyProfile);
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
                        
                        <ProfileDetail 
                            children={"プロフィール"}
                        />
                        
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
                
                <NewPost />
                

            </Flex>
        </>
    )
}