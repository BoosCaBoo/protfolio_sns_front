import { Avatar, AvatarGroup } from "@chakra-ui/avatar";
import { Button } from "@chakra-ui/button";
import Icon from "@chakra-ui/icon";
import { DeleteIcon, StarIcon } from "@chakra-ui/icons";
import { Image } from "@chakra-ui/image";
import { Input, InputGroup } from "@chakra-ui/input";
import { Box, Divider, Flex, Spacer, Stack, Text } from "@chakra-ui/layout";
import { Tooltip } from "@chakra-ui/tooltip";
import React, { FC, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../../app/store";

import { selectProfiles } from "../../../features/auth/authSlice";

import {
    fetchPostStart,
    fetchPostEnd,
    fetchAsyncPostComment,
    fetchAsyncPatchLiked,
    fetchAsyncDeletePost,
    fetchAsyncGetPosts,
    fetchAsyncGetComments,
} from "../../../features/post/postSlice";

import { POST, LIKED, DELETEPOST } from "../../../types/types";
import { CommentModal } from "./CommentModal";


export const Post: FC<POST> = (props) => {
    const { id, loginId, user_post, body, image, liked, created } = props;
    const dispatch: AppDispatch = useDispatch();
    const profiles = useSelector(selectProfiles);
    const [text, setText ] = useState("");
    const NullText = () => setText("");

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
        await dispatch(fetchAsyncGetPosts());
        await dispatch(fetchAsyncGetComments());
        await dispatch(fetchPostEnd());
    }

    if (body) {
        return (
            <Stack spacing={1} py={4} px={4} zIndex="0" >
                <Box>

                    <Flex >
                        <Avatar bg="teal.400" src={prof[0]?.avatar} size="lg" />
                        <Text  
                            align="center" 
                            fontSize="3xl" 
                            fontWeight="bold" 
                            mt={1} 
                            mx={5}
                        >{prof[0]?.user_name}
                        </Text>
                        <Spacer />
                        <Text
                            align="center" 
                            fontSize="sm"
                            fontWeight="thin" 
                            opacity="0.8"
                            mt={5}
                            mr={3}
                        >{created}</Text>
                    </Flex>
                
                    <Box align="center" >  
                        <Image 
                            objectFit="cover"
                            alt="" 
                            src={image} 
                            h="400px"
                            w="600px"
                            mt={3} 
                        />
                    </Box>
                    
                    <Box pt={4} >
                        <Text mx={5} >{body}</Text>
                    </Box>
                    <Divider mt={1} />
                    
                    <Flex pt={2} mx={5} >
                        <Box pt={1}>
                            <CommentModal id={id} />
                        </Box>
                        {!liked.some((like) => like === loginId)  ? (
                            <Button
                                leftIcon={<StarIcon/>}
                                bg="gray.200"
                                mt={1}
                                onClick={handleLiked}
                                _hover={{ opacity: 1 }}
                        >いいね</Button>
                        ): (
                            <Button
                                leftIcon={<StarIcon/>}
                                bg="#f7cd12"
                                mt={1}
                                onClick={handleLiked}
                                _hover={{ opacity: 1 }}
                            >いいね</Button>
                         )}
                        <AvatarGroup ml={2} size="sm" max={3} >
                            {liked.map((like) => (
                                <Avatar 
                                    key={like} 
                                    name="" 
                                    src={profiles.find((prof) => 
                                        prof.user_profile === like)?.avatar} />
                                    ))}
                        </AvatarGroup>
                        <Spacer />
                        {user_post === loginId ? (
                            <Tooltip label="投稿削除" placement="top" >
                            <Icon
                                pl={1}
                                w={6} 
                                h={6} 
                                as={DeleteIcon} 
                                onClick={handleDelete} 
                                mt="8px"
                                _hover={{ opacity: 0.6}}
                                /></Tooltip>
                            ):(null)}
                    </Flex>

                    <InputGroup mt={3}>
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
                        >投稿
                        </Button>
                    </InputGroup>
                </Box>
            </Stack>
        )
    } return null;
}