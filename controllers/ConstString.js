const port = 8080;
const api = "10.0.2.2";
const url = `http://${api}:${port}/api/v1`;
const api_login = "/user/login";
const api_sign_up = "/user/sign_up";
const api_search_produt_by_name = "/user/search_product_by_name";
const api_update_phone_number = "/user/update_phone_number";
const api_update_email = "/user/update_email";
const api_update_password = "/user/update_password";
const api_update_information = "/user/update_information";
const api_get_all_product = "/user/products";
const api_get_all_categories = "/user/categories";
const api_filter_product_by_category = "/user/filter_product_by_category/";
const api_search_product_by_name_and_category = "/user/filter_food_by_name_and_category/";
const api_add_cart = "/user/add_product_to_cart";
const api_get_carts = "/user/carts/";
const api_increase_cart = "/user/increase_cart/";
const api_reduce_cart = "/user/reduce_cart/";
const api_delete_cart = "/user/cart/delete/";
const api_check_out_carts = "/user/cart/check_out/";
const api_update_address = "/user/profile/address/update";
const api_search_user_by_id = "/user/search_user_by_id/";
const api_get_quantity_carts = "/user/carts/quantity/";
const api_get_quantity_bills = "/user/bills/quantity/";
const api_get_order_waiting = "/user/bills/waiting/";
const api_get_order_shipping = "/user/bills/shipping/";
const api_get_order_done = "/user/bills/done/";
const api_confirm_done_order = "/user/bills/confirm_order/";
const api_search_order_by_id = "/user/bills/search_by_id/";
const api_cancel_order = "/user/bills/cancel_order/";
const api_get_history_order = "/user/order/history/";
const api_update_avatar = "/user/profile/update_avatar";

const ConstString = {
    url,
    api_login,
    api_sign_up,
    api_search_produt_by_name,
    api_update_phone_number,
    api_update_email,
    api_update_password,
    api_update_information,
    api_get_all_product,
    api_get_all_categories,
    api_filter_product_by_category,
    api_search_product_by_name_and_category,
    api_add_cart,
    api_get_carts,
    api_increase_cart,
    api_reduce_cart,
    api_delete_cart,
    api_check_out_carts,
    api_update_address,
    api_search_user_by_id,
    api_get_quantity_carts,
    api_get_quantity_bills,
    api_get_order_waiting,
    api_get_order_shipping,
    api_get_order_done,
    api_confirm_done_order,
    api_search_order_by_id,
    api_cancel_order,
    api_get_history_order,
    api_update_avatar,
};

export default ConstString;
