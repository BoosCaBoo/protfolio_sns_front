import React, { useState } from "react";
import { AppDispatch } from "../app/store";
import { useSelector, useDispatch } from "react-redux";
import { Formik } from "formik";
import Modal from "react-modal";
import * as Yup from "yup";
import { Flex, Box, Heading, Divider, Stack, Input, InputGroup, InputRightElement, Button, Icon} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

import {
    selectIsLoadingAuth,
    selectOpenSignIn,
    selectOpenSignUp,
    selectMyProfile,
    setOpenSignIn,
    resetOpenSignIn,
    setOpenSignUp,
    resetOpenSignUp,
    fetchCreadStart,
    fetchCreadEnd,
    fetchAsyncLogin,
    fetchAsyncRegister,
    fetchAsyncGetMyProf,
    fetchAsyncGetProfs,
    fetchAsyncCreateProf,
} from "../features/auth/authSlice";
import { fetchAsyncGetComments, fetchAsyncGetPosts } from "../features/post/postSlice";
// import { PrimaryButton } from "./atoms/button/PrimaryButton";

const CustomStyle = {
    content: {
    padding: 0,
    mergin: 0,
    }
}


export const Auth: React.FC = () => {
    /* ここはSignIn、Up関係 */
    Modal.setAppElement("#root");
    const openSignIn = useSelector(selectOpenSignIn);
    const openSignUp = useSelector(selectOpenSignUp);
    const isLoadingAuth = useSelector(selectIsLoadingAuth);
    const profile = useSelector(selectMyProfile);
    const dispatch: AppDispatch = useDispatch()

    const [show, setShow] = useState(false);
    const handleClick = () => setShow(!show);

    return (
        <>
            <Modal
            isOpen={openSignUp}
            onRequestClose={async () => {
                await dispatch(resetOpenSignUp());
            }}
            >
                <Formik
                    initialErrors={{ email: "required"}}
                    initialValues={{ email: "", password: "", name: "",}}
                    onSubmit={async (values) => {
                        await dispatch(fetchCreadStart());
                        const resultReg = await dispatch(fetchAsyncRegister({email: values.email, password: values.password}));
                        
                        if (fetchAsyncRegister.fulfilled.match(resultReg)) {
                            await dispatch(fetchAsyncLogin({email: values.email, password: values.password}));
                            await dispatch(fetchAsyncCreateProf({ user_name: values.name, bio: "", avatar: null }));                            
                            
                            await dispatch(fetchAsyncGetProfs());
                            await dispatch(fetchAsyncGetPosts());
                            await dispatch(fetchAsyncGetComments())
                            await dispatch(fetchAsyncGetMyProf());
                        }

                        await dispatch(fetchCreadEnd());
                        await dispatch(resetOpenSignUp());
                    }}
                    validationSchema={Yup.object().shape({
                        email: Yup.string().email("email format is wrong").required("email is must"),
                        password: Yup.string().required("password is must").min(4).max(16),
                        name: Yup.string().required("name is must").min(1).max(50),
                    })}
                >
                {({
                    handleSubmit,
                    handleChange,
                    handleBlur,
                    values,
                    errors,
                    touched,
                    isValid,
               }) => (
                    <div>
                        <form onSubmit={handleSubmit}  >
                            <Flex align="center" justify="center" h="100%" >
                                <Box bg="white" w="md" p={4} borderRadius="md" shadow="md">
                                    <Heading as="h1" size="lg" textAlign="center">
                                        SNS CLONE
                                    </Heading>
                                    <Divider my={4} />
                                    <Stack spacing={6} py={4} px={10} >
                                        <Input
                                            placeholder="メール"
                                            name="email"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.email}
                                            pr="4.5rem"
                                            variant="outline"
                                        />
                                        <br />
                                        {touched.email && errors.email ? (
                                            <div>{errors.email}</div>
                                        ): null}

                                        <InputGroup size="md">
                                            <Input
                                                type={show ? "text" : "password"}
                                                placeholder="パスワード"
                                                name="password"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.password}
                                                variant="outline"
                                             />
                                             <InputRightElement width="4.5rem">
                                                <Button
                                                bg="white"
                                                h="2.0rem"
                                                size="sm"
                                                onClick={handleClick}
                                                >
                                                    {show ? <Icon as={ViewIcon} /> : <Icon as={ViewOffIcon} /> }
                                                </Button>
                                             </InputRightElement>
                                        </InputGroup>
                                        <br />
                                        {touched.password && errors.password ? (
                                            <div>{errors.password}</div>
                                        ): null}

                                        <Input
                                            placeholder="ユーザーネーム"
                                            name="name"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.name}
                                            pr="4.5rem"
                                            variant="outline"
                                        />
                                        <br />
                                        {touched.name && errors.name ? (
                                            <div>{errors.name}</div>
                                        ): null}

                                        <Button
                                            size="md"
                                            bg="teal.400"
                                            color="white"
                                            variant="outline"
                                            _hover={{ opacity: 0.9 }}
                                            disabled={!isValid}
                                            type="submit"
                                        >
                                            登録する
                                        </Button>

                                        <br />
                                        <p>アカウントをお持ちですか？</p>
                                        <Button
                                            color="teal"
                                            onClick={async () => {
                                                await dispatch(setOpenSignIn());
                                                await dispatch(resetOpenSignUp());
                                            }}
                                        >
                                            ログインする
                                        </Button>
                                            
                                    </Stack>
                                </Box>
                            </Flex>
                        </form>
                    </div>
                    )}
                </Formik>
            </Modal>
        


 

            <Modal
            isOpen={openSignIn}
            onRequestClose={async () => {
                await dispatch(setOpenSignIn());
            }}
            style={CustomStyle}
            >
                <Formik
                    initialErrors={{ email: "required"}}
                    initialValues={{ email: "", password: ""}}
                    onSubmit={async (values) => {
                        await dispatch(fetchCreadStart());
                        const result = await dispatch(fetchAsyncLogin({email: values.email, password: values.password}));
                        
                        if (fetchAsyncLogin.fulfilled.match(result)) {

                            await dispatch(fetchAsyncGetProfs());
                            await dispatch(fetchAsyncGetMyProf());
                        }
                        await dispatch(fetchCreadEnd());
                        await dispatch(resetOpenSignIn());
                    }}
                    validationSchema={Yup.object().shape({
                        email: Yup.string().email("email format is wrong").required("email is must"),
                        password: Yup.string().required("password is must").min(4).max(16),
                    })}
                >
                    {({
                      handleSubmit,
                      handleChange,
                      handleBlur,
                      values,
                      errors,
                      touched,
                      isValid,
                    }) => (
                        <div>
                            <form onSubmit={handleSubmit} >
                                <Flex align="center" justify="center" h="100%" mt="75" >
                                    <Box bg="white" w="md" p={4} borderRadius="md" shadow="md">
                                        <Heading as="h1" size="lg" textAlign="center">
                                            SNS CLONE
                                        </Heading>
                                        <Divider my={4} />
                                        <Stack spacing={6} py={4} px={10} >
                                            <Input
                                                placeholder="email"
                                                name="email"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.email}
                                                pr="4.5rem"
                                                variant="outline"
                                            />
                                            <br />
                                            {touched.email && errors.email ? (
                                                <div>{errors.email}</div>
                                            ): null}

                                            <InputGroup size="md">
                                                <Input
                                                    type={show ? "text" : "password"}
                                                    placeholder="password"
                                                    name="password"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.password}
                                                    variant="outline"
                                                />
                                                <InputRightElement width="4.5rem">
                                                    <Button
                                                    bg="white"
                                                    h="2.0rem"
                                                    size="sm"
                                                    onClick={handleClick}
                                                    >
                                                        {show ? <Icon as={ViewIcon} /> : <Icon as={ViewOffIcon} /> }
                                                    </Button>
                                                </InputRightElement>
                                            </InputGroup>
                                            <br />
                                            {touched.password && errors.password ? (
                                            <div>{errors.password}</div>
                                            ): null}
                                            <br />

                                            <Button
                                                size="md"
                                                bg="teal.400"
                                                color="white"
                                                variant="outline"
                                                _hover={{ opacity: 0.9 }}
                                                disabled={!isValid}
                                                type="submit"
                                            >
                                                ログインする
                                            </Button>

                                            <br />
                                            <p>アカウントをお持ちでないですか？</p>
                                            <Button
                                                color="teal"
                                                onClick={async () => {
                                                    await dispatch(resetOpenSignIn());
                                                    await dispatch(setOpenSignUp());
                                                }}
                                            >
                                                登録する
                                            </Button>
                                            
                                        </Stack>
                                    </Box>
                                </Flex>
                            </form>
                        </div>
                    )}
                </Formik>

            </Modal>


        </>
    )
};

