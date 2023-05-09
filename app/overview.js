import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, Pressable } from 'react-native'
import { Link } from 'expo-router'
import * as SecureStore from 'expo-secure-store'
import * as Crypto from 'expo-crypto'

async function delPrivate() {
  await SecureStore.deleteItemAsync("private")
}

async function setPrivate(value) {
  await SecureStore.setItemAsync("private", value)
}

async function getPrivate() {
  let result = await SecureStore.getItemAsync("private")
  if (result) {
    return result
  } else {
    return false
  }
}

export default function Overview() {
  // Create random key for use in file encryption later and store it in the secure storage if there isn't any
  useEffect(function () {
    (async function() {
      const privateKey = await getPrivate()
      if (privateKey) {
        console.log("Private found!")
        console.log(privateKey)
      } else {
        console.log("Private not found!")
        const digest = await Crypto.digestStringAsync(
          Crypto.CryptoDigestAlgorithm.SHA256,
          Crypto.getRandomBytes(20).toString('hex')
        )
        console.log("NEW private...")
        console.log(digest)
        await setPrivate(digest)
      }
    })()
  }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Your wallet</Text>
      <Link style={styles.button} href="/scanner">
        Add a new credential
      </Link>
      <Link style={styles.button} href="/manage">
        Manage my credentials
      </Link>
      <Link style={styles.gobackbutton} href="/" asChild>
        <Pressable>
          {({ hovered, pressed }) => (
            <Text>Go back to login screen</Text>
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
    backgroundColor: 'blue',
    color: 'white'
  },
})
