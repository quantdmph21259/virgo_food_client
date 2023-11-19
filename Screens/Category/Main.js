import { StyleSheet, Text, View, SafeAreaView, TextInput, Dimensions, TouchableOpacity, FlatList, ActivityIndicator, Image, Alert } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import Ionic from 'react-native-vector-icons/Ionicons'
import ConstString from '../../controllers/ConstString'
import { useNavigation } from '@react-navigation/native'
import ScreenName from '../../controllers/ScreenName'
import Color from '../../controllers/Color'

const width = Dimensions.get('window').width

const CategoryScreen = () => {
    const navigation = useNavigation()
    const [categories, setCategories] = useState([])
    const [isLoading, setLoading] = useState(false)
    const flatListRef = useRef(null)

    useEffect(() => {
        getCategories()
    }, [])

    const getCategories = async () => {
        const url = `${ConstString.url}${ConstString.api_get_all_categories}`
        setLoading(true)
        try {
            const res = await fetch(url)
            const json = await res.json()
            setCategories(json)
        } catch (err) {
            Alert.alert('Oops', err.message)
        } finally {
            setLoading(false)
        }
    }

    const onRefresh = React.useCallback(() => {
        setLoading(true)
        getCategories()
    }, [])

    return (
        <SafeAreaView style={styles.container}>
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'white',
                width: width,
                borderBottomWidth: 1,
                borderBottomColor: Color.primary
            }}>
                <Text style={{
                    fontWeight: '300',
                    fontSize: 24,
                    textAlign: 'center',
                }}>Thể loại</Text>
            </View>
            <View style={styles.containerShowList}>
                {
                    (isLoading)
                        ? (
                            <ActivityIndicator />
                        ) : (
                            <FlatList data={categories}
                                onRefresh={onRefresh}
                                refreshing={false}
                                ref={flatListRef}
                                keyExtractor={(item, index) => item.id}
                                renderItem={({ item }) => {
                                    return (
                                        <TouchableOpacity style={styles.containerItem}
                                            onPress={() => { navigation.navigate(ScreenName.detailsCategoryScreen, { item }) }}>
                                            <Text style={{ fontWeight: '300' }}>
                                                {
                                                    item.name
                                                }
                                            </Text>
                                            <View style={{ flex: 1 }} />
                                            <Ionic name={'chevron-forward-outline'} size={20} color={'#EEA743'} />
                                        </TouchableOpacity>
                                    )
                                }}
                            />
                        )
                }
            </View>
        </SafeAreaView>
    )
}

export default CategoryScreen

const styles = StyleSheet.create({
    container: {
        flex: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    containerSearch: {
        flex: 1,
        width: width,
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    containerFilterByCategory: {
        flex: .7,
        width: width,
        justifyContent: 'center',
        paddingHorizontal: 12
    },
    containerShowList: {
        flex: 8.3,
        width: width,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#EEEBF6'
    },
    containerItem: {
        width: width,
        paddingVertical: 14,
        backgroundColor: 'white',
        paddingHorizontal: 12,
        borderBottomWidth: .5,
        borderBottomColor: '#CCCCCC',
        flexDirection: 'row'
    }
})