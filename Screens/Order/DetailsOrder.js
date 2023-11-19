import { StyleSheet, Text, View, SafeAreaView, Dimensions, TouchableOpacity, Alert, ActivityIndicator, FlatList, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import Ionic from 'react-native-vector-icons/Ionicons'
import Color from '../../controllers/Color'
import ConstString from '../../controllers/ConstString'

const width = Dimensions.get('window').width

const DetailsOrder = ({ navigation, route }) => {
    const [itemCurrent, setItemCurrent] = useState(route.params.item)
    const [isLoading, setLoading] = useState(true)
    const [mOrder, setOrder] = useState({})
    const [data, setData] = useState([])

    useEffect(() => {
        getOrder()
    }, [])

    const getOrder = async () => {
        setLoading(true)
        const url = `${ConstString.url}${ConstString.api_search_order_by_id}${itemCurrent.id}`
        fetch(url)
            .then(res => { return res.json() })
            .then(res => {
                setData(res.data)
                setOrder(res.data[0])
            })
            .catch(err => {
                Alert.alert('Oops', err.message)
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const formatPriceByVnd = (price) => {
        let vnd = new Intl.NumberFormat('VN', {
            style: 'currency',
            currency: 'VND',
        })

        return `${vnd.format(price)}`
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.containerHeader}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionic name={'chevron-back-outline'} size={30} color={'#EEA743'} />
                </TouchableOpacity>
                <Text style={{
                    fontWeight: '300',
                    fontSize: 24,
                    flex: 1,
                    textAlign: 'center',
                    paddingBottom: 7
                }}>Chi tiết đơn hàng</Text>
            </View>

            <View style={{
                flex: 1,
                backgroundColor: '#EEEBF6',
                justifyContent: 'center',
                alignItems: 'center',
                width: width
            }}>
                {
                    isLoading
                        ? (
                            <ActivityIndicator />
                        )
                        : (
                            <>
                                <View style={{ flexDirection: 'row', width: width, paddingHorizontal: 12 }}>
                                    <Text style={{
                                        fontSize: 16,
                                        fontWeight: '500',
                                        marginVertical: 12,
                                        color: Color.primary
                                    }}>Thông tin đơn hàng</Text>
                                    <View style={{ flex: 1 }} />
                                </View>
                                <View style={{ flexDirection: 'row', width: width, padding: 12, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#D5D5D5' }}>
                                    <Text style={{
                                        fontSize: 14,
                                        fontWeight: '500',
                                    }}>Mã đơn hàng</Text>
                                    <Text style={{ flex: 1, textAlign: 'right', fontSize: 14, fontWeight: '300' }}>{itemCurrent.id}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', width: width, padding: 12, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#D5D5D5' }}>
                                    <Text style={{
                                        fontSize: 14,
                                        fontWeight: '500',
                                    }}>Người nhận</Text>
                                    <Text style={{ flex: 1, textAlign: 'right', fontSize: 14, fontWeight: '300' }}>{mOrder.user_name}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', width: width, padding: 12, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#D5D5D5' }}>
                                    <Text style={{
                                        fontSize: 14,
                                        fontWeight: '500',
                                    }}>Số điện thoại</Text>
                                    <Text style={{ flex: 1, textAlign: 'right', fontSize: 14, fontWeight: '300' }}>{mOrder.phone_number}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', width: width, padding: 12, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#D5D5D5' }}>
                                    <Text style={{
                                        fontSize: 14,
                                        fontWeight: '500',
                                    }}>Địa chỉ</Text>
                                    <Text style={{ flex: 1, textAlign: 'right', fontSize: 14, fontWeight: '300' }}>{mOrder.address}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', width: width, paddingHorizontal: 12 }}>
                                    <Text style={{
                                        fontSize: 16,
                                        fontWeight: '500',
                                        marginVertical: 12,
                                        color: Color.primary
                                    }}>Danh sách đơn mua</Text>
                                    <View style={{ flex: 1 }} />
                                </View>
                                <FlatList style={{ flex: 1 }}
                                    scrollEnabled={data.length > 2}
                                    data={data}
                                    keyExtractor={(item, index) => (item.food_image)}
                                    renderItem={({ item }) => {
                                        return (
                                            <View style={{
                                                width: width,
                                                borderBottomWidth: .5,
                                                borderBottomColor: '#D5D5D5',
                                                padding: 7,
                                                flexDirection: 'row'
                                            }}>
                                                <Image source={{ uri: item.food_image }}
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
                                                    }}>{item.food_name}</Text>
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
                                    }} />
                            </>
                        )
                }
            </View>
        </SafeAreaView>
    )
}

export default DetailsOrder

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white'
    },
    containerHeader: {
        width: width,
        textAlign: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1.3,
        borderBottomColor: Color.primary,
        padding: 12
    },
})