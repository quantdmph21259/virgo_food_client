import { StyleSheet, Text, View, FlatList, Alert, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState, useRef } from 'react'
import ConstString from '../../controllers/ConstString'
import { useNavigation } from '@react-navigation/native'
import Ionic from 'react-native-vector-icons/Ionicons'
import Color from '../../controllers/Color'
import ScreenName from '../../controllers/ScreenName'
import AsyncStorage from '@react-native-async-storage/async-storage'

const width = Dimensions.get('window').width

const Done = () => {
    const [isLoading, setLoading] = useState(true)
    const navigation = useNavigation()
    const [data, setData] = useState([])
    const flatListRef = useRef(null)

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
                const url = `${ConstString.url}${ConstString.api_get_order_done}${JSON.parse(value).id}`
                setLoading(true)
                fetch(url)
                    .then(res => { return res.json() })
                    .then(res => {
                        setData(res.data)
                    })
                    .catch(err => {
                        Alert.alert('Oops', err.message)
                    })
                    .finally(() => {
                        setLoading(false)
                    })
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

    const onRefresh = React.useCallback(() => {
        setLoading(true)
        getObjectCurrent()
    }, [])

    return (
        <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#EEEBF6'
        }}>
            {
                isLoading
                    ? (
                        <ActivityIndicator />
                    )
                    : (
                        <FlatList data={data}
                            onRefresh={onRefresh}
                            refreshing={false}
                            ref={flatListRef}
                            keyExtractor={(item, index) => item.id}
                            renderItem={({ item }) => {
                                return (
                                    <View style={{
                                        width: width,
                                        padding: 12,
                                        backgroundColor: 'white',
                                        borderBottomWidth: 1,
                                        borderBottomColor: '#DDDDDD'
                                    }}>
                                        <Text style={{
                                            fontSize: 14,
                                            fontWeight: '400',
                                            marginBottom: 10
                                        }}>Đơn hàng ngày: {item.created_at}</Text>
                                        <View style={{
                                            flexDirection: 'row',
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }}>
                                            <Text style={{
                                                fontSize: 12,
                                                fontWeight: '300'
                                            }}>{item.product_count} sản phẩm</Text>
                                            <View style={{
                                                flexDirection: 'row',
                                                flex: 1,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                marginBottom: 10
                                            }}>
                                                <Ionic name={'wallet'} size={23} color={'#EEA743'} />
                                                <Text style={{
                                                    fontSize: 14,
                                                    fontWeight: '400',
                                                    marginStart: 7
                                                }}>Thành tiền:</Text>
                                                <Text style={{
                                                    marginStart: 7,
                                                    fontSize: 14,
                                                    fontWeight: '500',
                                                    color: '#FF0000'
                                                }}>{formatPriceByVnd(item.price)}</Text>
                                            </View>
                                        </View>
                                        <TouchableOpacity
                                            onPress={() => navigation.navigate(ScreenName.detailsOrderScreen, { item })}
                                        >
                                            <Text style={{
                                                fontSize: 12,
                                                fontWeight: '500',
                                                textAlign: 'center',
                                                textDecorationLine: 'underline',
                                                fontStyle: 'italic',
                                                color: Color.primary,
                                                marginTop: 10
                                            }}>Xem chi tiết đơn hàng</Text>
                                        </TouchableOpacity>
                                    </View>
                                )
                            }} />
                    )
            }
        </View >
    )
}

export default Done

const styles = StyleSheet.create({})