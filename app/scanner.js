import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, Button } from 'react-native'
import { BarCodeScanner } from 'expo-barcode-scanner'
import { Link } from 'expo-router'
import * as SecureStore from 'expo-secure-store'
import * as CryptoJS from 'crypto-js'

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

export default function Scanner() {
  const [hasPermission, setHasPermission] = useState(null)
  const [scanned, setScanned] = useState(false)

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync()
      setHasPermission(status === 'granted')
    };

    getBarCodeScannerPermissions()
  }, [])

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true)
    // Credential scanned succesfully, add it to the encrypted storage here
    console.log(data)
    const privateKey = await getSecureValue("private")
    if (privateKey) {
      const encrypted = CryptoJS.AES.encrypt(data, privateKey).toString()
      console.log(encrypted)
      // Save encrypted credential to SecureStorage
      setSecureValue("credential", encrypted)
      const decrypted = CryptoJS.AES.decrypt(encrypted, privateKey).toString(CryptoJS.enc.Utf8)
      console.log(decrypted)
    } else {
      console.log("Private not found!")
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.desc}>Requesting for camera permission</Text>
      </View>
    )
  }
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.desc}>No access to camera</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && 
      <><Button title={'Tap to add another credential'} onPress={() => setScanned(false)} /><Link style={styles.button} href="/manage">Manage my credentials</Link></>
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
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
  desc: {
    color: 'blue',
    fontSize: 20,
    fontWeight: '100',
    textAlign: 'center',
  },
})
