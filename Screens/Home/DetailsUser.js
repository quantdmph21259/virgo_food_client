import { StyleSheet, Text, View, SafeAreaView, Dimensions, TouchableOpacity, ActivityIndicator, Image, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import Ionic from 'react-native-vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { FlatGrid } from 'react-native-super-grid'
import Format from '../../controllers/FormatData'
import ConstString from '../../controllers/ConstString'

const width = Dimensions.get('window').width

const DetailsUser = () => {
    const navigation = useNavigation()
    const [isLoading, setLoading] = useState(true)
    const [objectCurrent, setObjectCurrent] = useState({})
    const [data, setData] = useState([])
    const [quantityCarts, setQuantityCarts] = useState(0)
    const [quantityBills, setQuantityBills] = useState(0)

    useEffect(() => {
        getObjectCurrent()
    }, [])

    const getObjectCurrent = async () => {
        try {
            const value = await AsyncStorage.getItem('ObjectCurrent')
            if (value !== null) {
                console.log(
                    `
                    \n>>>>> Check user current from async storage: ${JSON.stringify(objectCurrent)}\n
                    `
                )
                setObjectCurrent(JSON.parse(value))

                const urlGetQuantityCarts = `${ConstString.url}${ConstString.api_get_quantity_carts}${JSON.parse(value).id}`
                const urlGetQuantityBills = `${ConstString.url}${ConstString.api_get_quantity_bills}${JSON.parse(value).id}`
                const urlGetHistoryOrder = `${ConstString.url}${ConstString.api_get_history_order}${JSON.parse(value).id}`

                setLoading(true)

                fetch(urlGetQuantityBills)
                    .then(res => { return res.json() })
                    .then(res => {
                        setQuantityBills(res.total_records)
                    })
                    .catch(err => {
                        Alert.alert('Oops', err.message)
                    })
                    .finally(() => {
                        setLoading(false)
                    })

                setLoading(true)

                fetch(urlGetQuantityCarts)
                    .then(res => { return res.json() })
                    .then(res => {
                        setQuantityCarts(res.total_records)
                    })
                    .catch(err => {
                        Alert.alert('Oops', err.message)
                    })
                    .finally(() => {
                        setLoading(false)
                    })

                setLoading(true)

                fetch(urlGetHistoryOrder)
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

    return (
        <SafeAreaView style={styles.container}>
            {
                isLoading
                    ? (
                        <ActivityIndicator />
                    )
                    : (
                        <>
                            <View style={styles.header}>
                                <TouchableOpacity onPress={() => navigation.goBack()}>
                                    <Ionic name='chevron-back-outline' size={30} color={'#EEA743'} />
                                </TouchableOpacity>
                                <Text style={styles.textEmailUser}>{objectCurrent.email}</Text>
                            </View>
                            <View style={styles.body}>
                                <View style={styles.containerImage}>
                                    <Image style={styles.imageUser}
                                        source={{ uri: objectCurrent.image }} />
                                    <View style={styles.containerInformation}>
                                        <View style={styles.center}>
                                            <Text style={styles.textCaculator}>{quantityCarts}</Text>
                                            <Text style={styles.textNormal}>Giỏ hàng</Text>
                                        </View>
                                        <View style={styles.center}>
                                            <Text style={styles.textCaculator}>{quantityBills}</Text>
                                            <Text style={styles.textNormal}>Đã mua</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.footer}>
                                <Text style={styles.textTitle}>Lịch sử mua hàng</Text>
                                <FlatGrid data={Format.formatData(data, 2)}
                                    keyExtractor={(item, index) => item.image}
                                    itemDimension={130}
                                    spacing={5}
                                    renderItem={({ item }) => {
                                        return (
                                            <>
                                                {
                                                    item.image
                                                    && (
                                                        <View style={styles.containerItem}>
                                                            <Image source={{ uri: item.image }}
                                                                style={styles.imageItem} />
                                                            <Text style={styles.nameItem}>{item.name}</Text>
                                                        </View>
                                                    )
                                                }
                                            </>
                                        )
                                    }} />
                            </View>
                        </>
                    )
            }
        </SafeAreaView>
    )
}

export default DetailsUser

const styles = StyleSheet.create({
    container: {
        flex: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#EEEBF6'
    },
    header: {
        flex: 1,
        width: width,
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center'
    },
    body: {
        flex: 1,
        width: width,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 12
    },
    footer: {
        flex: 8,
        width: width,
        marginTop: 12
    },
    textEmailUser: {
        flex: 1,
        fontSize: 18,
        fontWeight: '500',
        color: '#EEA743',
        textAlign: 'center'
    },
    imageUser: {
        width: 75,
        height: 75,
        borderWidth: 2,
        borderColor: '#EEA743',
        borderRadius: 100
    },
    containerImage: {
        width: width,
        paddingHorizontal: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    containerInformation: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 12,
        borderColor: '#FF0000',
        padding: 12,
        marginStart: 12
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    textTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#EEA743',
        fontStyle: 'italic',
        margin: 12
    },
    containerItem: {
        flex: 1,
        padding: 12,
        backgroundColor: 'white',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center'
    },
    imageItem: {
        width: 80,
        height: 80,
        borderWidth: 2,
        borderRadius: 100,
        borderColor: '#EEA743'
    },
    nameItem: {
        marginTop: 7,
        fontSize: 14,
        fontWeight: '500',
        color: '#EEA743'
    },
    textCaculator: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 3
    },
    textNormal: {
        fontSize: 14,
        fontWeight: '300'
    }
})