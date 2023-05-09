import * as React from 'react'
import { StyleSheet, Text, View, Pressable } from 'react-native'
import { Link, useRouter } from 'expo-router'
import * as LocalAuthentication from 'expo-local-authentication'
import { Image } from 'expo-image'

export default function BiometricScreen() {
  const [facialRecognitionAvailable, setFacialRecognitionAvailable] = React.useState(false)
  const [fingerprintAvailable, setFingerprintAvailable] = React.useState(false)
  const [irisAvailable, setIrisAvailable] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const router = useRouter()
  let result = ''

  const checkSupportedAuthentication = async () => {
    const types = await LocalAuthentication.supportedAuthenticationTypesAsync()
    if (types && types.length) {
      setFacialRecognitionAvailable(types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION))
      setFingerprintAvailable(types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT))
      setIrisAvailable(types.includes(LocalAuthentication.AuthenticationType.IRIS))
    }
  }

  const authenticate = async () => {
    if (loading) {
      return
    }

    setLoading(true)

    try {
      const results = await LocalAuthentication.authenticateAsync({
        promptMessage: "Login with biometrics to your wallet",
        cancelLabel: "Cancel",
        disableDeviceFallback: false,
      });
      
      if (results.success) {
        result = "SUCCESS"
        router.push("/overview")
      } else if (results.error === 'unknown') {
        result = "DISABLED"
      } else if (
        results.error === 'user_cancel' ||
        results.error === 'system_cancel' ||
        results.error === 'app_cancel'
      ) {
        result = "CANCELLED"
      }
    } catch (error) {
      result = "ERROR"
    }

    setLoading(false)
  };

  React.useEffect(() => {
    checkSupportedAuthentication()
  }, [])

  let resultMessage
  switch (result) {
    case "CANCELLED":
      resultMessage = 'Authentication process has been cancelled'
      break
    case "DISABLED":
      resultMessage = 'Biometric authentication has been disabled'
      break
    case "ERROR":
      resultMessage = 'There was an error in authentication'
      break
    case "SUCCESS":
      resultMessage = 'Successfully authenticated'
      break
    default:
      resultMessage = ''
      break
  }

  let description;
  if (facialRecognitionAvailable && fingerprintAvailable && irisAvailable) {
    description = 'Authenticate with Face ID, touch ID or iris ID'
  } else if (facialRecognitionAvailable && fingerprintAvailable) {
    description = 'Authenticate with Face ID or touch ID'
  } else if (facialRecognitionAvailable && irisAvailable) {
    description = 'Authenticate with Face ID or iris ID'
  } else if (fingerprintAvailable && irisAvailable) {
    description = 'Authenticate with touch ID or iris ID'
  } else if (facialRecognitionAvailable) {
    description = 'Authenticate with Face ID'
  } else if (fingerprintAvailable) {
    description = 'Authenticate with touch ID '
  } else if (irisAvailable) {
    description = 'Authenticate with iris ID'
  } else {
    description = 'No biometric authentication methods available'
  }

  return (
    <View style={styles.container}>
      <Image
        style={styles.logo}
        source="https://token-project.eu/wp-content/uploads/2020/03/Token_logo-1.png"
        contentFit="cover"
        transition={1000}
      />
      <Text style={styles.intro}>To continue and access your wallet and credentials, use biometric login.</Text>
      {facialRecognitionAvailable || fingerprintAvailable || irisAvailable ? (
        <Pressable style={styles.button} onPress={authenticate}>
          <Text style={styles.text}>{description}</Text>
        </Pressable>
      ) : null}
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
  header: {
    color: 'grey',
    fontSize: 42,
    fontWeight: '100',
    textAlign: 'center',
  },
  intro: {
    color: 'blue',
    fontSize: 20,
    fontWeight: '100',
    textAlign: 'center',
    marginVertical: 20,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'blue',
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
  logo: {
    width: 300,
    height: 80
  },
})
