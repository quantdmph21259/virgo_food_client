import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import CartScreen from './Main'
import ScreenName from '../../controllers/ScreenName'
import HandleOrder from './HandleOrder'
import Address from '../Settings/AccountAndSecurity/Address/AddressScreen'

const ContainerCart = () => {

    const Stack = createStackNavigator()

    return (
        <Stack.Navigator initialRouteName={ScreenName.cartScreen} screenOptions={{ headerShown: false }}>
            <Stack.Screen name={ScreenName.cartScreen} component={CartScreen} />
            <Stack.Screen name={ScreenName.handleOrderScreen} component={HandleOrder} />
            <Stack.Screen name={ScreenName.addressScreen} component={Address} />
        </Stack.Navigator>
    )
}

export default ContainerCart