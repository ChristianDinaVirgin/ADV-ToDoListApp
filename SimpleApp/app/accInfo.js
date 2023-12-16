import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground } from 'react-native';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { router } from 'expo-router';

const App = () => {
  const auth = getAuth();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, [auth]);

  const onPressLogout = async () => {
    try {
      await signOut(auth);
      router.replace('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const onPressBack = async () => {
    router.replace('/HomePage');
  };

  return (
    <ImageBackground
      source={{
        uri:
          'https://scontent.fdvo4-1.fna.fbcdn.net/v/t1.15752-9/377241562_868391151699221_5446282403854734404_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=8cd0a2&_nc_eui2=AeGiINpwHk2LIIorG3IMjM1XwPuzx-o5kUTA-7PH6jmRRJhqspM2zB4I83XWBTn0WAe1QGgiustMNEKf-YQx5psF&_nc_ohc=n5Ud94yoRTgAX9hF4qN&_nc_ht=scontent.fdvo4-1.fna&oh=03_AdRPxhbmIwkSf50gIjoVQALgOv_qJQjwmmLkBm0Q-Kujyg&oe=659F5F64',
      }}
      style={styles.bG}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {user ? (
            <>
              <Text style={styles.title}>Account Information</Text>
              <Text style={styles.email}>{user.email}</Text>
              <TouchableOpacity onPress={onPressLogout} style={styles.logOutBtn}>
                <Text style={styles.logoutText}>Logout</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onPressBack} style={styles.logOutBtn}>
                <Text style={styles.logoutText}>Back</Text>
              </TouchableOpacity>
            </>
          ) : (
            <Text style={styles.title}>User not logged in</Text>
          )}
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  bG: {
    flex: 1,
    resizeMode: 'cover',
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
    borderRadius: 25,
    padding: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },

  title: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#4d5f94',
    marginBottom: 20,
  },

  email: {
    fontSize: 20,
    marginBottom: 20,
  },

  logOutBtn: {
    width: '100%',
    backgroundColor: '#4d5f94',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },

  logoutText: {
    color: 'white',
    textTransform: 'uppercase',
    fontWeight: 'bold'
  },
});

export default App;
