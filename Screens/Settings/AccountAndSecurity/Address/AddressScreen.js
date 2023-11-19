import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Dimensions, TextInput, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import Ionic from "react-native-vector-icons/Ionicons";
import ConstString from "../../../../controllers/ConstString";

const width = Dimensions.get("window").width;

const AddressScreen = () => {
    const [address, setAddress] = useState("");
    const [objectCurrent, setObjectCurrent] = useState({});
    const navigation = useNavigation();
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        getObjectCurrent();
    }, []);

    const back = () => {
        navigation.goBack();
    };

    const getObjectCurrent = async () => {
        try {
            const value = await AsyncStorage.getItem("ObjectCurrent");
            if (value !== null) {
                console.log(
                    `
                    \n>>>>> Check user current from async storage: ${JSON.stringify(objectCurrent)}\n
                    `
                );
                setObjectCurrent(JSON.parse(value));
                setAddress(JSON.parse(value).address);
            }
        } catch (e) {
            console.log(
                `
                \n>>>>> Message get user from async storage: ${e}\n
                `
            );
        }
    };

    const updateAddress = async () => {
        if (address) {
            const url = `${ConstString.url}${ConstString.api_update_address}`;
            const object = {
                idUser: objectCurrent.id,
                address: address,
            };

            fetch(url, {
                method: "put",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(object),
            })
                .then((res) => {
                    return res.json();
                })
                .then((res) => {
                    const code = res.flag;
                    if (code == 1) {
                        Alert.alert("Thành công", "Cập nhật thành công!");
                        clearAsyncStorage();
                        searchUserCurrentByIDAndSave();
                        navigation.goBack();
                    }
                })
                .catch((err) => {
                    Alert.alert("Oops", err.message);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    };

    const clearAsyncStorage = async () => {
        try {
            await AsyncStorage.clear();
            console.log("\n>>>>> Message: AsyncStorage cleared\n");
        } catch (error) {
            console.error(`
                \n>>>>> Message: ${error}\n
            `);
        }
    };

    const searchUserCurrentByIDAndSave = async () => {
        setLoading(true);
        const idUser = objectCurrent.id;
        const urlSearchUser = `${ConstString.url}${ConstString.api_search_user_by_id}${idUser}`;
        fetch(urlSearchUser)
            .then((res) => {
                return res.json();
            })
            .then(async (res) => {
                const object = res;
                try {
                    const jsonValue = JSON.stringify(object);
                    await AsyncStorage.setItem("ObjectCurrent", jsonValue);

                    console.log(`\n>>>>> Message: Save object current by async storage successful!\n`);
                } catch (e) {
                    console.log(`\n>>>>> Message: ${e}!\n`);
                }
            })
            .catch((err) => {
                Alert.alert("Oops", err.message);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.containerHeader}>
                <TouchableOpacity onPress={back}>
                    <Ionic name="chevron-back-outline" size={30} color={"#EEA743"} />
                </TouchableOpacity>
                <Text style={styles.textTitle}>Cập nhật địa chỉ</Text>
            </View>
            <View style={styles.body}>
                <View style={styles.containerInput}>
                    <TextInput
                        style={styles.textInput}
                        keyboardType="default"
                        placeholder="Nhập địa chỉ"
                        value={address}
                        onChangeText={(text) => setAddress(text)}
                    />
                    <TouchableOpacity onPress={updateAddress}>
                        <Ionic name="cloud-upload-outline" size={30} color={"#EEA743"} />
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default AddressScreen;

const styles = StyleSheet.create({
    container: {
        flex: 10,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
    },
    containerHeader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        paddingHorizontal: 12,
    },
    textTitle: {
        fontSize: 24,
        fontWeight: "300",
        flex: 1,
        textAlign: "center",
    },
    body: {
        flex: 9,
        alignItems: "center",
        backgroundColor: "#EEEBF6",
        width: width,
        padding: 12,
    },
    containerInput: {
        width: width,
        padding: 12,
        backgroundColor: "white",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    textInput: {
        flex: 1,
        height: 50,
        marginEnd: 12,
        paddingHorizontal: 12,
        color: "black",
        fontSize: 16,
    },
});
