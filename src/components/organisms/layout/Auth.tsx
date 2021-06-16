import React, { useState } from "react";
import Modal from "react-modal";
import { AppDispatch } from "../../../app/store";
import { useDispatch } from "react-redux";
import { Formik } from "formik";
import * as Yup from "yup";
import { Flex, Box, Heading, Divider, Stack, Input, InputGroup, InputRightElement, Button, Icon, ChakraProvider, theme, Alert, AlertIcon, AlertTitle, AlertDescription, CloseButton, Wrap} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

import {
    fetchCreadStart,
    fetchCreadEnd,
    fetchAsyncLogin,
    fetchAsyncRegister,
    fetchAsyncGetMyProf,
    fetchAsyncGetProfs,
    fetchAsyncCreateProf,
} from "../../../features/auth/authSlice";
import { fetchAsyncGetComments, fetchAsyncGetPosts } from "../../../features/post/postSlice";


export const Auth: React.FC = () => {
    /* ここはSignIn、Up関係 */
    Modal.setAppElement("#root");
    const dispatch: AppDispatch = useDispatch()

    const [ login, setLogin ] = useState(true);
    const handleLogin = () => setLogin(!login);

    const [show, setShow] = useState(false);
    const handleShow = () => setShow(!show);

    const [alert, setAlert] = useState(false);
    const handleAlert = () => setAlert(!alert); 

    return (
        <ChakraProvider theme={theme}>
        <>
        { !login ? (
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
                            await dispatch(fetchAsyncGetComments());
                            await dispatch(fetchAsyncGetMyProf());
                        } else {
                            handleAlert();
                        }

                        await dispatch(fetchCreadEnd());
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
                   <>
                        <form onSubmit={handleSubmit}  >
                            <Flex align="center" justify="center" h="100%" pt="75px" >
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
                                                onClick={handleShow}
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
                                                handleLogin();
                                            }}
                                        >
                                            ログインする
                                        </Button>
                                            
                                    </Stack>
                                </Box>
                            </Flex>
                        </form>
                        { alert && 
                        <Alert status="error">
                            <AlertIcon />
                            <AlertTitle mr={2}>登録に失敗しました！</AlertTitle>
                            <AlertDescription mr={2}>別のメールアドレスで登録してください。</AlertDescription>
                            <CloseButton position="absolute" right="8px" top="8px" onClick={handleAlert} />
                        </Alert>
                        }     
                    </>
                    )}
                </Formik>
         ) : (
        
                <Formik
                    initialErrors={{ email: "required"}}
                    initialValues={{ email: "", password: ""}}
                    onSubmit={async (values) => {
                        await dispatch(fetchCreadStart());
                        const result = await dispatch(fetchAsyncLogin({email: values.email, password: values.password}));
                        
                        if (fetchAsyncLogin.fulfilled.match(result)) {


                            await dispatch(fetchAsyncGetPosts());
                            await dispatch(fetchAsyncGetComments());
                            await dispatch(fetchAsyncGetProfs());
                            await dispatch(fetchAsyncGetMyProf());
                        } else {
                            handleAlert();
                        }
                        await dispatch(fetchCreadEnd());
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
                        <>
                        <Box>
                            <form onSubmit={handleSubmit} >
                                <Flex align="center" justify="center" mt="75px" >
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
                                                    onClick={handleShow}
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
                                                    handleLogin();
                                                }}
                                            >
                                                登録する
                                            </Button>
                                            
                                        </Stack>
                                    </Box>
                                </Flex>
                            </form>
                            { alert && 
                                <Wrap  mt="55px" >
                                <Alert status="error"  >
                                    <AlertIcon />
                                    <AlertTitle mr={2}>ログインに失敗しました！</AlertTitle>
                                    <AlertDescription mr={2}>メールアドレス、またはパスワードが間違っています。</AlertDescription>
                                    <CloseButton position="absolute" right="8px" top="8px" onClick={handleAlert} />
                                </Alert>
                                </Wrap>
                            }  
                        </Box>   
                        </>
                    )}
                </Formik>
         )}
        
        </>
        </ChakraProvider>
    )
};

