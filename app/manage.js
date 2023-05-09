import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, Pressable, Button } from 'react-native'
import { Link } from 'expo-router'
import * as SecureStore from 'expo-secure-store'
import * as CryptoJS from 'crypto-js'
import { Image } from 'expo-image'

async function getSecureValue(key) {
  let result = await SecureStore.getItemAsync(key)
  if (result) {
    return result
  } else {
    return false
  }
}

async function setSecureValue(key, value) {
  await SecureStore.setItemAsync(key, value)
}

async function delSecureValue(key) {
  await SecureStore.deleteItemAsync(key)
}

export default function Manage() {
  const [credentials, setCredentials] = useState(false)

  useEffect(function () {
    (async function () {
      const privateKey = await getSecureValue("private")
      const encrypted = await getSecureValue("credential")
      if (privateKey && encrypted) {
        const decrypted = JSON.parse(CryptoJS.AES.decrypt(encrypted, privateKey).toString(CryptoJS.enc.Utf8))
        setCredentials(decrypted)
        console.log(decrypted.credentialSubject)
      } else {
        console.log("No credentials found!")
      }
    })()
  }, [])

  const removeCredential = async () => {
    setCredentials(false)
    delSecureValue("credential")
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Your credentials</Text>
      {credentials && credentials.credentialSubject ? (
      <View style={styles.credential}>
        <Image
          style={styles.logo}
          source={credentials.credentialSubject.properties.achievement.image.id}
          contentFit="cover"
          transition={1000}
        />
        <Text>ID: {credentials.id}</Text>
        <Text>Issuer: {credentials.issuerId}</Text>
        <Text>Issued: {credentials.issued}</Text>
        <Button title={'Remove'} onPress={removeCredential} color="#841584"/>
      </View>
      ) : null}
      <Link style={styles.gobackbutton} href="/overview" asChild>
        <Pressable>
          {({ hovered, pressed }) => (
            <Text>Go back</Text>
          )}
        </Pressable>
      </Link>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'grey',
    fontSize: 42,
    fontWeight: '100',
    textAlign: 'center',
    marginVertical: 30
  },
  desc: {
    color: 'blue',
    fontSize: 20,
    fontWeight: '100',
    textAlign: 'center',
  },
  gobackbutton: {
    marginVertical: 100
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'red',
    color: 'white'
  },
  credential: {
    width: 200,
  },
  credentialLogo: {
    width: 50,
    height: 50
  },
})
