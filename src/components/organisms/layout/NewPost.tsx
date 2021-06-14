import { Box, Stack} from "@chakra-ui/layout";
import { Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay } from "@chakra-ui/modal";
import { Textarea } from "@chakra-ui/textarea";
import { AddIcon } from '@chakra-ui/icons'
import React, {FC, useState} from 'react'
import { useDisclosure } from "@chakra-ui/hooks";
import { Button } from "@chakra-ui/button";
import { FormLabel } from "@chakra-ui/form-control";

import { File } from "../../../types/types";
import { AppDispatch } from "../../../app/store";
import { useDispatch, useSelector } from "react-redux";
import {
        fetchAsyncNewPost, 
        fetchAsyncGetPosts,
        fetchAsyncGetComments,
        fetchPostEnd,
        fetchPostStart,
        selectOpenNewPost, 
        fetchAsyncPostComment
} from "../../../features/post/postSlice";
import { Input } from "@chakra-ui/input";




export const NewPost: FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const openNewPost = useSelector(selectOpenNewPost);

    const [body, setBody] = useState<string>("");
    const [image, setImage] = useState<File | null>(null);
    const NullBody = () => setBody("");
    const NullImage = () => setImage(null);
    const { isOpen, onOpen, onClose } = useDisclosure();


    const newPost = async (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        const packet = { body: body, image: image };

        await dispatch(fetchPostStart());
        await dispatch(fetchAsyncNewPost(packet));
        await dispatch(fetchAsyncGetPosts());
        await dispatch(fetchAsyncGetComments());
        await dispatch(fetchPostEnd());
        NullBody();
        NullImage();
        onClose();
    }

    return (
        <>
        <Button 
            leftIcon={<AddIcon/>} 
            colorScheme="teal" 
            onClick={onOpen}
            _hover={{ opacity: 0.6}}
        >投稿
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
                        <Textarea 
                            htmlFor="desc" 
                            id="body"
                            placeholder="...150文字まで"
                            onChange={(e) => setBody(e.target.value)}
                        />
                    </Box>        
                    <Box>
                        <FormLabel htmlFor="desc">投稿画像</FormLabel>
                        <Input
                            type="file"
                            id="imageInput"
                            onChange={(e) => setImage(e.target.files![0])}
                        />
                    </Box>
                </Stack>
            </DrawerBody>
            <DrawerFooter borderTopWidth="1px">
                <Button variant="outline" mr={3} onClick={onClose}>キャンセル</Button>
                <Button 
                    disabled={!body || !image} 
                    variant="blue" 
                    onClick={newPost} 
                    colorScheme="teal"
                >投稿</Button>                                    
            </DrawerFooter>                       
        </DrawerContent>
        </Drawer>
        </>
    )
}
