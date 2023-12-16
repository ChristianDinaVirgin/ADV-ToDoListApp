import { router } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ImageBackground } from 'react-native';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from '../Firebase/firebase';


const App = () => {

    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {

        if (user.length > 0) {
            if (!user.endsWith('@gmail.com')) {
                setEmailError('Invalid email format');
            } 

            else {
                setEmailError('');
            }
        }

        if (password.length > 0) {
            if (password.length < 8 || password.length > 20) {
                setPasswordError('Password must be between 8 to 20 characters');
            } 

            else {
                setPasswordError('');
            }
        }
    }, [user, password]);

    const auth = getAuth (app);
    const onPressLogin = () => {
        // if (user === 'Sean@gmail.com' && password === 'sean1234') {
        //     router.replace('/HomePage');
        //     alert('Welcome Boss Sean...');
        //     return;
        // } 
        signInWithEmailAndPassword(auth, user, password)
        .then((userCredential) => {
            const user = userCredential.user;
            router.replace('/HomePage')
            alert('Login Successfully...');
        })
        .catch((error) => {
            const errorCode = error.code;
            alert(error.message);
        });

        if (emailError || passwordError) {
            return;
        }

        console.log(user);
        console.log(password);

    };

    const onPressSignUp = () => {
        router.replace('/signUp');
    };

    return (
        <ImageBackground source={{ uri: 'https://scontent.fdvo4-1.fna.fbcdn.net/v/t1.15752-9/377241562_868391151699221_5446282403854734404_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=8cd0a2&_nc_eui2=AeGiINpwHk2LIIorG3IMjM1XwPuzx-o5kUTA-7PH6jmRRJhqspM2zB4I83XWBTn0WAe1QGgiustMNEKf-YQx5psF&_nc_ohc=n5Ud94yoRTgAX9hF4qN&_nc_ht=scontent.fdvo4-1.fna&oh=03_AdRPxhbmIwkSf50gIjoVQALgOv_qJQjwmmLkBm0Q-Kujyg&oe=659F5F64' }}
        style={styles.bG}>
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <Text style={styles.title}>Login</Text>
                        <View style={styles.inputView}>
                            <TextInput
                            style={styles.inputText}
                            placeholder="Email"
                            placeholderTextColor="white"
                            onChangeText={(text) => setUser(text)} />
                        </View>
                        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

                        <View style={styles.inputView2}>
                            <TextInput
                                style={styles.inputText}
                                secureTextEntry={!showPassword} 
                                placeholder="Password"
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
                        {passwordError ? ( <Text style={styles.errorText}>{passwordError}</Text> ) : null}

                    <TouchableOpacity onPress={onPressLogin} style={styles.loginBtn}>
                        <Text style={styles.loginText}>LOGIN</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={onPressSignUp} style={styles.signUpBtn}>
                        <Text style={styles.signupText}>SIGN UP</Text>
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
        marginTop:10,
        marginBottom: 10,
        justifyContent:"center",
        padding: 20
    },

    inputView2: {
        width: '100%',
        backgroundColor:"#a3abc4",
        borderRadius:25,
        height:50,
        marginBottom: 10,
        justifyContent:"center",
        padding: 20
    },

    inputText: {
        height:50,
        color:"white"
    },

    loginBtn: {
        width: '100%',
        backgroundColor:"#4d5f94",
        borderRadius:25,
        height:50,
        alignItems:"center",
        justifyContent:"center",
        marginTop: 20,
    },

    signUpBtn: {
        width: '100%',
        backgroundColor:"#8a92c1",
        borderRadius:25,
        height:50,
        alignItems:"center",
        justifyContent:"center",
        marginTop: 10,
    },


    signupText: {
        color: 'white'
    },

    loginText: {
        color: 'white'
    },

    errorText: {
        color: 'red',
        fontSize: 12,
    },

});

export default App;