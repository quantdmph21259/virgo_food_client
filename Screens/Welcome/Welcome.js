import { StyleSheet, Text, View, SafeAreaView, Dimensions, Image, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import AnimatedLottieView from 'lottie-react-native'
import Color from '../../controllers/Color'
import AsyncStorage from '@react-native-async-storage/async-storage'
import ScreenName from '../../controllers/ScreenName'

const width = Dimensions.get('window').width

const Welcome = () => {
    const navigation = useNavigation()

    useEffect(() => {
        getObjectCurrent()

        return () => {

        }
    }, [])

    const getObjectCurrent = async () => {
        try {
            const value = await AsyncStorage.getItem('ObjectCurrent')
            if (value !== null) {
                setTimeout(() => {
                    navigation.navigate(ScreenName.bottomApp)
                    navigation.reset({
                        index: 0,
                        routes: [{ name: ScreenName.bottomApp }],
                    })
                }, 5000)
            } else {
                setTimeout(() => {
                    navigation.navigate(ScreenName.signIn)
                    navigation.reset({
                        index: 0,
                        routes: [{ name: ScreenName.signIn }],
                    })
                }, 5000)
            }

        } catch (e) {
            console.log(
                `
                \n>>>>> Message get user from async storage: ${e}\n
                `
            )
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <AnimatedLottieView source={require('../../assets/anim/anim_humberger.json')}
                autoPlay={true}
                loop={true}
                style={styles.size_anim} />
            <Text style={{
                fontSize: 34,
                fontWeight: '500',
                color: Color.primary
            }}>VIRGO FOOD</Text>
        </SafeAreaView>
    )
}

export default Welcome

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    containerButton: {
        width: width - 130,
        height: 60,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#EEA743',
    },
    textButton: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white'
    },
    size_anim: {
        width: width - 20,
        height: 250,
        zIndex: 10,
        marginBottom: 30
    },
})