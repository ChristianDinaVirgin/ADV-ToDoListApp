import { router } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ImageBackground } from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth"; 
import { app } from '../Firebase/firebase';


const SignUp = () => {
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');

    useEffect(() => {
        if (user.length > 0) {
            if (!user.endsWith('@gmail.com')) {
                setEmailError('Invalid email format');
            } else {
                setEmailError('');
                // Clear the password error when the email is valid
                setPasswordError('');
            }
        }

        if (password.length > 0) {
            if (password.length < 8 || password.length > 20) {
                setPasswordError('Password must be between 8 to 20 characters');
            } else if (password !== confirmPassword) {
                setPasswordMessage('Password doesn\'t match');
            } else {
                setPasswordError('');
                setPasswordMessage('Password match');
            }
        }
    }, [user, password, confirmPassword]);

    const auth = getAuth (app);
    const onPressSignUp = async () => {
        if (user !== '' && password !== '') { 
            try {
                createUserWithEmailAndPassword(auth, user, password)
                    .then((userCredential) => {
                        const user = userCredential.user;
                        console.log(userCredential);
                    })
                    .catch((error) => {
                        const errorCode = error.code;
                        setResponse(error.message);
                    });
            } catch (err) {
                console.log(err);
            }
            router.replace('/sucSignUp');
        } else {
            alert('Incorrect email or password');
        }
        console.log(user);
        console.log(password);
    };
    
    const onPressLogin = () => {
        router.replace('/');
    };

    return (
        <ImageBackground
            source={{
                uri: 'https://scontent.fdvo4-1.fna.fbcdn.net/v/t1.15752-9/377241562_868391151699221_5446282403854734404_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=8cd0a2&_nc_eui2=AeGiINpwHk2LIIorG3IMjM1XwPuzx-o5kUTA-7PH6jmRRJhqspM2zB4I83XWBTn0WAe1QGgiustMNEKf-YQx5psF&_nc_ohc=n5Ud94yoRTgAX9hF4qN&_nc_ht=scontent.fdvo4-1.fna&oh=03_AdRPxhbmIwkSf50gIjoVQALgOv_qJQjwmmLkBm0Q-Kujyg&oe=659F5F64',
            }}
            style={styles.bG}
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <Text style={styles.title}>Sign Up</Text>
                    <View style={styles.inputView}>
                        <TextInput
                            style={styles.inputText}
                            placeholder="Enter Email"
                            placeholderTextColor="white"
                            onChangeText={(text) => setUser(text)}
                        />
                    </View>
                    {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

                    <View style={styles.inputView}>
                        <TextInput
                            style={styles.inputText}
                            secureTextEntry={!showPassword}
                            placeholder="Enter Password"
                            placeholderTextColor="white"
                            onChangeText={(text) => setPassword(text)}
                        />
                        <TouchableOpacity
                            style={styles.toggleButton}
                            onPress={() => setShowPassword(!showPassword)}
                        >
                            <Text style={styles.toggleButtonText}>
                                {showPassword ? 'Hide' : 'Show'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    {passwordError ? (
                        <Text style={styles.errorText}>{passwordError}</Text>
                    ) : null}

                    <View style={styles.inputView}>
                        <TextInput
                            style={styles.inputText}
                            secureTextEntry={!showPassword}
                            placeholder="Confirm Password"
                            placeholderTextColor="white"
                            onChangeText={(text) => setConfirmPassword(text)}
                        />
                        <TouchableOpacity
                            style={styles.toggleButton}
                            onPress={() => setShowPassword(!showPassword)}
                        >
                            <Text style={styles.toggleButtonText}>
                                {showPassword ? 'Hide' : 'Show'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    {passwordMessage ? (
                        <Text style={passwordMessage === 'Password match' ? styles.successText : styles.errorText}>
                            {passwordMessage}
                        </Text>
                    ) : null}

                    <TouchableOpacity onPress={onPressSignUp} style={styles.loginBtn}>
                        <Text style={styles.loginText}>SIGN UP</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={onPressLogin} style={styles.signUpBtn}>
                        <Text style={styles.signupText}>LOGIN EXISTING ACCOUNT</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    
    bG: {
        flex: 1,
        resizeMode: 'cover'
    },

    toggleButton: {
        position: 'absolute',
        top: 18,
        right: 20,
        zIndex: 1,
    },
    toggleButtonText: {
        color: 'white',
        fontSize: 10,
    },

    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', 
        alignItems: 'center',
        justifyContent: 'center',
    },

    container: {
        width: '80%',
        borderWidth: 3,
        borderColor: '#4d5f94',
        borderRadius:25,
        padding: 25,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white'
    },

    title: {
        fontWeight: "bold",
        fontSize: 30,
        color:"#4d5f94",
        marginBottom: 20,
        textTransform:'uppercase'
    },

    inputView: {
        width: '100%',
        backgroundColor:"#a3abc4",
        borderRadius:25,
        height:50,
        marginBottom:10,
        justifyContent:"center",
        padding:20
    },

    inputText: {
        height:50,
        color:"white"
    },

    forgotAndSignUpText: {
        marginTop:10,
        color:"black",
        fontSize:11
    },

    loginBtn: {
        width: '100%',
        backgroundColor:"#4d5f94",
        borderRadius:25,
        height:50,
        alignItems:"center",
        justifyContent:"center",
        marginTop: 10,
    },

    signUpBtn: {
        width: '100%',
        backgroundColor:"#8a92c1",
        borderRadius:25,
        height:50,
        alignItems:"center",
        justifyContent:"center",
        marginTop:10,
    },


    signupText: {
        color: 'white'
    },

    loginText: {
        color: 'white'
    },

    checkboxContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    
    checkbox: {
        marginRight: 10,
        marginTop: 20,
        width: 20,
        height: 20,
        borderWidth: 1,
        borderColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
    },
    
    checkboxInner: {
        width: 12,
        height: 12,
        backgroundColor: 'black',
    },

    rememberMeText: {
        marginTop: 20,

    },

    errorText: {
        color: 'red',
        fontSize: 12,
    },

    successText: {
        color: 'green',
        fontSize: 12,
    },

});

export default SignUp;