import { Avatar } from "@chakra-ui/avatar";
import { Image } from "@chakra-ui/image";
import { Box, Grid, GridItem, Spacer, Stack, Text, Wrap, WrapItem } from "@chakra-ui/layout";
import React, { FC, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../../app/store";

import { selectProfiles } from "../../../features/auth/authSlice";

import {
    selectComments,
    fetchPostStart,
    fetchPostEnd,
    fetchAsyncPostComment,
    fetchAsyncPatchLiked,
} from "../../../features/post/postSlice";

import { POST } from "../../../types/types";


export const Post: FC<POST> = (props) => {
    const { id, loginId, user_post, body, image, liked } = props;
    const dispatch: AppDispatch = useDispatch();
    const profiles = useSelector(selectProfiles);
    const comments = useSelector(selectComments);
    const [text, setText ] = useState("");

    const commentsOnPost = comments.filter((com) => {
        return com.post === id;
    });

    const prof = profiles.filter((prof) => {
        return prof.user_profile === user_post;
    });

    const postComment = async(e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        const packet = {body: text, post: id}
        await dispatch(fetchPostStart());
        await dispatch(fetchAsyncPostComment(packet));
        await dispatch(fetchPostEnd());
    };


    const handleLiked = async () => {
        const packet = {
            id: id,
            body: body,
            current: liked,
            new: loginId,
        };
        await dispatch(fetchPostStart());
        await dispatch(fetchAsyncPatchLiked(packet));
        await dispatch(fetchPostEnd());
    };

    if (body) {
        return (
            <Stack spacing={1} py={4} px={4} >
                <Box>
                <Grid 
                h="100%"
                templateColumns="repeat(2, 1fr)"
                gap={1}
                mb={2}
                >
                    <Avatar src={prof[0]?.avatar} />
                    <Text fontSize="lg" fontWeight="bold">{prof[0]?.user_name}</Text>
                </Grid>
                {image ? (             
                        <Image objectFit="cover" alt="" src={image} boxSize="300px" align="center" />
                    ): null}  
                <Box pt={4} isTruncated >{body}</Box>
                </Box>
            </Stack>
            
        )
    } return null
}