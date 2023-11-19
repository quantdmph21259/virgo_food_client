import { StyleSheet, Text, View, SafeAreaView, Dimensions } from 'react-native'
import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import ScreenName from '../../controllers/ScreenName'
import WaitingScreen from './WaitingConfirm'
import ShippingScreen from './Shipping'
import DoneScreen from './Done'
import Color from '../../controllers/Color'

const width = Dimensions.get('window').width

const OrderScreen = () => {
    const Tab = createMaterialTopTabNavigator()

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.containerHeader}>
                <Text style={{
                    fontWeight: '300',
                    fontSize: 24,
                    flex: 1,
                    textAlign: 'center',
                    paddingBottom: 7
                }}>Hóa đơn</Text>
            </View>

            <View style={{ flex: 1, width: width }}>
                <Tab.Navigator initialRouteName={ScreenName.waitingScreen}
                    screenOptions={{
                        tabBarLabelStyle: { fontSize: 14, textTransform: 'none', fontWeight: '400' },
                        tabBarStyle: { backgroundColor: 'white' },
                        tabBarAndroidRipple: { borderless: false },
                        tabBarActiveTintColor: Color.primary,
                        tabBarInactiveTintColor: '#323232',
                        tabBarIndicatorStyle: { backgroundColor: Color.primary }
                    }}
                >
                    <Tab.Screen name={ScreenName.waitingScreen} component={WaitingScreen} />
                    <Tab.Screen name={ScreenName.shippingScreen} component={ShippingScreen} />
                    <Tab.Screen name={ScreenName.doneScreeen} component={DoneScreen} />
                </Tab.Navigator>
            </View>
        </SafeAreaView>


    )
}

export default OrderScreen

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
        borderBottomColor: Color.primary
    },
})