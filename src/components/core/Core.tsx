import { Box, SimpleGrid} from "@chakra-ui/layout";

import React, { FC, useEffect } from "react";
import  { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store"

import { Header } from "../organisms/layout/Header";
import {
    selectMyProfile,
    fetchAsyncGetMyProf,
    fetchAsyncGetProfs,
} from "../../features/auth/authSlice"
import {
    selectPosts,
    fetchAsyncGetPosts,
    fetchAsyncGetComments,
} from "../../features/post/postSlice";
import { Post } from "../organisms/layout/Post";


export const Core: FC = () => {

    const dispatch: AppDispatch = useDispatch();
    const profile = useSelector(selectMyProfile);
    const posts = useSelector(selectPosts);
    

    useEffect(() => {
        const fetchBootLoader = async () => {
          if (localStorage.localJWT) {
            const result = await dispatch(fetchAsyncGetMyProf());
            if (fetchAsyncGetMyProf.rejected.match(result)) {
              return null;
            }
            await dispatch(fetchAsyncGetPosts());
            await dispatch(fetchAsyncGetProfs());
            await dispatch(fetchAsyncGetComments());
          } else {
            window.location.href = "/";
          }
        };
        fetchBootLoader();
      }, [dispatch]);

    return (
        <>
            <Header />
            { profile.id && (
                <>
                <SimpleGrid columns={{ base: 1, lg: 2 }} pt="70px" >
                    {posts.slice(0).map((post) => (
                        <Box
                            key={post.id} 
                            maxW="100%" 
                            bg="gray.100" 
                            borderWidth="2px" 
                            borderColor="black.200" 
                            borderRadius="lg" 
                            overflow="hidden"
                            mx={5}
                            mt={5}
                        >
                            <Post
                                id={post.id}
                                loginId={profile.user_profile}
                                user_post={post.user_post}
                                body={post.body}
                                image={post.image}
                                liked={post.liked}
                                created={post.created}
                            />

                        </Box>
                    ))}
                </SimpleGrid>
                </>
            )}
        </>
        
    );
};
