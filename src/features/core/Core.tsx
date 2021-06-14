import { Avatar } from "@chakra-ui/avatar";
import { Button } from "@chakra-ui/button";
import { FormLabel } from "@chakra-ui/form-control";
import { useDisclosure } from "@chakra-ui/hooks";
import { AddIcon } from "@chakra-ui/icons";
import { Box, Flex, Grid, Heading, Spacer, Stack, Wrap, WrapItem } from "@chakra-ui/layout";
import { Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay } from "@chakra-ui/modal";
import { Textarea } from "@chakra-ui/textarea";
import { Progress } from "@chakra-ui/progress";

import React, { FC, useEffect } from "react";
import  { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store"

import { Auth } from "../../components/Auth";
import { Header } from "../../components/organisms/layout/Header";
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
    selectProfiles,
} from "../auth/authSlice"
import {
    selectPosts,
    selectIsLoadingPost,
    setOpenNewPost,
    resetOpenNewPost,
    fetchAsyncGetPosts,
    fetchAsyncGetComments,
} from "../post/postSlice";
import { Post } from "../../components/organisms/layout/Post";

export const Core: FC = () => {

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
            <Header />
            <Auth />
            {(isLoadingPost || isLoadingAuth) && <Progress size="xs" isIndeterminate color="teal" /> }
            { profile.user_name && (
                <>
                <Grid templateColumns="repeat(2, 1fr)" pt="100px" >
                    {posts.slice(0).reverse().map((post) => (
                        <Box key={post.id} maxW="100%" bg="gray.100" borderWidth="2px" borderColor="black.200" borderRadius="lg" overflow="hidden" m={5} >
                            <Post
                                id={post.id}
                                loginId={profile.user_profile}
                                user_post={post.user_post}
                                body={post.body}
                                image={post.image}
                                liked={post.liked}
                            />

                        </Box>
                    ))}
                </Grid>
                </>
            )}
        </>
        
    );
};
