import { StyleSheet, Text, View, SafeAreaView, Dimensions, TextInput, TouchableOpacity, Alert, Keyboard } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import validate from '../../controllers/Validate'
import ConstString from '../../controllers/ConstString'

const width = Dimensions.get('window').width

const SignUp = () => {
    const navigation = useNavigation()
    const [userName, setUserName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const url = `${ConstString.url}${ConstString.api_sign_up}`
    const [isOpenKeyboard, setOpenKeyBoard] = useState(false)

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                console.log('Bàn phím đã mở')
                setOpenKeyBoard(true)
            }
        )

        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                console.log('Bàn phím đã tắt')
                setOpenKeyBoard(false)
            }
        )

        // Gỡ lắng nghe sự kiện khi component bị unmount
        return () => {
            keyboardDidShowListener.remove()
            keyboardDidHideListener.remove()
        }
    }, [])


    const handleSignUp = async () => {
        const user = {
            userName: userName.trim(),
            email: email.toLocaleLowerCase().trim(),
            password: password.trim(),
            phoneNumber: phoneNumber.trim()
        }

        // validate
        if (!userName || !email || !password || !phoneNumber) {
            Alert.alert('Opps', 'Vui lòng điền đầy đủ thông tin!')
            return false
        } if (!validate.validateEmail(email)) {
            Alert.alert('Opps', 'Email không đúng định dạng!')
            return false
        } if (!validate.validatePhoneNumber(phoneNumber)) {
            Alert.alert('Opps', 'Số điện thoại không hợp lệ!')
            return false
        } if (!validate.validatePassword(password)) {
            Alert.alert('Opps', 'Mật khẩu phải chứa tối thiểu 6 kí tự bao gồm cả chữ cái viết hoa, viết thường và kí tự đặc biệt!')
            return false
        }

        // handle Đăng kí
        await fetch(url, {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        })
            .then((res) => {
                const code = res.status
                if (code == 400) {
                    Alert.alert('Opps', 'Email này đã được đăng kí!')
                    return false
                } if (code == 401) {
                    Alert.alert('Opps', 'Số điện thoại này đã được đăng kí!')
                    return false
                }

                Alert.alert('Thành công', 'Đăng kí tài khoản thành công!')
                clearInput()
            })
            .catch((err) => {
                Alert.alert('Oppps', err.message)
            })
    }

    const clearInput = () => {
        setEmail('')
        setPassword('')
        setUserName('')
        setPhoneNumber('')
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={{
                    fontSize: 34,
                    fontWeight: '500',
                    color: 'white',
                    marginBottom: 10
                }}>Đăng kí</Text>
                <Text style={{
                    color: 'white',
                    fontSize: 14,
                    fontWeight: '400'
                }}>Tạo mới tài khoản của bạn</Text>
            </View>
            <View style={styles.body}>
                <KeyboardAwareScrollView style={{
                    flex: 1,
                    width: width,
                }}
                    scrollEnabled={isOpenKeyboard}
                >
                    <View style={{
                        flex: 1,
                        paddingTop: 70
                    }}>
                        <View style={styles.bodyChild}>
                            <TextInput style={styles.input}
                                placeholder='Tên đăng nhập'
                                placeholderTextColor={'#AAAAAA'}
                                value={userName}
                                onChangeText={(text) => setUserName(text)} />
                            <TextInput style={styles.input}
                                keyboardType='email-address'
                                placeholderTextColor={'#AAAAAA'}
                                placeholder='Email'
                                value={email}
                                onChangeText={(text) => setEmail(text)} />
                            <TextInput style={styles.input}
                                secureTextEntry={true}
                                placeholderTextColor={'#AAAAAA'}
                                placeholder='Mật khẩu'
                                value={password}
                                onChangeText={(text) => setPassword(text)} />
                            <TextInput style={styles.input}
                                keyboardType='phone-pad'
                                placeholderTextColor={'#AAAAAA'}
                                placeholder='Số điện thoại'
                                value={phoneNumber}
                                onChangeText={(text) => setPhoneNumber(text)} />
                            <TouchableOpacity style={styles.containerButton}
                                onPress={handleSignUp}>
                                <Text style={styles.textButton}>Đăng kí</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{
                            flex: 1.5,
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'row',
                            marginTop: 50
                        }}>
                            <Text style={{
                                fontSize: 14,
                                fontWeight: '300',
                            }}>Bạn đã có tài khoản?</Text>
                            <TouchableOpacity onPress={() => {
                                navigation.goBack()
                            }}>
                                <Text style={{
                                    fontSize: 14,
                                    fontWeight: '500',
                                    color: '#EEA743'
                                }}> ĐĂNG NHẬP</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAwareScrollView>
            </View>
        </SafeAreaView>
    )
}

export default SignUp

const styles = StyleSheet.create({
    container: {
        flex: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#EEA743'
    },
    header: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
        width: width,
    },
    body: {
        flex: 8,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        width: width,
        borderTopLeftRadius: 100
    },
    bodyChild: {
        flex: 6.5,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    input: {
        width: width - 30,
        height: 50,
        borderRadius: 12,
        paddingHorizontal: 12,
        backgroundColor: '#DDDDDD',
        marginBottom: 12,
        fontSize: 14,
        fontWeight: '300'
    },
    containerButton: {
        width: width - 30,
        height: 50,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#EEA743'
    },
    textButton: {
        fontSize: 18,
        color: 'white',
        fontWeight: '500',
    }
})