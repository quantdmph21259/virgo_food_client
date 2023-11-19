import { StyleSheet, Text, View, SafeAreaView, Dimensions, FlatList, TouchableOpacity, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import Ionic from 'react-native-vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import ScreenName from '../../controllers/ScreenName'

const width = Dimensions.get('window').width

const SettingScreen = () => {

    const navigation = useNavigation()
    const myAccounts = [
        {
            id: 0,
            name: 'Tài khoản & Bảo mật',
            screenName: 'AccountAndSecurityScreen'
        },
        {
            id: 1,
            name: 'Địa chỉ',
            screenName: 'AdddressScreen'
        }
    ]
    const supports = [
        {
            id: 2,
            name: 'Trung tâm hỗ trợ'
        },
        {
            id: 3,
            name: 'Điều khoản cộng đồng'
        },
        {
            id: 4,
            name: 'Điều khoản app'
        },
        {
            id: 5,
            name: 'Giới thiệu'
        },
        {
            id: 6,
            name: 'Yêu cầu hủy tài khoản'
        }
    ]
    const [settingAccounts, setSettingAccount] = useState(myAccounts)
    const [supportsUser, setSupportsUser] = useState(supports)

    const handleSetting = (item) => {
        switch (item.id) {
            case 0: {
                startActivity(ScreenName.accountAndSecurityScreen)
                break
            } case 1: {
                startActivity(ScreenName.addressScreen)
                break
            } case 2: {
                startActivity(ScreenName.helpCenterScreen)
                break
            } case 3: {
                startActivity(ScreenName.communityTermsScreen)
                break
            } case 4: {
                startActivity(ScreenName.termsAppliationScreen)
                break
            } case 5: {
                startActivity(ScreenName.introduceScreen)
                break
            } case 6: {
                startActivity(ScreenName.requestDisableAccountScreen)
                break
            }
        }
    }

    const startActivity = (screenName) => {
        navigation.navigate(screenName)
    }

    const logout = () => {
        Alert.alert('Xác nhận đăng xuất', 'Bạn sẽ đăng xuất tài khoản sau khi thực hiện hành động này!', [
            {
                text: 'Hủy',
                style: 'cancel'
            },
            {
                text: 'Đồng ý',
                onPress: () => {
                    if (navigation.canGoBack()) {
                        navigation.dispatch(StackActions.pop(1))
                        console.log('Can go back')
                    } else {
                        console.log('Can not go back')
                    }
                }
            }
        ])
    }

    const clearAsyncStorage = async () => {
        try {
            await AsyncStorage.clear()
            console.log(`
            \n>>>>> Message: AsyncStorage cleared\n
            `)
        } catch (error) {
            console.error(`
                \n>>>>> Message: ${error}\n
            `)
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.containerHeader}>
                <Text style={{
                    fontSize: 24,
                    fontWeight: '300',
                    flex: 1,
                    textAlign: 'center'
                }}>Thiết lập tài khoản</Text>
                <TouchableOpacity onPress={() => {
                    Alert.alert('Xác nhận', 'Bạn có muốn đăng xuất tài khoản khỏi thiết bị này?', [
                        {
                            text: 'Không',
                            style: 'cancel'
                        },
                        {
                            text: 'Có',
                            onPress: () => {
                                clearAsyncStorage()
                                navigation.reset({
                                    index: 0,
                                    routes: [{ name: ScreenName.signIn }],
                                })
                                navigation.getParent().getParent().goBack()
                            }
                        }
                    ])
                }}>
                    <Ionic name={'exit-outline'} size={30} color={'#EEA743'} />
                </TouchableOpacity>
            </View>
            <View style={styles.body}>
                <View>
                    <Text style={styles.textLabel}>Tài khoản của tôi</Text>
                </View>
                <FlatList data={settingAccounts}
                    scrollEnabled={false}
                    keyExtractor={(item, index) => item.id}
                    renderItem={({ item }) => {
                        return (
                            <TouchableOpacity style={styles.containerItem}
                                onPress={() => handleSetting(item)}>
                                <Text style={{ fontWeight: '300' }}>{item.name}</Text>
                                <View style={{
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'flex-end'
                                }}>
                                    <Ionic name={'chevron-forward-outline'} size={20} color={'#EEA743'} />
                                </View>
                            </TouchableOpacity>
                        )
                    }} />
                <View>
                    <Text style={styles.textLabel}>Hỗ trợ</Text>
                </View>
                <FlatList data={supportsUser}
                    scrollEnabled={false}
                    keyExtractor={(item, index) => item.id}
                    key={(item) => item.id}
                    renderItem={({ item }) => {
                        return (
                            <TouchableOpacity style={styles.containerItem}
                                onPress={() => handleSetting(item)}>
                                <Text style={{ fontWeight: '300' }}>{item.name}</Text>
                                <View style={{
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'flex-end',
                                }}>
                                    <Ionic name={'chevron-forward-outline'} size={20} color={'#EEA743'} />
                                </View>
                            </TouchableOpacity>
                        )
                    }} />
                <View style={{ flex: 9 }} />
            </View>
        </SafeAreaView>
    )
}

export default SettingScreen

const styles = StyleSheet.create({
    container: {
        flex: 10,
        width: width,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white'
    },
    containerHeader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: width,
        flexDirection: 'row',
        paddingHorizontal: 12
    },
    body: {
        flex: 9,
        width: width,
        backgroundColor: '#EEEBF6',
    },
    textLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#EEA743',
        margin: 12
    },
    containerItem: {
        width: width,
        paddingHorizontal: 12,
        paddingVertical: 15,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: 'white',
        borderBottomColor: '#DDDDDD',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
})