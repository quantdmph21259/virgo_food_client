import moment from 'moment'

const formatDateTime = (date) => {
    const newDate = new Date(date)
    const formattedDate = moment(newDate).format('DD/MM/YYYY')

    return formattedDate
}

const getTimeCurrent = () => {
    const now = new Date();

    const currentYear = now.getFullYear(); // Lấy ra năm hiện tại
    const currentMonth = now.getMonth() + 1; // Lấy ra tháng hiện tại (phải cộng 1 vì các tháng được đánh số từ 0-11)
    const currentDate = now.getDate(); // Lấy ra ngày hiện tại
    const currentHour = now.getHours(); // Lấy ra giờ hiện tại
    const currentMinute = now.getMinutes(); // Lấy ra phút hiện tại
    const currentSecond = now.getSeconds(); // Lấy ra giây hiện tại

    return `${currentYear}-${currentMonth}-${currentDate} ${currentHour}:${currentMinute}:${currentSecond}`
}

const formatPriceByVnd = (price) => {
    let vnd = new Intl.NumberFormat('VN', {
        style: 'currency',
        currency: 'VND',
    })

    return `${vnd.format(price)}`
}

const formatData = (data, numColumns) => {
    const numberOfFullRows = Math.floor(data.length / numColumns)

    let numberOfElementsLastRow = data.length - (numberOfFullRows * numColumns)
    while (numberOfElementsLastRow !== numColumns && numberOfElementsLastRow !== 0) {
        data.push({ key: `blank-${numberOfElementsLastRow}`, empty: true })
        numberOfElementsLastRow++
    }

    return data
}


const Format = {
    formatDateTime,
    getTimeCurrent,
    formatPriceByVnd,
    formatData
}

export default Format