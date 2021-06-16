import { Avatar } from '@chakra-ui/avatar'
import { Button } from '@chakra-ui/button';
import { useDisclosure } from '@chakra-ui/hooks';
import { Box, Flex, Text } from '@chakra-ui/layout'
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/modal';
import React, { FC } from 'react'
import { useSelector } from 'react-redux';
import { selectProfiles } from '../../../features/auth/authSlice';
import { selectComments } from '../../../features/post/postSlice';

type Props = {
    id: number
}

export const CommentModal: FC<Props> = (props) => {
    const {id} = props;
    const profiles = useSelector(selectProfiles);
    const comments = useSelector(selectComments);
    const { isOpen, onOpen, onClose } = useDisclosure()
    const commentsOnPost = comments.filter((com) => {
        return com.post === id;
    });

    return (
        <>
            <Button colorScheme="teal" mr={5} onClick={onOpen}>コメントを見る</Button>
            <Modal isOpen={isOpen} onClose={onClose} >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>コメント一覧</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {commentsOnPost.map((comment: any) => (
                            
                            <Box key={comment.id} borderWidth="1px" borderRadius="lg" m="5px" >
                            <Flex
                                mt={2}
                            >                            
                                <Avatar
                                    size="md"
                                    ml="20px"
                                    src={
                                    profiles.find(
                                    (prof) => prof.user_profile === comment.user_comment)?.avatar
                                    }
                                />
                                <Text ml="30px" fontSize="xl" fontWeight="bold"  >{
                                    profiles.find((prof) => prof.user_profile === comment.user_comment)?.user_name
                                }</Text>
                                <Text fontSize="sm" mt="3px" ml="50px" fontWeight="thin" opacity="0.8" >{comment.created}</Text>
                            </Flex>
                            <Text pl="100px" pb="10px" fontSize="lg" >{comment.body}</Text>
                            </Box>
                            
                        ))}
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

        </>
    )
}

