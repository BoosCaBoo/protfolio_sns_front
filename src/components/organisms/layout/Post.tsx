import { Avatar, AvatarGroup } from "@chakra-ui/avatar";
import { Button } from "@chakra-ui/button";
import Icon from "@chakra-ui/icon";
import { DeleteIcon, StarIcon } from "@chakra-ui/icons";
import { Image } from "@chakra-ui/image";
import { Input, InputGroup } from "@chakra-ui/input";
import { Box, Grid, GridItem, Spacer, Stack, Text, Wrap, WrapItem } from "@chakra-ui/layout";
import { profile } from "console";
import { Checkbox, CheckboxWithLabel } from "formik-material-ui";
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
    fetchAsyncDeletePost,
} from "../../../features/post/postSlice";

import { POST, LIKED, DELETEPOST } from "../../../types/types";


export const Post: FC<POST> = (props) => {
    const { id, loginId, user_post, body, image, liked } = props;
    const dispatch: AppDispatch = useDispatch();
    const profiles = useSelector(selectProfiles);
    const comments = useSelector(selectComments);
    const [text, setText ] = useState("");
    const NullText = () => setText("");
    const [trash, setTrash] = useState(false);
    const switchTrash = () => setTrash(!trash);
    

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
        NullText();
        await dispatch(fetchPostEnd());
    };    

    const handleLiked = async () => {
        const packet: LIKED = {
            id: id,
            body: body,
            image: image,
            liked: liked,
            user_profile: loginId,
        };
        await dispatch(fetchPostStart());
        await dispatch(fetchAsyncPatchLiked(packet));
        await dispatch(fetchPostEnd());
    };

    const handleDelete = async () => {
        const packet: DELETEPOST = {
            id: id,
        };
        await dispatch(fetchPostStart());
        await dispatch(fetchAsyncDeletePost(packet));
        await dispatch(fetchPostEnd());
    }

    if (body) {
        return (
            <Stack spacing={1} py={4} px={4} >
                <Box>

                <Avatar src={prof[0]?.avatar} />
                <Text fontSize="lg" fontWeight="bold">{prof[0]?.user_name}</Text>  

                {user_post === loginId ? (
                    <Icon as={DeleteIcon} onClick={handleDelete}/>):(null)}

                  
                <Image objectFit="cover" alt="" src={image} boxSize="300px" align="center" />
                <Box pt={4} isTruncated >{body}</Box>

                {!liked.some((like) => like === loginId)  ? (
                    <Button
                        leftIcon={<StarIcon/>}
                        bg="gray.200"
                        onClick={handleLiked}
                        _hover={{ opacity: 1 }}
                    >いいね</Button>
                ): (
                    <Button
                        leftIcon={<StarIcon/>}
                        bg="red.200"
                        onClick={handleLiked}
                        _hover={{ opacity: 1 }}
                    >いいね済み</Button>
                )}
                <AvatarGroup size="md" max={7} >
                    {liked.map((like) => (
                        <Avatar key={like} name="" src={profiles.find((prof) => prof.user_profile === like)?.avatar} />
                    ))}
                </AvatarGroup>

                {commentsOnPost.map((comment) => (
                      
                    <Grid key={comment.id} templateColumns="repeat(7, 1fr)" templateRows="repeat(2, 1fr)" >
                        <GridItem colSpan={3} rowSpan={2} >
                            <Avatar
                            src={
                                profiles.find(
                                    (prof) => prof.user_profile === comment.user_comment
                                )?.avatar
                            }
                            />
                        </GridItem>
                        <GridItem colSpan={4} rowSpan={1} >
                            <Text>{
                                profiles.find(
                                    (prof) => prof.user_profile === comment.user_comment
                                )?.user_name
                                }</Text>
                        </GridItem>
                        <GridItem colSpan={4} rowSpan={1} >
                            <Text>{comment.body}</Text>
                        </GridItem>
                    </Grid>
                    
                ))}
                    <InputGroup>
                        <Input 
                        pr="4.5rm"
                        type="text"
                        placeholder="コメントをかく"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        />
                        <Button
                        disabled={!text.length}
                        type="submit"
                        onClick={postComment}
                        colorScheme="teal"
                        >
                            投稿
                        </Button>
                    </InputGroup>
                </Box>
            </Stack>
            
        )
    } return null
}