import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Dimensions, Alert, FlatList, ActivityIndicator, Image } from 'react-native'
import React, { useState } from 'react'
import Ionic from 'react-native-vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Color from '../../controllers/Color'
import ConstString from '../../controllers/ConstString'
import ScreenName from '../../controllers/ScreenName'

const width = Dimensions.get('window').width

const HandleOrder = () => {
    const [objectCurrent, setObjectCurrent] = useState({})
    const navigation = useNavigation()
    const [isLoading, setLoading] = useState(true)
    const [carts, setCarts] = useState([])

    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getObjectCurrent()
        })

        return unsubscribe
    }, [navigation])

    const getObjectCurrent = async () => {
        setLoading(true)
        try {
            const value = await AsyncStorage.getItem('ObjectCurrent')
            if (value !== null) {
                setObjectCurrent(JSON.parse(value))
                console.log(
                    `
                    \n>>>>> Check user current from async storage: ${JSON.stringify(objectCurrent)}\n
                    `
                )

                setLoading(true)
                url = `${ConstString.url}${ConstString.api_get_carts}${JSON.parse(value).id}`
                try {
                    const res = await fetch(url)
                    const json = await res.json()
                    setCarts(json)
                } catch (err) {
                    Alert.alert('Oops', err.message)
                } finally {
                    setLoading(false)
                }
            }
        } catch (e) {
            console.log(
                `
                \n>>>>> Message get user from async storage: ${e}\n
                `
            )
        } finally {
            setLoading(false)
        }
    }

    const formatPriceByVnd = (price) => {
        let vnd = new Intl.NumberFormat('VN', {
            style: 'currency',
            currency: 'VND',
        })

        return `${vnd.format(price)}`
    }

    const caculatorSumPrice = () => {
        if (carts.length == 0) {
            return 0
        }

        let result = 0
        for (let i = 0; i < carts.length; i++) {
            result += (carts[i].discount > 0)
                ? (carts[i].price - carts[i].price * carts[i].discount / 100) * carts[i].quantity
                : carts[i].price * carts[i].quantity
        }

        return result
    }

    const handleCheckOutCart = async () => {
        if (objectCurrent.address == null || objectCurrent.address == undefined) {
            Alert.alert('Oops', 'Không có địa chỉ nhận hàng!')
        } else {
            const url = `${ConstString.url}${ConstString.api_check_out_carts}${objectCurrent.id}`
            const object = {
                price: caculatorSumPrice()
            }
            fetch(url, {
                method: 'post',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(object)
            })
                .then(res => { return res.json() })
                .then(res => {
                    const code = res.flag
                    if (code == 1) {
                        Alert.alert('Thành công', 'Đặt hàng thành công!')
                        navigation.goBack()
                    }
                })
                .catch(err => {
                    Alert.alert('Oops', err.message)
                })
                .finally(() => {
                    setLoading(false)
                })
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.containerHeader}>
                <TouchableOpacity style={{ marginStart: 12 }}
                    onPress={() => {
                        Alert.alert('Xác nhận', 'Bạn có muốn hủy thanh toán?', [
                            {
                                text: 'Không',
                                style: 'cancel'
                            },
                            {
                                text: 'Có',
                                onPress: () => {
                                    navigation.goBack()
                                }
                            }
                        ])
                    }}>
                    <Ionic name='chevron-back-outline' size={30} color={'#EEA743'} />
                </TouchableOpacity>
                <Text style={{
                    fontWeight: '300',
                    fontSize: 24,
                    flex: 1,
                    textAlign: 'center'
                }}>Thanh toán</Text>
            </View>

            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#EEEBF6', width: width, }}>
                <View style={{
                    width: width,
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: 'white',
                    paddingVertical: 14,
                    paddingHorizontal: 12,
                    borderTopWidth: 2,
                    borderTopColor: Color.primary,
                    borderBottomWidth: 2,
                    borderBottomColor: Color.primary
                }}>
                    <Ionic name='location-outline' size={23} color={'#EEA743'} />
                    <View style={{ marginStart: 14, flex: 1 }}>
                        <Text style={{
                            fontSize: 14,
                            fontWeight: '500',
                            marginBottom: 7
                        }}>Địa chỉ nhận hàng</Text>
                        <Text style={{
                            fontSize: 14,
                            fontWeight: '300',
                            marginBottom: 3
                        }}>{objectCurrent.userName}  |  (+84) {String(objectCurrent.phoneNumber).substring(1)}</Text>
                        {
                            objectCurrent.address != null
                                ? (
                                    <Text style={{
                                        fontSize: 14,
                                        fontWeight: '300',
                                        color: 'black'
                                    }}>{objectCurrent.address}</Text>
                                )
                                : (
                                    <Text style={{
                                        fontSize: 14,
                                        textDecorationLine: 'underline',
                                        fontStyle: 'italic',
                                        color: '#FF0000',
                                        fontWeight: '300'
                                    }}>Không có địa chỉ nhận hàng</Text>
                                )
                        }
                    </View>
                    <TouchableOpacity onPress={() => { navigation.navigate(ScreenName.addressScreen) }}>
                        <Ionic name='create-outline' size={30} color={'#EEA743'} />
                    </TouchableOpacity>
                </View>

                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    {
                        isLoading
                            ? (
                                <ActivityIndicator />
                            )
                            : (
                                <>
                                    <FlatList data={carts}
                                        scrollEnabled={carts.length > 4}
                                        style={{
                                            marginTop: 14
                                        }}
                                        keyExtractor={(item, index) => item.id}
                                        renderItem={({ item }) => {
                                            return (
                                                <View style={{
                                                    width: width,
                                                    borderBottomWidth: .5,
                                                    borderBottomColor: '#D5D5D5',
                                                    padding: 7,
                                                    flexDirection: 'row'
                                                }}>
                                                    <Image source={{ uri: item.image }}
                                                        style={{
                                                            height: 80,
                                                            width: 80,
                                                            resizeMode: 'cover',
                                                            marginEnd: 14
                                                        }} />
                                                    <View>
                                                        <Text style={{
                                                            fontSize: 16,
                                                            color: 'black',
                                                            fontWeight: '300',
                                                            marginBottom: 5
                                                        }}>{item.name}</Text>
                                                        {
                                                            item.discount > 0
                                                                ? (
                                                                    <Text style={{
                                                                        fontSize: 14,
                                                                        fontWeight: '500',
                                                                        color: '#FF0000'
                                                                    }}>{formatPriceByVnd(item.price - (item.price * item.discount / 100))}</Text>
                                                                )
                                                                : (
                                                                    <Text style={{
                                                                        fontSize: 14,
                                                                        fontWeight: '500',
                                                                        color: '#FF0000'
                                                                    }}>{formatPriceByVnd(item.price)}</Text>
                                                                )
                                                        }
                                                        <Text style={{
                                                            fontSize: 14,
                                                            fontWeight: '300',
                                                            color: 'black',
                                                            marginTop: 7
                                                        }}>X{item.quantity}</Text>
                                                    </View>
                                                </View>
                                            )
                                        }}
                                    />
                                    <View style={{
                                        flexDirection: 'row',
                                        backgroundColor: 'white',
                                        width: width,
                                        borderTopWidth: 2,
                                        borderTopColor: '#D5D5D5',
                                        alignItems: 'center'
                                    }}>
                                        <Text style={{
                                            fontSize: 16,
                                            fontWeight: '500',
                                            color: 'black',
                                            marginEnd: 7,
                                            marginStart: 12,
                                            marginVertical: 16,
                                        }}>Tổng tiền:</Text>
                                        <Text style={{
                                            fontSize: 16,
                                            fontWeight: '500',
                                            color: '#FF0000'
                                        }}>{formatPriceByVnd(caculatorSumPrice())}</Text>

                                        <TouchableOpacity style={{
                                            flex: 1,
                                            height: 50,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            backgroundColor: Color.primary,
                                            marginStart: 14
                                        }}
                                            onPress={handleCheckOutCart}>
                                            <Text style={{
                                                fontSize: 16,
                                                color: 'white',
                                                fontWeight: '500'
                                            }}>Đặt hàng</Text>
                                        </TouchableOpacity>
                                    </View>
                                </>
                            )
                    }
                </View>
            </View>
        </SafeAreaView>
    )
}

export default HandleOrder

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white'
    },
    containerHeader: {
        width: width,
        paddingVertical: 15,
        textAlign: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
})