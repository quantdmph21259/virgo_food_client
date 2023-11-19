import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    Image,
    TouchableOpacity,
    Dimensions,
    FlatList,
    ActivityIndicator,
    Alert,
    StatusBar,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import ConstString from "../../controllers/ConstString";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Color from "../../controllers/Color";
import Ionic from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import ScreenName from "../../controllers/ScreenName";

const width = Dimensions.get("window").width;

const CartScreen = () => {
    const navigation = useNavigation();
    const [carts, setCarts] = useState([]);
    const [objectCurrent, setObjectCurrent] = useState({});
    const [isLoading, setLoading] = useState(true);
    const flatListRef = useRef(null);

    React.useEffect(() => {
        const unsubscribe = navigation.addListener("focus", () => {
            getObjectCurrent();
        });

        return unsubscribe;
    }, [navigation]);

    const getObjectCurrent = async () => {
        setLoading(true);
        try {
            const value = await AsyncStorage.getItem("ObjectCurrent");
            if (value !== null) {
                setObjectCurrent(JSON.parse(value));
                const url = `${ConstString.url}${ConstString.api_get_carts}${JSON.parse(value).id}`;
                console.log(
                    `
                    \n>>>>> Check Url: ${url}\n
                    `
                );
                setLoading(true);
                try {
                    const res = await fetch(url);
                    const json = await res.json();
                    setCarts(json);
                } catch (err) {
                    Alert.alert("Oops", err.message);
                } finally {
                    setLoading(false);
                }
            }
        } catch (e) {
            console.log(
                `
                \n>>>>> Message get user from async storage: ${e}\n
                `
            );
        } finally {
            setLoading(false);
        }
    };
    const formatPriceByVnd = (price) => {
        let vnd = new Intl.NumberFormat("VN", {
            style: "currency",
            currency: "VND",
        });

        return `${vnd.format(price)}`;
    };

    const increaseCart = async (item) => {
        if (item.quantity + 1 > 10) {
            Alert.alert("Oops", "Đơn hàng vượt quá số lượng!!!");
        } else {
            setLoading(true);
            const urlIncreaseCart = `${ConstString.url}${ConstString.api_increase_cart}${item.id}`;
            fetch(urlIncreaseCart, {
                method: "put",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            })
                .then((res) => {
                    return res.json();
                })
                .then((res) => {
                    getObjectCurrent();
                })
                .catch((err) => {
                    Alert.alert("Oops", err.message);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    };

    const reduceCart = async (item) => {
        if (item.quantity - 1 > 0) {
            setLoading(true);
            const urlReduceCart = `${ConstString.url}${ConstString.api_reduce_cart}${item.id}`;
            fetch(urlReduceCart, {
                method: "put",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            })
                .then((res) => {
                    return res.json();
                })
                .then((res) => {
                    getObjectCurrent();
                })
                .catch((err) => {
                    Alert.alert("Oops", err.message);
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            Alert.alert("Xác nhận", `Bạn có muốn xóa ${item.name} ra khỏi giỏ hàng?`, [
                {
                    text: "Không",
                    style: "cancel",
                },
                {
                    text: "Có",
                    onPress: () => {
                        setLoading(true);
                        const urlDeleteCart = `${ConstString.url}${ConstString.api_delete_cart}${item.id}`;
                        fetch(urlDeleteCart, {
                            method: "delete",
                            headers: {
                                Accept: "application/json",
                                "Content-Type": "application/json",
                            },
                        })
                            .then((res) => {
                                return res.json();
                            })
                            .then((res) => {
                                getObjectCurrent();
                            })
                            .catch((er) => {
                                Alert.alert("Oops", er.message);
                            })
                            .finally(() => {
                                setLoading(false);
                            });
                    },
                },
            ]);
        }
    };

    const caculatorSumPrice = () => {
        if (carts.length == 0) {
            return 0;
        }

        let result = 0;
        for (let i = 0; i < carts.length; i++) {
            result +=
                carts[i].discount > 0
                    ? (carts[i].price - (carts[i].price * carts[i].discount) / 100) * carts[i].quantity
                    : carts[i].price * carts[i].quantity;
        }

        return result;
    };

    const onRefresh = React.useCallback(() => {
        setLoading(true);
        getObjectCurrent();
    }, []);

    const handleCheckOutCart = async () => {
        if (carts.length > 0) {
            Alert.alert(`Xác nhận`, `Bạn có muốn thanh toán toàn bộ giỏ hàng này?`, [
                {
                    text: "Không",
                    style: "cancel",
                },
                {
                    text: "Có",
                    onPress: () => {
                        navigation.navigate(ScreenName.handleOrderScreen);
                    },
                },
            ]);
        } else {
            Alert.alert("Oops", "Giỏ hàng trống, không thể thanh toán!");
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar hidden />
            <View style={styles.containerHeader}>
                <View style={{ flex: 1 }}></View>
                <Text
                    style={{
                        fontWeight: "300",
                        fontSize: 24,
                        flex: 1,
                        textAlign: "center",
                    }}
                >
                    Giỏ hàng
                </Text>
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <TouchableOpacity
                        onPress={handleCheckOutCart}
                        style={{
                            height: 30,
                            width: 30,
                        }}
                    >
                        <Image
                            source={require("../../assets/icon_check_out.png")}
                            style={{
                                height: 30,
                                width: 30,
                                tintColor: Color.primary,
                            }}
                        />
                    </TouchableOpacity>
                </View>
            </View>
            <View
                style={{
                    flex: 1,
                    backgroundColor: "#EEEBF6",
                    width: width,
                    justifyContent: "center",
                    alignItems: "center",
                    paddingTop: 20,
                }}
            >
                {isLoading ? (
                    <ActivityIndicator />
                ) : (
                    <>
                        <FlatList
                            data={carts}
                            keyExtractor={(item, index) => item.id}
                            onRefresh={onRefresh}
                            refreshing={false}
                            ref={flatListRef}
                            renderItem={({ item }) => {
                                return (
                                    <View style={styles.containerItem}>
                                        <Image
                                            source={{ uri: item.image }}
                                            style={{
                                                height: 100,
                                                width: 100,
                                                borderRadius: 100,
                                                borderWidth: 2,
                                                borderColor: Color.primary,
                                            }}
                                        />
                                        <View
                                            style={{
                                                marginStart: 14,
                                                flex: 1,
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontSize: 16,
                                                    fontWeight: "500",
                                                    color: "black",
                                                    marginBottom: 7,
                                                }}
                                            >
                                                {String(item.name).length >= 24
                                                    ? String(item.name).substring(0, 24) + "..."
                                                    : String(item.name)}
                                            </Text>
                                            {item.discount > 0 ? (
                                                <>
                                                    <Text
                                                        style={{
                                                            fontSize: 10,
                                                            fontWeight: "bold",
                                                            color: "#FF0000",
                                                            marginBottom: 7,
                                                        }}
                                                    >
                                                        -{item.discount}%
                                                    </Text>
                                                    <View style={{ flexDirection: "row" }}>
                                                        <Text
                                                            style={{
                                                                fontWeight: "400",
                                                                textDecorationLine: "line-through",
                                                                color: "#DDDDDD",
                                                                marginEnd: 12,
                                                            }}
                                                        >
                                                            {formatPriceByVnd(item.price)}
                                                        </Text>
                                                        <Text
                                                            style={{
                                                                fontSize: 14,
                                                                fontWeight: "500",
                                                                color: "#FF0000",
                                                            }}
                                                        >
                                                            {formatPriceByVnd(
                                                                item.price - (item.price * item.discount) / 100
                                                            )}
                                                        </Text>
                                                    </View>
                                                </>
                                            ) : (
                                                <Text
                                                    style={{
                                                        fontSize: 14,
                                                        fontWeight: "500",
                                                        color: "#FF0000",
                                                    }}
                                                >
                                                    {formatPriceByVnd(item.price)}
                                                </Text>
                                            )}
                                            <View
                                                style={{
                                                    flexDirection: "row",
                                                    marginTop: 14,
                                                    justifyContent: "flex-start",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <TouchableOpacity onPress={() => increaseCart(item)}>
                                                    <Ionic name={"chevron-up-outline"} size={23} color={"#EEA743"} />
                                                </TouchableOpacity>
                                                <Text
                                                    style={{
                                                        fontSize: 14,
                                                        fontWeight: "300",
                                                        color: "black",
                                                        marginHorizontal: 30,
                                                        paddingVertical: 7,
                                                        paddingHorizontal: 14,
                                                        borderWidth: 1,
                                                        borderRadius: 7,
                                                        borderColor: Color.primary,
                                                    }}
                                                >
                                                    {item.quantity}
                                                </Text>
                                                <TouchableOpacity onPress={() => reduceCart(item)}>
                                                    <Ionic name={"chevron-down-outline"} size={23} color={"#EEA743"} />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                );
                            }}
                        />

                        <View
                            style={{
                                flexDirection: "row",
                                paddingHorizontal: 12,
                                paddingVertical: 16,
                                backgroundColor: "white",
                                width: width,
                                borderTopWidth: 2,
                                borderTopColor: "#D5D5D5",
                                alignItems: "center",
                            }}
                        >
                            <View style={{ flex: 1 }} />
                            <Text
                                style={{
                                    fontSize: 16,
                                    fontWeight: "500",
                                    color: "black",
                                    marginEnd: 7,
                                }}
                            >
                                Tổng tiền:
                            </Text>
                            <Text
                                style={{
                                    fontSize: 16,
                                    fontWeight: "500",
                                    color: "#FF0000",
                                }}
                            >
                                {formatPriceByVnd(caculatorSumPrice())}
                            </Text>
                        </View>
                    </>
                )}
            </View>
        </SafeAreaView>
    );
};

export default CartScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
    },
    containerHeader: {
        width: width,
        paddingVertical: 15,
        textAlign: "center",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: Color.primary,
    },
    containerItem: {
        width: width - 20,
        padding: 12,
        backgroundColor: "white",
        marginBottom: 14,
        borderRadius: 12,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
});
