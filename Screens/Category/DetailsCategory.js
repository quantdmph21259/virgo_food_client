import { StyleSheet, Text, View, SafeAreaView, Dimensions, TextInput, ActivityIndicator, FlatList, Alert, Image, TouchableOpacity } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import Ionic from 'react-native-vector-icons/Ionicons'
import ConstString from '../../controllers/ConstString'
import AsyncStorage from '@react-native-async-storage/async-storage'

const width = Dimensions.get('window').width

const DetailsCategory = ({ navigation, route }) => {
    const [itemCurrent, setItemCurrent] = useState(route.params.item)
    const [keySearch, setKeySearch] = useState('')
    const [isLoading, setLoading] = useState(false)
    const [foods, setFoods] = useState([])
    const [objectCurrent, setObjectCurrent] = useState({})
    const url = `${ConstString.url}${ConstString.api_filter_product_by_category}${itemCurrent.id}`
    const lengthNameMax = 13
    const flatListRef = useRef(null)

    useEffect(() => {
        setLoading(true)
        getFoods()
        getObjectCurrent()
    }, [])

    const getObjectCurrent = async () => {
        try {
            const value = await AsyncStorage.getItem('ObjectCurrent')
            if (value !== null) {
                setObjectCurrent(JSON.parse(value))
                console.log(
                    `
                    \n>>>>> Check user current from async storage: ${JSON.stringify(objectCurrent)}\n
                    `
                )
            }
        } catch (e) {
            console.log(
                `
                \n>>>>> Message get user from async storage: ${e}\n
                `
            )
        }
    }


    const getFoods = async () => {
        try {
            const res = await fetch(url)
            const json = await res.json()
            setFoods(json)
        } catch (err) {
            Alert.alert('Oops', err.message)
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

    const handleSearchFoodName = async () => {
        if (!keySearch) {
            setLoading(true)
            getFoods()
        } else {
            const urlSearch = `${ConstString.url}${ConstString.api_search_product_by_name_and_category}${itemCurrent.id}`
            const objectSearch = {
                keySearch: keySearch
            }
            fetch(urlSearch, {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(objectSearch)
            })
                .then((res) => { return res.json() })
                .then(res => {
                    setFoods(res)
                })
                .catch(err => {
                    Alert.alert('Opps', err.message)
                })
                .finally(() => {
                    setLoading(false)
                })
        }
    }

    const addCart = async (item) => {
        const url = `${ConstString.url}${ConstString.api_add_cart}`
        const object = {
            idProduct: item.id,
            idUser: objectCurrent.id
        }

        setLoading(true)
        fetch(url, {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(object)
        })
            .then(res => { return res.json() })
            .then(res => {
                const flag = res.flag
                if (flag == 1) {
                    Alert.alert('Thành công!', 'Đã thêm sản phẩm vào giỏ hàng!')
                }
            })
            .catch(err => {
                Alert.alert('Oops', err.message)
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const onRefresh = React.useCallback(() => {
        setLoading(true)
        getFoods()
    }, [])

    return (
        <View style={styles.container}>
            <View style={styles.containerHeader}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionic name={'chevron-back-outline'} size={30} color={'#EEA743'} />
                </TouchableOpacity>
                <Text style={{
                    fontSize: 18,
                    fontWeight: '500',
                    flex: 1,
                    textAlign: 'center'
                }}>{itemCurrent.name}</Text>
            </View>
            <View style={styles.containerSearch}>
                <View style={{
                    width: width - 12,
                    backgroundColor: '#DDDDDD',
                    height: 50,
                    borderRadius: 12,
                    paddingHorizontal: 12,
                    justifyContent: 'center',
                    flexDirection: 'row',
                    alignItems: 'center'
                }}>
                    <TextInput style={{
                        height: 40,
                        flex: 1,
                        fontSize: 14,
                        color: 'black',
                        fontWeight: '300'
                    }}
                        placeholder='Tìm kiếm tên món ăn...'
                        placeholderTextColor={'gray'}
                        value={keySearch}
                        onChangeText={(text) => setKeySearch(text)}
                        onSubmitEditing={handleSearchFoodName}
                    />
                    {/* <Ionic name={'search-outline'} size={30} color={'#EEA743'} /> */}
                </View>
            </View>

            <View style={{ flex: 9, justifyContent: 'center', alignItems: 'center', }}>
                {
                    isLoading
                        ? (
                            <ActivityIndicator />
                        )
                        : (
                            <FlatList data={foods}
                                onRefresh={onRefresh}
                                refreshing={false}
                                ref={flatListRef}
                                keyExtractor={(item, index) => item.id}
                                renderItem={({ item }) => {
                                    return (
                                        <View style={styles.containerItem}>
                                            <Image source={{ uri: item.image }}
                                                style={styles.imageItem} />
                                            <View style={styles.containerVerticalTextItem}>
                                                <Text style={{
                                                    fontSize: 18,
                                                    fontWeight: '500',
                                                    marginBottom: 7
                                                }}>{
                                                        String(item.name).length > lengthNameMax ? String(item.name).slice(0, lengthNameMax) + "..." : String(item.name)
                                                    }</Text>
                                                <Text style={{
                                                    fontSize: 14,
                                                    fontStyle: 'italic',
                                                    color: 'gray',
                                                    marginBottom: 7,
                                                    fontWeight: '300'
                                                }}>{item.category}</Text>
                                                <View>
                                                    {
                                                        (item.discount > 0)
                                                            ? (
                                                                <View style={{ flexDirection: 'row' }}>
                                                                    <Text style={{
                                                                        textDecorationLine: 'line-through',
                                                                        textDecorationColor: '#EEA743',
                                                                        color: '#DDDDDD',
                                                                        fontStyle: 'italic',
                                                                        marginEnd: 7,
                                                                        fontWeight: '400'
                                                                    }}>{formatPriceByVnd(item.price)}</Text>
                                                                    <Text style={{
                                                                        fontSize: 14,
                                                                        fontWeight: '500',
                                                                        color: 'red'
                                                                    }}>{formatPriceByVnd(item.price - item.price * item.discount / 100)}</Text>
                                                                </View>
                                                            )
                                                            : (
                                                                <Text style={{
                                                                    fontSize: 14,
                                                                    fontWeight: '500',
                                                                }}>{formatPriceByVnd(item.price)}</Text>
                                                            )
                                                    }
                                                </View>
                                            </View>
                                            {
                                                (item.discount > 0)
                                                    ? (
                                                        <View style={{ flex: 1 }}>
                                                            <Text style={{
                                                                fontSize: 10,
                                                                fontWeight: 'bold',
                                                                fontStyle: 'italic',
                                                                color: 'red',
                                                            }}>-{item.discount}%</Text>
                                                        </View>
                                                    ) : <View style={{ flex: 1, }}></View>
                                            }
                                            <View style={{
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                <TouchableOpacity style={styles.containerButton}
                                                    onPress={() => addCart(item)}>
                                                    <Text style={{ color: '#EEA743' }}>+</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    )
                                }}
                            />
                        )
                }
            </View>
        </View>
    )
}

export default DetailsCategory

const styles = StyleSheet.create({
    container: {
        flex: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#EEEBF6'
    },
    containerSearch: {
        width: width,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 7,
        marginBottom: 14,
    },
    containerItem: {
        width: width - 12,
        padding: 12,
        borderRadius: 12,
        marginBottom: 12,
        backgroundColor: 'white',
        flexDirection: 'row'
    },
    containerButton: {
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#EEA743'
    },
    imageItem: {
        width: 75,
        height: 75,
        borderRadius: 100,
        resizeMode: 'cover'
    },
    containerVerticalTextItem: {
        marginHorizontal: 12,
        justifyContent: 'center',
    },
    containerHeader: {
        justifyContent: 'center',
        alignItems: 'center',
        width: width,
        backgroundColor: 'white',
        flex: 1.3,
        flexDirection: 'row',
        paddingHorizontal: 12
    },
})