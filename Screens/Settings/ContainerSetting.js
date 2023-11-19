import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { AccountScreen, AddressScreen, ConfirmUserScreen, EmailScreen, PasswordScreen, PhoneNumberScreen, UserProfileScreen } from './AccountAndSecurity/index'
import { CommunityTerms, Introduce, RequestDeleteAccount, SuppoterCenter, TermsOfApplication, } from './Supported/index'
import SettingScreen from './Main'
import ScreenName from '../../controllers/ScreenName'

const Stack = createStackNavigator()

const ContainerSetting = () => {
    return (
        <Stack.Navigator initialRouteName={ScreenName.settingScreen} screenOptions={{ headerShown: false }}>
            <Stack.Screen name={ScreenName.settingScreen} component={SettingScreen} />
            <Stack.Screen name={ScreenName.accountAndSecurityScreen} component={AccountScreen} />
            <Stack.Screen name={ScreenName.addressScreen} component={AddressScreen} />
            <Stack.Screen name={ScreenName.communityTermsScreen} component={CommunityTerms} />
            <Stack.Screen name={ScreenName.introduceScreen} component={Introduce} />
            <Stack.Screen name={ScreenName.requestDisableAccountScreen} component={RequestDeleteAccount} />
            <Stack.Screen name={ScreenName.helpCenterScreen} component={SuppoterCenter} />
            <Stack.Screen name={ScreenName.termsAppliationScreen} component={TermsOfApplication} />
            <Stack.Screen name={ScreenName.emailScreen} component={EmailScreen} />
            <Stack.Screen name={ScreenName.confirmUserScreen} component={ConfirmUserScreen} />
            <Stack.Screen name={ScreenName.passwordScreen} component={PasswordScreen} />
            <Stack.Screen name={ScreenName.phoneNumberScren} component={PhoneNumberScreen} />
            <Stack.Screen name={ScreenName.profileScreen} component={UserProfileScreen} />
        </Stack.Navigator>
    )
}

export default ContainerSetting