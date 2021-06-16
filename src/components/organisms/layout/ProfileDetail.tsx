import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/modal';
import { Avatar } from "@chakra-ui/avatar";
import { Button } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import React, { FC, ReactNode, useState} from 'react'
import {File} from "../../../types/types";

import {
    editUserName,
    editUserBio,
    selectMyProfile,
    fetchCreadStart,
    fetchCreadEnd,
    fetchAsyncUpdateProf,
} from "../../../features/auth/authSlice"
import { AppDispatch } from '../../../app/store';
import { useDispatch, useSelector } from 'react-redux';
import { Divider, Flex, Text } from '@chakra-ui/layout';
import { Input } from '@chakra-ui/input';

type Props = {
    children: ReactNode,
}

export const ProfileDetail: FC<Props> = (props) => {
    const { children } = props;
    const { isOpen, onOpen, onClose } = useDisclosure();

    const dispatch: AppDispatch = useDispatch();
    const profile = useSelector(selectMyProfile)

    const [image, setImage] = useState<File | null>(null);

    const [edit, setEdit] = useState<boolean>(false);
    const switchEdit = () => setEdit(!edit);
    

    const updateProfile = async (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        const packet = { id: profile.id, user_name: profile.user_name, avatar: image, bio: profile.bio };

        await dispatch(fetchCreadStart());
        await dispatch(fetchAsyncUpdateProf(packet))
        await dispatch(fetchCreadEnd());
        switchEdit();
    }

    return (    
        <>
            <Button onClick={onOpen} colorScheme="teal" >
                {children}
            </Button>

            <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose} >
            <ModalOverlay />
                
                    {!edit ? (
                    <ModalContent>
                    <ModalHeader>プロフィール</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Flex>
                        <Avatar src={profile.avatar} bg="teal.400" size="lg" />
                        <Text
                            align="center" 
                            fontSize="3xl" 
                            fontWeight="bold" 
                            mt={1} 
                            mx={5}
                        >{profile.user_name}</Text>
                        </Flex>
                        <Text
                            align="center"
                            fontWeight="bold"
                        >{profile.bio}</Text>
                        <Divider my={2} />   
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={onClose} mr={3} >閉じる</Button>
                        <Button onClick={switchEdit}>編集</Button>
                    </ModalFooter>
                    </ModalContent>
                    ) :(
                    <ModalContent>
                    <ModalHeader>プロフィール</ModalHeader>
                    <ModalBody>
                        
                        <Text
                            align="center"
                            fontWeight="bold" 
                            mt={1}
                        >アバター</Text>
                        <Input 
                            pt={1}
                            type="file"
                            id="imageInput"
                            onChange={(e) => setImage(e.target.files![0])}
                        />
                        <Text
                            align="center" 
                            fontWeight="bold" 
                            mt={1}
                        >ユーザーネーム</Text>
                        <Input
                            placeholder="ユーザーネーム"
                            type="text"
                            value={profile.user_name}
                            onChange={(e) => dispatch(editUserName(e?.target.value))}
                        />
                        <Text
                            align="center" 
                            fontWeight="bold" 
                            mt={1}
                        >ひとこと</Text>
                        <Input
                            placeholder="ひとこと"
                            type="text"
                            value={profile.bio}
                            onChange={(e) => dispatch(editUserBio(e?.target.value))}
                        />

                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={switchEdit} mr={3}>やめる</Button>
                        <Button
                            colorScheme="teal"
                            type="submit"
                            onClick={updateProfile}
                        >編集する</Button>
                        
                    </ModalFooter>
                    </ModalContent>
                    )}
            </Modal>
        </>
    )
}

