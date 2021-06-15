import { Avatar } from "@chakra-ui/avatar";
import { Button } from "@chakra-ui/button";
import { Box, Flex, Heading, Spacer, Wrap, WrapItem } from "@chakra-ui/layout";
import React, { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../app/store";


import {
    selectMyProfile,
    setOpenSignIn,
    resetOpenSignIn,
    resetOpenProfile,
    fetchAsyncGetMyProf,
    fetchAsyncGetProfs,
} from "../../../features/auth/authSlice";


import {
    resetOpenNewPost,
    fetchAsyncGetPosts,
    fetchAsyncGetComments,
} from "../../../features/post/postSlice";
import { NewPost } from "./NewPost";
import { ProfileDetail } from "./ProfileDetail";


export const Header:FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const profile = useSelector(selectMyProfile);

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
                w="100%"
                h={100}
                zIndex="1"  
                position="fixed"          
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
                            size="lg"
                            src={profile?.avatar}
                            mr="5px"
                        />{" "}
                    </WrapItem>
                </Wrap>
                
                <NewPost />
                

            </Flex>
        </>
    )
}