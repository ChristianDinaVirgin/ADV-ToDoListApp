import { router } from 'expo-router';
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground } from 'react-native';


const App = () => {

    const onPressSignUp = () => {
        router.replace('/');
    };

    return (
        <ImageBackground source={{ uri: 'https://scontent.fdvo4-1.fna.fbcdn.net/v/t1.15752-9/377241562_868391151699221_5446282403854734404_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=8cd0a2&_nc_eui2=AeGiINpwHk2LIIorG3IMjM1XwPuzx-o5kUTA-7PH6jmRRJhqspM2zB4I83XWBTn0WAe1QGgiustMNEKf-YQx5psF&_nc_ohc=n5Ud94yoRTgAX9hF4qN&_nc_ht=scontent.fdvo4-1.fna&oh=03_AdRPxhbmIwkSf50gIjoVQALgOv_qJQjwmmLkBm0Q-Kujyg&oe=659F5F64' }}
        style={styles.bG}>
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <Text style={styles.title}>Successfully Registered...</Text>

                    <TouchableOpacity onPress={onPressSignUp} style={styles.signUpBtn}>
                        <Text style={styles.signupText}>LOGIN</Text>
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
        fontSize:30,
        color:"#4d5f94",
        marginBottom: 20,
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

});

export default App;